import { describe, expect, it } from "vitest";
import { addDays, isValidTimeZone, localDate } from "./dates";

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
