/** Paths reachable without a session. */
// /api/cron/reminders has no session; it checks its own bearer secret.
const PUBLIC_PATHS = ["/login", "/api/version", "/api/cron/reminders"];

/** Exact match or a sub-path — `/login-admin` must not slip through as a prefix of `/login`. */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
