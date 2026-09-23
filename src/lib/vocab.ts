"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewCard, type SrsCardState } from "@/lib/srs";
import type { SrsResult } from "@/lib/supabase/types";

const NEW_WORDS_PER_DAY = 5;

export interface VocabQueueItem {
  cardId: string | null;
  wordId: string;
  headword: string;
  translation: string;
  ipa: string | null;
  exampleSentence: string | null;
  srsState: SrsCardState;
}

/**
 * Today's step-1 queue: due reviews first, then enough new words to fill the
 * daily cap — matches the plan's "приоритет — повторы, затем новые слова".
 */
export async function getTodayVocabQueue(): Promise<VocabQueueItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data: userCards }, { data: allWords }] = await Promise.all([
    supabase
      .from("cards")
      .select("id, word_id, ease_factor, interval_days, repetitions, due_at")
      .eq("user_id", user.id),
    supabase
      .from("words")
      .select("id, headword, translation, ipa, example_sentence")
      // Learning order: starter words, then textbook units interleaved with IT terms.
      .order("sort_order")
      .order("cefr_level")
      .order("headword"),
  ]);

  const wordsById = new Map((allWords ?? []).map((w) => [w.id, w]));
  const now = Date.now();

  const due: VocabQueueItem[] = (userCards ?? [])
    .filter((c) => new Date(c.due_at).getTime() <= now)
    .map((c): VocabQueueItem | null => {
      const word = wordsById.get(c.word_id);
      if (!word) return null;
      return {
        cardId: c.id,
        wordId: c.word_id,
        headword: word.headword,
        translation: word.translation,
        ipa: word.ipa,
        exampleSentence: word.example_sentence,
        srsState: {
          ease_factor: c.ease_factor,
          interval_days: c.interval_days,
          repetitions: c.repetitions,
        },
      };
    })
    .filter((item): item is VocabQueueItem => item !== null);

  const seenWordIds = new Set((userCards ?? []).map((c) => c.word_id));
  const fresh: VocabQueueItem[] = (allWords ?? [])
    .filter((w) => !seenWordIds.has(w.id))
    .slice(0, NEW_WORDS_PER_DAY)
    .map((w) => ({
      cardId: null,
      wordId: w.id,
      headword: w.headword,
      translation: w.translation,
      ipa: w.ipa,
      exampleSentence: w.example_sentence,
      srsState: { ease_factor: 2.5, interval_days: 0, repetitions: 0 },
    }));

  return [...due, ...fresh];
}

export async function submitVocabReview(
  wordId: string,
  cardId: string | null,
  srsState: SrsCardState,
  result: SrsResult
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const next = reviewCard(srsState, result);

  const { error } = await supabase.from("cards").upsert(
    {
      ...(cardId ? { id: cardId } : {}),
      user_id: user.id,
      word_id: wordId,
      ease_factor: next.ease_factor,
      interval_days: next.interval_days,
      repetitions: next.repetitions,
      due_at: next.due_at,
      last_result: result,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,word_id" }
  );

  if (error) throw error;
}
