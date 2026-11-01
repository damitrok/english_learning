import { describe, expect, it } from "vitest";
import {
  buildWordQueue,
  DAILY_NEW_CAP,
  LEARNED_INTERVAL_DAYS,
  NEW_PER_SESSION,
  REVIEWS_PER_SESSION,
  summarizeWords,
  type CardRow,
  type WordRow,
} from "@/lib/word-queue";

const NOW = new Date("2026-11-01T12:00:00Z");
const day = 24 * 3600 * 1000;

const word = (i: number, extra: Partial<WordRow> = {}): WordRow => ({
  id: `w${i}`,
  headword: `word${i}`,
  translation: `слово ${i}`,
  ipa: null,
  example_sentence: `This is the word${i} in a sentence.`,
  cefr_level: "A2",
  ...extra,
});
const card = (i: number, dueInDays: number, interval = 1, extra: Partial<CardRow> = {}): CardRow => ({
  id: `c${i}`,
  word_id: `w${i}`,
  ease_factor: 2.5,
  interval_days: interval,
  repetitions: 1,
  due_at: new Date(NOW.getTime() + dueInDays * day).toISOString(),
  ...extra,
});
const words = (n: number) => Array.from({ length: n }, (_, i) => word(i));

describe("buildWordQueue", () => {
  it("puts due cards first, most overdue first, then new words in learning order", () => {
    const ws = words(30);
    const cards = [card(5, -1), card(3, -5), card(4, +2)]; // 4 is not due
    const q = buildWordQueue({ words: ws, cards, newToday: 0, now: NOW });
    expect(q.slice(0, 2).map((i) => i.wordId)).toEqual(["w3", "w5"]);
    const fresh = q.slice(2);
    expect(fresh).toHaveLength(NEW_PER_SESSION);
    expect(fresh.every((i) => i.isNew)).toBe(true);
    expect(fresh.map((i) => i.wordId)).toEqual(["w0", "w1", "w2", "w6", "w7", "w8", "w9", "w10"]);
  });

  it("caps the reviews per session", () => {
    const ws = words(60);
    const cards = Array.from({ length: 50 }, (_, i) => card(i, -1));
    const q = buildWordQueue({ words: ws, cards, newToday: DAILY_NEW_CAP, now: NOW });
    expect(q).toHaveLength(REVIEWS_PER_SESSION);
    expect(q.every((i) => !i.isNew)).toBe(true);
  });

  it("respects the daily cap of new words, and 'more' lifts it", () => {
    const ws = words(80);
    expect(buildWordQueue({ words: ws, cards: [], newToday: DAILY_NEW_CAP - 3, now: NOW })).toHaveLength(3);
    expect(buildWordQueue({ words: ws, cards: [], newToday: DAILY_NEW_CAP, now: NOW })).toHaveLength(0);
    expect(buildWordQueue({ words: ws, cards: [], newToday: DAILY_NEW_CAP, more: true, now: NOW })).toHaveLength(NEW_PER_SESSION);
  });

  it("asks young cards by recall and some older cards as a gap in the example sentence", () => {
    const ws = words(40);
    const young = buildWordQueue({ words: ws, cards: [card(0, -1, 3)], newToday: DAILY_NEW_CAP, now: NOW });
    expect(young[0].kind).toBe("recall");
    const old = Array.from({ length: 40 }, (_, i) => card(i, -1, 30, { repetitions: 4 }));
    const kinds = buildWordQueue({ words: ws, cards: old, newToday: DAILY_NEW_CAP, now: NOW }).map((i) => i.kind);
    expect(kinds).toContain("context");
    expect(kinds).toContain("recall");
  });

  it("a context item hides the word and accepts it as it appears in the sentence", () => {
    const ws = [word(0, { headword: "attack", example_sentence: "Hackers attacked the server." })];
    for (let rep = 1; rep < 30; rep++) {
      const [item] = buildWordQueue({
        words: ws,
        cards: [card(0, -1, 30, { repetitions: rep })],
        newToday: DAILY_NEW_CAP,
        now: NOW,
      });
      if (item.kind === "context") {
        expect(item.context).toEqual({ before: "Hackers ", after: " the server." });
        expect(item.answers).toEqual(["attacked", "attack"]);
        return;
      }
    }
    throw new Error("no context item produced");
  });

  it("falls back to recall when the example does not contain the word", () => {
    const ws = [word(0, { example_sentence: "Nothing relevant here." })];
    const [item] = buildWordQueue({ words: ws, cards: [card(0, -1, 30)], newToday: DAILY_NEW_CAP, now: NOW });
    expect(item.kind).toBe("recall");
  });
});

describe("summarizeWords", () => {
  it("counts started, learned, learning and due, and per level", () => {
    const ws = [word(0, { cefr_level: "A1" }), word(1, { cefr_level: "A2" }), word(2, { cefr_level: "A2" }), word(3, { cefr_level: "B1" })];
    const cards = [card(0, 5, LEARNED_INTERVAL_DAYS), card(1, -1, 2), card(2, 3, LEARNED_INTERVAL_DAYS + 10)];
    const s = summarizeWords({ words: ws, cards, newToday: 5, now: NOW });
    expect(s).toMatchObject({ total: 4, started: 3, learned: 2, learning: 1, due: 1, newToday: 5 });
    expect(s.newRemainingToday).toBe(DAILY_NEW_CAP - 5);
    expect(s.byLevel).toEqual([
      { level: "A1", total: 1, learned: 1 },
      { level: "A2", total: 2, learned: 1 },
      { level: "B1", total: 1, learned: 0 },
    ]);
  });
});
