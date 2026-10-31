"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmRecovery,
  confirmSignUp,
  requestPasswordReset,
  resendSignUpCode,
  setNewPassword,
  signIn,
  signUp,
  type ActionResult,
} from "@/lib/auth";
import { isValidCode, isValidEmail, normalizeCode, validatePassword } from "@/lib/auth-validation";

type Mode = "signin" | "signup" | "confirm-signup" | "forgot" | "confirm-recovery" | "new-password";

const RESEND_SECONDS = 60;

const inputClass =
  "min-h-12 w-full rounded-inputs bg-white/5 px-3 py-3 text-body text-pure-white placeholder:text-ash focus:outline-none focus:ring-1 focus:ring-coral-pulse";

function PasswordInput({
  value,
  onChange,
  autoComplete,
  placeholder = "Пароль",
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        type={shown ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass} pr-[6rem]`}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-pressed={shown}
        className="absolute inset-y-0 right-0 px-4 text-body text-ash"
      >
        {shown ? "Скрыть" : "Показать"}
      </button>
    </div>
  );
}

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (resendAt <= now) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [resendAt, now]);
  const secondsLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  function go(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
    setCode("");
  }

  function startCooldown() {
    const t = Date.now();
    setNow(t);
    setResendAt(t + RESEND_SECONDS * 1000);
  }

  async function run(action: () => Promise<ActionResult>, onOk: () => void) {
    setPending(true);
    setError(null);
    setInfo(null);
    try {
      const result = await action();
      if (result.ok) onOk();
      else setError(result.error);
    } catch {
      setError("Нет связи с сервером. Проверь интернет и попробуй ещё раз.");
    } finally {
      setPending(false);
    }
  }

  const enter = () => {
    router.replace("/");
    router.refresh();
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    switch (mode) {
      case "signin":
        return run(() => signIn(email, password), enter);
      case "signup": {
        const weak = validatePassword(password);
        if (weak) return setError(weak);
        return run(() => signUp(email, password), () => {
          go("confirm-signup");
          startCooldown();
        });
      }
      case "confirm-signup":
        return run(() => confirmSignUp(email, code), enter);
      case "forgot":
        return run(() => requestPasswordReset(email), () => {
          go("confirm-recovery");
          startCooldown();
        });
      case "confirm-recovery":
        return run(() => confirmRecovery(email, code), () => go("new-password"));
      case "new-password": {
        const weak = validatePassword(password);
        if (weak) return setError(weak);
        return run(() => setNewPassword(password), enter);
      }
    }
  }

  function resend() {
    if (secondsLeft > 0 || pending) return;
    const action = mode === "confirm-signup" ? () => resendSignUpCode(email) : () => requestPasswordReset(email);
    run(action, () => {
      startCooldown();
      setInfo("Новый код отправлен.");
    });
  }

  const titles: Record<Mode, string> = {
    signin: "Вход",
    signup: "Регистрация",
    "confirm-signup": "Подтверди email",
    forgot: "Пароль",
    "confirm-recovery": "Введи код",
    "new-password": "Новый пароль",
  };
  const showTabs = mode === "signin" || mode === "signup";
  const needsEmail = mode === "signin" || mode === "signup" || mode === "forgot";
  const needsPassword = mode === "signin" || mode === "signup" || mode === "new-password";
  const needsCode = mode === "confirm-signup" || mode === "confirm-recovery";

  const canSubmit =
    !pending &&
    (needsEmail ? isValidEmail(email) : true) &&
    (needsPassword ? password.length > 0 : true) &&
    (needsCode ? isValidCode(code) : true);

  const submitLabel: Record<Mode, string> = {
    signin: "Войти",
    signup: "Зарегистрироваться",
    "confirm-signup": "Подтвердить",
    forgot: "Отправить код",
    "confirm-recovery": "Продолжить",
    "new-password": "Сохранить пароль",
  };

  return (
    <div className="w-full max-w-sm rounded-cards border border-border-hairline bg-ink p-6 shadow-key sm:p-[2rem]">
      <h1 className="text-heading-sm font-medium text-pure-white">English for IT</h1>
      <p className="mt-2 text-body text-ash">Тренажёр технического английского.</p>

      {showTabs && (
        <div role="tablist" className="mt-5 grid grid-cols-2 rounded-inputs bg-white/5 p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => go(m)}
              className={`min-h-11 rounded-[6px] text-body font-medium transition-colors ${
                mode === m ? "bg-mist text-iron" : "text-ash"
              }`}
            >
              {m === "signin" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>
      )}
      {!showTabs && <h2 className="mt-5 text-subheading font-medium text-pure-white">{titles[mode]}</h2>}

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3" noValidate>
        {needsEmail && (
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@example.com"
            className={inputClass}
          />
        )}

        {(mode === "confirm-signup" || mode === "confirm-recovery") && (
          <p className="text-body text-ash">
            Мы отправили код на <span className="text-pure-white">{email}</span>. Введи его здесь.
          </p>
        )}
        {mode === "new-password" && (
          <p className="text-body text-ash">Email подтверждён. Придумай пароль для входа.</p>
        )}

        {needsPassword && (
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder={mode === "signin" ? "Пароль" : "Пароль (от 8 символов)"}
          />
        )}

        {needsCode && (
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            placeholder="Код из письма"
            className={`${inputClass} text-center font-mono text-subheading tracking-widest placeholder:tracking-normal`}
          />
        )}

        <button type="submit" disabled={!canSubmit} className="btn-primary mt-1">
          {pending ? "Подожди…" : submitLabel[mode]}
        </button>

        {error && (
          <p role="alert" className="text-body text-coral-pulse">
            {error}
          </p>
        )}
        {info && <p className="text-body text-success-green">{info}</p>}
      </form>

      <div className="mt-3 flex flex-col items-stretch gap-1">
        {mode === "signin" && (
          <button type="button" onClick={() => go("forgot")} className="min-h-12 text-body text-ash underline underline-offset-4">
            Забыл пароль или входил по ссылке — задать пароль
          </button>
        )}
        {mode === "signup" && (
          <p className="text-[13px] text-smoke">
            Пришлём код на email. Если письма нет — возможно, аккаунт уже существует: войди или задай пароль заново.
          </p>
        )}
        {needsCode && (
          <button
            type="button"
            onClick={resend}
            disabled={secondsLeft > 0 || pending}
            className="min-h-12 text-body text-ash underline underline-offset-4 disabled:no-underline disabled:opacity-60"
          >
            {secondsLeft > 0 ? `Отправить код ещё раз (${secondsLeft} с)` : "Отправить код ещё раз"}
          </button>
        )}
        {(mode === "confirm-signup" || mode === "forgot" || mode === "confirm-recovery") && (
          <button type="button" onClick={() => go("signin")} className="min-h-12 text-body text-ash underline underline-offset-4">
            Назад ко входу
          </button>
        )}
      </div>
    </div>
  );
}
