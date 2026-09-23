"use server";

import { createClient } from "@/lib/supabase/server";
import type { CefrLevel } from "@/lib/supabase/types";

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface ListeningDialogue {
  id: string;
  title: string;
  level: CefrLevel;
  lines: DialogueLine[];
  position: number;
  total: number;
  doneBefore: boolean;
}

export interface ExtraVideo {
  id: string;
  title: string;
  level: CefrLevel;
  url: string;
  startSeconds: number;
}

export interface ListeningToday {
  dialogue: ListeningDialogue | null;
  videos: ExtraVideo[];
}

/**
 * Today's shadowing dialogue: the first one (catalog order) not done yet, then
 * the one done longest ago. External videos come along as extra listening.
 */
export async function getTodayListening(): Promise<ListeningToday> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { dialogue: null, videos: [] };

  const [{ data: items }, { data: logs }] = await Promise.all([
    supabase
      .from("listening_items")
      .select("id, title, kind, cefr_level, position, lines, source_url, start_seconds")
      .order("position"),
    supabase
      .from("listening_logs")
      .select("item_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  const lastDone = new Map<string, string>();
  for (const l of logs ?? []) lastDone.set(l.item_id, l.created_at);

  const dialogues = (items ?? []).filter((i) => i.kind === "tts");
  const next =
    dialogues.find((d) => !lastDone.has(d.id)) ??
    [...dialogues].sort((a, b) => lastDone.get(a.id)!.localeCompare(lastDone.get(b.id)!))[0];

  return {
    dialogue: next
      ? {
          id: next.id,
          title: next.title,
          level: next.cefr_level,
          lines: (next.lines as unknown as DialogueLine[]) ?? [],
          position: dialogues.indexOf(next) + 1,
          total: dialogues.length,
          doneBefore: lastDone.has(next.id),
        }
      : null,
    videos: (items ?? [])
      .filter((i) => i.kind === "youtube" && i.source_url)
      .map((i) => ({
        id: i.id,
        title: i.title,
        level: i.cefr_level,
        url: i.source_url!,
        startSeconds: i.start_seconds,
      })),
  };
}

export async function saveListening(
  itemId: string,
  accuracy: number | null,
  secondsSpent: number
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("listening_logs").insert({
    user_id: user.id,
    item_id: itemId,
    accuracy: accuracy === null ? null : Math.max(0, Math.min(100, Math.round(accuracy))),
    seconds_spent: Math.max(0, Math.round(secondsSpent)),
  });
  if (error) throw error;
}
