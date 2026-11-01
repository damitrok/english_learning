// Brute-force protection for the sign-in Server Actions. Supabase Auth sees only the hosting
// server's IP for every user, so it can neither tell clients apart nor stop one attacker from
// using up the shared limit — the app counts attempts itself, per client IP and per email,
// in the auth_throttle table (see supabase/migrations/20261101120000_security_hardening.sql).
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const MINUTES = 60;

/** Attempts allowed per window, by kind of action. `ip` caps one client, `email` caps one account. */
export const RULES = {
  signIn: { ip: { limit: 20, windowSeconds: 15 * MINUTES }, email: { limit: 8, windowSeconds: 15 * MINUTES } },
  // Six-digit codes: few guesses per email, however many addresses the attacker comes from.
  verifyCode: { ip: { limit: 20, windowSeconds: 15 * MINUTES }, email: { limit: 5, windowSeconds: 15 * MINUTES } },
  sendCode: { ip: { limit: 10, windowSeconds: 15 * MINUTES }, email: { limit: 5, windowSeconds: 15 * MINUTES } },
} as const;

export const THROTTLED_MESSAGE = "Слишком много попыток. Подожди несколько минут и попробуй снова.";

/** Opaque, fixed-length key: raw emails and IPs are never stored. */
export function throttleKey(kind: "ip" | "email", action: string, value: string): string {
  return createHash("sha256").update(`${kind}|${action}|${value}`).digest("hex");
}

/** The client's address as seen by the hosting platform (Vercel sets x-forwarded-for itself). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

/**
 * Counts one attempt for this client and, when given, this email. Returns false when either limit
 * is exceeded. If the counter itself is unavailable it lets the attempt through (fail open):
 * Supabase Auth's own limits still apply, and a broken counter must not lock everyone out.
 */
export async function allowAttempt(
  supabase: Pick<SupabaseClient<Database>, "rpc">,
  action: keyof typeof RULES,
  email?: string
): Promise<boolean> {
  const rule = RULES[action];
  const checks: [string, { limit: number; windowSeconds: number }][] = [
    [throttleKey("ip", action, await clientIp()), rule.ip],
  ];
  if (email) checks.push([throttleKey("email", action, email), rule.email]);

  for (const [key, { limit, windowSeconds }] of checks) {
    const { data, error } = await supabase.rpc("auth_throttle_hit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (!error && data === false) return false;
  }
  return true;
}
