// Checking a typed word against the expected answer(s), and turning the attempt into an SRS rating.
import type { SrsResult } from "@/lib/supabase/types";

export type AnswerVerdict = "correct" | "near" | "wrong";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/[.,;:!?"“”()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Edit distance where swapping two neighbouring letters counts as one edit (optimal string alignment). */
export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/**
 * "correct" for an exact match, "near" for a one-letter slip in a word of 5+ letters (a typo, not a
 * gap in memory), "wrong" otherwise.
 */
export function checkWordAnswer(input: string, accepted: string[]): AnswerVerdict {
  const given = normalize(input);
  if (!given) return "wrong";
  const targets = accepted.map(normalize).filter(Boolean);
  if (targets.includes(given)) return "correct";
  if (targets.some((t) => t.length >= 5 && editDistance(given, t) === 1)) return "near";
  return "wrong";
}

/** A quick, unaided correct answer is "easy"; everything shaky is "hard" or "forgot". */
export const FAST_ANSWER_SECONDS = 8;

export function gradeAttempt(a: {
  verdict: AnswerVerdict;
  usedHint: boolean;
  gaveUp: boolean;
  seconds: number;
}): SrsResult {
  if (a.gaveUp || a.verdict === "wrong") return "forgot";
  if (a.verdict === "near" || a.usedHint) return "hard";
  return a.seconds <= FAST_ANSWER_SECONDS ? "easy" : "normal";
}

/** "t____" — the first letter and one underscore per remaining letter. */
export function hintFor(word: string): string {
  return word ? word[0] + "_".repeat(Math.max(0, word.length - 1)) : "";
}
