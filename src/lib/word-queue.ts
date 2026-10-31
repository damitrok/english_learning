// Pure logic of the words tab: which cards a session contains and how the word stats are summed up.
import { blankWord } from "@/lib/word-context";
import type { SrsCardState } from "@/lib/srs";

/** Max due cards in one session; the rest wait for the next one. */
export const REVIEWS_PER_SESSION = 20;
/** New words per session. */
export const NEW_PER_SESSION = 8;
/** New words per day (≈ three sessions); "learn more" lifts it by one more session. */
export const DAILY_NEW_CAP = 24;
/** A card counts as learned once its review interval reaches three weeks. */
export const LEARNED_INTERVAL_DAYS = 21;
/** Roughly the vocabulary of a confident B1. */
export const WORD_TARGET = 3000;
/** From this interval on, a card is also tested in context (fill the gap in a sentence). */
const CONTEXT_FROM_DAYS = 7;

export interface WordRow {
  id: string;
  headword: string;
  translation: string;
  ipa: string | null;
  example_sentence: string | null;
  cefr_level: string;
}

export interface CardRow {
  id: string;
  word_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  due_at: string;
}

export interface WordItem {
  wordId: string;
  cardId: string | null;
  headword: string;
  translation: string;
  ipa: string | null;
  example: string | null;
  srsState: SrsCardState;
  /** A brand-new word: shown first (intro), then recalled. */
  isNew: boolean;
  /** recall: Russian → type the English word; context: type the word missing from a sentence. */
  kind: "recall" | "context";
  context?: { before: string; after: string };
  /** Accepted typed answers (first = the one shown as correct). */
  answers: string[];
}

function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function toItem(word: WordRow, card: CardRow | null): WordItem {
  const state: SrsCardState = card
    ? { ease_factor: card.ease_factor, interval_days: card.interval_days, repetitions: card.repetitions }
    : { ease_factor: 2.5, interval_days: 0, repetitions: 0 };
  const base: WordItem = {
    wordId: word.id,
    cardId: card?.id ?? null,
    headword: word.headword,
    translation: word.translation,
    ipa: word.ipa,
    example: word.example_sentence,
    srsState: state,
    isNew: !card,
    kind: "recall",
    answers: [word.headword],
  };
  if (card && card.interval_days >= CONTEXT_FROM_DAYS && word.example_sentence) {
    const blank = blankWord(word.example_sentence, word.headword);
    // Alternate recall and context, deterministically per card and review count.
    if (blank && hash(word.id + card.repetitions) % 2 === 0) {
      return { ...base, kind: "context", context: { before: blank.before, after: blank.after }, answers: blank.answers };
    }
  }
  return base;
}

/**
 * The next words session: due cards first (most overdue first, capped), then new words in learning
 * order, limited per session and per day. `words` must be sorted in learning order.
 */
export function buildWordQueue(a: {
  words: WordRow[];
  cards: CardRow[];
  /** How many new words were already started today. */
  newToday: number;
  /** Ignore the daily cap (once more). */
  more?: boolean;
  now?: Date;
}): WordItem[] {
  const now = (a.now ?? new Date()).getTime();
  const byId = new Map(a.words.map((w) => [w.id, w]));

  const due = a.cards
    .filter((c) => new Date(c.due_at).getTime() <= now && byId.has(c.word_id))
    .sort((x, y) => new Date(x.due_at).getTime() - new Date(y.due_at).getTime())
    .slice(0, REVIEWS_PER_SESSION)
    .map((c) => toItem(byId.get(c.word_id)!, c));

  const started = new Set(a.cards.map((c) => c.word_id));
  const room = a.more ? NEW_PER_SESSION : Math.max(0, DAILY_NEW_CAP - a.newToday);
  const fresh = a.words
    .filter((w) => !started.has(w.id))
    .slice(0, Math.min(NEW_PER_SESSION, room))
    .map((w) => toItem(w, null));

  return [...due, ...fresh];
}

export interface WordsSummary {
  total: number;
  started: number;
  learned: number;
  learning: number;
  due: number;
  newToday: number;
  newRemainingToday: number;
  byLevel: { level: string; total: number; learned: number }[];
}

export function summarizeWords(a: { words: WordRow[]; cards: CardRow[]; newToday: number; now?: Date }): WordsSummary {
  const now = (a.now ?? new Date()).getTime();
  const cardByWord = new Map(a.cards.map((c) => [c.word_id, c]));
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const byLevel = levels
    .map((level) => {
      const inLevel = a.words.filter((w) => w.cefr_level === level);
      const learned = inLevel.filter((w) => (cardByWord.get(w.id)?.interval_days ?? 0) >= LEARNED_INTERVAL_DAYS).length;
      return { level, total: inLevel.length, learned };
    })
    .filter((l) => l.total > 0);
  const learned = a.cards.filter((c) => c.interval_days >= LEARNED_INTERVAL_DAYS).length;
  return {
    total: a.words.length,
    started: a.cards.length,
    learned,
    learning: a.cards.length - learned,
    due: a.cards.filter((c) => new Date(c.due_at).getTime() <= now).length,
    newToday: a.newToday,
    newRemainingToday: Math.max(0, DAILY_NEW_CAP - a.newToday),
    byLevel,
  };
}
