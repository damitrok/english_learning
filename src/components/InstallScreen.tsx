"use client";

import Image from "next/image";
import { getInstallInstructions, type DeviceInfo, type InstallStep } from "@/lib/device";

function StepIcon({ icon }: { icon?: InstallStep["icon"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  switch (icon) {
    case "share":
      return (
        <svg {...common}>
          <path d="M12 15V3M8 7l4-4 4 4" />
          <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      );
    case "safari":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="6" y="2.5" width="12" height="19" rx="3" />
          <path d="M10.5 18.5h3" />
        </svg>
      );
    default:
      return null;
  }
}

/** Full-screen "install the app" instructions for phone browsers (the app is meant to run as a PWA). */
export function InstallScreen({
  info,
  canPrompt,
  onInstall,
  onSkip,
}: {
  info: DeviceInfo;
  canPrompt: boolean;
  onInstall: () => void;
  onSkip: () => void;
}) {
  const { title, steps, note } = getInstallInstructions(info, canPrompt);

  return (
    <div className="scroll-area h-full">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 pb-safe pt-[2rem]">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/icon-192.png"
            alt=""
            width={88}
            height={88}
            priority
            className="rounded-[22px] shadow-[0_6px_0_0_var(--color-graphite-edge)]"
          />
          <h1 className="mt-6 text-heading-sm font-medium text-pure-white">{title}</h1>
          <p className="mt-2 text-body text-ash">
            Так English for IT откроется как обычное приложение на весь экран — без адресной строки, и вход будет
            держаться дольше.
          </p>
        </div>

        <ol className="mt-[2rem] flex flex-col gap-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-cards border border-border-hairline bg-ink p-4 shadow-key"
            >
              <span className="flex h-[2rem] w-[2rem] shrink-0 items-center justify-center rounded-full bg-coral-pulse font-mono text-body font-semibold text-void-black">
                {i + 1}
              </span>
              <span className="flex-1 text-body leading-snug text-mist">{step.text}</span>
              {step.icon && (
                <span className="mt-0.5 shrink-0 text-coral-pulse">
                  <StepIcon icon={step.icon} />
                </span>
              )}
            </li>
          ))}
        </ol>

        {note && <p className="mt-4 text-body text-ash">{note}</p>}

        <div className="mt-auto flex flex-col gap-2 pt-[2rem]">
          {canPrompt && (
            <button type="button" onClick={onInstall} className="btn-primary">
              Установить приложение
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="min-h-12 text-body text-ash underline underline-offset-4"
          >
            Продолжить в браузере
          </button>
        </div>
      </div>
    </div>
  );
}
