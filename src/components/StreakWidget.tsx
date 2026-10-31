import Link from "next/link";
import { LESSONS_PER_DAY } from "@/lib/dates";
import { plural } from "@/lib/plural";

/** Small pill pinned to the top-right corner: streak days + today's progress toward the next day. */
export function StreakWidget({
  streak,
  lessonsToday,
  dayComplete,
}: {
  streak: number;
  lessonsToday: number;
  dayComplete: boolean;
}) {
  const progress = Math.min(lessonsToday, LESSONS_PER_DAY);
  return (
    <Link
      href="/dashboard"
      aria-label={`Серия: ${streak} ${plural(streak, ["день", "дня", "дней"])} подряд. Сегодня пройдено ${progress} из ${LESSONS_PER_DAY} уроков${dayComplete ? ", день засчитан" : ""}`}
      className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-20 flex items-center gap-2 rounded-full border border-border-hairline bg-ink/85 py-1.5 pl-2.5 pr-3 shadow-key backdrop-blur-xl active:scale-95 sm:top-[5.5rem]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden
        className={dayComplete ? "text-coral-pulse" : "text-smoke"}
        fill="currentColor"
      >
        <path d="M12.6 2.2c.3 2.6-.7 4.2-2 5.7C9 9.6 7 11.4 7 14.6 7 18 9.2 20.5 12 20.5s5-2.4 5-5.7c0-2-.9-3.5-1.8-4.7-.3 1.2-1 2-1.9 2.3.5-3.5-.4-7.2-.7-10.2z" />
      </svg>
      <span className="font-mono text-body font-medium text-pure-white">{streak}</span>
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: LESSONS_PER_DAY }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i < progress ? "bg-coral-pulse" : "bg-graphite"}`}
          />
        ))}
      </span>
    </Link>
  );
}
