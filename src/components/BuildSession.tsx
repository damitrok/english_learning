"use client";

import { useState } from "react";
import { isCorrectPhrase } from "@/lib/phrases-lesson";
import type { Phrase } from "@/content/phrases";
import { StepComplete } from "@/components/StepComplete";
import { SessionFrame } from "@/components/SessionFrame";
import { useStepOnce } from "@/components/useStepOnce";

export interface BuildItem extends Phrase {
  /** The words of `en` in shuffled order. */
  tokens: string[];
}

export function BuildSession({ items }: { items: BuildItem[] }) {
  const [index, setIndex] = useState(0);
  // Indices into item.tokens, in the order the learner picked them.
  const [picked, setPicked] = useState<number[]>([]);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= items.length;
  useStepOnce("build", done);

  if (done) {
    return <StepComplete step="build" message={`Верно ${score} из ${items.length}.`} />;
  }

  const item = items[index];
  const checked = correct !== null;
  const complete = picked.length === item.tokens.length;

  function check() {
    if (checked || !complete) return;
    const ok = isCorrectPhrase(picked.map((i) => item.tokens[i]).join(" "), item);
    setCorrect(ok);
    if (ok) setScore((n) => n + 1);
  }

  function next() {
    setCorrect(null);
    setPicked([]);
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
          <button onClick={check} disabled={!complete} className="btn-primary">
            Проверить
          </button>
        )
      }
    >
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Собери предложение</p>
        <p className="mt-2 text-body text-ash">
          {index + 1} / {items.length} · нажимай слова по порядку
        </p>
      </div>
      <div className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-8">
        <p className="text-subheading leading-relaxed text-pure-white">{item.ru}</p>
      </div>

      <div
        aria-label="Твой ответ"
        className={`flex min-h-24 flex-wrap content-start gap-2 rounded-cards border-2 border-dashed p-3 ${
          correct === null ? "border-border-hairline" : correct ? "border-success-green" : "border-coral-pulse"
        }`}
      >
        {picked.map((i, pos) => (
          <button
            key={i}
            disabled={checked}
            onClick={() => setPicked((p) => p.filter((x) => x !== i))}
            aria-label={`Убрать слово ${item.tokens[i]}, позиция ${pos + 1}`}
            className="btn-secondary px-4 text-pure-white"
          >
            {item.tokens[i]}
          </button>
        ))}
      </div>

      <div aria-label="Слова" className="flex flex-wrap gap-2">
        {item.tokens.map((token, i) => {
          const used = picked.includes(i);
          return (
            <button
              key={i}
              disabled={used || checked}
              onClick={() => setPicked((p) => [...p, i])}
              className={`btn-secondary px-4 ${used ? "opacity-30" : "text-pure-white"}`}
            >
              {token}
            </button>
          );
        })}
      </div>
    </SessionFrame>
  );
}
