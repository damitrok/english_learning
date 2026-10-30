"use client";

import { useEffect, useRef, useState } from "react";
import { useOffline } from "next/offline";
import { submitVocabReview, type VocabQueueItem } from "@/lib/vocab";
import { markStepDone } from "@/lib/steps";
import { speak } from "@/lib/speech";
import type { SrsResult } from "@/lib/supabase/types";
import { StepComplete } from "@/components/StepComplete";

const RATING_BUTTONS: { result: SrsResult; label: string }[] = [
  { result: "forgot", label: "Забыл" },
  { result: "hard", label: "Трудно" },
  { result: "normal", label: "Нормально" },
  { result: "easy", label: "Легко" },
];

export function VocabSession({ queue }: { queue: VocabQueueItem[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Reviews are saved in the background so the next card shows immediately.
  // With experimental.useOffline, a save made without network waits and is
  // sent when the connection returns (as long as the page stays open).
  const [unsaved, setUnsaved] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const isOffline = useOffline();
  const startedAt = useRef<number | null>(null);
  const stepMarked = useRef(false);

  const current = queue[index];
  const done = index >= queue.length;

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  useEffect(() => {
    // Nothing due counts as a finished step too.
    if (!done || stepMarked.current) return;
    stepMarked.current = true;
    const seconds = (performance.now() - (startedAt.current ?? performance.now())) / 1000;
    markStepDone("vocab", seconds).catch(() => {
      stepMarked.current = false;
    });
  }, [done]);

  function rate(result: SrsResult) {
    if (!current) return;
    const item = current;
    setUnsaved((n) => n + 1);
    submitVocabReview(item.wordId, item.cardId, item.srsState, result)
      .catch(() => setFailed((f) => [...f, item.headword]))
      .finally(() => setUnsaved((n) => n - 1));
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  const saveStatus =
    unsaved > 0 ? (
      <p className="text-body text-ash">
        {isOffline
          ? `Нет сети — ответов в очереди: ${unsaved}. Отправлю, когда связь вернётся; не закрывай страницу.`
          : `Сохраняю ответы… (${unsaved})`}
      </p>
    ) : null;
  const failedNote =
    failed.length > 0 ? (
      <p className="text-body text-coral-pulse">
        Не сохранились ответы для: {failed.join(", ")}. Эти слова придут снова.
      </p>
    ) : null;

  if (done) {
    return (
      <StepComplete
        step="vocab"
        message={
          queue.length === 0
            ? "На сегодня карточек нет — шаг засчитан."
            : `Готово! Пройдено карточек: ${queue.length}.`
        }
      >
        {saveStatus}
        {failedNote}
      </StepComplete>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-8">
      <p className="text-body text-ash">
        {index + 1} / {queue.length}
      </p>
      <div className="flex flex-col items-center gap-4 rounded-cards border border-border-hairline bg-ink p-8 text-center shadow-key sm:p-10">
        <h2 className="text-heading font-normal text-pure-white">{current.headword}</h2>
        {current.ipa && <p className="font-mono text-body text-ash">{current.ipa}</p>}
        <button
          onClick={() => speak(current.headword)}
          className="rounded-buttons border border-border-hairline px-4 py-3 text-body text-mist hover:bg-white/5"
        >
          🔊 Произнести
        </button>

        {revealed ? (
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-subheading font-medium text-pure-white">{current.translation}</p>
            {current.exampleSentence && (
              <p className="text-body text-ash">{current.exampleSentence}</p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-2 rounded-buttons bg-mist px-4 py-3 text-body font-medium text-iron"
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
              className="rounded-buttons border border-border-hairline px-3 py-3 text-body font-medium text-pure-white hover:bg-white/5"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {saveStatus}
      {failedNote}
    </div>
  );
}
