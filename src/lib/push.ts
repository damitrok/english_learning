"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/user";
import { isValidTimeZone } from "@/lib/dates";
import { isPushEndpoint, isPushKey } from "@/lib/input-guards";
import type { ActionResult } from "@/lib/auth";

const fail = (error: string): ActionResult => ({ ok: false, error });

/** Remembers this device for the daily reminder (also refreshes keys and time zone of a known one). */
export async function savePushSubscription(
  endpoint: string,
  p256dh: string,
  auth: string,
  timeZone: string,
): Promise<ActionResult> {
  if (!isPushEndpoint(endpoint) || !isPushKey(p256dh) || !isPushKey(auth)) return fail("Не удалось включить напоминания.");
  const supabase = await createClient();
  if (!(await getAuthUser(supabase))) return fail("Сессия закончилась. Войдите заново.");
  const { error } = await supabase.rpc("save_push_subscription", {
    p_endpoint: endpoint,
    p_p256dh: p256dh,
    p_auth: auth,
    p_time_zone: isValidTimeZone(timeZone) ? timeZone : "UTC",
  });
  return error ? fail("Не удалось включить напоминания. Попробуйте ещё раз.") : { ok: true };
}

/** Forgets this device: no more reminders to it. */
export async function removePushSubscription(endpoint: string): Promise<ActionResult> {
  if (!isPushEndpoint(endpoint)) return fail("Не удалось выключить напоминания.");
  const supabase = await createClient();
  if (!(await getAuthUser(supabase))) return { ok: true };
  const { error } = await supabase.rpc("remove_push_subscription", { p_endpoint: endpoint });
  return error ? fail("Не удалось выключить напоминания. Попробуйте ещё раз.") : { ok: true };
}
