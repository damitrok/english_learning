import { describe, expect, it } from "vitest";
import { BUILD_PHRASES, TRANSLATE_PHRASES, type Phrase } from "@/content/phrases";

const ORDER = { A1: 0, A2: 1, B1: 2 } as const;
const norm = (s: string) => s.split(" ").map((w) => w.toLowerCase()).sort().join(" ");

function checkText(s: string) {
  expect(s.trim()).toBe(s);
  expect(s).not.toMatch(/ {2}/);
  expect(s.length).toBeGreaterThan(0);
}

describe.each([
  ["BUILD", BUILD_PHRASES],
  ["TRANSLATE", TRANSLATE_PHRASES],
] as [string, Phrase[]][])("%s_PHRASES", (_name, list) => {
  it("has 48 items", () => expect(list).toHaveLength(48));

  it("has non-empty, clean fields", () => {
    for (const p of list) {
      checkText(p.ru);
      checkText(p.en);
      for (const a of p.alt ?? []) checkText(a);
      expect(["A1", "A2", "B1"]).toContain(p.level);
    }
  });

  it("levels are non-decreasing", () => {
    for (let i = 1; i < list.length; i++) {
      expect(ORDER[list[i].level]).toBeGreaterThanOrEqual(ORDER[list[i - 1].level]);
    }
  });

  it("alts differ from en and from each other", () => {
    for (const p of list) {
      const alts = p.alt ?? [];
      for (const a of alts) expect(a).not.toBe(p.en);
      expect(new Set(alts).size).toBe(alts.length);
    }
  });
});

describe("BUILD specifics", () => {
  it("has 4-9 words each", () => {
    for (const p of BUILD_PHRASES) {
      const n = p.en.split(" ").length;
      expect(n, p.en).toBeGreaterThanOrEqual(4);
      expect(n, p.en).toBeLessThanOrEqual(9);
    }
  });
  it("alts are anagrams of en", () => {
    for (const p of BUILD_PHRASES) for (const a of p.alt ?? []) expect(norm(a)).toBe(norm(p.en));
  });
});

describe("cross-array", () => {
  it("has no duplicate en", () => {
    const all = [...BUILD_PHRASES, ...TRANSLATE_PHRASES].map((p) => p.en.toLowerCase());
    expect(new Set(all).size).toBe(all.length);
  });
});
