import { describe, expect, it } from "vitest";
import {
  CHAPTER_LESSONS,
  DAILY_TASKS,
  FREEZE_EVERY,
  LEGACY_RULE_UNTIL,
  MAX_FREEZES,
  computeStreakState,
  isDayComplete,
  pathLessons,
  taskStatus,
  tasksDone,
} from "./daily";

const NEW_DAY = "2026-11-10";
const day = (over: Partial<{ date: string; lessons: number; wordSessions: number; listeningGames: number }> = {}) => ({
  date: NEW_DAY,
  lessons: 0,
  wordSessions: 0,
  listeningGames: 0,
  ...over,
});

describe("taskStatus", () => {
  it("is all false without activity", () => {
    expect(taskStatus(undefined)).toEqual({ words: false, grammar: false, listening: false });
    expect(tasksDone(taskStatus(day()))).toBe(0);
  });
  it("counts words sessions for words only; grammar needs a whole chapter of path lessons", () => {
    expect(CHAPTER_LESSONS).toBe(5);
    expect(taskStatus(day({ lessons: 1, wordSessions: 1 }))).toEqual({ words: true, grammar: false, listening: false });
    expect(taskStatus(day({ lessons: 4 })).grammar).toBe(false);
    expect(taskStatus(day({ lessons: 5 })).grammar).toBe(true);
    expect(taskStatus(day({ lessons: 6, wordSessions: 1 })).grammar).toBe(true);
    expect(taskStatus(day({ lessons: 5, wordSessions: 1 })).grammar).toBe(false);
    expect(pathLessons(day({ lessons: 7, wordSessions: 2 }))).toBe(5);
    expect(taskStatus(day({ listeningGames: 2 }))).toEqual({ words: false, grammar: false, listening: true });
  });
});

describe("isDayComplete", () => {
  it("needs all three tasks after the switch", () => {
    expect(DAILY_TASKS).toHaveLength(3);
    expect(isDayComplete(day({ lessons: 5, wordSessions: 5 }))).toBe(false);
    expect(isDayComplete(day({ lessons: 4, wordSessions: 1, listeningGames: 0 }))).toBe(false);
    expect(isDayComplete(day({ lessons: 5, wordSessions: 1, listeningGames: 1 }))).toBe(false);
    expect(isDayComplete(day({ lessons: 6, wordSessions: 1, listeningGames: 1 }))).toBe(true);
  });
  it("keeps the old rule (3 lessons) for days up to the switch", () => {
    expect(isDayComplete(day({ date: LEGACY_RULE_UNTIL, lessons: 3 }))).toBe(true);
    expect(isDayComplete(day({ date: LEGACY_RULE_UNTIL, lessons: 2 }))).toBe(false);
  });
});

describe("computeStreakState", () => {
  const today = "2026-03-10";
  const days = (...ds: string[]) => ds;

  it("returns zeros for empty input", () => {
    expect(computeStreakState([], today)).toEqual({ current: 0, longest: 0, freezes: 0, frozenDays: [] });
  });
  it("counts consecutive days ending today", () => {
    const s = computeStreakState(days("2026-03-08", "2026-03-09", "2026-03-10"), today);
    expect([s.current, s.longest]).toEqual([3, 3]);
  });
  it("keeps the streak when today is not done yet", () => {
    expect(computeStreakState(days("2026-03-08", "2026-03-09"), today).current).toBe(2);
  });
  it("breaks the streak when a day was missed and there is no freeze", () => {
    const s = computeStreakState(days("2026-03-06", "2026-03-07"), today);
    expect([s.current, s.longest]).toEqual([0, 2]);
  });
  it("a gap resets current but longest remembers the best run", () => {
    const s = computeStreakState(days("2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04", "2026-03-09", "2026-03-10"), today);
    expect([s.current, s.longest]).toEqual([2, 4]);
  });
  it("handles unsorted and duplicate input, and ignores future days", () => {
    expect(computeStreakState(days("2026-03-10", "2026-03-08", "2026-03-09", "2026-03-09"), today).current).toBe(3);
    expect(computeStreakState(days("2026-03-12"), today)).toMatchObject({ current: 0, longest: 0 });
  });
  it("works across a year boundary", () => {
    expect(computeStreakState(days("2026-12-30", "2026-12-31", "2027-01-01"), "2027-01-01").current).toBe(3);
  });

  describe("freezes", () => {
    const run = (from: string, n: number) => Array.from({ length: n }, (_, i) => addDaysStr(from, i));
    function addDaysStr(d: string, n: number) {
      const x = new Date(`${d}T00:00:00Z`);
      x.setUTCDate(x.getUTCDate() + n);
      return x.toISOString().slice(0, 10);
    }

    it("earns one freeze per FREEZE_EVERY days in a row", () => {
      expect(FREEZE_EVERY).toBe(7);
      expect(computeStreakState(run("2026-03-04", 6), today).freezes).toBe(0);
      expect(computeStreakState(run("2026-03-04", 7), today).freezes).toBe(1);
    });
    it("a freeze covers one missed day and the streak goes on", () => {
      // 7 days (Feb 20-26) earn a freeze, Feb 27 is missed, Feb 28 continues.
      const s = computeStreakState([...run("2026-02-20", 7), "2026-02-28"], "2026-02-28");
      expect(s.frozenDays).toEqual(["2026-02-27"]);
      expect(s.current).toBe(8);
      expect(s.freezes).toBe(0);
    });
    it("two missed days need two freezes, otherwise the streak resets", () => {
      const week = run("2026-02-01", 7);
      const s = computeStreakState([...week, "2026-02-10"], "2026-02-10");
      expect(s.frozenDays).toEqual(["2026-02-08"]);
      expect(s.current).toBe(1);
    });
    it("keeps at most MAX_FREEZES in stock", () => {
      expect(MAX_FREEZES).toBe(2);
      expect(computeStreakState(run("2026-02-01", 28), "2026-02-28").freezes).toBe(2);
    });
    it("today not done never uses a freeze", () => {
      const s = computeStreakState(run("2026-03-03", 7), today);
      expect(s.frozenDays).toEqual([]);
      expect(s.freezes).toBe(1);
      expect(s.current).toBe(7);
    });
  });
});
