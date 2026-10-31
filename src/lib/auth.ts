"use server";

import { createClient } from "@/lib/supabase/server";
import {
  authErrorMessage,
  isValidCode,
  isValidEmail,
  normalizeCode,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth-validation";

// All sign-in work happens on the server so the session cookies are written by Set-Cookie
// response headers (long-lived, refreshed only by the proxy) instead of by browser JS —
// Safari caps cookies written from JavaScript at 7 days, and a second client refreshing the
// same refresh token in the browser can invalidate the session.

export type ActionResult = { ok: true } | { ok: false; error: string };

const fail = (error: string): ActionResult => ({ ok: false, error });
const BAD_EMAIL = fail("Проверь email — похоже, в нём опечатка.");
const BAD_CODE = fail("Введи код из письма (6 цифр).");

/** Creates an account and emails a confirmation code. */
export async function signUp(email: string, password: string): Promise<ActionResult> {
  if (!isValidEmail(email)) return BAD_EMAIL;
  const weak = validatePassword(password);
  if (weak) return fail(weak);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email: normalizeEmail(email), password });
  // For an address that is already registered Supabase answers as if it succeeded
  // (it doesn't reveal which emails exist); the form says what to do if no code arrives.
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

/** Re-sends the confirmation code of an unconfirmed account. */
export async function resendSignUpCode(email: string): Promise<ActionResult> {
  if (!isValidEmail(email)) return BAD_EMAIL;
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email: normalizeEmail(email) });
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

/** Confirms the email with the emailed code and signs the user in. */
export async function confirmSignUp(email: string, code: string): Promise<ActionResult> {
  if (!isValidEmail(email)) return BAD_EMAIL;
  if (!isValidCode(code)) return BAD_CODE;
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: normalizeEmail(email),
    token: normalizeCode(code),
    type: "signup",
  });
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

export async function signIn(email: string, password: string): Promise<ActionResult> {
  if (!isValidEmail(email)) return BAD_EMAIL;
  if (!password) return fail("Введи пароль.");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

/** Sends a code for setting a new password (also how an existing passwordless account gets its first password). */
export async function requestPasswordReset(email: string): Promise<ActionResult> {
  if (!isValidEmail(email)) return BAD_EMAIL;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email));
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

/** Checks the recovery code; on success the user is signed in and must now choose a password. */
export async function confirmRecovery(email: string, code: string): Promise<ActionResult> {
  if (!isValidEmail(email)) return BAD_EMAIL;
  if (!isValidCode(code)) return BAD_CODE;
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: normalizeEmail(email),
    token: normalizeCode(code),
    type: "recovery",
  });
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

export async function setNewPassword(password: string): Promise<ActionResult> {
  const weak = validatePassword(password);
  if (weak) return fail(weak);
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  return error ? fail(authErrorMessage(error)) : { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
