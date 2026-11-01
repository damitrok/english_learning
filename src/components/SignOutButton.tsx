"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { clearPageCache } from "@/lib/page-cache";

export function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    // Drop the offline copies of visited pages first and regardless of whether the request
    // succeeds: the next person on this device must not be able to open them.
    await clearPageCache();
    try {
      await signOut();
    } finally {
      await clearPageCache();
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button onClick={handleSignOut} className={className}>
      Выйти
    </button>
  );
}
