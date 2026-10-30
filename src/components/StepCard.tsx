import Link from "next/link";

interface StepCardProps {
  step: number;
  strand: string;
  minutes: number;
  description: string;
  href?: string;
  /** Optional second action on the same step, e.g. grammar inside step 1. */
  secondary?: { href: string; label: string };
  /** Step already finished today. */
  done?: boolean;
  /** The step to do next — gets the accent. */
  highlighted?: boolean;
}

export function StepCard({
  step,
  strand,
  minutes,
  description,
  href,
  secondary,
  done = false,
  highlighted = false,
}: StepCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-cards border bg-ink p-6 shadow-key ${
        highlighted ? "border-ash" : "border-border-hairline"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-icon-container text-body font-medium ${
            done ? "bg-success-green text-void-black" : "bg-obsidian text-mist"
          }`}
          aria-label={done ? `Шаг ${step} пройден` : `Шаг ${step}`}
        >
          {done ? "✓" : step}
        </span>
        <span className="rounded-badges bg-graphite px-2 py-1 font-mono text-[12px] text-ash">
          {done ? "пройдено" : `${minutes} мин`}
        </span>
      </div>
      <div>
        <h3 className="text-subheading font-medium text-pure-white">{strand}</h3>
        <p className="mt-1 text-body text-ash">{description}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-3">
        {href ? (
          <Link
            href={href}
            className={
              done
                ? "rounded-buttons border border-border-hairline px-4 py-3 text-body font-medium text-pure-white hover:bg-white/5"
                : "rounded-buttons bg-mist px-4 py-3 text-body font-medium text-iron hover:opacity-90"
            }
          >
            {done ? "Ещё раз" : "Начать"}
          </Link>
        ) : (
          <button
            disabled
            title="Появится в следующих фазах разработки"
            className="rounded-buttons bg-mist px-4 py-3 text-body font-medium text-iron opacity-40"
          >
            Начать
          </button>
        )}
        {secondary && (
          <Link
            href={secondary.href}
            className="rounded-buttons border border-border-hairline px-4 py-3 text-body font-medium text-pure-white hover:bg-white/5"
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
