// Local-day helpers. "Today" is the learner's calendar day in their own
// timezone (sent by the browser in the `tz` cookie), not the server's UTC day.

export const TZ_COOKIE = "tz";
export const DEFAULT_TZ = "UTC";

export const CORE_STEPS = ["vocab", "reading", "listening", "fluency"] as const;
export type StepName = (typeof CORE_STEPS)[number] | "grammar";

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

function isWeekend(day: string): boolean {
  const dow = new Date(`${day}T00:00:00Z`).getUTCDay();
  return dow === 0 || dow === 6;
}

export function isDayComplete(steps: readonly string[]): boolean {
  return CORE_STEPS.every((s) => steps.includes(s));
}

/**
 * Streaks over completed days (all four core steps). The plan is 5 days a week,
 * so a weekend day without a session doesn't break a streak — it just doesn't
 * add to it. A weekday without a completed session does. Today not being done
 * yet doesn't break the current streak either.
 */
export function computeStreaks(
  completedDays: Iterable<string>,
  today: string
): { current: number; longest: number } {
  const done = new Set(completedDays);

  let current = 0;
  let day = done.has(today) ? today : addDays(today, -1);
  // Walk back while days are completed or skippable weekends.
  for (let guard = 0; guard < 3650; guard++) {
    if (done.has(day)) current++;
    else if (!isWeekend(day)) break;
    day = addDays(day, -1);
  }

  let longest = 0;
  const sorted = [...done].sort();
  if (sorted.length > 0) {
    let run = 0;
    let prev: string | null = null;
    for (const d of sorted) {
      if (prev === null) run = 1;
      else {
        // Continue the run if every day strictly between prev and d is a weekend.
        let gapOk = true;
        for (let x = addDays(prev, 1); x < d; x = addDays(x, 1)) {
          if (!isWeekend(x)) {
            gapOk = false;
            break;
          }
        }
        run = gapOk ? run + 1 : 1;
      }
      longest = Math.max(longest, run);
      prev = d;
    }
  }
  return { current, longest: Math.max(longest, current) };
}
