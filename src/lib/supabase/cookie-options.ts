/**
 * Session cookie flags. Every sign-in runs in Server Actions and the browser never reads these
 * cookies (there is no browser Supabase client), so JavaScript gets no access to them: a future
 * XSS can't lift the refresh token.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
