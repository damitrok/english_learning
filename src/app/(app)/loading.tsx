"use client";

import { useOffline } from "next/offline";

// Route-level shell: shown while a screen loads — and, offline, while
// experimental.useOffline waits for the network to finish the navigation.
export default function Loading() {
  const isOffline = useOffline();
  return (
    <p className="py-16 text-center text-body text-ash">
      {isOffline ? "Нет сети — экран загрузится, когда связь вернётся…" : "Загрузка…"}
    </p>
  );
}
