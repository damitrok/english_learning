/** Lowercase, straighten apostrophes, collapse spaces, drop trailing punctuation. */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?,]+$/, "");
}
