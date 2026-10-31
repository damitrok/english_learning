import { describe, expect, it } from "vitest";
import { getInstallInstructions, parseUserAgent } from "@/lib/device";

const UA = {
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  iphoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.153 Mobile/15E148 Safari/604.1",
  iphoneFirefox:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/127.0 Mobile/15E148 Safari/605.1.15",
  iphoneInstagram:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 330.0.0.35.108",
  iphoneWebView:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  androidSamsung:
    "Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36",
  androidFirefox: "Mozilla/5.0 (Android 14; Mobile; rv:127.0) Gecko/127.0 Firefox/127.0",
  androidWebView:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.0.0 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  ipad: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  desktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
};

describe("parseUserAgent", () => {
  it("detects iPhone browsers", () => {
    expect(parseUserAgent(UA.iphoneSafari)).toEqual({ isPhone: true, platform: "ios", browser: "safari" });
    expect(parseUserAgent(UA.iphoneChrome)).toMatchObject({ platform: "ios", browser: "chrome" });
    expect(parseUserAgent(UA.iphoneFirefox)).toMatchObject({ platform: "ios", browser: "firefox" });
  });
  it("detects in-app browsers on iOS and Android", () => {
    expect(parseUserAgent(UA.iphoneInstagram).browser).toBe("inapp");
    expect(parseUserAgent(UA.iphoneWebView).browser).toBe("inapp");
    expect(parseUserAgent(UA.androidWebView).browser).toBe("inapp");
  });
  it("detects Android phone browsers", () => {
    expect(parseUserAgent(UA.androidChrome)).toEqual({ isPhone: true, platform: "android", browser: "chrome" });
    expect(parseUserAgent(UA.androidSamsung).browser).toBe("samsung");
    expect(parseUserAgent(UA.androidFirefox).browser).toBe("firefox");
  });
  it("does not treat tablets or desktops as phones", () => {
    for (const ua of [UA.androidTablet, UA.ipad, UA.desktop, "", null, undefined]) {
      expect(parseUserAgent(ua).isPhone).toBe(false);
    }
  });
});

describe("getInstallInstructions", () => {
  it("explains Share → Add to Home Screen for Safari on iPhone", () => {
    const i = getInstallInstructions(parseUserAgent(UA.iphoneSafari));
    expect(i.steps.map((s) => s.text).join(" ")).toMatch(/Поделиться/);
    expect(i.steps.map((s) => s.text).join(" ")).toMatch(/На экран «Домой»/);
    expect(i.note).toBeUndefined();
  });
  it("tells other iPhone browsers to fall back to Safari", () => {
    expect(getInstallInstructions(parseUserAgent(UA.iphoneChrome)).note).toMatch(/Safari/);
  });
  it("asks to leave an in-app browser first", () => {
    expect(getInstallInstructions(parseUserAgent(UA.iphoneInstagram)).title).toMatch(/Safari/);
    expect(getInstallInstructions(parseUserAgent(UA.androidWebView)).title).toMatch(/Chrome/);
  });
  it("uses the install button when Android offers a prompt, and a menu path otherwise", () => {
    const info = parseUserAgent(UA.androidChrome);
    expect(getInstallInstructions(info, true).steps[0].text).toMatch(/Установить приложение/);
    expect(getInstallInstructions(info, false).steps[0].text).toMatch(/меню/i);
  });
  it("always ends with opening the installed app", () => {
    for (const ua of [UA.iphoneSafari, UA.androidChrome, UA.androidSamsung]) {
      const steps = getInstallInstructions(parseUserAgent(ua)).steps;
      expect(steps.at(-1)?.text).toMatch(/главного экрана/);
    }
  });
});
