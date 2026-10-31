// Pure helpers for the sign-in / sign-up forms: validation and Russian error messages.

export const MIN_PASSWORD_LENGTH = 8;
/** bcrypt (used by Supabase Auth) ignores everything past 72 bytes. */
export const MAX_PASSWORD_LENGTH = 72;
export const OTP_LENGTH = 6;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const e = normalizeEmail(email);
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

/** Returns a Russian message when the password is not acceptable, otherwise null. */
export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Пароль — минимум ${MIN_PASSWORD_LENGTH} символов.`;
  if (new TextEncoder().encode(password).length > MAX_PASSWORD_LENGTH) return `Пароль слишком длинный (до ${MAX_PASSWORD_LENGTH} байт).`;
  if (/^\d+$/.test(password)) return "Добавь в пароль буквы — одних цифр мало.";
  return null;
}

export function normalizeCode(code: string): string {
  return code.replace(/\D/g, "").slice(0, 8);
}

export function isValidCode(code: string): boolean {
  const c = normalizeCode(code);
  return c.length >= OTP_LENGTH;
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Неверный email или пароль.",
  email_not_confirmed: "Email ещё не подтверждён. Введи код из письма или запроси новый.",
  over_email_send_rate_limit: "Письма можно запрашивать не чаще раза в минуту. Подожди немного.",
  over_request_rate_limit: "Слишком много попыток. Подожди минуту и попробуй снова.",
  otp_expired: "Код не подошёл или устарел. Запроси новый.",
  weak_password: "Пароль слишком простой. Придумай подлиннее.",
  same_password: "Новый пароль совпадает со старым.",
  user_already_exists: "Этот email уже зарегистрирован. Войди или восстанови пароль.",
  email_exists: "Этот email уже зарегистрирован. Войди или восстанови пароль.",
  signup_disabled: "Регистрация сейчас отключена.",
  session_not_found: "Сессия закончилась. Войди заново.",
  user_not_found: "Не нашли такой аккаунт.",
};

/** Maps a Supabase Auth error (code + message) to a short Russian message. */
export function authErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) return "";
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  const m = (error.message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return MESSAGES.invalid_credentials;
  if (m.includes("not confirmed")) return MESSAGES.email_not_confirmed;
  if (m.includes("expired") || m.includes("invalid") && m.includes("token")) return MESSAGES.otp_expired;
  if (m.includes("rate limit") || m.includes("only request this after")) return MESSAGES.over_email_send_rate_limit;
  if (m.includes("already registered")) return MESSAGES.user_already_exists;
  return "Что-то пошло не так. Попробуй ещё раз.";
}
