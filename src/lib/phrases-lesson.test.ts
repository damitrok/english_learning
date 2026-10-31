import { describe, expect, it } from "vitest";
import { BUILD_PHRASES, TRANSLATE_PHRASES } from "@/content/phrases";
import { isCorrectPhrase, pickPhrases, seededShuffle, tokenize } from "@/lib/phrases-lesson";

const list = Array.from({ length: 10 }, (_, i) => ({ ru: `р${i}`, en: `e${i}`, level: "A1" as const }));

describe("pickPhrases", () => {
  it("takes consecutive batches per cycle", () => {
    expect(pickPhrases(list, 0, 4).map((p) => p.en)).toEqual(["e0", "e1", "e2", "e3"]);
    expect(pickPhrases(list, 1, 4).map((p) => p.en)).toEqual(["e4", "e5", "e6", "e7"]);
  });
  it("wraps around the end of the list", () => {
    expect(pickPhrases(list, 2, 4).map((p) => p.en)).toEqual(["e8", "e9", "e0", "e1"]);
  });
  it("handles empty lists and lists shorter than a batch", () => {
    expect(pickPhrases([], 3)).toEqual([]);
    expect(pickPhrases(list.slice(0, 2), 5, 6)).toHaveLength(2);
  });
  it("covers the whole real corpus over successive cycles without gaps", () => {
    const seen = new Set<string>();
    for (let c = 0; c < 115; c++) pickPhrases(BUILD_PHRASES, c).forEach((p) => seen.add(p.en));
    expect(seen.size).toBe(BUILD_PHRASES.length);
  });
});

describe("seededShuffle", () => {
  const words = tokenize("I am going to start a new project");
  it("is deterministic and keeps the same words", () => {
    expect(seededShuffle(words, 7)).toEqual(seededShuffle(words, 7));
    expect([...seededShuffle(words, 7)].sort()).toEqual([...words].sort());
  });
  it("never returns the original order for 2+ distinct words", () => {
    for (let seed = 0; seed < 200; seed++) expect(seededShuffle(["a", "b", "c"], seed)).not.toEqual(["a", "b", "c"]);
  });
  it("doesn't mutate the input", () => {
    const copy = [...words];
    seededShuffle(words, 1);
    expect(words).toEqual(copy);
  });
});

describe("isCorrectPhrase", () => {
  const p = { en: "I'm a developer.", alt: ["I am a developer."] };
  it("ignores case, curly apostrophes, trailing punctuation and extra spaces", () => {
    expect(isCorrectPhrase("i’m  a developer", p)).toBe(true);
    expect(isCorrectPhrase("I AM A DEVELOPER!", p)).toBe(true);
  });
  it("rejects wrong sentences", () => {
    expect(isCorrectPhrase("I am developer", p)).toBe(false);
    expect(isCorrectPhrase("", p)).toBe(false);
  });
});

describe("real corpus is solvable by BuildSession's check", () => {
  it("the tokens of every BUILD sentence joined back are accepted", () => {
    for (const p of BUILD_PHRASES) expect(isCorrectPhrase(tokenize(p.en).join(" "), p)).toBe(true);
  });
  it("every TRANSLATE canonical answer is accepted", () => {
    for (const p of TRANSLATE_PHRASES) expect(isCorrectPhrase(p.en, p)).toBe(true);
  });
});
