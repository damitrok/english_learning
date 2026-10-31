import { NavBar } from "@/components/NavBar";
import { TimezoneCookie } from "@/components/TimezoneCookie";
import { OfflineBanner } from "@/components/OfflineBanner";

// Fixed full-screen shell: nav bars sit in the flex column (top bar on desktop, tab bar on
// phones, see NavBar) and only <main> scrolls.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <TimezoneCookie />
      <NavBar />
      <OfflineBanner />
      <main className="scroll-area mx-auto w-full max-w-[1200px] flex-1 px-4 pb-6 sm:pb-[4rem]">{children}</main>
    </div>
  );
}
