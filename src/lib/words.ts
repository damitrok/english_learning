"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/user";
import { getTimeZone } from "@/lib/day-server";
import { localDate } from "@/lib/dates";
import { reviewCard, type SrsCardState } from "@/lib/srs";
import { buildWordQueue, summarizeWords, type CardRow, type WordItem, type WordRow, type WordsSummary } from "@/lib/word-queue";
import type { SrsResult } from "@/lib/supabase/types";

async function load() {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
  if (!user) return null;
  const [{ data: cards }, { data: words }] = await Promise.all([
    supabase
      .from("cards")
      .select("id, word_id, ease_factor, interval_days, repetitions, due_at, created_at")
      .eq("user_id", user.id),
    supabase
      .from("words")
      // Learning order: starter words, textbook units interleaved with IT terms, then the B1 extension.
      .select("id, headword, translation, ipa, example_sentence, cefr_level")
      .order("sort_order")
      .order("cefr_level")
      .order("headword"),
  ]);
  const tz = await getTimeZone();
  const today = localDate(tz);
  const newToday = (cards ?? []).filter((c) => localDate(tz, new Date(c.created_at)) === today).length;
  return { supabase, user, cards: (cards ?? []) as CardRow[], words: (words ?? []) as WordRow[], newToday };
}

/** Today's words session: due reviews first, then new words (per-session and per-day limits). */
export async function getWordsSession(more = false): Promise<WordItem[]> {
  const data = await load();
  if (!data) return [];
  return buildWordQueue({ words: data.words, cards: data.cards, newToday: data.newToday, more });
}

export async function getWordsOverview(): Promise<WordsSummary | null> {
  const data = await load();
  if (!data) return null;
  return summarizeWords({ words: data.words, cards: data.cards, newToday: data.newToday });
}

export async function submitWordReview(
  wordId: string,
  cardId: string | null,
  srsState: SrsCardState,
  result: SrsResult
): Promise<void> {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
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
