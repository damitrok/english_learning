/** Lowercase, straighten apostrophes, collapse spaces, drop trailing punctuation. */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?,]+$/, "");
}

/**
 * Comparison key for free-typed sentences: like normalizeAnswer, but punctuation anywhere is
 * ignored (a missing comma or "a.m." vs "am" never makes a correct sentence wrong).
 */
export function normalizePhrase(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/[.,;:!?"“”()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
