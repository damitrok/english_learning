import { describe, expect, it } from "vitest";
import { reviewCard } from "./srs";

const now = new Date("2026-03-10T12:00:00.000Z");
const card = (repetitions: number, interval_days: number, ease_factor = 2.5) => ({
  ease_factor,
  interval_days,
  repetitions,
});
const daysUntil = (iso: string) => (new Date(iso).getTime() - now.getTime()) / 86_400_000;

describe("reviewCard fixed early steps", () => {
  it.each(["hard", "normal", "easy"] as const)("%s: 1st/2nd/3rd success -> 1/3/7 days, ease unchanged", (r) => {
    expect(reviewCard(card(0, 0), r, now)).toMatchObject({ interval_days: 1, repetitions: 1, ease_factor: 2.5 });
    expect(reviewCard(card(1, 1), r, now)).toMatchObject({ interval_days: 3, repetitions: 2, ease_factor: 2.5 });
    expect(reviewCard(card(2, 3), r, now)).toMatchObject({ interval_days: 7, repetitions: 3, ease_factor: 2.5 });
  });
  it("sets due_at = now + interval", () => {
    const res = reviewCard(card(1, 1), "normal", now);
    expect(daysUntil(res.due_at)).toBe(3);
  });
});

describe("reviewCard after the fixed steps (repetitions >= 3)", () => {
  it("normal: interval * ease, ease unchanged", () => {
    expect(reviewCard(card(3, 7), "normal", now)).toMatchObject({ interval_days: 17.5, ease_factor: 2.5, repetitions: 4 });
  });
  it("hard: interval * 1.2, ease -0.15", () => {
    const r = reviewCard(card(3, 10), "hard", now);
    expect(r.interval_days).toBe(12);
    expect(r.ease_factor).toBeCloseTo(2.35, 10);
    expect(r.repetitions).toBe(4);
  });
  it("easy: interval * ease * 1.3 (old ease), ease +0.15", () => {
    const r = reviewCard(card(3, 10), "easy", now);
    expect(r.interval_days).toBe(32.5);
    expect(r.ease_factor).toBeCloseTo(2.65, 10);
  });
  it("ease factor never drops below 1.3", () => {
    expect(reviewCard(card(3, 10, 1.35), "hard", now).ease_factor).toBe(1.3);
    expect(reviewCard(card(3, 10, 1.3), "hard", now).ease_factor).toBe(1.3);
  });
  it("rounds interval to 2 decimals", () => {
    expect(reviewCard(card(3, 7, 2.37), "normal", now).interval_days).toBe(16.59);
  });
  it("due_at matches the unrounded-then-rounded interval", () => {
    const r = reviewCard(card(3, 10), "normal", now);
    expect(daysUntil(r.due_at)).toBeCloseTo(25, 6);
  });
});

describe("reviewCard forgot", () => {
  it("resets repetitions and interval to 1 day, keeps ease", () => {
    const r = reviewCard(card(8, 120, 2.1), "forgot", now);
    expect(r).toMatchObject({ repetitions: 0, interval_days: 1, ease_factor: 2.1 });
    expect(daysUntil(r.due_at)).toBe(1);
  });
  it("after forgetting, the next success restarts at the 1-day step", () => {
    const f = reviewCard(card(8, 120), "forgot", now);
    expect(reviewCard(f, "easy", now)).toMatchObject({ interval_days: 1, repetitions: 1 });
  });
});
