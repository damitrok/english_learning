"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { PushToggle } from "@/components/PushToggle";
import { CHAPTER_LESSONS, DAILY_TASKS, FREEZE_EVERY, MAX_FREEZES, type TaskId, type TaskStatus } from "@/lib/daily";
import type { DailyOverview } from "@/lib/overview";
import { plural } from "@/lib/plural";

function Flame({ lit, size }: { lit: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={lit ? "text-coral-pulse" : "text-smoke"}
      fill="currentColor"
    >
      <path d="M12.6 2.2c.3 2.6-.7 4.2-2 5.7C9 9.6 7 11.4 7 14.6 7 18 9.2 20.5 12 20.5s5-2.4 5-5.7c0-2-.9-3.5-1.8-4.7-.3 1.2-1 2-1.9 2.3.5-3.5-.4-7.2-.7-10.2z" />
    </svg>
  );
}

function Snowflake() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      className="text-info-blue"
    >
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />
    </svg>
  );
}

function TaskRow({
  id,
  label,
  note,
  done,
  href,
}: {
  id: TaskId;
  label: string;
  note?: string;
  done: boolean;
  href: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-inputs bg-white/5 p-3" data-task={id}>
      <span
        aria-hidden
        className={`flex size-[1.75rem] shrink-0 items-center justify-center rounded-full ${
          done ? "bg-coral-pulse text-void-black" : "border border-border-hairline text-transparent"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span className={`flex-1 text-body ${done ? "text-ash line-through" : "text-pure-white"}`}>
        {label}
        {note && <span className="mt-1 block text-[13px] text-smoke no-underline">{note}</span>}
        <span className="sr-only">{done ? " — выполнено" : " — не выполнено"}</span>
      </span>
      {!done && (
        <Link href={href} className="shrink-0 text-body font-medium text-coral-pulse underline underline-offset-4">
          Начать
        </Link>
      )}
    </li>
  );
}

/** Streak pill pinned to the top-right corner; a click opens today's tasks, the streak and the freezes. */
export function DailyTasks({ current, freezes, tasks, done, grammarHref, grammarLessonsToday, dayComplete }: DailyOverview) {
  const [open, setOpen] = useState(false);
  const total = DAILY_TASKS.length;
  const hrefs: Record<TaskId, string | undefined> = { words: undefined, grammar: grammarHref, listening: undefined };
  const status: TaskStatus = tasks;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ежедневные задания: серия ${current} ${plural(current, ["день", "дня", "дней"])}, выполнено ${done} из ${total}`}
        className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-20 flex items-center gap-2 rounded-full border border-border-hairline bg-ink/85 py-1.5 pl-2.5 pr-3 shadow-key backdrop-blur-xl active:scale-95 sm:top-[5.5rem]"
      >
        <Flame lit={dayComplete} size={20} />
        <span className="font-mono text-body font-medium text-pure-white">{current}</span>
        <span className="flex gap-1" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < done ? "bg-coral-pulse" : "bg-graphite"}`} />
          ))}
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Ежедневные задания">
        <div className="flex items-center gap-3">
          <Flame lit={dayComplete} size={44} />
          <div>
            <p className="font-mono text-heading-sm font-medium text-pure-white">{current}</p>
            <p className="text-body text-ash">{plural(current, ["день", "дня", "дней"])} подряд</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-body">
            <span className="text-ash">Сегодня</span>
            <span className="font-mono text-pure-white">
              {done} / {total}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            aria-label="Выполнено заданий"
            className="mt-2 h-2 overflow-hidden rounded-full bg-graphite"
          >
            <div className="h-full rounded-full bg-coral-pulse transition-[width]" style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {DAILY_TASKS.map((t) => (
            <TaskRow
              key={t.id}
              id={t.id}
              label={t.label}
              note={t.id === "grammar" ? `Уроков главы: ${Math.min(grammarLessonsToday, CHAPTER_LESSONS)} из ${CHAPTER_LESSONS}` : undefined}
              done={status[t.id]}
              href={hrefs[t.id] ?? t.href}
            />
          ))}
        </ul>

        <p className="mt-4 text-body text-ash">
          {dayComplete ? "Все задания выполнены — день засчитан в серию." : "Выполните все три задания, чтобы день засчитался в серию."}
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-inputs border border-border-hairline p-3">
          <Snowflake />
          <div className="text-[14px] leading-snug text-ash">
            <p className="text-body font-medium text-pure-white">
              Заморозки: {freezes} из {MAX_FREEZES}
            </p>
            <p className="mt-1">
              Заморозка закрывает один пропущенный день, и серия не сбрасывается. Её дают за каждые {FREEZE_EVERY} дней
              подряд, хранить можно не больше {MAX_FREEZES}.
            </p>
          </div>
        </div>

        <PushToggle />

        <button type="button" onClick={() => setOpen(false)} className="btn-secondary mt-4 w-full">
          Закрыть
        </button>
      </Modal>
    </>
  );
}
