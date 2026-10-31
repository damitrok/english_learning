// Pure helpers for the build-a-sentence and translate lessons.
import type { Phrase } from "@/content/phrases";
import { normalizePhrase } from "@/lib/text-normalize";

export const PHRASES_PER_LESSON = 6;

/** The batch of phrases for a path cycle; wraps around once the list is used up. */
export function pickPhrases(list: readonly Phrase[], cycle: number, size = PHRASES_PER_LESSON): Phrase[] {
  if (list.length === 0) return [];
  return Array.from({ length: Math.min(size, list.length) }, (_, k) => list[(cycle * size + k) % list.length]);
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic shuffle (server and client render the same order); never returns the input order. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...items];
  for (let attempt = 0; attempt < 8; attempt++) {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.length < 2 || out.some((x, i) => x !== items[i])) break;
  }
  return out;
}

export function tokenize(sentence: string): string[] {
  return sentence.split(" ").filter(Boolean);
}

/** True when `given` matches the canonical English or any of its listed variants. */
export function isCorrectPhrase(given: string, phrase: Pick<Phrase, "en" | "alt">): boolean {
  const g = normalizePhrase(given);
  return [phrase.en, ...(phrase.alt ?? [])].some((v) => normalizePhrase(v) === g);
}
