import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface Text {
  title: string;
  level: string;
  body: string;
  questions: { statement: string; answer: boolean }[];
}

// Reading texts are .mjs content modules (also read by the seed builder); text N goes with grammar unit N.
const dir = new URL("../../supabase/content/", import.meta.url);
async function loadTexts(): Promise<Text[]> {
  const parts = readdirSync(dir)
    .filter((f) => /^texts-part-\d+\.mjs$/.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const base = (await import(/* @vite-ignore */ new URL("texts.mjs", dir).href)).TEXTS as Text[];
  const rest = await Promise.all(parts.map(async (f) => (await import(/* @vite-ignore */ new URL(f, dir).href)).TEXTS as Text[]));
  return [...base, ...rest.flat()];
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("reading texts", async () => {
  const texts = await loadTexts();

  it("has one text per grammar unit (115)", () => {
    expect(texts).toHaveLength(115);
  });

  it("has unique titles", () => {
    expect(new Set(texts.map((t) => t.title)).size).toBe(texts.length);
  });

  it("labels levels A1 → A2 → B1 in order (A1 ≤ 24 < A2 ≤ 70 < B1) from text 13 on", () => {
    texts.forEach((t, i) => {
      const n = i + 1;
      if (n < 13) return; // the first twelve are the hand-picked starter set
      expect(t.level, `text ${n} ${t.title}`).toBe(n <= 24 ? "A1" : n <= 70 ? "A2" : "B1");
    });
  });

  it("grows in length with the text number (±20% of 50 + 1.5·N words from text 13)", () => {
    texts.forEach((t, i) => {
      const n = i + 1;
      if (n < 13) return;
      const target = 50 + 1.5 * n;
      const w = words(t.body);
      expect(w, `text ${n} ${t.title}`).toBeGreaterThanOrEqual(target * 0.8);
      expect(w, `text ${n} ${t.title}`).toBeLessThanOrEqual(target * 1.2);
    });
  });

  it("gets longer fifth by fifth", () => {
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const f = Array.from({ length: 5 }, (_, k) =>
      mean(texts.slice(Math.floor((k * 115) / 5), Math.floor(((k + 1) * 115) / 5)).map((t) => words(t.body)))
    );
    for (let k = 1; k < 5; k++) expect(f[k], f.map((x) => x.toFixed(0)).join(" ")).toBeGreaterThan(f[k - 1]);
  });

  it("has well-formed true/false questions (3–5, mixed answers)", () => {
    texts.forEach((t, i) => {
      expect(t.questions.length, `text ${i + 1}`).toBeGreaterThanOrEqual(2);
      expect(t.questions.length, `text ${i + 1}`).toBeLessThanOrEqual(5);
      for (const q of t.questions) {
        expect(q.statement.trim().length).toBeGreaterThan(5);
        expect(typeof q.answer).toBe("boolean");
      }
      if (i + 1 >= 13) expect(new Set(t.questions.map((q) => q.answer)).size, `text ${i + 1} needs both true and false`).toBe(2);
    });
  });

  it("has no stray whitespace or empty paragraphs", () => {
    for (const t of texts) {
      expect(t.body.trim()).toBe(t.body);
      expect(t.body).not.toMatch(/\n{3,}/);
      expect(t.title.trim()).toBe(t.title);
    }
  });
});
