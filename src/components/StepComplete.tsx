import Link from "next/link";
import type { StepName } from "@/lib/dates";

// Where to go after each step: the daily order is vocab → reading → listening →
// fluency; grammar is an optional add-on to step 1, so it also leads to reading.
const NEXT: Record<StepName, { href: string; label: string } | null> = {
  vocab: { href: "/session/reading", label: "Дальше: чтение →" },
  grammar: { href: "/session/reading", label: "Дальше: чтение →" },
  reading: { href: "/session/listening", label: "Дальше: аудирование →" },
  listening: { href: "/session/fluency", label: "Дальше: беглость →" },
  fluency: null,
};

/** End-of-step screen: result message, the next step, and a way back to «Сегодня». */
export function StepComplete({
  step,
  message,
  children,
}: {
  step: StepName;
  message: string;
  children?: React.ReactNode;
}) {
  const next = NEXT[step];
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-12 text-center">
      <p className="text-body-lg text-pure-white">{message}</p>
      {children}
      <div className="flex flex-wrap justify-center gap-3">
        {next && (
          <Link
            href={next.href}
            className="rounded-buttons bg-mist px-4 py-3 text-body font-medium text-iron"
          >
            {next.label}
          </Link>
        )}
        {step === "vocab" && (
          <Link
            href="/session/grammar"
            className="rounded-buttons border border-border-hairline px-4 py-3 text-body font-medium text-pure-white hover:bg-white/5"
          >
            Грамматика
          </Link>
        )}
        <Link
          href="/"
          className={
            next
              ? "rounded-buttons border border-border-hairline px-4 py-3 text-body font-medium text-pure-white hover:bg-white/5"
              : "rounded-buttons bg-mist px-4 py-3 text-body font-medium text-iron"
          }
        >
          {next ? "К «Сегодня»" : "Вернуться к «Сегодня»"}
        </Link>
      </div>
    </div>
  );
}
