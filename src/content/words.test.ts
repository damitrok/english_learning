import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { blankWord } from "@/lib/word-context";

interface Word {
  headword: string;
  tag: string;
  translation: string;
  cefr: string;
  example: string;
}

// The B1 extension: words-part-N.mjs (N = frequency band, learning order). Also read by the seed builder.
const dir = new URL("../../supabase/content/", import.meta.url);

async function loadBands(): Promise<Word[][]> {
  const files = readdirSync(dir)
    .filter((f) => /^words-part-\d+\.mjs$/.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return Promise.all(files.map(async (f) => (await import(/* @vite-ignore */ new URL(f, dir).href)).WORDS as Word[]));
}

/** Headwords taught before the extension (starter set + textbook units + IT terms). */
function existingHeadwords(): Set<string> {
  const re = /^\s+\('([^']+)',/gm;
  const heads = new Set<string>();
  // seed.sql and the units part of seed_words.sql (rows whose source is not the extension)
  for (const f of ["../seed.sql", "../seed_words.sql"]) {
    const text = readFileSync(new URL(f, dir), "utf8");
    for (const line of text.split("\n")) {
      if (line.includes("b1-extension")) continue;
      const m = [...line.matchAll(re)][0];
      if (m) heads.add(m[1].toLowerCase());
    }
  }
  return heads;
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("B1 vocabulary extension", async () => {
  const bands = await loadBands();
  const all = bands.flat();

  it("has 8 bands of 275 words (2200 new words, ~3000 in total)", () => {
    expect(bands.map((b) => b.length)).toEqual(Array(8).fill(275));
  });

  it("never repeats a headword, nor one the learner already has", () => {
    const keys = all.map((w) => w.headword.toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
    const existing = existingHeadwords();
    expect(existing.size).toBeGreaterThan(700);
    expect(keys.filter((k) => existing.has(k))).toEqual([]);
  });

  it("has every field and a valid tag / level", () => {
    for (const w of all) {
      expect(Object.keys(w).sort(), w.headword).toEqual(["cefr", "example", "headword", "tag", "translation"]);
      expect(["general", "it"], w.headword).toContain(w.tag);
      expect(["A2", "B1", "B2"], w.headword).toContain(w.cefr);
      expect(w.headword, w.headword).toMatch(/^[a-z]+(-[a-z]+)?$/);
    }
  });

  it("has Russian translations without English letters", () => {
    for (const w of all) {
      expect(w.translation.trim(), w.headword).toBe(w.translation);
      expect(w.translation, w.headword).toMatch(/[а-яё]/i);
      expect(w.translation, w.headword).not.toMatch(/[a-z]/i);
    }
  });

  it("has examples of 6–14 words that contain the word once, in a form the gap exercise can cut out", () => {
    for (const w of all) {
      const n = words(w.example);
      expect(n, `${w.headword}: ${w.example}`).toBeGreaterThanOrEqual(6);
      expect(n, `${w.headword}: ${w.example}`).toBeLessThanOrEqual(14);
      expect(blankWord(w.example, w.headword), `${w.headword}: ${w.example}`).not.toBeNull();
      const hits = w.example.match(new RegExp(`\\b${w.headword}(?:s|es|ed|d|ing)?\\b`, "gi")) ?? [];
      expect(hits, `${w.headword}: ${w.example}`).toHaveLength(1);
    }
  });

  it("gets harder band by band (share of A2 words falls, B2 rises)", () => {
    const share = (b: Word[], level: string) => b.filter((w) => w.cefr === level).length / b.length;
    expect(share(bands[0], "A2")).toBeGreaterThan(share(bands[3], "A2"));
    expect(share(bands[3], "A2")).toBeGreaterThan(share(bands[7], "A2"));
    expect(share(bands[7], "B2")).toBeGreaterThan(share(bands[0], "B2"));
  });

  it("is about a quarter work/IT vocabulary", () => {
    const it = all.filter((w) => w.tag === "it").length;
    expect(it / all.length).toBeGreaterThan(0.15);
    expect(it / all.length).toBeLessThan(0.4);
  });
});
