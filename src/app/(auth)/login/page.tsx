"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

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
        Личный тренажёр технического английского. Вход по ссылке на почту.
      </p>
      {status === "sent" ? (
        <p className="mt-6 text-body text-success-green">
          Ссылка для входа отправлена на {email}. Проверь почту.
        </p>
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
