// Daily tasks and the streak built on them. A day counts toward the streak once all three tasks
// are done; a missed day is covered by a streak freeze when one is in stock.
import { addDays } from "@/lib/dates";
import { UNIT_SIZE } from "@/lib/path";

export type TaskId = "words" | "grammar" | "listening";

export const DAILY_TASKS: readonly { id: TaskId; label: string; href: string }[] = [
  { id: "words", label: "Пройти урок из раздела «Слова»", href: "/session/vocab" },
  { id: "grammar", label: "Пройти главу из раздела «Грамматика»", href: "/path" },
  { id: "listening", label: "Пройти один уровень из раздела «Аудирование»", href: "/listening" },
];

/** What a day's activity is made of (a `sessions` row). */
export interface DayCounts {
  date: string;
  /** All finished lessons, words sessions included. */
  lessons: number;
  wordSessions: number;
  listeningGames: number;
}

export type TaskStatus = Record<TaskId, boolean>;

/** A chapter is one section of the grammar path: this many lessons finished in a day. */
export const CHAPTER_LESSONS = UNIT_SIZE;

/** Path lessons (grammar, build, reading, translate, review) finished that day: everything except words sessions. */
export function pathLessons(day: Pick<DayCounts, "lessons" | "wordSessions"> | undefined): number {
  return day ? Math.max(0, day.lessons - day.wordSessions) : 0;
}

export function taskStatus(day: Pick<DayCounts, "lessons" | "wordSessions" | "listeningGames"> | undefined): TaskStatus {
  if (!day) return { words: false, grammar: false, listening: false };
  return {
    words: day.wordSessions > 0,
    grammar: pathLessons(day) >= CHAPTER_LESSONS,
    listening: day.listeningGames > 0,
  };
}

export function tasksDone(status: TaskStatus): number {
  return DAILY_TASKS.filter((t) => status[t.id]).length;
}

/**
 * Days up to and including this date were played under the old rule (3 finished lessons), so
 * the streak earned before the daily tasks existed is kept.
 */
export const LEGACY_RULE_UNTIL = "2026-11-03";
const LEGACY_LESSONS_PER_DAY = 3;

export function isDayComplete(day: DayCounts): boolean {
  if (day.date <= LEGACY_RULE_UNTIL) return day.lessons >= LEGACY_LESSONS_PER_DAY;
  return tasksDone(taskStatus(day)) === DAILY_TASKS.length;
}

/** One streak freeze is earned for every this many days in a row. */
export const FREEZE_EVERY = 7;
/** Freezes that can be kept in stock. */
export const MAX_FREEZES = 2;

export interface StreakState {
  current: number;
  longest: number;
  /** Freezes in stock right now. */
  freezes: number;
  /** Missed days that a freeze covered. */
  frozenDays: string[];
}

/**
 * Walks the calendar from the first completed day to today. A completed day extends the streak
 * (and earns a freeze every FREEZE_EVERY days); a missed day uses a freeze if there is one and
 * otherwise resets the streak. Today not being done yet breaks nothing — there is still time.
 */
export function computeStreakState(completedDays: Iterable<string>, today: string): StreakState {
  const done = new Set(completedDays);
  const sorted = [...done].filter((d) => d <= today).sort();
  const state: StreakState = { current: 0, longest: 0, freezes: 0, frozenDays: [] };
  if (sorted.length === 0) return state;

  for (let day = sorted[0]; day <= today; day = addDays(day, 1)) {
    if (done.has(day)) {
      state.current++;
      state.longest = Math.max(state.longest, state.current);
      if (state.current % FREEZE_EVERY === 0) state.freezes = Math.min(MAX_FREEZES, state.freezes + 1);
    } else if (day < today) {
      if (state.freezes > 0) {
        state.freezes--;
        state.frozenDays.push(day);
      } else {
        state.current = 0;
      }
    }
  }
  return state;
}
