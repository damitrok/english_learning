"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { markTextRead, type ReadingText } from "@/lib/reading";
import { splitByHeadwords } from "@/lib/highlight";
import { speak } from "@/lib/speech";
import { StepComplete } from "@/components/StepComplete";
import { SessionEmpty, SessionFrame } from "@/components/SessionFrame";

type Phase = "reading" | "questions" | "done";

export function ReadingSession({ text }: { text: ReadingText | null }) {
  const [phase, setPhase] = useState<Phase>("reading");
  const [openWord, setOpenWord] = useState<{ id: string; headword: string } | null>(null);
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
    return <SessionEmpty message="Текстов пока нет — добавь их в базу (supabase/content/texts.mjs)." />;
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

  const answeredCount = answers.filter((a) => a !== null).length;
  const progress =
    phase === "reading" ? 0.1 : 0.1 + (0.9 * answeredCount) / Math.max(1, text.questions.length);
  const footer =
    phase === "reading" ? (
      <button onClick={() => setPhase("questions")} className="btn-primary">
        Прочитал
      </button>
    ) : allAnswered ? (
      <button onClick={finish} disabled={saving} className="btn-primary">
        Завершить
      </button>
    ) : undefined;

  return (
    <SessionFrame progress={progress} width="max-w-2xl" footer={footer}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-body text-ash">
          Текст {text.position} / {text.total}
          {text.readBefore && " · повтор"}
        </p>
        <span className="rounded-badges bg-graphite px-2 py-1 font-mono text-[12px] text-ash">
          {text.level}
        </span>
      </div>

      <article className="flex flex-col gap-4 rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-10">
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 break-words text-heading-sm font-normal sm:text-heading text-pure-white">{text.title}</h1>
          <button
            onClick={() => speak(text.body)}
            className="btn-secondary min-h-12 shrink-0 px-4"
          >
            🔊 Слушать
          </button>
        </div>
        {paragraphs.map((segments, pi) => (
          <p key={pi} className="whitespace-pre-line text-body-lg leading-relaxed text-mist">
            {segments.map((seg, si) => {
              if (seg.kind === "text") return <span key={si}>{seg.value}</span>;
              const id = `${pi}:${si}`;
              const isOpen = openWord?.id === id;
              return (
                <span key={si} className="relative">
                  <button
                    onClick={() =>
                      setOpenWord(isOpen ? null : { id, headword: seg.headword })
                    }
                    className="rounded-sm py-2 text-electric-sky underline decoration-dotted underline-offset-4"
                  >
                    {seg.value}
                  </button>
                </span>
              );
            })}
          </p>
        ))}
      </article>

      {phase === "reading" && (
        <p className="text-body text-ash">
          Читай ради смысла, не переводи каждое слово. Синим выделены слова из твоих
          карточек — нажми, если забыл перевод.
        </p>
      )}

      {openWord && (
        <button
          role="status"
          onClick={() => setOpenWord(null)}
          className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-30 mx-auto max-w-md rounded-cards border border-border-hairline bg-obsidian px-4 py-3 text-left text-body-lg text-pure-white shadow-lift"
        >
          <span className="text-electric-sky">{openWord.headword}</span> —{" "}
          {translations.get(openWord.headword)}
        </button>
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
                <div className="grid grid-cols-2 gap-3">
                  {[true, false].map((value) => {
                    const chosen = given === value;
                    const isRight = value === q.answer;
                    const tone = !answered
                      ? "text-pure-white"
                      : isRight
                        ? "border-success-green text-success-green"
                        : chosen
                          ? "border-coral-pulse text-coral-pulse"
                          : "text-smoke";
                    return (
                      <button
                        key={String(value)}
                        disabled={answered}
                        onClick={() =>
                          setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)))
                        }
                        className={`btn-secondary ${tone}`}
                      >
                        {value ? "Верно" : "Неверно"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {saveError && <p className="text-body text-coral-pulse">{saveError}</p>}
        </div>
      )}
    </SessionFrame>
  );
}
