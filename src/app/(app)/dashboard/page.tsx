import { getDashboard, type DashboardData } from "@/lib/overview";
import { plural } from "@/lib/plural";
import { SignOutButton } from "@/components/SignOutButton";

const STRANDS: { key: keyof DashboardData["minutesLast7"]; label: string }[] = [
  { key: "vocab", label: "Слова" },
  { key: "grammar", label: "Грамматика" },
  { key: "reading", label: "Чтение" },
  { key: "practice", label: "Практика" },
];

// Sequential single hue (electric sky) for "how many lessons that day": empty → full (3+ = streak day).
const CELL_TONES = [
  "bg-graphite",
  "bg-electric-sky/25",
  "bg-electric-sky/50",
  "bg-electric-sky/75",
  "bg-electric-sky",
];

const WEEKDAYS = ["Пн", "", "Ср", "", "Пт", "", "Вс"];

export default async function DashboardPage() {
  const data = await getDashboard();
  if (!data) return null;

  const weeks = Array.from({ length: 12 }, (_, w) => data.calendar.slice(w * 7, w * 7 + 7));
  const total7 = STRANDS.reduce((sum, s) => sum + data.minutesLast7[s.key], 0);
  const max30 = Math.max(1, ...STRANDS.map((s) => data.minutesLast30[s.key]));

  return (
    <div className="flex flex-col gap-6 py-2 sm:gap-[2rem] sm:py-4">
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Прогресс</p>
        <h1 className="mt-2 text-heading font-normal text-pure-white">Дашборд</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat
          label="Серия"
          value={data.streak.current}
          unit={plural(data.streak.current, ["день", "дня", "дней"])}
          note={`рекорд ${data.streak.longest} · всего дней ${data.daysCompleted}`}
        />
        <Stat
          label="Слов выучено"
          value={data.words.learned}
          unit={`из ${data.words.total}`}
          note={`в работе ${data.words.started - data.words.learned} · на повтор ${data.words.due}`}
        />
        <Stat
          label="Грамматика"
          value={data.grammar.mastered}
          unit={`из ${data.grammar.total} тем`}
          note={
            data.grammar.recentAccuracy === null
              ? "ещё нет ответов"
              : `точность последних ответов ${data.grammar.recentAccuracy}%`
          }
        />
        <Stat
          label="За 7 дней"
          value={total7}
          unit={plural(total7, ["минута", "минуты", "минут"])}
          note={`тексты прочитано ${data.reading.textsRead} из ${data.reading.textsTotal}`}
        />
      </div>

      <section className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-6">
        <h2 className="text-subheading font-medium text-pure-white">Активность за 12 недель</h2>
        <p className="mt-1 text-body text-ash">Каждая клетка — день, яркость — сколько уроков пройдено. 3 урока — день в серии.</p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <div className="grid grid-rows-7 gap-1 pr-1 text-[12px] leading-none text-smoke">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="flex h-4 items-center">
                {d}
              </span>
            ))}
          </div>
          {weeks.map((week, w) => (
            <div key={w} className="grid grid-rows-7 gap-1">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={day.future ? day.date : `${day.date}: уроков ${day.lessons}`}
                  aria-label={day.future ? undefined : `${day.date}: уроков ${day.lessons}`}
                  className={`h-4 w-4 rounded-[3px] ${
                    day.future ? "bg-transparent" : CELL_TONES[Math.min(day.lessons, 4)]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-smoke">
          <span>0</span>
          {CELL_TONES.map((tone) => (
            <span key={tone} className={`h-3 w-3 rounded-[3px] ${tone}`} aria-hidden />
          ))}
          <span>4+ урока</span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-cards border border-border-hairline bg-ink p-5 shadow-key sm:p-6">
          <h2 className="text-subheading font-medium text-pure-white">Время по направлениям</h2>
          <p className="mt-1 text-body text-ash">Минуты за последние 30 дней.</p>
          <div className="mt-4 flex flex-col gap-3">
            {STRANDS.map((s) => {
              const minutes = data.minutesLast30[s.key];
              return (
                <div key={s.key} className="grid grid-cols-[96px_1fr_48px] items-center gap-3">
                  <span className="text-body text-ash">{s.label}</span>
                  <div className="h-2 rounded-full bg-graphite">
                    <div
                      className="h-2 rounded-full bg-electric-sky"
                      style={{ width: `${(minutes / max30) * 100}%` }}
                      title={`${s.label}: ${minutes} мин`}
                    />
                  </div>
                  <span className="text-right font-mono text-body text-mist">{minutes}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <SignOutButton className="btn-secondary w-full text-ash sm:hidden" />
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: number;
  unit: string;
  note: string;
}) {
  return (
    <div className="rounded-cards border border-border-hairline bg-ink p-4 shadow-key sm:p-5">
      <p className="text-body text-ash">{label}</p>
      <p className="mt-2 text-heading-sm font-medium text-pure-white">
        {value} <span className="text-body font-normal text-smoke">{unit}</span>
      </p>
      <p className="mt-1 text-[13px] leading-snug text-smoke">{note}</p>
    </div>
  );
}
