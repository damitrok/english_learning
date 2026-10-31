"use client";

import { useState } from "react";
import type { ContextItem } from "@/lib/practice";
import { normalizeAnswer } from "@/lib/text-normalize";
import { StepComplete } from "@/components/StepComplete";
import { SessionFrame } from "@/components/SessionFrame";
import { useStepOnce } from "@/components/useStepOnce";

export function ContextSession({ items }: { items: ContextItem[] }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= items.length;
  useStepOnce("context", done);

  if (done) {
    return (
      <StepComplete
        step="context"
        message={
          items.length === 0
            ? "Пока нет подходящих слов — урок засчитан."
            : `Верно ${score} из ${items.length}.`
        }
      />
    );
  }

  const item = items[index];
  const checked = correct !== null;

  function check() {
    if (checked || !typed.trim()) return;
    const ok = item.answers.some((a) => normalizeAnswer(a) === normalizeAnswer(typed));
    setCorrect(ok);
    if (ok) setScore((n) => n + 1);
  }

  function next() {
    setCorrect(null);
    setTyped("");
    setIndex((i) => i + 1);
  }

  const tone = correct === null ? "border-ash text-ash" : correct ? "border-success-green text-success-green" : "border-coral-pulse text-coral-pulse";

  return (
    <SessionFrame
      progress={(index + (checked ? 1 : 0)) / items.length}
      footer={
        checked ? (
          <div className="flex flex-col gap-3">
            <p className={`text-body-lg font-medium ${correct ? "text-success-green" : "text-coral-pulse"}`}>
              {correct ? "Верно!" : `Правильно: ${item.answers[0]}`}
            </p>
            <button onClick={next} autoFocus className="btn-primary">
              Дальше
            </button>
          </div>
        ) : (
          <button type="submit" form="context-answer" disabled={!typed.trim()} className="btn-primary">
            Проверить
          </button>
        )
      }
    >
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Слова в контексте</p>
        <p className="mt-2 text-body text-ash">
          {index + 1} / {items.length} · впиши пропущенное слово
        </p>
      </div>
      <div className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-[2rem]">
        <p className="text-subheading leading-relaxed text-pure-white">
          {item.before}
          <span className={`inline-block min-w-20 border-b-2 px-1 text-center ${tone}`}>
            {checked ? item.answers[0] : " "}
          </span>
          {item.after}
        </p>
        <p className="mt-4 text-body text-ash">Значение слова: {item.hint}</p>
      </div>
      <form
        id="context-answer"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={checked}
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder="Впиши слово"
          className="min-h-14 w-full rounded-cards border border-border-hairline bg-obsidian px-4 text-body-lg text-pure-white placeholder:text-smoke focus:border-ash focus:outline-none"
        />
      </form>
      {checked && !correct && item.answers.length > 1 && (
        <p className="text-body text-ash">Начальная форма: {item.answers[item.answers.length - 1]}</p>
      )}
    </SessionFrame>
  );
}
