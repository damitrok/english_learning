"use server";

import { createClient } from "@/lib/supabase/server";
import { blankWord } from "@/lib/word-context";
import type { GrammarLesson } from "@/lib/grammar";

export interface ContextItem {
  wordId: string;
  before: string;
  after: string;
  /** Russian meaning shown as a hint, so the blank has exactly one answer. */
  hint: string;
  answers: string[];
}

const CONTEXT_ITEMS = 6;
const MIN_STUDIED = 4;

/**
 * "Words in context": the example sentences of words the learner has started,
 * with the word blanked out. The batch rotates with the path cycle; a brand-new
 * learner (too few studied words) gets the first words in learning order.
 */
export async function getContextLesson(cycle: number): Promise<ContextItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data: cards }, { data: words }] = await Promise.all([
    supabase.from("cards").select("word_id").eq("user_id", user.id),
    supabase
      .from("words")
      .select("id, headword, translation, example_sentence")
      .order("sort_order")
      .order("cefr_level")
      .order("headword"),
  ]);

  const usable = (words ?? []).flatMap((w) => {
    const blank = w.example_sentence ? blankWord(w.example_sentence, w.headword) : null;
    return blank ? [{ id: w.id, hint: w.translation, ...blank }] : [];
  });
  const studiedIds = new Set((cards ?? []).map((c) => c.word_id));
  const studied = usable.filter((w) => studiedIds.has(w.id));
  const pool = studied.length >= MIN_STUDIED ? studied : usable;
  if (pool.length === 0) return [];

  const size = Math.min(CONTEXT_ITEMS, pool.length);
  return Array.from({ length: size }, (_, k) => {
    const w = pool[(cycle * CONTEXT_ITEMS + k) % pool.length];
    return { wordId: w.id, before: w.before, after: w.after, hint: w.hint, answers: w.answers };
  });
}

const REVIEW_ITEMS = 6;

/**
 * "Mistakes review": grammar exercises whose latest attempt was wrong, oldest
 * mistake first. Null when there are none.
 */
export async function getReviewLesson(): Promise<GrammarLesson | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: attempts } = await supabase
    .from("grammar_attempts")
    .select("exercise_id, is_correct, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const latest = new Map<string, boolean>();
  for (const a of attempts ?? []) {
    latest.delete(a.exercise_id); // re-insert so Map order follows the latest attempt
    latest.set(a.exercise_id, a.is_correct);
  }
  const wrongIds = [...latest].filter(([, ok]) => !ok).map(([id]) => id).slice(0, REVIEW_ITEMS);
  if (wrongIds.length === 0) return null;

  const { data: exercises } = await supabase
    .from("grammar_exercises")
    .select("id, exercise_type, prompt, options")
    .in("id", wrongIds);
  const byId = new Map((exercises ?? []).map((e) => [e.id, e]));
  const queue = wrongIds.flatMap((id) => {
    const e = byId.get(id);
    return e ? [{ id: e.id, type: e.exercise_type, prompt: e.prompt, options: e.options }] : [];
  });
  if (queue.length === 0) return null;

  return {
    unit: 0,
    section: "",
    title: "Повтор ошибок",
    summary: null,
    exercises: queue,
    isRetry: true,
    topicsDone: 0,
    topicsTotal: 0,
  };
}
