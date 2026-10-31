// Read-side data for «Сегодня» and the dashboard. Plain server module.
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/user";
import { getTimeZone } from "@/lib/day-server";
import { addDays, computeStreaks, isDayComplete, localDate } from "@/lib/dates";

export interface DayActivity {
  date: string;
  lessons: number;
  /** Words-tab sessions among `lessons`; they count for the streak but not for the path. */
  wordSessions: number;
  minutes: { vocab: number; grammar: number; reading: number; practice: number };
}

async function loadDays() {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
  const tz = await getTimeZone();
  const today = localDate(tz);
  if (!user) return { supabase, user: null, tz, today, days: [] as DayActivity[] };

  const { data } = await supabase
    .from("sessions")
    .select(
      "session_date, lessons_completed, word_sessions, vocab_minutes, grammar_minutes, reading_minutes, practice_minutes"
    )
    .eq("user_id", user.id)
    .order("session_date");

  const days: DayActivity[] = (data ?? []).map((s) => ({
    date: s.session_date,
    lessons: s.lessons_completed,
    wordSessions: s.word_sessions,
    minutes: {
      vocab: s.vocab_minutes,
      grammar: s.grammar_minutes,
      reading: s.reading_minutes,
      practice: s.practice_minutes,
    },
  }));
  return { supabase, user, tz, today, days };
}

export interface PathOverview {
  /** Lifetime number of finished path lessons — the learner's position on the path (words sessions excluded). */
  lessonsCompleted: number;
  lessonsToday: number;
  streak: number;
  /** Today already has enough lessons to count toward the streak. */
  dayComplete: boolean;
}

export async function getPathOverview(): Promise<PathOverview> {
  const { today, days } = await loadDays();
  const lessonsToday = days.find((d) => d.date === today)?.lessons ?? 0;
  const streaks = computeStreaks(
    days.filter((d) => isDayComplete(d.lessons)).map((d) => d.date),
    today
  );
  return {
    lessonsCompleted: days.reduce((sum, d) => sum + d.lessons - d.wordSessions, 0),
    lessonsToday,
    streak: streaks.current,
    dayComplete: isDayComplete(lessonsToday),
  };
}

export interface DashboardData {
  streak: { current: number; longest: number };
  daysCompleted: number;
  /** Last 12 weeks, oldest first, Monday-aligned; `lessons` = lessons finished that day. */
  calendar: { date: string; lessons: number; future: boolean }[];
  minutesLast7: DayActivity["minutes"];
  minutesLast30: DayActivity["minutes"];
  words: { total: number; started: number; learned: number; due: number };
  grammar: { mastered: number; total: number; recentAccuracy: number | null };
  reading: { textsRead: number; textsTotal: number };
}

/** A card counts as learned once its review interval reaches three weeks. */
const LEARNED_INTERVAL_DAYS = 21;

export async function getDashboard(): Promise<DashboardData | null> {
  const { supabase, user, today, days } = await loadDays();
  if (!user) return null;

  const [
    { count: wordsTotal },
    { data: cards },
    { data: exercises },
    { data: attempts },
    { data: texts },
    { data: reads },
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
      .select("text_id")
      .eq("user_id", user.id),
  ]);

  // Calendar: 12 weeks ending with the current week (Mon..Sun).
  const byDate = new Map(days.map((d) => [d.date, d]));
  const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // Mon = 0
  const start = addDays(today, -dow - 7 * 11);
  const calendar = Array.from({ length: 84 }, (_, i) => {
    const date = addDays(start, i);
    return { date, lessons: byDate.get(date)?.lessons ?? 0, future: date > today };
  });

  const sumMinutes = (from: string) => {
    const acc = { vocab: 0, grammar: 0, reading: 0, practice: 0 };
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

  return {
    streak: computeStreaks(days.filter((d) => isDayComplete(d.lessons)).map((d) => d.date), today),
    daysCompleted: days.filter((d) => isDayComplete(d.lessons)).length,
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
      textsRead: new Set((reads ?? []).map((r) => r.text_id)).size,
      textsTotal: texts?.length ?? 0,
    },
  };
}
