"use client";

import { useState } from "react";
import { isCorrectPhrase } from "@/lib/phrases-lesson";
import type { Phrase } from "@/content/phrases";
import { StepComplete } from "@/components/StepComplete";
import { SessionFrame } from "@/components/SessionFrame";
import { useStepOnce } from "@/components/useStepOnce";

export function TranslateSession({ items }: { items: Phrase[] }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= items.length;
  useStepOnce("translate", done);

  if (done) {
    return <StepComplete step="translate" message={`Верно ${score} из ${items.length}.`} />;
  }

  const item = items[index];
  const checked = correct !== null;

  function check() {
    if (checked || !typed.trim()) return;
    const ok = isCorrectPhrase(typed, item);
    setCorrect(ok);
    if (ok) setScore((n) => n + 1);
  }

  function next() {
    setCorrect(null);
    setTyped("");
    setIndex((i) => i + 1);
  }

  return (
    <SessionFrame
      progress={(index + (checked ? 1 : 0)) / items.length}
      footer={
        checked ? (
          <div className="flex flex-col gap-3">
            <p className={`text-body-lg font-medium ${correct ? "text-success-green" : "text-coral-pulse"}`}>
              {correct ? "Верно!" : `Правильно: ${item.en}`}
            </p>
            <button onClick={next} autoFocus className="btn-primary">
              Дальше
            </button>
          </div>
        ) : (
          <button type="submit" form="translate-answer" disabled={!typed.trim()} className="btn-primary">
            Проверить
          </button>
        )
      }
    >
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Перевод</p>
        <p className="mt-2 text-body text-ash">
          {index + 1} / {items.length} · переведи на английский
        </p>
      </div>
      <div className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-8">
        <p className="text-subheading leading-relaxed text-pure-white">{item.ru}</p>
      </div>
      <form
        id="translate-answer"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <textarea
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={checked}
          rows={3}
          autoFocus
          autoCapitalize="sentences"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              check();
            }
          }}
          placeholder="Напиши по-английски"
          className={`w-full resize-none rounded-cards border bg-obsidian p-4 text-body-lg text-pure-white placeholder:text-smoke focus:outline-none ${
            correct === null
              ? "border-border-hairline focus:border-ash"
              : correct
                ? "border-success-green"
                : "border-coral-pulse"
          }`}
        />
      </form>
    </SessionFrame>
  );
}
