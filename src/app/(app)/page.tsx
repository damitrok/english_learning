import { StepCard } from "@/components/StepCard";

const STEPS = [
  {
    step: 1,
    strand: "Осознанное изучение",
    minutes: 10,
    description:
      "SRS-карточки: слова на повтор по алгоритму + несколько новых. 2-3 раза в неделю — блок грамматики.",
    href: "/session/vocab",
    secondary: { href: "/session/grammar", label: "Грамматика" },
  },
  {
    step: 2,
    strand: "Понятный ввод — чтение",
    minutes: 10,
    description: "Короткий текст под текущий уровень, читается ради смысла.",
    href: "/session/reading",
  },
  {
    step: 3,
    strand: "Вывод + аудирование",
    minutes: 10,
    description: "Короткий диалог: сначала слушаешь, потом повторяешь вслух за диктором (shadowing).",
    href: "/session/listening",
  },
  {
    step: 4,
    strand: "Беглость",
    minutes: 5,
    description: "Быстрое повторное чтение вчерашнего текста без словаря.",
    href: "/session/fluency",
  },
] as const;

export default function TodayPage() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Сегодня</p>
        <h1 className="mt-2 text-heading font-normal text-pure-white">
          0 дней подряд
        </h1>
        <p className="mt-2 text-body text-ash">
          Пройди все 4 шага, чтобы засчитать день. ≈ 35 минут.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {STEPS.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </div>
    </div>
  );
}
