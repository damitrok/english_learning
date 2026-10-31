import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The signed-in user's id, read from the (locally verified) JWT in the session cookie — no
 * round trip to Supabase Auth. The proxy has already refreshed an expired session by the time
 * server code runs.
 */
export async function getAuthUser(supabase: Pick<SupabaseClient, "auth">): Promise<{ id: string } | null> {
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  return id ? { id } : null;
}
