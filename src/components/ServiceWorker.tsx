"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js in production builds (dev keeps plain network behaviour) and keeps an
 * installed app fresh: whenever the app comes back to the foreground it checks for a new service
 * worker and for a newer deployment, and reloads once if it finds one — an installed PWA can
 * otherwise stay on the build it was opened with for days.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((r) => (registration = r))
      .catch(() => {});

    async function checkForUpdate() {
      if (document.visibilityState !== "visible") return;
      registration?.update().catch(() => {});
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const { id } = (await res.json()) as { id: string };
        if (id !== "dev" && id !== process.env.NEXT_PUBLIC_BUILD_ID) window.location.reload();
      } catch {
        // offline or no network — keep what we have
      }
    }

    document.addEventListener("visibilitychange", checkForUpdate);
    return () => document.removeEventListener("visibilitychange", checkForUpdate);
  }, []);
  return null;
}
