import Link from "next/link";

/**
 * Full-screen lesson chrome for one-handed use: a thin progress bar with a
 * close (×) back to the path on top, and the primary action pinned to the
 * bottom edge (thumb zone).
 */
export function SessionFrame({
  progress,
  footer,
  width = "max-w-xl",
  children,
}: {
  /** 0..1 */
  progress: number;
  footer?: React.ReactNode;
  width?: string;
  children: React.ReactNode;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div className={`mx-auto flex w-full flex-col ${width}`}>
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-void-black/90 px-2 backdrop-blur-xl">
        <Link
          href="/"
          aria-label="Закрыть урок и вернуться к пути"
          className="flex h-tap w-tap shrink-0 items-center justify-center rounded-full text-ash active:bg-white/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Link>
        <div
          role="progressbar"
          aria-label="Прогресс урока"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="mr-3 h-3 flex-1 overflow-hidden rounded-full bg-graphite"
        >
          <div
            className="h-full rounded-full bg-coral-pulse motion-safe:transition-[width] motion-safe:duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 pb-actionbar pt-4">{children}</div>

      {footer && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t border-border-hairline bg-void-black/95 backdrop-blur-xl">
          <div className={`mx-auto w-full px-4 py-3 ${width}`}>{footer}</div>
        </div>
      )}
    </div>
  );
}

/** Nothing-to-do screen with a way back to the path. */
export function SessionEmpty({ message }: { message: string }) {
  return (
    <SessionFrame
      progress={0}
      width="max-w-md"
      footer={
        <Link href="/" className="btn-primary">
          Вернуться к пути
        </Link>
      }
    >
      <p className="py-10 text-center text-body-lg text-pure-white">{message}</p>
    </SessionFrame>
  );
}
