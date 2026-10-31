// Pure: blanks a studied word in its example sentence (headword + simple inflections,
// the same rule as highlight.ts).
export interface ContextBlank {
  before: string;
  after: string;
  /** Accepted answers: the form as it appears in the sentence, and the headword. */
  answers: string[];
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function blankWord(sentence: string, headword: string): ContextBlank | null {
  const re = new RegExp(`\\b${escapeRegExp(headword)}(?:s|es|ed|d|ing)?\\b`, "i");
  const m = re.exec(sentence);
  if (!m) return null;
  const surface = m[0];
  return {
    before: sentence.slice(0, m.index),
    after: sentence.slice(m.index + surface.length),
    answers: [...new Set([surface, headword])],
  };
}
