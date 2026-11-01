"use client";

import { useEffect, useRef, useState } from "react";
import { useOffline } from "next/offline";
import { submitWordReview } from "@/lib/words";
import type { WordItem } from "@/lib/word-queue";
import { checkWordAnswer, gradeAttempt, hintFor, type AnswerVerdict } from "@/lib/word-check";
import { speak } from "@/lib/speech";
import { StepComplete } from "@/components/StepComplete";
import { SessionEmpty, SessionFrame } from "@/components/SessionFrame";
import { useStepOnce } from "@/components/useStepOnce";

interface Entry {
  item: WordItem;
  /** First time the learner sees this word in this session: intro card before the question. */
  intro: boolean;
  /** 0 = first attempt (the only one that counts for the SRS); later ones are re-asks after a mistake. */
  attempt: number;
}

type Phase = "intro" | "ask" | "feedback";

/** After a mistake a word comes back at the end of the session, at most this many times. */
const MAX_RETRIES = 2;

const inputClass =
  "min-h-14 w-full rounded-cards border border-border-hairline bg-obsidian px-4 text-body-lg text-pure-white placeholder:text-smoke focus:border-ash focus:outline-none";

/**
 * A words session: new words are introduced, then every word is recalled by typing it (Russian →
 * English, or the missing word of a sentence for older cards). Mistakes are asked again before the
 * session ends; only the first attempt is graded for the spaced-repetition schedule.
 */
export function WordsSession({ items }: { items: WordItem[] }) {
  const [queue, setQueue] = useState<Entry[]>(() => items.map((item) => ({ item, intro: item.isNew, attempt: 0 })));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(() => (items[0]?.isNew ? "intro" : "ask"));
  const [typed, setTyped] = useState("");
  const [hinted, setHinted] = useState(false);
  const [feedback, setFeedback] = useState<{ verdict: AnswerVerdict; gaveUp: boolean } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  // Reviews are saved in the background so the next card shows immediately; with
  // experimental.useOffline a save made without network waits and is sent when it returns.
  const [unsaved, setUnsaved] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const isOffline = useOffline();
  const askedAt = useRef(0);

  const entry = queue[index];
  const done = index >= queue.length;
  useStepOnce("vocab", done && items.length > 0);

  // Start the answer timer whenever a question appears.
  useEffect(() => {
    if (phase === "ask") askedAt.current = performance.now();
  }, [phase, index]);

  if (items.length === 0) {
    return <SessionEmpty backHref="/" message="Слов на сейчас нет — загляни позже." />;
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
      <p className="text-body text-coral-pulse">Не сохранились ответы для: {failed.join(", ")}. Эти слова придут снова.</p>
    ) : null;

  if (done) {
    const newCount = items.filter((i) => i.isNew).length;
    return (
      <StepComplete
        step="vocab"
        message={`Слов: ${items.length}${newCount ? `, из них новых ${newCount}` : ""}. С ошибками: ${mistakes}.`}
      >
        {saveStatus}
        {failedNote}
      </StepComplete>
    );
  }

  const { item } = entry;

  function check(gaveUp: boolean) {
    if (phase !== "ask") return;
    const verdict: AnswerVerdict = gaveUp ? "wrong" : checkWordAnswer(typed, item.answers);
    if (entry.attempt === 0) {
      const result = gradeAttempt({
        verdict,
        usedHint: hinted,
        gaveUp,
        seconds: (performance.now() - askedAt.current) / 1000,
      });
      setUnsaved((n) => n + 1);
      submitWordReview(item.wordId, result)
        .catch(() => setFailed((f) => [...f, item.headword]))
        .finally(() => setUnsaved((n) => n - 1));
      if (verdict === "wrong") setMistakes((m) => m + 1);
    }
    // A wrong answer comes back at the end of the session (a few times at most).
    if (verdict === "wrong" && entry.attempt < MAX_RETRIES) {
      setQueue((q) => [...q, { item, intro: false, attempt: entry.attempt + 1 }]);
    }
    setFeedback({ verdict, gaveUp });
    setPhase("feedback");
  }

  function next() {
    const nextEntry = queue[index + 1];
    setIndex((i) => i + 1);
    setTyped("");
    setHinted(false);
    setFeedback(null);
    setPhase(nextEntry?.intro && nextEntry.attempt === 0 ? "intro" : "ask");
  }

  const progress = index / queue.length;
  const counter = (
    <p className="text-body text-ash">
      {Math.min(index + 1, queue.length)} / {queue.length}
      {entry.attempt > 0 && " · ещё раз"}
    </p>
  );

  if (phase === "intro") {
    return (
      <SessionFrame
        progress={progress}
        backHref="/"
        footer={
          <button onClick={() => setPhase("ask")} autoFocus className="btn-primary">
            Понятно, проверим
          </button>
        }
      >
        <div>
          <p className="text-eyebrow font-medium uppercase text-coral-pulse">Новое слово</p>
          <div className="mt-2">{counter}</div>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-cards border border-border-hairline bg-ink p-5 text-center shadow-key sm:p-[2rem]">
          <h1 className="text-heading font-normal text-pure-white">{item.headword}</h1>
          {item.ipa && <p className="font-mono text-body text-ash">{item.ipa}</p>}
          <button onClick={() => speak(item.headword)} className="btn-secondary min-w-[12rem]">
            🔊 Произнести
          </button>
          <p className="mt-2 text-subheading font-medium text-pure-white">{item.translation}</p>
          {item.example && <p className="text-body text-ash">{item.example}</p>}
        </div>
        <p className="text-body text-smoke">Запомни слово — сейчас нужно будет вспомнить и написать его.</p>
      </SessionFrame>
    );
  }

  const asking = phase === "ask";
  const correctText = item.headword;

  return (
    <SessionFrame
      progress={progress}
      backHref="/"
      footer={
        asking ? (
          <div className="flex flex-col gap-2">
            <button type="submit" form="word-answer" disabled={!typed.trim()} className="btn-primary">
              Проверить
            </button>
            <button type="button" onClick={() => check(true)} className="min-h-12 text-body text-ash underline underline-offset-4">
              Не помню
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p
              className={`text-body-lg font-medium ${
                feedback?.verdict === "correct" ? "text-success-green" : "text-coral-pulse"
              }`}
            >
              {feedback?.verdict === "correct"
                ? "Верно!"
                : feedback?.verdict === "near"
                  ? `Почти — пишется «${correctText}»`
                  : `Правильно: ${correctText}`}
            </p>
            <button onClick={next} autoFocus className="btn-primary">
              Дальше
            </button>
          </div>
        )
      }
    >
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">
          {item.kind === "context" ? "Слово в предложении" : "Вспомни слово"}
        </p>
        <div className="mt-2">{counter}</div>
      </div>

      <div className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-[2rem]">
        {item.kind === "context" && item.context ? (
          <>
            <p className="text-subheading leading-relaxed text-pure-white">
              {item.context.before}
              <span
                className={`inline-block min-w-[5rem] border-b-2 px-1 text-center ${
                  !feedback
                    ? "border-ash text-ash"
                    : feedback.verdict === "wrong"
                      ? "border-coral-pulse text-coral-pulse"
                      : "border-success-green text-success-green"
                }`}
              >
                {feedback ? item.answers[0] : hinted ? hintFor(item.answers[0]) : " "}
              </span>
              {item.context.after}
            </p>
            <p className="mt-4 text-body text-ash">Значение слова: {item.translation}</p>
          </>
        ) : (
          <>
            <p className="text-heading-sm font-medium text-pure-white">{item.translation}</p>
            <p className="mt-2 text-body text-ash">Как это по-английски?</p>
            {hinted && !feedback && (
              <p className="mt-3 font-mono text-subheading tracking-widest text-coral-pulse">{hintFor(item.headword)}</p>
            )}
          </>
        )}
      </div>

      {asking ? (
        <form
          id="word-answer"
          onSubmit={(e) => {
            e.preventDefault();
            if (typed.trim()) check(false);
          }}
          className="flex flex-col gap-2"
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="done"
            placeholder="Впиши слово"
            className={inputClass}
          />
          {!hinted && (
            <button
              type="button"
              onClick={() => setHinted(true)}
              className="min-h-12 self-start text-body text-ash underline underline-offset-4"
            >
              Подсказка: первая буква
            </button>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          {typed.trim() && feedback?.verdict !== "correct" && (
            <p className="text-body text-ash">Ты написал: {typed.trim()}</p>
          )}
          <div className="flex items-center gap-3">
            <button onClick={() => speak(item.headword)} className="btn-secondary">
              🔊 Произнести
            </button>
            {item.ipa && <span className="font-mono text-body text-ash">{item.ipa}</span>}
          </div>
          {item.example && <p className="text-body text-ash">{item.example}</p>}
          {entry.attempt < MAX_RETRIES && feedback?.verdict === "wrong" && (
            <p className="text-body text-smoke">Это слово вернётся в конце — вспомнишь ещё раз.</p>
          )}
        </div>
      )}

      {saveStatus}
      {failedNote}
    </SessionFrame>
  );
}
