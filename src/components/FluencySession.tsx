"use client";

import { useState } from "react";
import Link from "next/link";
import { saveFluencyRead, type FluencyText } from "@/lib/fluency";

type Phase = "ready" | "reading" | "done";

export function FluencySession({ text }: { text: FluencyText | null }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [startedAt, setStartedAt] = useState(0);
  const [wpm, setWpm] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!text) {
    return (
      <EmptyState message="Сначала прочитай текст в шаге 2 — беглость тренируется на уже знакомом тексте." />
    );
  }

  async function finish() {
    if (!text) return;
    setSaving(true);
    setError(null);
    try {
      setWpm(await saveFluencyRead(text.id, (performance.now() - startedAt) / 1000));
      setPhase("done");
    } catch {
      setError("Не сохранилось — проверь соединение и попробуй ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  if (phase === "done" && wpm !== null) {
    const improved = text.bestWpm !== null && wpm > text.bestWpm;
    return (
      <EmptyState
        message={`Скорость: ${wpm} слов в минуту.${
          text.bestWpm === null
            ? ""
            : improved
              ? ` Новый рекорд (был ${text.bestWpm})!`
              : ` Лучший результат на этом тексте — ${text.bestWpm}.`
        }`}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">
          Беглость · {text.fromEarlierDay ? "вчерашний текст" : "сегодняшний текст"}
        </p>
        <h1 className="mt-2 text-heading-sm font-normal text-pure-white">{text.title}</h1>
        <p className="mt-2 text-body text-ash">
          Прочитай знакомый текст быстро, без словаря и не останавливаясь. Цель — скорость, а не
          точность. {text.wordCount} слов
          {text.bestWpm !== null && ` · твой рекорд ${text.bestWpm} слов/мин`}.
        </p>
      </div>

      {phase === "ready" ? (
        <button
          onClick={() => {
            setStartedAt(performance.now());
            setPhase("reading");
          }}
          className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
        >
          ▶ Старт
        </button>
      ) : (
        <>
          <article className="flex flex-col gap-4 rounded-cards border border-border-hairline bg-ink p-6 shadow-key sm:p-10">
            {text.body.split(/\n{2,}/).map((p, i) => (
              <p key={i} className="whitespace-pre-line text-body-lg leading-relaxed text-mist">
                {p}
              </p>
            ))}
          </article>
          <button
            onClick={finish}
            disabled={saving}
            className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron disabled:opacity-40"
          >
            ■ Прочитал
          </button>
          {error && <p className="text-body text-coral-pulse">{error}</p>}
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-16 text-center">
      <p className="text-body-lg text-pure-white">{message}</p>
      <Link
        href="/"
        className="rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
      >
        Вернуться к «Сегодня»
      </Link>
    </div>
  );
}
