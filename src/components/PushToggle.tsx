"use client";

import { useEffect, useState } from "react";
import { disablePush, enablePush, readPushState, type PushState } from "@/lib/push-client";

const HINTS: Record<PushState, string> = {
  on: "Вечером напомним, если останутся невыполненные задания.",
  off: "Вечером напомним, если останутся невыполненные задания. Не чаще раза в день.",
  denied: "Уведомления запрещены в настройках браузера или телефона. Разрешите их для этого приложения.",
  unsupported:
    "Здесь напоминания недоступны. На iPhone установите приложение на экран «Домой» (iOS 16.4 и новее) и откройте его оттуда.",
};

/** Switch for the evening reminder on this device. */
export function PushToggle() {
  const [state, setState] = useState<PushState | "loading">("loading");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    readPushState()
      .catch((): PushState => "off")
      .then((s) => {
        if (!cancelled) setState(s);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle() {
    if (state !== "on" && state !== "off") return;
    setPending(true);
    setFailed(false);
    try {
      if (state === "on") {
        await disablePush();
        setState("off");
      } else {
        const next = await enablePush();
        setState(next);
        if (next === "off") setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  if (state === "loading") return null;
  const on = state === "on";
  const canToggle = state === "on" || state === "off";

  return (
    <div className="mt-4 rounded-inputs border border-border-hairline p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-body font-medium text-pure-white">Напоминания</p>
        {canToggle && (
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label="Напоминания"
            onClick={toggle}
            disabled={pending}
            className={`relative h-[1.75rem] w-[3rem] shrink-0 rounded-full transition-colors disabled:opacity-60 ${
              on ? "bg-coral-pulse" : "bg-graphite"
            }`}
          >
            <span
              className={`absolute top-[0.25rem] size-[1.25rem] rounded-full bg-pure-white transition-all ${
                on ? "left-[1.5rem]" : "left-[0.25rem]"
              }`}
            />
          </button>
        )}
      </div>
      <p className="mt-1 text-[14px] leading-snug text-ash">{HINTS[state]}</p>
      {failed && (
        <p role="alert" className="mt-2 text-[14px] text-coral-pulse">
          Не получилось. Проверьте разрешение на уведомления и попробуйте ещё раз.
        </p>
      )}
    </div>
  );
}
