// Browser side of the daily reminders: permission, the push subscription and its registration
// on the server. Client-only (uses navigator); the server half is src/lib/push.ts.
import { removePushSubscription, savePushSubscription } from "@/lib/push";

export type PushState = "unsupported" | "denied" | "off" | "on";

export function pushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function currentSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.getRegistration();
  return (await registration?.pushManager.getSubscription()) ?? null;
}

async function register(sub: PushSubscription): Promise<boolean> {
  const { endpoint, keys } = sub.toJSON();
  if (!endpoint || !keys?.p256dh || !keys.auth) return false;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (await savePushSubscription(endpoint, keys.p256dh, keys.auth, tz)).ok;
}

/** Where things stand on this device; re-registers a known subscription (keeps the time zone fresh). */
export async function readPushState(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const sub = await currentSubscription();
  if (!sub || Notification.permission !== "granted") return "off";
  await register(sub).catch(() => false);
  return "on";
}

/** Asks for permission (must run from a click) and subscribes this device. */
export async function enablePush(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) return "unsupported";
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "off";
  const registration = await navigator.serviceWorker.ready;
  const sub =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) }));
  return (await register(sub)) ? "on" : "off";
}

/** Stops reminders to this device: forgotten on the server first (needs the session), then in the browser. */
export async function disablePush(): Promise<void> {
  if (!pushSupported()) return;
  const sub = await currentSubscription();
  if (!sub) return;
  await removePushSubscription(sub.endpoint);
  await sub.unsubscribe();
}
