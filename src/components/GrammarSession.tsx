"use client";

import { useState } from "react";
import Link from "next/link";
import {
  submitGrammarAnswer,
  type GrammarAnswerResult,
  type GrammarLesson,
} from "@/lib/grammar";

export function GrammarSession({ lesson }: { lesson: GrammarLesson | null }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [given, setGiven] = useState<string | null>(null);
  const [result, setResult] = useState<GrammarAnswerResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!lesson) {
    return (
      <EmptyState message="Все темы с упражнениями пройдены. Новые юниты появятся по мере наполнения базы." />
    );
  }

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
        Грамматика · Unit {lesson.unit} · {lesson.section}
      </p>
      <h1 className="mt-2 text-heading-sm font-normal text-pure-white">{lesson.title}</h1>
      <p className="mt-1 text-body text-ash">
        Тем освоено: {lesson.topicsDone} / {lesson.topicsTotal}
      </p>
    </div>
  );

  if (!started) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-8">
        {header}
        {lesson.summary && (
          <div className="rounded-cards border border-border-hairline bg-ink p-6 shadow-key">
            <p className="text-body-lg leading-relaxed text-mist">{lesson.summary}</p>
          </div>
        )}
        <button
          onClick={() => setStarted(true)}
          className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
        >
          К упражнениям ({exercises.length})
        </button>
      </div>
    );
  }

  if (done) {
    const allRight = correctCount === exercises.length;
    return (
      <EmptyState
        message={
          allRight
            ? `Отлично — все ${exercises.length} верно! Тема «${lesson.title}» освоена.`
            : `Верно ${correctCount} из ${exercises.length}. Ошибки вернутся в следующий раз, пока тема не будет освоена.`
        }
      />
    );
  }

  const [before, after] = current.prompt.split("___");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-8">
      {header}
      <p className="text-body text-ash">
        {lesson.isRetry && "Работа над ошибками · "}
        {index + 1} / {exercises.length}
      </p>

      <div className="rounded-cards border border-border-hairline bg-ink p-6 shadow-key sm:p-10">
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
            {given ?? " "}
          </span>
          {after}
        </p>
      </div>

      {current.type === "multiple_choice" && current.options ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {current.options.map((opt) => {
            const tone = !result
              ? "border-border-hairline text-pure-white hover:bg-white/5"
              : opt === result.correctAnswer
                ? "border-success-green text-success-green"
                : opt === given
                  ? "border-coral-pulse text-coral-pulse"
                  : "border-border-hairline text-smoke";
            return (
              <button
                key={opt}
                disabled={!!result || pending}
                onClick={() => answer(opt)}
                className={`rounded-buttons border px-3 py-2 text-body font-medium ${tone}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            answer(typed);
          }}
          className="flex gap-3"
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={!!result || pending}
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Впиши ответ"
            className="min-w-0 flex-1 rounded-buttons border border-border-hairline bg-obsidian px-3 py-2 text-body text-pure-white placeholder:text-smoke focus:border-ash focus:outline-none"
          />
          <button
            type="submit"
            disabled={!!result || pending || !typed.trim()}
            className="rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron disabled:opacity-40"
          >
            Проверить
          </button>
        </form>
      )}

      {result && (
        <div className="flex flex-col gap-3">
          <p className={`text-body-lg ${result.correct ? "text-success-green" : "text-coral-pulse"}`}>
            {result.correct ? "Верно!" : `Правильно: ${result.correctAnswer}`}
          </p>
          {result.explanation && <p className="text-body text-ash">{result.explanation}</p>}
          <button
            onClick={next}
            autoFocus
            className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
          >
            Дальше
          </button>
        </div>
      )}

      {error && <p className="text-body text-coral-pulse">{error}</p>}
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
