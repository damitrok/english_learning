// User-agent based device detection for the "install the app" screen (pure, so it runs on the
// server for the first paint and in the browser alike, and is unit-tested).

export type Platform = "ios" | "android" | "other";
export type BrowserKind = "safari" | "chrome" | "firefox" | "edge" | "samsung" | "inapp" | "other";

export interface DeviceInfo {
  /** A phone (not a tablet or desktop). */
  isPhone: boolean;
  platform: Platform;
  browser: BrowserKind;
}

const IN_APP = /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Snapchat|TikTok|musical_ly|Twitter|LinkedInApp|Pinterest|GSA\//i;

export function parseUserAgent(ua: string | null | undefined): DeviceInfo {
  const s = ua ?? "";
  const ios = /iPhone|iPod/.test(s);
  const android = /Android/.test(s) && /Mobile/.test(s);
  const platform: Platform = ios ? "ios" : android ? "android" : "other";
  const isPhone = ios || android;

  let browser: BrowserKind = "other";
  if (IN_APP.test(s) || (android && /; wv\)/.test(s))) browser = "inapp";
  else if (ios) {
    if (/CriOS/.test(s)) browser = "chrome";
    else if (/FxiOS/.test(s)) browser = "firefox";
    else if (/EdgiOS/.test(s)) browser = "edge";
    // A WKWebView embedded in another app has no "Safari/" token.
    else if (/Safari\//.test(s)) browser = "safari";
    else browser = "inapp";
  } else if (android) {
    if (/SamsungBrowser/.test(s)) browser = "samsung";
    else if (/EdgA/.test(s)) browser = "edge";
    else if (/Firefox\//.test(s)) browser = "firefox";
    else if (/Chrome\//.test(s) && !/OPR\//.test(s)) browser = "chrome";
  }
  return { isPhone, platform, browser };
}

export interface InstallStep {
  text: string;
  /** Which small illustration to draw next to the step. */
  icon?: "share" | "plus" | "menu" | "app" | "safari";
}

export interface InstallInstructions {
  title: string;
  steps: InstallStep[];
  note?: string;
}

/**
 * What to tell the user to do in their browser. `canPrompt` is true on Chromium Android when the
 * browser handed us an install prompt (then a button is enough, the steps are a fallback).
 */
export function getInstallInstructions(info: DeviceInfo, canPrompt = false): InstallInstructions {
  const finish: InstallStep = { text: "Открой приложение с главного экрана и войди — это нужно сделать один раз.", icon: "app" };

  if (info.browser === "inapp") {
    return {
      title: info.platform === "ios" ? "Открой в Safari" : "Открой в Chrome",
      steps: [
        {
          text:
            info.platform === "ios"
              ? "Нажми «⋯» или иконку компаса в углу и выбери «Открыть в Safari»."
              : "Нажми «⋮» в углу и выбери «Открыть в браузере» (Chrome).",
          icon: info.platform === "ios" ? "safari" : "menu",
        },
        { text: "Дальше установи приложение по подсказке на этом экране." },
      ],
      note: "Из встроенного браузера мессенджера или соцсети приложение установить нельзя.",
    };
  }

  if (info.platform === "ios") {
    const safari = info.browser === "safari";
    return {
      title: "Установи на iPhone",
      steps: [
        {
          text: safari
            ? "Нажми «Поделиться» — квадрат со стрелкой в нижней панели Safari."
            : "Нажми «Поделиться» — квадрат со стрелкой в адресной строке или в меню «⋯».",
          icon: "share",
        },
        { text: "Прокрути список и выбери «На экран «Домой»».", icon: "plus" },
        { text: "Нажми «Добавить» в правом верхнем углу." },
        finish,
      ],
      note: safari ? undefined : "Если пункта «На экран «Домой»» нет — открой эту страницу в Safari.",
    };
  }

  if (info.platform === "android") {
    if (canPrompt) {
      return {
        title: "Установи на телефон",
        steps: [
          { text: "Нажми «Установить приложение» ниже и подтверди.", icon: "plus" },
          finish,
        ],
      };
    }
    const menu: Record<BrowserKind, string> = {
      chrome: "Открой меню «⋮» справа от адресной строки и выбери «Установить приложение» (или «Добавить на главный экран»).",
      edge: "Открой меню «⋯» внизу и выбери «Добавить на телефон».",
      firefox: "Открой меню «⋮» и выбери «Установить».",
      samsung: "Открой меню «≡» внизу и выбери «Добавить страницу на» → «Главный экран».",
      safari: "Открой меню браузера и выбери «Добавить на главный экран».",
      inapp: "",
      other: "Открой меню браузера и выбери «Установить приложение» или «Добавить на главный экран».",
    };
    return {
      title: "Установи на телефон",
      steps: [
        { text: menu[info.browser], icon: "menu" },
        { text: "Подтверди установку." },
        finish,
      ],
    };
  }

  return { title: "Установи приложение", steps: [{ text: "Открой сайт с телефона и добавь его на главный экран." }] };
}
