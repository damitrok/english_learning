"use server";

import { createClient } from "@/lib/supabase/server";
import type { ExerciseType } from "@/lib/supabase/types";

export interface GrammarExerciseItem {
  id: string;
  type: ExerciseType;
  prompt: string;
  options: string[] | null;
}

export interface GrammarLesson {
  unit: number;
  section: string;
  title: string;
  summary: string | null;
  exercises: GrammarExerciseItem[];
  /** True when this topic was attempted before — the queue then holds only the mistakes. */
  isRetry: boolean;
  topicsDone: number;
  topicsTotal: number;
}

export interface GrammarAnswerResult {
  correct: boolean;
  correctAnswer: string;
  explanation: string | null;
}

/**
 * The current grammar topic: the first unit (textbook order) that has
 * exercises and isn't mastered yet. A topic is mastered once the latest attempt
 * at every one of its exercises is correct — so the next visit after a lesson
 * with mistakes serves only those mistakes again. Returns null when every
 * topic with exercises is mastered.
 */
export async function getGrammarLesson(): Promise<GrammarLesson | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: topics }, { data: exercises }, { data: attempts }] = await Promise.all([
    supabase.from("grammar_topics").select("id, unit, section, title, summary").order("unit"),
    supabase
      .from("grammar_exercises")
      .select("id, topic_id, position, exercise_type, prompt, options")
      .order("position"),
    supabase
      .from("grammar_attempts")
      .select("exercise_id, is_correct, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  // Later attempts overwrite earlier ones, leaving the latest result per exercise.
  const latest = new Map<string, boolean>();
  for (const a of attempts ?? []) latest.set(a.exercise_id, a.is_correct);

  const byTopic = new Map<string, NonNullable<typeof exercises>>();
  for (const ex of exercises ?? []) {
    const list = byTopic.get(ex.topic_id) ?? [];
    list.push(ex);
    byTopic.set(ex.topic_id, list);
  }

  const withExercises = (topics ?? []).filter((t) => byTopic.has(t.id));
  const isMastered = (topicId: string) =>
    byTopic.get(topicId)!.every((ex) => latest.get(ex.id) === true);
  const topicsDone = withExercises.filter((t) => isMastered(t.id)).length;

  const current = withExercises.find((t) => !isMastered(t.id));
  if (!current) return null;

  const all = byTopic.get(current.id)!;
  const isRetry = all.some((ex) => latest.has(ex.id));
  const queue = isRetry ? all.filter((ex) => latest.get(ex.id) !== true) : all;

  return {
    unit: current.unit,
    section: current.section,
    title: current.title,
    summary: current.summary,
    exercises: queue.map((ex) => ({
      id: ex.id,
      type: ex.exercise_type,
      prompt: ex.prompt,
      options: ex.options,
    })),
    isRetry,
    topicsDone,
    topicsTotal: withExercises.length,
  };
}

/** Lowercase, straighten apostrophes, collapse spaces, drop trailing punctuation. */
function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?,]+$/, "");
}

/** Checks the answer server-side (answers never reach the client) and logs the attempt. */
export async function submitGrammarAnswer(
  exerciseId: string,
  answer: string
): Promise<GrammarAnswerResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: exercise, error: readError } = await supabase
    .from("grammar_exercises")
    .select("correct_answer, accepted_answers, explanation")
    .eq("id", exerciseId)
    .single();
  if (readError) throw readError;

  const given = normalizeAnswer(answer);
  const correct = [exercise.correct_answer, ...exercise.accepted_answers].some(
    (a) => normalizeAnswer(a) === given
  );

  const { error } = await supabase.from("grammar_attempts").insert({
    user_id: user.id,
    exercise_id: exerciseId,
    answer,
    is_correct: correct,
  });
  if (error) throw error;

  return {
    correct,
    correctAnswer: exercise.correct_answer,
    explanation: exercise.explanation,
  };
}
