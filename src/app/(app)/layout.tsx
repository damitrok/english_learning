import { NavBar } from "@/components/NavBar";
import { TimezoneCookie } from "@/components/TimezoneCookie";
import { OfflineBanner } from "@/components/OfflineBanner";
import { UserMenu } from "@/components/UserMenu";
import { FeedbackButton } from "@/components/FeedbackButton";

// Fixed full-screen shell: nav bars sit in the flex column (top bar on desktop, tab bar on
// phones, see NavBar) and only <main> scrolls.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <TimezoneCookie />
      <NavBar />
      <OfflineBanner />
      {/* Round buttons in the bottom-right corner; on phones they sit above the tab bar. */}
      <div className="fixed right-4 bottom-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom)+0.75rem)] z-30 flex flex-col items-end gap-2 sm:bottom-[1.5rem]">
        <FeedbackButton />
        <UserMenu />
      </div>
      <main className="scroll-area mx-auto w-full max-w-[1200px] flex-1 px-4 pb-6 sm:pb-[4rem]">{children}</main>
    </div>
  );
}
