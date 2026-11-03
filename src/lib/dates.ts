// Local-day helpers. "Today" is the learner's calendar day in their own
// timezone (sent by the browser in the `tz` cookie), not the server's UTC day.

export const TZ_COOKIE = "tz";
export const DEFAULT_TZ = "UTC";

/** Kinds of lesson; each one is a session screen under /session/<name>. "vocab" is a words-tab session (not on the path). */
export const LESSON_TYPES = [
  "vocab",
  "grammar",
  "build",
  "reading",
  "translate",
  "review",
] as const;
export type StepName = (typeof LESSON_TYPES)[number];

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
