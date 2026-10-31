"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

const LINKS = [
  { href: "/", label: "Слова" },
  { href: "/path", label: "Путь" },
  { href: "/dashboard", label: "Прогресс" },
];

function TabIcon({ href }: { href: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  } as const;
  if (href === "/")
    return (
      <svg {...common}>
        <path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z" />
        <path d="M12 6.5v13" />
      </svg>
    );
  if (href === "/path")
    return (
      <svg {...common}>
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <path d="M8.5 18H14a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h5.5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

export function NavBar() {
  const pathname = usePathname();
  // Lessons are full-screen focus mode (they have their own × and action bar).
  if (pathname.startsWith("/session")) return null;

  return (
    <>
      {/* >= sm: glass top bar */}
      <header className="order-first mx-auto hidden w-full max-w-[1200px] shrink-0 px-4 py-4 sm:block">
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
          <SignOutButton className="rounded-buttons bg-mist px-3 py-2 text-body font-medium text-iron hover:opacity-90 transition-opacity" />
        </div>
      </header>

      {/* < sm: bottom tab bar (part of the flex column, not floating over the content) */}
      <nav
        aria-label="Основная навигация"
        className="pb-safe order-last shrink-0 border-t border-border-hairline bg-ink sm:hidden"
      >
        <ul className="mx-auto flex h-tabbar max-w-md">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="flex-1">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 text-[12px] font-medium transition-colors active:bg-white/5 ${
                    active ? "text-coral-pulse" : "text-ash"
                  }`}
                >
                  <TabIcon href={link.href} />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
