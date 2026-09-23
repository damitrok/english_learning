"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/", label: "Сегодня" },
  { href: "/dashboard", label: "Прогресс" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-4 z-10 mx-auto w-full max-w-[1200px] px-4">
      <div className="flex items-center justify-between rounded-buttons border border-border-hairline bg-ink/70 px-4 py-2 backdrop-blur-2xl">
        <span className="flex items-center gap-2 text-body font-medium text-pure-white">
          <span className="h-2 w-2 rounded-full bg-coral-pulse" aria-hidden />
          English for IT
        </span>
        <nav className="flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-pure-white text-body-lg font-medium"
                  : "text-ash text-body-lg hover:text-pure-white transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="rounded-buttons bg-mist px-3 py-2 text-body font-medium text-iron hover:opacity-90 transition-opacity"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
