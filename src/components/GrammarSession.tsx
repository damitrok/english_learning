"use client";

import { useState } from "react";
import {
  submitGrammarAnswer,
  type GrammarAnswerResult,
  type GrammarLesson,
} from "@/lib/grammar";
import { useStepOnce } from "@/components/useStepOnce";
import { StepComplete } from "@/components/StepComplete";
import { SessionFrame } from "@/components/SessionFrame";

export function GrammarSession({
  lesson,
  step = "grammar",
}: {
  lesson: GrammarLesson;
  step?: "grammar" | "review";
}) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [given, setGiven] = useState<string | null>(null);
  const [result, setResult] = useState<GrammarAnswerResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useStepOnce(step, index >= lesson.exercises.length);

  const exercises = lesson.exercises;
  const current = exercises[index];
  const done = index >= exercises.length;

  async function answer(value: string) {
    if (!current || result || !value.trim()) return;
    setPending(true);
    setError(null);
    try {
      const res = await submitGrammarAnswer(current.id, value);
      setGiven(value);
      setResult(res);
      if (res.correct) setCorrectCount((n) => n + 1);
    } catch {
      setError("Не сохранилось — проверь соединение и попробуй ещё раз.");
    } finally {
      setPending(false);
    }
  }

  function next() {
    setResult(null);
    setGiven(null);
    setTyped("");
    setIndex((i) => i + 1);
  }

  const header = (
    <div>
      <p className="text-eyebrow font-medium uppercase text-ash">
        {step === "review" ? "Повтор ошибок" : `Грамматика · Unit ${lesson.unit} · ${lesson.section}`}
      </p>
      {step === "grammar" && (
        <>
          <h1 className="mt-2 text-heading-sm font-normal text-pure-white">{lesson.title}</h1>
          <p className="mt-1 text-body text-ash">
            Тем освоено: {lesson.topicsDone} / {lesson.topicsTotal}
          </p>
        </>
      )}
    </div>
  );

  if (!started) {
    return (
      <SessionFrame
        progress={0}
        footer={
          <button onClick={() => setStarted(true)} className="btn-primary">
            К упражнениям ({exercises.length})
          </button>
        }
      >
        {header}
        {lesson.summary && (
          <div className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-6">
            <p className="text-body-lg leading-relaxed text-mist">{lesson.summary}</p>
          </div>
        )}
      </SessionFrame>
    );
  }

  if (done) {
    const allRight = correctCount === exercises.length;
    return (
      <StepComplete
        step={step}
        message={
          allRight
            ? step === "review"
              ? `Отлично — все ${exercises.length} верно! Ошибки исправлены.`
              : `Отлично — все ${exercises.length} верно! Тема «${lesson.title}» освоена.`
            : `Верно ${correctCount} из ${exercises.length}. Ошибки вернутся в следующий раз, пока тема не будет освоена.`
        }
      />
    );
  }

  const [before, after] = current.prompt.split("___");

  const isChoice = current.type === "multiple_choice" && !!current.options;
  const footer = result ? (
    <div className="flex flex-col gap-3">
      <p className={`text-body-lg font-medium ${result.correct ? "text-success-green" : "text-coral-pulse"}`}>
        {result.correct ? "Верно!" : `Правильно: ${result.correctAnswer}`}
      </p>
      <button onClick={next} autoFocus className="btn-primary">
        Дальше
      </button>
    </div>
  ) : isChoice ? undefined : (
    <button
      type="submit"
      form="grammar-answer"
      disabled={pending || !typed.trim()}
      className="btn-primary"
    >
      Проверить
    </button>
  );

  return (
    <SessionFrame
      progress={(index + (result ? 1 : 0)) / exercises.length}
      footer={footer}
    >
      {header}
      <p className="text-body text-ash">
        {lesson.isRetry && "Работа над ошибками · "}
        {index + 1} / {exercises.length}
      </p>

      <div className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-10">
        <p className="text-subheading leading-relaxed text-pure-white">
          {before}
          <span
            className={`inline-block min-w-16 border-b-2 px-1 text-center ${
              !result
                ? "border-ash text-ash"
                : result.correct
                  ? "border-success-green text-success-green"
                  : "border-coral-pulse text-coral-pulse"
            }`}
          >
            {given ?? " "}
          </span>
          {after}
        </p>
      </div>

      {isChoice ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {current.options!.map((opt) => {
            const tone = !result
              ? "text-pure-white"
              : opt === result.correctAnswer
                ? "border-success-green text-success-green"
                : opt === given
                  ? "border-coral-pulse text-coral-pulse"
                  : "text-smoke";
            return (
              <button
                key={opt}
                disabled={!!result || pending}
                onClick={() => answer(opt)}
                className={`btn-secondary ${tone}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          id="grammar-answer"
          onSubmit={(e) => {
            e.preventDefault();
            answer(typed);
          }}
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={!!result || pending}
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            placeholder="Впиши ответ"
            className="min-h-14 w-full rounded-cards border border-border-hairline bg-obsidian px-4 text-body-lg text-pure-white placeholder:text-smoke focus:border-ash focus:outline-none"
          />
        </form>
      )}

      {result?.explanation && <p className="text-body text-ash">{result.explanation}</p>}
      {error && <p className="text-body text-coral-pulse">{error}</p>}
    </SessionFrame>
  );
}
