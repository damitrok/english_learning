export type PhraseLevel = "A1" | "A2" | "B1";

/** A Russian sentence with its English translation (and other equally correct translations). */
export interface Phrase {
  ru: string;
  en: string;
  alt?: string[];
  level: PhraseLevel;
}
