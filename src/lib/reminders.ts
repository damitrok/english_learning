// When and what to remind: a pure planner used by the hourly reminder job.
import { addDays, localDate } from "@/lib/dates";
import { DAILY_TASKS, computeStreakState, isDayComplete, taskStatus, tasksDone, type DayCounts } from "@/lib/daily";
import { plural } from "@/lib/plural";

/** Reminders go out in this window of the person's local day (the first hourly run inside it sends). */
export const REMINDER_FROM_HOUR = 19;
export const REMINDER_TO_HOUR = 21;
/** Someone who has not studied for this many days is left alone. */
export const INACTIVE_AFTER_DAYS = 7;

export interface Reminder {
  title: string;
  body: string;
  url: string;
}

/** Local hour (0-23) of `at` in `timeZone`. */
export function localHour(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" }).formatToParts(at);
  return Number(parts.find((p) => p.type === "hour")?.value ?? 0);
}

export function inReminderWindow(timeZone: string, now: Date): boolean {
  const hour = localHour(timeZone, now);
  return hour >= REMINDER_FROM_HOUR && hour <= REMINDER_TO_HOUR;
}

/** True when a device still needs to be considered: in its window and not reminded today. */
export function isCandidate(timeZone: string, lastSentOn: string | null, now: Date): boolean {
  return inReminderWindow(timeZone, now) && lastSentOn !== localDate(timeZone, now);
}

/**
 * The reminder for one person, or null when none is due: today is already done, they have been
 * away for over a week, or this device was reminded today / is outside its evening window.
 * `days` are all of the person's `sessions` rows.
 */
export function planReminder(input: {
  timeZone: string;
  now: Date;
  lastSentOn: string | null;
  days: DayCounts[];
}): Reminder | null {
  const { timeZone, now, lastSentOn, days } = input;
  if (!isCandidate(timeZone, lastSentOn, now)) return null;

  const today = localDate(timeZone, now);
  const todayRow = days.find((d) => d.date === today);
  if (todayRow && isDayComplete(todayRow)) return null;

  const since = addDays(today, -INACTIVE_AFTER_DAYS);
  const active = days.some((d) => d.date >= since && (d.lessons > 0 || d.listeningGames > 0));
  if (!active) return null;

  const done = tasksDone(taskStatus(todayRow));
  const left = DAILY_TASKS.length - done;
  const streak = computeStreakState(days.filter(isDayComplete).map((d) => d.date), today).current;

  if (streak > 0) {
    return {
      title: `Серия ${streak} ${plural(streak, ["день", "дня", "дней"])} под угрозой`,
      body: `Сегодня осталось ${left} ${plural(left, ["задание", "задания", "заданий"])}. Успейте засчитать день.`,
      url: "/",
    };
  }
  return {
    title: "Пора заниматься английским",
    body: `Сегодня выполнено ${done} из ${DAILY_TASKS.length} заданий. Начните новую серию!`,
    url: "/",
  };
}
