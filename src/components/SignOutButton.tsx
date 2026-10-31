"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // The service worker keeps copies of visited pages for offline use — drop
    // them so the next person on this device can't open them.
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith("pages-")).map((k) => caches.delete(k)));
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={signOut} className={className}>
      Выйти
    </button>
  );
}
