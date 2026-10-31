import Link from "next/link";
import type { StepName } from "@/lib/dates";
import { SessionFrame } from "@/components/SessionFrame";

/** End-of-lesson screen: result message and the way back to the path. */
export function StepComplete({
  message,
  children,
}: {
  step: StepName;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <SessionFrame
      progress={1}
      width="max-w-md"
      footer={
        <Link href="/" className="btn-primary">
          Продолжить
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span
          className="flex h-[6rem] w-[6rem] items-center justify-center rounded-full bg-success-green text-[44px] font-medium text-void-black shadow-[0_6px_0_0_#2f8a62] motion-safe:animate-pop"
          aria-hidden
        >
          ✓
        </span>
        <p className="text-heading-sm font-medium text-pure-white">Урок пройден!</p>
        <p className="text-body-lg text-ash">{message}</p>
        {children}
      </div>
    </SessionFrame>
  );
}
