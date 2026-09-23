"use client";

import { useOffline } from "next/offline";

/** Shown on every screen while offline; pending saves are retried automatically. */
export function OfflineBanner() {
  const isOffline = useOffline();
  if (!isOffline) return null;
  return (
    <div
      role="status"
      className="mx-auto w-full max-w-[1200px] px-4"
    >
      <p className="rounded-buttons border border-border-hairline bg-obsidian px-4 py-2 text-body text-ash">
        Нет сети. Ответы сохранятся автоматически, когда связь вернётся — не закрывай вкладку.
      </p>
    </div>
  );
}
