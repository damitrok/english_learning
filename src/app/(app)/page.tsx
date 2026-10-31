import Link from "next/link";
import { StreakWidget } from "@/components/StreakWidget";
import { getPathOverview } from "@/lib/overview";
import { plural } from "@/lib/plural";
import { getWordsOverview } from "@/lib/words";
import { NEW_PER_SESSION, WORD_TARGET } from "@/lib/word-queue";

const HOW_IT_WORKS = [
  "Слово появляется снова через 1, 3, 7 дней и дальше всё реже — ровно тогда, когда ты начинаешь его забывать.",
  "Ты не листаешь карточки, а сам вспоминаешь и пишешь слово — так оно запоминается лучше всего.",
  "Ошибки возвращаются в конце занятия, а старые слова проверяются ещё и в предложении.",
];

export default async function WordsPage() {
  const [words, path] = await Promise.all([getWordsOverview(), getPathOverview()]);
  if (!words) return null;

  const { due, newRemainingToday, learned, learning, byLevel } = words;
  const allDone = due === 0 && newRemainingToday === 0;
  const canLearn = due > 0 || newRemainingToday > 0;
  const target = Math.max(WORD_TARGET, words.total);
  const learnedPct = (learned / target) * 100;
  const learningPct = (learning / target) * 100;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 sm:pt-4">
      <StreakWidget streak={path.streak} lessonsToday={path.lessonsToday} dayComplete={path.dayComplete} />

      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Словарь</p>
        <h1 className="mt-2 text-heading font-normal text-pure-white">Слова</h1>
      </div>

      <section className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key">
        <h2 className="text-subheading font-medium text-pure-white">Сегодня</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-inputs bg-white/5 p-3">
            <dt className="text-body text-ash">Повторить</dt>
            <dd className="mt-1 font-mono text-heading-sm font-medium text-pure-white">{due}</dd>
          </div>
          <div className="rounded-inputs bg-white/5 p-3">
            <dt className="text-body text-ash">Новых слов</dt>
            <dd className="mt-1 font-mono text-heading-sm font-medium text-pure-white">{newRemainingToday}</dd>
          </div>
        </dl>
        <p className="mt-4 text-body text-ash">
          {allDone
            ? "На сегодня всё готово. Можно выучить ещё слов — или вернуться завтра."
            : due > 0
              ? `Занятие — до 20 повторов и до ${NEW_PER_SESSION} новых слов.`
              : "Повторов нет — самое время взять новые слова."}
        </p>
        <Link
          href={allDone ? "/session/vocab?more=1" : "/session/vocab"}
          className="btn-primary mt-4"
        >
          {allDone ? `Выучить ещё ${NEW_PER_SESSION} ${plural(NEW_PER_SESSION, ["слово", "слова", "слов"])}` : canLearn ? "Учить слова" : "Учить"}
        </Link>
      </section>

      <section className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key">
        <h2 className="text-subheading font-medium text-pure-white">Путь к B1</h2>
        <p className="mt-3 text-body text-ash">
          <span className="font-mono text-heading-sm font-medium text-pure-white">{learned}</span> из ~{target} слов выучено
        </p>
        <div
          role="progressbar"
          aria-label="Выучено слов"
          aria-valuemin={0}
          aria-valuemax={target}
          aria-valuenow={learned}
          className="mt-3 flex h-3 overflow-hidden rounded-full bg-graphite"
        >
          <div className="h-full bg-coral-pulse" style={{ width: `${learnedPct}%` }} />
          <div className="h-full bg-coral-pulse/40" style={{ width: `${learningPct}%` }} />
        </div>
        <p className="mt-2 text-[13px] text-smoke">
          В работе: {learning}. «Выучено» — слово, которое ты уверенно помнишь больше трёх недель. Для уверенного B1 нужно
          около {WORD_TARGET} слов.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {byLevel.map((l) => (
            <li key={l.level} className="grid grid-cols-[2.5rem_1fr_5rem] items-center gap-3">
              <span className="font-mono text-body text-ash">{l.level}</span>
              <div className="h-2 overflow-hidden rounded-full bg-graphite">
                <div className="h-full rounded-full bg-electric-sky" style={{ width: `${(l.learned / l.total) * 100}%` }} />
              </div>
              <span className="text-right font-mono text-[13px] text-smoke">
                {l.learned}/{l.total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-cards border border-border-hairline bg-ink p-5">
        <h2 className="text-subheading font-medium text-pure-white">Как мы учим слова</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {HOW_IT_WORKS.map((t) => (
            <li key={t} className="flex gap-3 text-body text-ash">
              <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral-pulse" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
