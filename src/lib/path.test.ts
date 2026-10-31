import { describe, expect, it } from "vitest";
import { buildPath, lessonCycle, PATTERN, UNIT_SIZE } from "@/lib/path";
import { LESSON_TYPES } from "@/lib/dates";

describe("path constants", () => {
  it("PATTERN uses every lesson type except words (they live in their own tab) exactly once; a unit is one pass", () => {
    expect([...PATTERN].sort()).toEqual(LESSON_TYPES.filter((t) => t !== "vocab").sort());
    expect(UNIT_SIZE).toBe(PATTERN.length);
  });

  it("lessonCycle counts passes through PATTERN", () => {
    expect(lessonCycle(0)).toBe(0);
    expect(lessonCycle(PATTERN.length - 1)).toBe(0);
    expect(lessonCycle(PATTERN.length)).toBe(1);
    expect(lessonCycle(PATTERN.length * 5 + 2)).toBe(5);
  });
});

describe("buildPath", () => {
  it("returns the current and the next unit with continuous indexes and PATTERN types", () => {
    const { units } = buildPath(0);
    expect(units.map((u) => u.number)).toEqual([1, 2]);
    const all = units.flatMap((u) => u.lessons);
    expect(all.map((l) => l.index)).toEqual(all.map((_, i) => i));
    expect(all.map((l) => l.type)).toEqual(all.map((_, i) => PATTERN[i % PATTERN.length]));
  });

  it("marks done / current / locked mid-unit", () => {
    const states = buildPath(3).units[0].lessons.map((l) => l.state);
    expect(states.filter((s) => s === "done")).toHaveLength(3);
    expect(states.filter((s) => s === "current")).toHaveLength(1);
    expect(states[3]).toBe("current");
    expect(states.slice(4).every((s) => s === "locked")).toBe(true);
  });

  it("the last lesson of a unit is current just before the boundary", () => {
    const path = buildPath(UNIT_SIZE - 1);
    expect(path.finishedUnits).toBe(0);
    expect(path.units[0].lessons.at(-1)?.state).toBe("current");
    expect(path.units[0].done).toBe(UNIT_SIZE - 1);
  });

  it("moves to the next unit exactly at the boundary", () => {
    const path = buildPath(UNIT_SIZE);
    expect(path.finishedUnits).toBe(1);
    expect(path.units[0].number).toBe(2);
    expect(path.units[0].lessons[0].state).toBe("current");
  });

  it("works for large numbers and always has exactly one current lesson", () => {
    const n = 1_000_003;
    const path = buildPath(n);
    expect(path.finishedUnits).toBe(Math.floor(n / UNIT_SIZE));
    const current = path.units.flatMap((u) => u.lessons).filter((l) => l.state === "current");
    expect(current).toHaveLength(1);
    expect(current[0].index).toBe(n);
  });
});
