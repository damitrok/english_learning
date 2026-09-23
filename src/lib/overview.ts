// Read-side data for «Сегодня» and the dashboard. Plain server module.
import { createClient } from "@/lib/supabase/server";
import { getTimeZone } from "@/lib/day-server";
import { addDays, computeStreaks, isDayComplete, localDate } from "@/lib/dates";

export interface DayActivity {
  date: string;
  steps: string[];
  minutes: { vocab: number; grammar: number; reading: number; listening: number; fluency: number };
}

async function loadDays() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tz = await getTimeZone();
  const today = localDate(tz);
  if (!user) return { supabase, user: null, tz, today, days: [] as DayActivity[] };

  const { data } = await supabase
    .from("sessions")
    .select(
      "session_date, completed_steps, vocab_minutes, grammar_minutes, reading_minutes, listening_minutes, fluency_minutes"
    )
    .eq("user_id", user.id)
    .order("session_date");

  const days: DayActivity[] = (data ?? []).map((s) => ({
    date: s.session_date,
    steps: s.completed_steps,
    minutes: {
      vocab: s.vocab_minutes,
      grammar: s.grammar_minutes,
      reading: s.reading_minutes,
      listening: s.listening_minutes,
      fluency: s.fluency_minutes,
    },
  }));
  return { supabase, user, tz, today, days };
}

export interface TodayOverview {
  stepsDone: string[];
  dayComplete: boolean;
  streak: number;
}

export async function getTodayOverview(): Promise<TodayOverview> {
  const { today, days } = await loadDays();
  const todayRow = days.find((d) => d.date === today);
  const streaks = computeStreaks(
    days.filter((d) => isDayComplete(d.steps)).map((d) => d.date),
    today
  );
  return {
    stepsDone: todayRow?.steps ?? [],
    dayComplete: isDayComplete(todayRow?.steps ?? []),
    streak: streaks.current,
  };
}

export interface DashboardData {
  streak: { current: number; longest: number };
  daysCompleted: number;
  /** Last 12 weeks, oldest first, Monday-aligned; `steps` = core steps done that day. */
  calendar: { date: string; steps: number; future: boolean }[];
  minutesLast7: DayActivity["minutes"];
  minutesLast30: DayActivity["minutes"];
  words: { total: number; started: number; learned: number; due: number };
  grammar: { mastered: number; total: number; recentAccuracy: number | null };
  reading: { textsRead: number; textsTotal: number; fluency: { date: string; wpm: number }[] };
  listening: { done: number; total: number; avgAccuracy: number | null };
}

/** A card counts as learned once its review interval reaches three weeks. */
const LEARNED_INTERVAL_DAYS = 21;

export async function getDashboard(): Promise<DashboardData | null> {
  const { supabase, user, tz, today, days } = await loadDays();
  if (!user) return null;

  const [
    { count: wordsTotal },
    { data: cards },
    { data: exercises },
    { data: attempts },
    { data: texts },
    { data: reads },
    { data: dialogues },
    { data: logs },
  ] = await Promise.all([
    supabase.from("words").select("id", { count: "exact", head: true }),
    supabase.from("cards").select("interval_days, due_at").eq("user_id", user.id),
    supabase.from("grammar_exercises").select("id, topic_id"),
    supabase
      .from("grammar_attempts")
      .select("exercise_id, is_correct, created_at")
      .eq("user_id", user.id)
      .order("created_at"),
    supabase.from("texts").select("id"),
    supabase
      .from("text_reads")
      .select("text_id, mode, words_per_minute, created_at")
      .eq("user_id", user.id)
      .order("created_at"),
    supabase.from("listening_items").select("id").eq("kind", "tts"),
    supabase.from("listening_logs").select("item_id, accuracy").eq("user_id", user.id),
  ]);

  // Calendar: 12 weeks ending with the current week (Mon..Sun).
  const byDate = new Map(days.map((d) => [d.date, d]));
  const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // Mon = 0
  const start = addDays(today, -dow - 7 * 11);
  const calendar = Array.from({ length: 84 }, (_, i) => {
    const date = addDays(start, i);
    const steps = byDate.get(date)?.steps.filter((s) => s !== "grammar").length ?? 0;
    return { date, steps, future: date > today };
  });

  const sumMinutes = (from: string) => {
    const acc = { vocab: 0, grammar: 0, reading: 0, listening: 0, fluency: 0 };
    for (const d of days) {
      if (d.date < from || d.date > today) continue;
      for (const k of Object.keys(acc) as (keyof typeof acc)[]) acc[k] += d.minutes[k];
    }
    return acc;
  };

  const now = Date.now();
  const latest = new Map<string, boolean>();
  for (const a of attempts ?? []) latest.set(a.exercise_id, a.is_correct);
  const exByTopic = new Map<string, string[]>();
  for (const e of exercises ?? []) exByTopic.set(e.topic_id, [...(exByTopic.get(e.topic_id) ?? []), e.id]);
  const mastered = [...exByTopic.values()].filter((ids) => ids.every((id) => latest.get(id) === true)).length;
  const recent = (attempts ?? []).slice(-30);

  const measured = (logs ?? []).filter((l) => l.accuracy !== null).map((l) => l.accuracy!);

  return {
    streak: computeStreaks(days.filter((d) => isDayComplete(d.steps)).map((d) => d.date), today),
    daysCompleted: days.filter((d) => isDayComplete(d.steps)).length,
    calendar,
    minutesLast7: sumMinutes(addDays(today, -6)),
    minutesLast30: sumMinutes(addDays(today, -29)),
    words: {
      total: wordsTotal ?? 0,
      started: cards?.length ?? 0,
      learned: (cards ?? []).filter((c) => c.interval_days >= LEARNED_INTERVAL_DAYS).length,
      due: (cards ?? []).filter((c) => new Date(c.due_at).getTime() <= now).length,
    },
    grammar: {
      mastered,
      total: exByTopic.size,
      recentAccuracy: recent.length
        ? Math.round((recent.filter((a) => a.is_correct).length / recent.length) * 100)
        : null,
    },
    reading: {
      textsRead: new Set((reads ?? []).filter((r) => r.mode === "reading").map((r) => r.text_id)).size,
      textsTotal: texts?.length ?? 0,
      fluency: (reads ?? [])
        .filter((r) => r.mode === "fluency" && r.words_per_minute)
        .slice(-12)
        .map((r) => ({ date: localDate(tz, new Date(r.created_at)), wpm: r.words_per_minute! })),
    },
    listening: {
      done: new Set((logs ?? []).map((l) => l.item_id)).size,
      total: dialogues?.length ?? 0,
      avgAccuracy: measured.length
        ? Math.round(measured.reduce((a, b) => a + b, 0) / measured.length)
        : null,
    },
  };
}
