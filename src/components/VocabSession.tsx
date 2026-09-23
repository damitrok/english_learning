"use client";

import { useState } from "react";
import Link from "next/link";
import { submitVocabReview, type VocabQueueItem } from "@/lib/vocab";
import { speak } from "@/lib/speech";
import type { SrsResult } from "@/lib/supabase/types";

const RATING_BUTTONS: { result: SrsResult; label: string }[] = [
  { result: "forgot", label: "Забыл" },
  { result: "hard", label: "Трудно" },
  { result: "normal", label: "Нормально" },
  { result: "easy", label: "Легко" },
];

export function VocabSession({ queue }: { queue: VocabQueueItem[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const current = queue[index];
  const done = index >= queue.length;

  async function rate(result: SrsResult) {
    if (!current) return;
    setPendingError(null);
    try {
      await submitVocabReview(
        current.wordId,
        current.cardId,
        current.srsState,
        result
      );
    } catch {
      setPendingError("Не сохранилось — проверь соединение и попробуй ещё раз.");
      return;
    }
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  if (queue.length === 0) {
    return (
      <EmptyState message="На сегодня карточек нет — загляни завтра, либо добавь слова в базу." />
    );
  }

  if (done) {
    return <EmptyState message={`Готово! Пройдено карточек: ${queue.length}.`} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-8">
      <p className="text-body text-ash">
        {index + 1} / {queue.length}
      </p>
      <div className="flex flex-col items-center gap-4 rounded-cards border border-border-hairline bg-ink p-10 text-center shadow-key">
        <h2 className="text-heading font-normal text-pure-white">
          {current.headword}
        </h2>
        {current.ipa && <p className="font-mono text-body text-ash">{current.ipa}</p>}
        <button
          onClick={() => speak(current.headword)}
          className="rounded-buttons border border-border-hairline px-3 py-2 text-body text-mist hover:bg-white/5"
        >
          🔊 Произнести
        </button>

        {revealed ? (
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-subheading font-medium text-pure-white">
              {current.translation}
            </p>
            {current.exampleSentence && (
              <p className="text-body text-ash">{current.exampleSentence}</p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-2 rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
          >
            Показать перевод
          </button>
        )}
      </div>

      {revealed && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {RATING_BUTTONS.map((btn) => (
            <button
              key={btn.result}
              onClick={() => rate(btn.result)}
              className="rounded-buttons border border-border-hairline px-3 py-2 text-body font-medium text-pure-white hover:bg-white/5"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {pendingError && <p className="text-body text-coral-pulse">{pendingError}</p>}
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
