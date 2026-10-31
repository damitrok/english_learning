import { LessonPath } from "@/components/LessonPath";
import { LESSONS_PER_DAY } from "@/lib/dates";
import { getPathOverview } from "@/lib/overview";
import { plural } from "@/lib/plural";

export default async function PathPage() {
  const { lessonsCompleted, lessonsToday, streak, dayComplete } = await getPathOverview();
  const progress = Math.min(lessonsToday, LESSONS_PER_DAY);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-2 sm:gap-8 sm:py-4">
      <div className="rounded-cards border border-border-hairline bg-ink p-4 shadow-key sm:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-heading-sm font-medium text-pure-white">
            {streak} {plural(streak, ["день", "дня", "дней"])} подряд
          </h1>
          <span className="font-mono text-body text-ash">
            {progress}/{LESSONS_PER_DAY}
          </span>
        </div>
        <div className="mt-3 flex gap-2" aria-hidden>
          {Array.from({ length: LESSONS_PER_DAY }, (_, i) => (
            <span
              key={i}
              className={`h-3 flex-1 rounded-full ${i < progress ? "bg-coral-pulse" : "bg-graphite"}`}
            />
          ))}
        </div>
        <p className="mt-3 text-body text-ash">
          {dayComplete
            ? "День засчитан! Можно продолжать — уроков в день сколько угодно."
            : `Пройди ещё ${LESSONS_PER_DAY - progress} ${plural(LESSONS_PER_DAY - progress, ["урок", "урока", "уроков"])}, чтобы засчитать день.`}
        </p>
      </div>
      <LessonPath completed={lessonsCompleted} />
    </div>
  );
}
