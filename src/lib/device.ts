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
  const finish: InstallStep = { text: "Откройте приложение с главного экрана и войдите — это нужно сделать один раз.", icon: "app" };

  if (info.browser === "inapp") {
    return {
      title: info.platform === "ios" ? "Откройте в Safari" : "Откройте в Chrome",
      steps: [
        {
          text:
            info.platform === "ios"
              ? "Нажмите «⋯» или иконку компаса в углу и выберите «Открыть в Safari»."
              : "Нажмите «⋮» в углу и выберите «Открыть в браузере» (Chrome).",
          icon: info.platform === "ios" ? "safari" : "menu",
        },
        { text: "Дальше установите приложение по подсказке на этом экране." },
      ],
      note: "Из встроенного браузера мессенджера или соцсети приложение установить нельзя.",
    };
  }

  if (info.platform === "ios") {
    const safari = info.browser === "safari";
    return {
      title: "Установите на iPhone",
      steps: [
        {
          text: safari
            ? "Нажмите «Поделиться» — квадрат со стрелкой в нижней панели Safari."
            : "Нажмите «Поделиться» — квадрат со стрелкой в адресной строке или в меню «⋯».",
          icon: "share",
        },
        { text: "Прокрутите список и выберите «На экран «Домой»».", icon: "plus" },
        { text: "Нажмите «Добавить» в правом верхнем углу." },
        finish,
      ],
      note: safari ? undefined : "Если пункта «На экран «Домой»» нет — откройте эту страницу в Safari.",
    };
  }

  if (info.platform === "android") {
    if (canPrompt) {
      return {
        title: "Установите на телефон",
        steps: [
          { text: "Нажмите «Установить приложение» ниже и подтвердите.", icon: "plus" },
          finish,
        ],
      };
    }
    const menu: Record<BrowserKind, string> = {
      chrome: "Откройте меню «⋮» справа от адресной строки и выберите «Установить приложение» (или «Добавить на главный экран»).",
      edge: "Откройте меню «⋯» внизу и выберите «Добавить на телефон».",
      firefox: "Откройте меню «⋮» и выберите «Установить».",
      samsung: "Откройте меню «≡» внизу и выберите «Добавить страницу на» → «Главный экран».",
      safari: "Откройте меню браузера и выберите «Добавить на главный экран».",
      inapp: "",
      other: "Откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран».",
    };
    return {
      title: "Установите на телефон",
      steps: [
        { text: menu[info.browser], icon: "menu" },
        { text: "Подтверди установку." },
        finish,
      ],
    };
  }

  return { title: "Установите приложение", steps: [{ text: "Откройте сайт с телефона и добавьте его на главный экран." }] };
}
