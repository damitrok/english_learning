import { describe, expect, it } from "vitest";
import { addDays, computeStreaks, isDayComplete, isValidTimeZone, LESSONS_PER_DAY, localDate } from "./dates";

describe("localDate", () => {
  const at = new Date("2026-03-10T23:30:00Z");
  it("formats as YYYY-MM-DD in the given zone", () => {
    expect(localDate("UTC", at)).toBe("2026-03-10");
  });
  it("rolls to the next day east of UTC", () => {
    expect(localDate("Asia/Tokyo", at)).toBe("2026-03-11");
    expect(localDate("Europe/Moscow", at)).toBe("2026-03-11");
  });
  it("stays on the previous day west of UTC", () => {
    expect(localDate("America/Los_Angeles", new Date("2026-03-11T05:00:00Z"))).toBe("2026-03-10");
  });
  it("handles the day boundary exactly", () => {
    expect(localDate("Europe/Moscow", new Date("2026-03-10T20:59:59Z"))).toBe("2026-03-10");
    expect(localDate("Europe/Moscow", new Date("2026-03-10T21:00:00Z"))).toBe("2026-03-11");
  });
  it("handles year boundary", () => {
    expect(localDate("Pacific/Auckland", new Date("2026-12-31T12:00:00Z"))).toBe("2027-01-01");
  });
});

describe("isValidTimeZone", () => {
  it("accepts real zones and rejects junk", () => {
    expect(isValidTimeZone("Europe/Moscow")).toBe(true);
    expect(isValidTimeZone("Not/AZone")).toBe(false);
    expect(isValidTimeZone(undefined)).toBe(false);
    expect(isValidTimeZone("")).toBe(false);
  });
});

describe("addDays", () => {
  it("crosses month boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
  it("crosses year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });
  it("handles leap years", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2028-02-29", 1)).toBe("2028-03-01");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
  });
  it("supports zero and large deltas", () => {
    expect(addDays("2026-05-05", 0)).toBe("2026-05-05");
    expect(addDays("2026-01-01", 365)).toBe("2027-01-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });
});

describe("isDayComplete", () => {
  it("requires LESSONS_PER_DAY lessons, with no upper limit", () => {
    expect(LESSONS_PER_DAY).toBe(3);
    expect(isDayComplete(0)).toBe(false);
    expect(isDayComplete(2)).toBe(false);
    expect(isDayComplete(3)).toBe(true);
    expect(isDayComplete(50)).toBe(true);
  });
});

describe("computeStreaks", () => {
  const today = "2026-03-10";
  it("returns zeros for empty input", () => {
    expect(computeStreaks([], today)).toEqual({ current: 0, longest: 0 });
  });
  it("counts consecutive days ending today", () => {
    expect(computeStreaks(["2026-03-08", "2026-03-09", "2026-03-10"], today)).toEqual({ current: 3, longest: 3 });
  });
  it("keeps the streak when today is not done yet", () => {
    expect(computeStreaks(["2026-03-08", "2026-03-09"], today)).toEqual({ current: 2, longest: 2 });
  });
  it("breaks the streak when yesterday was missed", () => {
    expect(computeStreaks(["2026-03-07", "2026-03-08"], today)).toEqual({ current: 0, longest: 2 });
  });
  it("a gap resets current but longest remembers the best run", () => {
    const days = ["2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04", "2026-03-09", "2026-03-10"];
    expect(computeStreaks(days, today)).toEqual({ current: 2, longest: 4 });
  });
  it("only today done gives 1", () => {
    expect(computeStreaks(["2026-03-10"], today)).toEqual({ current: 1, longest: 1 });
  });
  it("handles unsorted and duplicate input", () => {
    const days = ["2026-03-10", "2026-03-08", "2026-03-09", "2026-03-09", "2026-03-10"];
    expect(computeStreaks(days, today)).toEqual({ current: 3, longest: 3 });
  });
  it("works across month and year boundaries", () => {
    expect(computeStreaks(["2026-12-30", "2026-12-31", "2027-01-01"], "2027-01-01")).toEqual({ current: 3, longest: 3 });
  });
  it("accepts any iterable (Set)", () => {
    expect(computeStreaks(new Set(["2026-03-10"]), today).current).toBe(1);
  });
  it("ignores future days for current streak", () => {
    expect(computeStreaks(["2026-03-12"], today)).toEqual({ current: 0, longest: 1 });
  });
});
