"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { markTextRead, type ReadingText } from "@/lib/reading";
import { splitByHeadwords } from "@/lib/highlight";
import { speak } from "@/lib/speech";
import { StepComplete } from "@/components/StepComplete";

type Phase = "reading" | "questions" | "done";

export function ReadingSession({ text }: { text: ReadingText | null }) {
  const [phase, setPhase] = useState<Phase>("reading");
  const [openWord, setOpenWord] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    () => text?.questions.map(() => null) ?? []
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const translations = useMemo(
    () => new Map(text?.studiedWords.map((w) => [w.headword.toLowerCase(), w.translation]) ?? []),
    [text]
  );
  const paragraphs = useMemo(
    () =>
      (text?.body ?? "")
        .split(/\n{2,}/)
        .map((p) => splitByHeadwords(p, [...translations.keys()])),
    [text, translations]
  );

  if (!text) {
    return <EmptyState message="Текстов пока нет — добавь их в базу (supabase/content/texts.mjs)." />;
  }

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter((a, i) => a === text.questions[i].answer).length;

  async function finish() {
    if (!text) return;
    setSaving(true);
    setSaveError(null);
    try {
      const seconds = (performance.now() - (startedAt.current ?? performance.now())) / 1000;
      await markTextRead(text.id, seconds, correctCount);
      setPhase("done");
    } catch {
      setSaveError("Не сохранилось — проверь соединение и попробуй ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  if (phase === "done") {
    return (
      <StepComplete
        step="reading"
        message={`Готово! Верных ответов: ${correctCount} из ${text.questions.length}.`}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-body text-ash">
          Текст {text.position} / {text.total}
          {text.readBefore && " · повтор"}
        </p>
        <span className="rounded-badges bg-graphite px-2 py-1 font-mono text-[12px] text-ash">
          {text.level}
        </span>
      </div>

      <article className="flex flex-col gap-4 rounded-cards border border-border-hairline bg-ink p-6 shadow-key sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-heading font-normal text-pure-white">{text.title}</h1>
          <button
            onClick={() => speak(text.body)}
            className="shrink-0 rounded-buttons border border-border-hairline px-3 py-2 text-body text-mist hover:bg-white/5"
          >
            🔊 Слушать
          </button>
        </div>
        {paragraphs.map((segments, pi) => (
          <p key={pi} className="whitespace-pre-line text-body-lg leading-relaxed text-mist">
            {segments.map((seg, si) => {
              if (seg.kind === "text") return <span key={si}>{seg.value}</span>;
              const id = `${pi}:${si}`;
              const isOpen = openWord === id;
              return (
                <span key={si} className="relative">
                  <button
                    onClick={() => setOpenWord(isOpen ? null : id)}
                    className="rounded-sm text-electric-sky underline decoration-dotted underline-offset-4"
                  >
                    {seg.value}
                  </button>
                  {isOpen && (
                    <span className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded-buttons border border-border-hairline bg-obsidian px-2 py-1 text-body text-pure-white shadow-key">
                      {translations.get(seg.headword)}
                    </span>
                  )}
                </span>
              );
            })}
          </p>
        ))}
      </article>

      {phase === "reading" && (
        <div className="flex flex-col gap-2">
          <p className="text-body text-ash">
            Читай ради смысла, не переводи каждое слово. Синим выделены слова из твоих
            карточек — нажми, если забыл перевод.
          </p>
          <button
            onClick={() => setPhase("questions")}
            className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
          >
            Прочитал
          </button>
        </div>
      )}

      {phase === "questions" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-subheading font-medium text-pure-white">Верно или нет?</h2>
          {text.questions.map((q, i) => {
            const given = answers[i];
            const answered = given !== null;
            return (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-cards border border-border-hairline bg-ink p-4"
              >
                <p className="text-body-lg text-pure-white">{q.statement}</p>
                <div className="flex gap-3">
                  {[true, false].map((value) => {
                    const chosen = given === value;
                    const isRight = value === q.answer;
                    const tone = !answered
                      ? "border-border-hairline text-pure-white hover:bg-white/5"
                      : isRight
                        ? "border-success-green text-success-green"
                        : chosen
                          ? "border-coral-pulse text-coral-pulse"
                          : "border-border-hairline text-smoke";
                    return (
                      <button
                        key={String(value)}
                        disabled={answered}
                        onClick={() =>
                          setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)))
                        }
                        className={`rounded-buttons border px-4 py-2 text-body font-medium ${tone}`}
                      >
                        {value ? "Верно" : "Неверно"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {allAnswered && (
            <button
              onClick={finish}
              disabled={saving}
              className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron disabled:opacity-40"
            >
              Завершить
            </button>
          )}
          {saveError && <p className="text-body text-coral-pulse">{saveError}</p>}
        </div>
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
