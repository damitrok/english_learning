"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { InstallScreen } from "@/components/InstallScreen";
import { parseUserAgent } from "@/lib/device";

const DISMISS_KEY = "pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * On a phone, in a regular browser tab (not the installed app), shows the install instructions
 * instead of the app. `initialPhone` comes from the server's User-Agent so the first paint is
 * already right; the browser then confirms it and checks whether the app is already installed.
 */
const subscribeNever = () => () => {};

function readEnvironment(): string {
  let dismissed = false;
  try {
    dismissed = localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    // storage blocked — just show the screen each time
  }
  return `${isStandalone() ? 1 : 0}${dismissed ? 1 : 0}`;
}

/**
 * On a phone, in a regular browser tab (not the installed app), shows the install instructions
 * instead of the app. `initialPhone` comes from the server's User-Agent so the first paint is
 * already right; the browser then confirms it and checks whether the app is already installed.
 */
export function InstallGate({ initialPhone, children }: { initialPhone: boolean; children: React.ReactNode }) {
  // "" on the server and during hydration (not known yet), then "<standalone><dismissed>".
  const env = useSyncExternalStore(subscribeNever, readEnvironment, () => "");
  const [skipped, setSkipped] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!initialPhone) return <>{children}</>;
  // Phone, but we haven't looked at the display mode yet: show nothing rather than flash the wrong screen.
  if (env === "") return <div className="h-full" aria-hidden />;

  const info = parseUserAgent(navigator.userAgent);
  if (env[0] === "1" || env[1] === "1" || installed || skipped || !info.isPhone) return <>{children}</>;

  function skip() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setSkipped(true);
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    if (outcome === "accepted") skip();
  }

  return <InstallScreen info={info} canPrompt={!!prompt} onInstall={install} onSkip={skip} />;
}
