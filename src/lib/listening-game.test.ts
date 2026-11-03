import { describe, expect, it } from "vitest";
import type { ListeningLine } from "@/content/listening/types";
import {
  LEVELS,
  STOPWORDS,
  activeLineIndex,
  buildGaps,
  buildOptions,
  collectVocabulary,
  estimateGaps,
  hashSeed,
  isCandidate,
  lineParts,
  mulberry32,
  tokenizeLine,
} from "./listening-game";

// Original text, 5 seconds per line, 60 lines = 5 minutes.
const SENTENCES = [
  "Today we talk about deploying a service to production",
  "The pipeline builds a container image after every commit",
  "Monitoring tells you quickly when latency starts growing",
  "A reliable database backup is worth more than any feature",
  "Engineers review every change before the release happens",
  "Feature flags let teams ship unfinished work safely",
];
const lines: ListeningLine[] = Array.from({ length: 60 }, (_, i) => ({
  start: i * 5,
  end: i * 5 + 5,
  text: SENTENCES[i % SENTENCES.length],
}));

describe("isCandidate", () => {
  it("accepts meaningful words and rejects short, filler and contracted ones", () => {
    expect(isCandidate("pipeline")).toBe(true);
    expect(isCandidate("Monitoring")).toBe(true);
    expect(isCandidate("the")).toBe(false);
    expect(isCandidate("they")).toBe(false);
    expect(isCandidate("about")).toBe(false);
    expect(isCandidate("don't")).toBe(false);
    expect(isCandidate("go")).toBe(false);
  });
  it("keeps the stop list lower case", () => {
    for (const w of STOPWORDS) expect(w).toBe(w.toLowerCase());
  });
});

describe("tokenizeLine", () => {
  const line: ListeningLine = { start: 10, end: 20, text: "Hello big world" };
  it("finds words with positions inside the line text", () => {
    const t = tokenizeLine(line, 3);
    expect(t.map((w) => w.word)).toEqual(["Hello", "big", "world"]);
    for (const w of t) expect(line.text.slice(w.charStart, w.charEnd)).toBe(w.word);
    expect(t.every((w) => w.line === 3)).toBe(true);
  });
  it("spreads the line's time over its characters, in order, inside start..end", () => {
    const t = tokenizeLine(line, 0);
    expect(t[0].start).toBe(10);
    for (let i = 0; i < t.length; i++) {
      expect(t[i].end).toBeGreaterThan(t[i].start);
      expect(t[i].end).toBeLessThanOrEqual(20);
      if (i > 0) expect(t[i].start).toBeGreaterThanOrEqual(t[i - 1].end);
    }
  });
  it("keeps contractions as one word", () => {
    expect(tokenizeLine({ start: 0, end: 2, text: "it's fine" }, 0).map((w) => w.word)).toEqual(["it's", "fine"]);
  });
});

describe("buildGaps", () => {
  it("is deterministic for a seed and differs between seeds", () => {
    const a = buildGaps(lines, 9, 1);
    expect(buildGaps(lines, 9, 1)).toEqual(a);
    expect(buildGaps(lines, 9, 2)).not.toEqual(a);
  });
  it("gives denser gaps on harder levels", () => {
    const counts = LEVELS.map((l) => buildGaps(lines, l.secondsPerGap, 7).length);
    expect(counts[0]).toBeLessThan(counts[1]);
    expect(counts[1]).toBeLessThan(counts[2]);
  });
  it("puts about one gap per secondsPerGap seconds", () => {
    const n = buildGaps(lines, 9, 3).length;
    // 300 s of video, 9 s per gap, minus the lead-in: roughly 28-33 gaps.
    expect(n).toBeGreaterThan(22);
    expect(n).toBeLessThan(36);
  });
  it("only gaps meaningful words, in playback order, spaced apart", () => {
    const gaps = buildGaps(lines, 5, 11);
    expect(gaps.length).toBeGreaterThan(0);
    gaps.forEach((g, i) => {
      expect(g.id).toBe(i);
      expect(isCandidate(g.word)).toBe(true);
      expect(lines[g.line].text.slice(g.charStart, g.charEnd)).toBe(g.word);
      if (i > 0) {
        expect(g.start).toBeGreaterThanOrEqual(gaps[i - 1].end + 1.5 - 1e-9);
        expect(g.line).toBeGreaterThanOrEqual(gaps[i - 1].line);
      }
    });
  });
  it("does not repeat a word while other candidates exist", () => {
    const gaps = buildGaps(lines, 9, 5);
    const first = gaps.slice(0, 8).map((g) => g.word.toLowerCase());
    expect(new Set(first).size).toBe(first.length);
  });
  it("copes with no lines, no candidates and zero-length lines", () => {
    expect(buildGaps([], 9, 1)).toEqual([]);
    expect(buildGaps([{ start: 0, end: 30, text: "the and but it is" }], 5, 1)).toEqual([]);
    expect(buildGaps([{ start: 3, end: 3, text: "pipeline" }], 0.1, 1).length).toBeLessThanOrEqual(1);
  });
});

describe("estimateGaps", () => {
  it("matches the number of gaps a play would get", () => {
    expect(estimateGaps(lines, 9)).toBe(buildGaps(lines, 9, 1).length);
  });
});

describe("collectVocabulary / buildOptions", () => {
  const vocab = collectVocabulary(lines);
  it("lists distinct lower-case meaningful words", () => {
    expect(vocab).toContain("pipeline");
    expect(vocab).not.toContain("the");
    expect(new Set(vocab).size).toBe(vocab.length);
    expect(vocab.every((w) => w === w.toLowerCase())).toBe(true);
  });
  it("offers the right word plus distinct wrong ones, shuffled, without mutating the pool", () => {
    const copy = [...vocab];
    const opts = buildOptions("Pipeline", vocab, mulberry32(4));
    expect(opts).toHaveLength(4);
    expect(opts).toContain("pipeline");
    expect(new Set(opts).size).toBe(4);
    expect(vocab).toEqual(copy);
  });
  it("prefers wrong options of similar length", () => {
    const opts = buildOptions("pipeline", vocab, mulberry32(9)).filter((w) => w !== "pipeline");
    for (const w of opts) expect(Math.abs(w.length - "pipeline".length)).toBeLessThanOrEqual(3);
  });
  it("gives fewer options when the transcript has few words", () => {
    expect(buildOptions("pipeline", ["pipeline", "monitoring"], mulberry32(1))).toHaveLength(2);
    expect(buildOptions("pipeline", [], mulberry32(1))).toEqual(["pipeline"]);
  });
});

describe("lineParts", () => {
  it("cuts a line into text and gaps without losing a character", () => {
    const text = "Monitoring tells you quickly when latency starts growing";
    const gaps = tokenizeLine({ start: 0, end: 5, text }, 0)
      .filter((w) => ["tells", "latency"].includes(w.word))
      .map((w, i) => ({ ...w, id: i }));
    const parts = lineParts(text, gaps);
    expect(parts.map((p) => p.text).join("")).toBe(text);
    expect(parts.filter((p) => p.gap).map((p) => p.text)).toEqual(["tells", "latency"]);
  });
  it("returns the whole line when there are no gaps", () => {
    expect(lineParts("plain text", [])).toEqual([{ text: "plain text" }]);
  });
});

describe("activeLineIndex", () => {
  it("finds the line being spoken", () => {
    expect(activeLineIndex(lines, 0)).toBe(0);
    expect(activeLineIndex(lines, 4.9)).toBe(0);
    expect(activeLineIndex(lines, 5)).toBe(1);
    expect(activeLineIndex(lines, 1000)).toBe(59);
    expect(activeLineIndex(lines, -3)).toBe(0);
    expect(activeLineIndex([], 3)).toBe(0);
  });
});

describe("seeding", () => {
  it("hashSeed is stable and mulberry32 stays in [0, 1)", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
    const r = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
