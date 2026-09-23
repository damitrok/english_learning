"use server";

import { createClient } from "@/lib/supabase/server";
import type { CefrLevel } from "@/lib/supabase/types";

export interface ReadingQuestion {
  statement: string;
  answer: boolean;
}

export interface StudiedWord {
  headword: string;
  translation: string;
}

export interface ReadingText {
  id: string;
  title: string;
  body: string;
  level: CefrLevel;
  questions: ReadingQuestion[];
  /** Words from the user's SRS cards — highlighted in the text, tap shows the translation. */
  studiedWords: StudiedWord[];
  /** Number of the text in the catalog order, for the "3 / 12" label. */
  position: number;
  total: number;
  readBefore: boolean;
}

/**
 * Today's text: the first one (catalog order) the user hasn't read yet; once
 * everything is read, the one read longest ago, so the step never runs dry.
 */
export async function getTodayText(): Promise<ReadingText | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: texts }, { data: reads }, { data: cards }] = await Promise.all([
    supabase
      .from("texts")
      .select("id, title, body, cefr_level, position, questions")
      .order("position"),
    supabase
      .from("text_reads")
      .select("text_id, created_at")
      .eq("user_id", user.id)
      .eq("mode", "reading")
      .order("created_at", { ascending: true }),
    supabase
      .from("cards")
      .select("words (headword, translation)")
      .eq("user_id", user.id),
  ]);

  if (!texts || texts.length === 0) return null;

  // Later reads overwrite earlier ones → last-read timestamp per text.
  const lastRead = new Map<string, string>();
  for (const r of reads ?? []) lastRead.set(r.text_id, r.created_at);

  const text =
    texts.find((t) => !lastRead.has(t.id)) ??
    [...texts].sort((a, b) => lastRead.get(a.id)!.localeCompare(lastRead.get(b.id)!))[0];

  const studiedWords = (cards ?? [])
    .map((c) => c.words)
    .filter((w): w is StudiedWord => w !== null);

  return {
    id: text.id,
    title: text.title,
    body: text.body,
    level: text.cefr_level,
    questions: (text.questions as unknown as ReadingQuestion[]) ?? [],
    studiedWords,
    position: texts.indexOf(text) + 1,
    total: texts.length,
    readBefore: lastRead.has(text.id),
  };
}

export async function markTextRead(
  textId: string,
  secondsSpent: number,
  correctAnswers: number
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("text_reads").insert({
    user_id: user.id,
    text_id: textId,
    seconds_spent: Math.max(0, Math.round(secondsSpent)),
    correct_answers: correctAnswers,
  });
  if (error) throw error;
}
