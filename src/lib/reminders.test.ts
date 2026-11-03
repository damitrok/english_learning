import { describe, expect, it } from "vitest";
import { INACTIVE_AFTER_DAYS, inReminderWindow, isCandidate, localHour, planReminder } from "./reminders";

const day = (date: string, over: Partial<{ lessons: number; wordSessions: number; listeningGames: number }> = {}) => ({
  date,
  lessons: 0,
  wordSessions: 0,
  listeningGames: 0,
  ...over,
});
/** A fully done day under the daily-tasks rule. */
const full = (date: string) => day(date, { lessons: 6, wordSessions: 1, listeningGames: 1 });

// 2026-11-10 is after the switch to daily tasks. 18:00 UTC = 21:00 Moscow.
const evening = new Date("2026-11-10T18:00:00Z");
const TZ = "Europe/Moscow";

describe("reminder window", () => {
  it("reads the local hour in the given zone", () => {
    expect(localHour("UTC", evening)).toBe(18);
    expect(localHour(TZ, evening)).toBe(21);
    expect(localHour("Asia/Tokyo", new Date("2026-11-10T15:30:00Z"))).toBe(0);
  });
  it("is the local evening, 19:00 to 21:59", () => {
    expect(inReminderWindow(TZ, new Date("2026-11-10T15:59:00Z"))).toBe(false); // 18:59
    expect(inReminderWindow(TZ, new Date("2026-11-10T16:00:00Z"))).toBe(true); // 19:00
    expect(inReminderWindow(TZ, new Date("2026-11-10T18:59:00Z"))).toBe(true); // 21:59
    expect(inReminderWindow(TZ, new Date("2026-11-10T19:00:00Z"))).toBe(false); // 22:00
  });
  it("skips a device already reminded today (local date)", () => {
    expect(isCandidate(TZ, "2026-11-10", evening)).toBe(false);
    expect(isCandidate(TZ, "2026-11-09", evening)).toBe(true);
    expect(isCandidate(TZ, null, evening)).toBe(true);
  });
});

describe("planReminder", () => {
  const base = { timeZone: TZ, now: evening, lastSentOn: null as string | null };

  it("warns about the streak when tasks are left", () => {
    const days = [full("2026-11-08"), full("2026-11-09"), day("2026-11-10", { wordSessions: 1, lessons: 1 })];
    const r = planReminder({ ...base, days });
    expect(r?.title).toBe("Серия 2 дня под угрозой");
    expect(r?.body).toContain("осталось 2 задания");
    expect(r?.url).toBe("/");
  });
  it("uses singular and plural forms", () => {
    const days = [full("2026-11-09"), day("2026-11-10", { wordSessions: 1, lessons: 6, listeningGames: 0 })];
    expect(planReminder({ ...base, days })).toMatchObject({ title: "Серия 1 день под угрозой" });
    expect(planReminder({ ...base, days })?.body).toContain("осталось 1 задание");
  });
  it("invites to start over when there is no streak", () => {
    const days = [day("2026-11-08", { lessons: 2, wordSessions: 1 })];
    const r = planReminder({ ...base, days });
    expect(r?.title).toBe("Пора заниматься английским");
    expect(r?.body).toContain("0 из 3");
  });
  it("sends nothing when today is already done", () => {
    expect(planReminder({ ...base, days: [full("2026-11-09"), full("2026-11-10")] })).toBeNull();
  });
  it("sends nothing outside the evening window or after today's reminder", () => {
    const days = [full("2026-11-09")];
    expect(planReminder({ ...base, now: new Date("2026-11-10T08:00:00Z"), days })).toBeNull();
    expect(planReminder({ ...base, lastSentOn: "2026-11-10", days })).toBeNull();
  });
  it("leaves people alone who have been away for over a week", () => {
    expect(INACTIVE_AFTER_DAYS).toBe(7);
    expect(planReminder({ ...base, days: [full("2026-11-02")] })).toBeNull();
    expect(planReminder({ ...base, days: [full("2026-11-03")] })).not.toBeNull();
    expect(planReminder({ ...base, days: [] })).toBeNull();
  });
});
