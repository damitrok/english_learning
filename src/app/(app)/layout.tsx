import { NavBar } from "@/components/NavBar";
import { TimezoneCookie } from "@/components/TimezoneCookie";
import { OfflineBanner } from "@/components/OfflineBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 pb-[calc(var(--spacing-tabbar)+1.5rem)] sm:gap-8 sm:pb-16">
      <TimezoneCookie />
      <NavBar />
      <OfflineBanner />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4">{children}</main>
    </div>
  );
}
