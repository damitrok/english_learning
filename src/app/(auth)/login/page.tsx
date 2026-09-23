"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const router = useRouter();

  // The code path matters for the installed PWA: on iOS the emailed link opens
  // in Safari, which can't finish a PKCE login started inside the app — typing
  // the code from the same email works everywhere.
  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setCodeError(false);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code.trim(), type: "email" });
    setVerifying(false);
    if (error) {
      setCodeError(true);
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="w-full max-w-sm rounded-cards border border-border-hairline bg-ink p-8 shadow-key">
      <h1 className="text-heading-sm font-medium text-pure-white">
        English for IT
      </h1>
      <p className="mt-2 text-body text-ash">
        Тренажёр технического английского. Вход по ссылке или коду из письма — без пароля.
      </p>
      {status === "sent" ? (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-body text-success-green">
            Письмо отправлено на {email}. Нажми ссылку в нём — или введи код из письма здесь
            (так удобнее в установленном приложении).
          </p>
          <form onSubmit={handleCode} className="flex flex-col gap-3">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="Код из письма"
              className="rounded-inputs bg-white/5 px-3 py-3 text-center font-mono text-subheading tracking-widest text-pure-white placeholder:text-ash placeholder:tracking-normal focus:outline-none focus:ring-1 focus:ring-coral-pulse"
            />
            <button
              type="submit"
              disabled={verifying || code.length < 6}
              className="rounded-buttons bg-mist px-3 py-3 text-body font-medium text-iron disabled:opacity-60"
            >
              {verifying ? "Проверяем…" : "Войти по коду"}
            </button>
            {codeError && (
              <p className="text-body text-coral-pulse">Код не подошёл или устарел. Запроси новое письмо.</p>
            )}
          </form>
          <button
            onClick={() => {
              setStatus("idle");
              setCode("");
            }}
            className="text-body text-ash underline underline-offset-4"
          >
            Другой email / отправить ещё раз
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-inputs bg-white/5 px-3 py-2 text-body text-pure-white placeholder:text-ash focus:outline-none focus:ring-1 focus:ring-coral-pulse"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-buttons bg-mist px-3 py-2 text-body font-medium text-iron disabled:opacity-60"
          >
            {status === "sending" ? "Отправляем…" : "Получить ссылку для входа"}
          </button>
          {status === "error" && (
            <p className="text-body text-coral-pulse">
              Не получилось отправить письмо. Попробуй ещё раз.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
