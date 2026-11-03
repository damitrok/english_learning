"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/user";
import { cleanFeedback } from "@/lib/input-guards";
import type { ActionResult } from "@/lib/auth";

const fail = (error: string): ActionResult => ({ ok: false, error });
const NOT_SIGNED_IN = fail("Сессия закончилась. Войдите заново.");

/** Saves a message from the feedback form; the database allows a few per hour per person. */
export async function sendFeedback(message: string): Promise<ActionResult> {
  const text = cleanFeedback(message);
  if (!text) return fail("Напишите сообщение (до 2000 символов).");
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
  if (!user) return NOT_SIGNED_IN;
  const { error } = await supabase.from("feedback").insert({ user_id: user.id, message: text });
  if (!error) return { ok: true };
  if (error.message.includes("feedback_rate_limit")) return fail("Слишком много сообщений. Попробуйте чуть позже.");
  return fail("Не получилось отправить. Попробуйте ещё раз.");
}

/** Permanently deletes the signed-in account with all its data, then ends the session. */
export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);
  if (!user) return NOT_SIGNED_IN;
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return fail("Не получилось удалить аккаунт. Попробуйте ещё раз.");
  // The user no longer exists; this only clears the session cookies.
  await supabase.auth.signOut();
  return { ok: true };
}
