import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { localDate } from "@/lib/dates";
import { isCandidate, planReminder } from "@/lib/reminders";
import type { DayCounts } from "@/lib/daily";

// Hourly job (GitHub Actions, see .github/workflows/reminders.yml): sends the evening reminder to
// devices whose local time is in the window and whose owner still has daily tasks left.

const sha = (s: string) => createHash("sha256").update(s).digest();

function authorized(request: NextRequest): boolean | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null; // not configured: the endpoint stays closed
  const given = request.headers.get("authorization") ?? "";
  return timingSafeEqual(sha(given), sha(`Bearer ${secret}`));
}

export async function POST(request: NextRequest) {
  const ok = authorized(request);
  if (ok === null) return NextResponse.json({ error: "not configured" }, { status: 503 });
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { NEXT_PUBLIC_VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: privateKey, VAPID_SUBJECT: subject } = process.env;
  if (!admin || !publicKey || !privateKey || !subject) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const now = new Date();
  const { data: subs, error } = await admin
    .from("push_subscriptions")
    .select("endpoint, user_id, p256dh, auth, time_zone, last_sent_on");
  if (error) return NextResponse.json({ error: "read failed" }, { status: 500 });

  const due = (subs ?? []).filter((s) => isCandidate(s.time_zone, s.last_sent_on, now));
  if (due.length === 0) return NextResponse.json({ due: 0, sent: 0, removed: 0, failed: 0 });

  const { data: rows, error: rowsError } = await admin
    .from("sessions")
    .select("user_id, session_date, lessons_completed, word_sessions, listening_games")
    .in("user_id", [...new Set(due.map((s) => s.user_id))]);
  if (rowsError) return NextResponse.json({ error: "read failed" }, { status: 500 });

  const daysByUser = new Map<string, DayCounts[]>();
  for (const r of rows ?? []) {
    const list = daysByUser.get(r.user_id) ?? [];
    list.push({
      date: r.session_date,
      lessons: r.lessons_completed,
      wordSessions: r.word_sessions,
      listeningGames: r.listening_games,
    });
    daysByUser.set(r.user_id, list);
  }

  let sent = 0;
  let removed = 0;
  let failed = 0;
  for (const s of due) {
    const reminder = planReminder({
      timeZone: s.time_zone,
      now,
      lastSentOn: s.last_sent_on,
      days: daysByUser.get(s.user_id) ?? [],
    });
    if (!reminder) continue;
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(reminder),
        { TTL: 6 * 60 * 60 },
      );
      await admin
        .from("push_subscriptions")
        .update({ last_sent_on: localDate(s.time_zone, now) })
        .eq("endpoint", s.endpoint);
      sent++;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        // The device unsubscribed or the install was removed.
        await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
        removed++;
      } else {
        failed++;
      }
    }
  }
  return NextResponse.json({ due: due.length, sent, removed, failed });
}
