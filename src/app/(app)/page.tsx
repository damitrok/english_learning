import { StepCard } from "@/components/StepCard";
import { getTodayOverview } from "@/lib/overview";
import { plural } from "@/lib/plural";

const STEPS = [
  {
    step: 1,
    key: "vocab",
    strand: "Осознанное изучение",
    minutes: 10,
    description:
      "SRS-карточки: слова на повтор по алгоритму + несколько новых. 2-3 раза в неделю — блок грамматики.",
    href: "/session/vocab",
    secondary: { href: "/session/grammar", label: "Грамматика" },
  },
  {
    step: 2,
    key: "reading",
    strand: "Понятный ввод — чтение",
    minutes: 10,
    description: "Короткий текст под текущий уровень, читается ради смысла.",
    href: "/session/reading",
  },
  {
    step: 3,
    key: "listening",
    strand: "Вывод + аудирование",
    minutes: 10,
    description: "Короткий диалог: сначала слушаешь, потом повторяешь вслух за диктором (shadowing).",
    href: "/session/listening",
  },
  {
    step: 4,
    key: "fluency",
    strand: "Беглость",
    minutes: 5,
    description: "Быстрое повторное чтение вчерашнего текста без словаря.",
    href: "/session/fluency",
  },
] as const;

export default async function TodayPage() {
  const { stepsDone, dayComplete, streak } = await getTodayOverview();
  const doneCount = STEPS.filter((s) => stepsDone.includes(s.key)).length;
  const nextStep = STEPS.find((s) => !stepsDone.includes(s.key));

  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Сегодня</p>
        <h1 className="mt-2 text-heading font-normal text-pure-white">
          {streak} {plural(streak, ["день", "дня", "дней"])} подряд
        </h1>
        <p className="mt-2 text-body text-ash">
          {dayComplete
            ? "День засчитан — все 4 шага пройдены. Отличная работа!"
            : `Пройдено шагов: ${doneCount} из 4. Пройди все, чтобы засчитать день (≈ 35 минут). Выходные без занятий серию не прерывают.`}
        </p>
        {stepsDone.includes("grammar") && (
          <p className="mt-1 text-body text-success-green">✓ Грамматика сегодня тоже есть</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {STEPS.map(({ key, ...s }) => (
          <StepCard
            key={s.step}
            {...s}
            done={stepsDone.includes(key)}
            highlighted={nextStep?.key === key}
          />
        ))}
      </div>
    </div>
  );
}
