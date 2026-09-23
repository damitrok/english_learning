"use server";

import { createClient } from "@/lib/supabase/server";

export interface FluencyText {
  id: string;
  title: string;
  body: string;
  wordCount: number;
  /** Best words-per-minute on earlier fluency runs of this text, if any. */
  bestWpm: number | null;
  /** True when the text was read before today (the plan's "вчерашний текст"). */
  fromEarlierDay: boolean;
}

/** Counts words the way a reader does: runs of letters/digits/apostrophes. */
function countWords(body: string): number {
  return body.match(/[A-Za-z0-9']+/g)?.length ?? 0;
}

/**
 * The step-4 text: the most recent text read in step 2 before today; if the
 * user only started today, today's text. Null until something has been read.
 */
export async function getFluencyText(): Promise<FluencyText | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reads } = await supabase
    .from("text_reads")
    .select("text_id, mode, words_per_minute, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (!reads) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const readings = reads.filter((r) => r.mode === "reading");
  const earlier = readings.find((r) => new Date(r.created_at) < startOfToday);
  const pick = earlier ?? readings[0];
  if (!pick) return null;

  const { data: text } = await supabase
    .from("texts")
    .select("id, title, body")
    .eq("id", pick.text_id)
    .single();
  if (!text) return null;

  const wpms = reads
    .filter((r) => r.mode === "fluency" && r.text_id === text.id && r.words_per_minute)
    .map((r) => r.words_per_minute!);

  return {
    id: text.id,
    title: text.title,
    body: text.body,
    wordCount: countWords(text.body),
    bestWpm: wpms.length ? Math.max(...wpms) : null,
    fromEarlierDay: !!earlier,
  };
}

export async function saveFluencyRead(textId: string, secondsSpent: number): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: text, error: readError } = await supabase
    .from("texts")
    .select("body")
    .eq("id", textId)
    .single();
  if (readError) throw readError;

  const seconds = Math.max(1, Math.round(secondsSpent));
  const wpm = Math.round((countWords(text.body) / seconds) * 60);

  const { error } = await supabase.from("text_reads").insert({
    user_id: user.id,
    text_id: textId,
    mode: "fluency",
    seconds_spent: seconds,
    words_per_minute: wpm,
  });
  if (error) throw error;
  return wpm;
}
