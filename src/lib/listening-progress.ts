"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/user";
import { getToday } from "@/lib/day-server";

/** Counts a finished listening level toward today's daily task. */
export async function recordListeningLevel(): Promise<void> {
  const supabase = await createClient();
  if (!(await getAuthUser(supabase))) return;
  const { error } = await supabase.rpc("record_listening", { p_date: await getToday() });
  if (error) throw error;
}
