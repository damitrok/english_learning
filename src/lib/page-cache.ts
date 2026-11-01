// The service worker keeps copies of visited (personal) pages for offline use. They must not
// outlive the person who saw them: dropped on sign-out and whenever the sign-in page opens.

export async function clearPageCache(): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("pages-")).map((k) => caches.delete(k)));
  } catch {
    // Cache storage unavailable (private mode etc.) — nothing to clear.
  }
}
