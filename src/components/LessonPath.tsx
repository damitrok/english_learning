import Link from "next/link";
import { ScrollToCurrent } from "@/components/ScrollToCurrent";
import { buildPath, lessonCycle, LESSON_HINTS, LESSON_LABELS, UNIT_SIZE, type PathLesson } from "@/lib/path";

// Horizontal offsets (px) that make the nodes zigzag up the screen, one per lesson in a unit.
// Max |offset| + half a node (40) = 104px, well inside the 288px of a 320px screen.
const OFFSETS = [0, 40, 64, 40, 0, -40, -64];
const GAP = 44; // height of a trail between two nodes

function Icon({ lesson }: { lesson: PathLesson }) {
  const common = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  if (lesson.state === "done")
    return (
      <svg {...common} stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    );
  if (lesson.state === "current")
    return (
      <svg {...common} fill="currentColor">
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
      </svg>
    );
  return (
    <svg {...common} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="11" width="13" height="9" rx="2" />
      <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" />
    </svg>
  );
}

const NODE_STYLES: Record<PathLesson["state"], string> = {
  done: "bg-coral-pulse text-void-black shadow-[0_7px_0_0_var(--color-coral-edge)]",
  current: "bg-mist text-iron shadow-[0_7px_0_0_var(--color-mist-edge)]",
  locked: "bg-graphite text-smoke shadow-[0_7px_0_0_var(--color-graphite-edge)]",
};

const offsetOf = (lesson: PathLesson) => OFFSETS[(lesson.index % UNIT_SIZE) % OFFSETS.length];

/** Small trail from the node above (`from`) down to the node below (`to`); coral once `to` is done. */
function Trail({ from, to }: { from: PathLesson; to: PathLesson }) {
  const x1 = offsetOf(from);
  const x2 = offsetOf(to);
  const done = to.state === "done";
  return (
    <li aria-hidden className="flex justify-center" style={{ height: GAP }}>
      <svg width={200} height={GAP} viewBox={`-100 0 200 ${GAP}`} fill="none" className="shrink-0">
        <path
          d={`M${x1} 0 C${x1} ${GAP / 2} ${x2} ${GAP / 2} ${x2} ${GAP}`}
          stroke={done ? "var(--color-coral-pulse)" : "var(--color-slate)"}
          strokeWidth={done ? 6 : 5}
          strokeLinecap="round"
          strokeDasharray={done ? undefined : "0.1 11"}
        />
      </svg>
    </li>
  );
}

function Node({ lesson }: { lesson: PathLesson }) {
  const offset = offsetOf(lesson);
  const label = `${LESSON_LABELS[lesson.type]}${
    lesson.state === "done" ? ", пройден" : lesson.state === "locked" ? ", закрыт" : ""
  }`;
  const className = `relative flex h-20 w-20 items-center justify-center rounded-full transition-transform ${NODE_STYLES[lesson.state]}`;
  const current = lesson.state === "current";

  return (
    <li
      id={current ? "current-node" : undefined}
      className={`flex justify-center ${current ? "pt-12" : ""}`}
      style={{ transform: `translateX(${offset}px)` }}
    >
      <div className="relative">
        {current ? (
          <>
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-cards border border-border-hairline bg-ink px-4 py-2 text-body font-semibold uppercase tracking-wide text-coral-pulse shadow-key motion-safe:animate-bob" aria-hidden>
              Начать
              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border-hairline bg-ink" />
            </span>
            <span className="absolute inset-0 rounded-full bg-coral-pulse/50 motion-safe:animate-ping" aria-hidden />
            <span className="absolute -inset-1.5 rounded-full border-4 border-coral-pulse/60" aria-hidden />
            <Link
              href={`/session/${lesson.type}?n=${lessonCycle(lesson.index)}`}
              aria-label={`${label}. Начать урок`}
              className={`${className} z-10 active:translate-y-[7px] active:shadow-none`}
            >
              <Icon lesson={lesson} />
            </Link>
          </>
        ) : (
          <span role="img" aria-label={label} className={className}>
            <Icon lesson={lesson} />
          </span>
        )}
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1/2 w-[92px] -translate-y-1/2 text-[12px] leading-tight ${
            offset > 0 ? "right-full mr-3 text-right" : "left-full ml-3"
          } ${current ? "font-medium text-pure-white" : "text-smoke"}`}
        >
          {LESSON_LABELS[lesson.type]}
        </span>
      </div>
    </li>
  );
}

/** Duolingo-style path: lessons grow from the bottom up along a winding trail, grouped in sections. */
export function LessonPath({ completed }: { completed: number }) {
  const { finishedUnits, units } = buildPath(completed);
  const current = units[0].lessons.find((l) => l.state === "current");
  // Top to bottom on screen: the upcoming section first, the current one below it.
  const sections = [...units].reverse();

  return (
    <div className="flex flex-col gap-10">
      <ScrollToCurrent />
      {sections.map((unit) => {
        // First lesson at the bottom of its section.
        const lessons = [...unit.lessons].reverse();
        return (
          <section key={unit.number} aria-label={`Раздел ${unit.number}`}>
            <div className="rounded-large-cards bg-coral-pulse px-5 py-4 text-void-black shadow-[0_5px_0_0_var(--color-coral-edge)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-eyebrow font-semibold uppercase">Раздел {unit.number}</p>
                <span className="font-mono text-body font-medium">
                  {unit.done}/{UNIT_SIZE}
                </span>
              </div>
              <p className="mt-2 text-heading-sm font-semibold">
                {unit.number <= finishedUnits ? "Пройден" : `${unit.done} из ${UNIT_SIZE} уроков`}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-void-black/25" aria-hidden>
                <div
                  className="h-full rounded-full bg-void-black"
                  style={{ width: `${(unit.done / UNIT_SIZE) * 100}%` }}
                />
              </div>
            </div>
            <ol className="mt-8 flex flex-col">
              {lessons.flatMap((lesson, i) => [
                i > 0 ? <Trail key={`t${lesson.index}`} from={lessons[i - 1]} to={lesson} /> : null,
                <Node key={lesson.index} lesson={lesson} />,
              ])}
            </ol>
          </section>
        );
      })}
      {finishedUnits > 0 && (
        <p className="text-center text-body text-smoke">Пройдено разделов: {finishedUnits}</p>
      )}
      {current && (
        <p className="sr-only">
          Дальше: {LESSON_LABELS[current.type]} — {LESSON_HINTS[current.type]}
        </p>
      )}
    </div>
  );
}
