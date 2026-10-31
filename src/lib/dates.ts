// Local-day helpers. "Today" is the learner's calendar day in their own
// timezone (sent by the browser in the `tz` cookie), not the server's UTC day.

export const TZ_COOKIE = "tz";
export const DEFAULT_TZ = "UTC";

/** Kinds of lesson on the path; each one is a session screen under /session/<name>. */
export const LESSON_TYPES = [
  "vocab",
  "context",
  "grammar",
  "build",
  "reading",
  "translate",
  "review",
] as const;
export type StepName = (typeof LESSON_TYPES)[number];

/** A day counts toward the streak once this many lessons are finished (no upper limit). */
export const LESSONS_PER_DAY = 3;

export function isValidTimeZone(tz: string | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** YYYY-MM-DD of `at` in timezone `tz`. */
export function localDate(tz: string, at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

/** Calendar arithmetic on YYYY-MM-DD strings (timezone-free). */
export function addDays(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function isDayComplete(lessonsCompleted: number): boolean {
  return lessonsCompleted >= LESSONS_PER_DAY;
}

/**
 * Streaks over completed days. A missed day breaks the streak; today not being
 * done yet doesn't break the current streak (there is still time).
 */
export function computeStreaks(
  completedDays: Iterable<string>,
  today: string
): { current: number; longest: number } {
  const done = new Set(completedDays);

  let current = 0;
  for (let day = done.has(today) ? today : addDays(today, -1); done.has(day); day = addDays(day, -1)) {
    current++;
  }

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of [...done].sort()) {
    run = prev !== null && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  return { current, longest: Math.max(longest, current) };
}
