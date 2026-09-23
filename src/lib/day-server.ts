// Server-side helpers for the learner's local day and step bookkeeping.
// Plain module (not "use server"): only imported by server code.
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_TZ, TZ_COOKIE, isValidTimeZone, localDate, type StepName } from "@/lib/dates";

/** The learner's timezone from the `tz` cookie (set by TimezoneCookie), else UTC. */
export async function getTimeZone(): Promise<string> {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  return isValidTimeZone(tz) ? tz : DEFAULT_TZ;
}

export async function getToday(): Promise<string> {
  return localDate(await getTimeZone());
}

/**
 * Marks `step` done for the learner's today and adds the time spent (rounded up
 * to whole minutes) to that strand. Called at the end of each step.
 */
export async function recordStep(step: StepName, secondsSpent: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_step", {
    p_date: await getToday(),
    p_step: step,
    p_minutes: Math.max(1, Math.ceil(Math.max(0, secondsSpent) / 60)),
  });
  if (error) throw error;
}
