import { describe, expect, it } from "vitest";
import { BUILD_PHRASES, TRANSLATE_PHRASES, type Phrase } from "@/content/phrases";
import { isCorrectPhrase, PHRASES_PER_LESSON, tokenize } from "@/lib/phrases-lesson";
import { normalizePhrase } from "@/lib/text-normalize";

const UNITS = 115;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const LEVEL_RANK = { A1: 0, A2: 1, B1: 2 } as const;

/** Mean word count of `en` for each fifth of the corpus. */
const fifths = (list: Phrase[]) =>
  Array.from({ length: 5 }, (_, i) =>
    mean(list.slice(Math.floor((i * list.length) / 5), Math.floor(((i + 1) * list.length) / 5)).map((p) => words(p.en)))
  );

describe.each([
  ["BUILD", BUILD_PHRASES],
  ["TRANSLATE", TRANSLATE_PHRASES],
])("%s corpus", (name, list) => {
  it("has 6 phrases for each of the 115 sections", () => {
    expect(list).toHaveLength(UNITS * PHRASES_PER_LESSON);
  });

  it("has no empty fields or stray spacing", () => {
    for (const p of list) {
      for (const s of [p.ru, p.en, ...(p.alt ?? [])]) {
        expect(s.trim(), s).toBe(s);
        expect(s, s).not.toMatch(/\s{2,}/);
        expect(s.length, `empty in ${p.en}`).toBeGreaterThan(0);
      }
    }
  });

  it("has no space before an apostrophe (\"brother 's\" could never be typed)", () => {
    for (const p of list) for (const s of [p.en, ...(p.alt ?? [])]) expect(s, s).not.toMatch(/\s'(s|re|ve|ll|d|m|t)\b/);
  });

  it("has no doubled punctuation", () => {
    for (const p of list) for (const s of [p.en, ...(p.alt ?? [])]) expect(s, s).not.toMatch(/(^|[^.])\.\.($|[^.])|,,|;;|::/);
  });

  it("never repeats an English sentence", () => {
    const keys = list.map((p) => normalizePhrase(p.en));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("has non-decreasing levels: A1 up to unit 24, A2 up to 70, B1 after", () => {
    list.forEach((p, i) => {
      const unit = Math.floor(i / PHRASES_PER_LESSON) + 1;
      expect(p.level, `${name} #${i} (unit ${unit})`).toBe(unit <= 24 ? "A1" : unit <= 70 ? "A2" : "B1");
    });
    const ranks = list.map((p) => LEVEL_RANK[p.level]);
    expect(ranks).toEqual([...ranks].sort());
  });

  it("gets longer step by step (mean sentence length per fifth rises)", () => {
    const f = fifths(list);
    for (let i = 1; i < f.length; i++) expect(f[i], f.map((x) => x.toFixed(1)).join(" ")).toBeGreaterThan(f[i - 1]);
  });

  it("accepts its own canonical answer and rejects an empty one", () => {
    for (const p of list) {
      expect(isCorrectPhrase(p.en, p), p.en).toBe(true);
      expect(isCorrectPhrase("", p)).toBe(false);
    }
  });
});

describe("BUILD specifics", () => {
  it("fits the ladder: 4–6 words early, up to 12 late", () => {
    for (const [i, p] of BUILD_PHRASES.entries()) {
      const unit = Math.floor(i / PHRASES_PER_LESSON) + 1;
      const n = tokenize(p.en).length;
      const [lo, hi] = unit <= 24 ? [4, 6] : unit <= 50 ? [5, 8] : unit <= 90 ? [6, 10] : [8, 12];
      expect(n, `unit ${unit}: ${p.en}`).toBeGreaterThanOrEqual(lo);
      expect(n, `unit ${unit}: ${p.en}`).toBeLessThanOrEqual(hi);
    }
  });

  it("alts are anagrams of the canonical sentence (same tiles, other order)", () => {
    const key = (s: string) => tokenize(s.toLowerCase()).sort().join(" ");
    for (const p of BUILD_PHRASES) for (const a of p.alt ?? []) expect(key(a), p.en).toBe(key(p.en));
  });
});

describe("TRANSLATE specifics", () => {
  it("fits the ladder: 4–8 words early, up to 18 late", () => {
    for (const [i, p] of TRANSLATE_PHRASES.entries()) {
      const unit = Math.floor(i / PHRASES_PER_LESSON) + 1;
      const n = words(p.en);
      const [lo, hi] = unit <= 24 ? [4, 8] : unit <= 50 ? [5, 11] : unit <= 90 ? [6, 14] : [8, 18];
      expect(n, `unit ${unit}: ${p.en}`).toBeGreaterThanOrEqual(lo);
      expect(n, `unit ${unit}: ${p.en}`).toBeLessThanOrEqual(hi);
    }
  });

  it("ignores punctuation inside the sentence when checking", () => {
    const p = { ru: "", en: "Be careful, you're going to fall!", level: "A1" as const };
    expect(isCorrectPhrase("be careful you're going to fall", p)).toBe(true);
  });
});
