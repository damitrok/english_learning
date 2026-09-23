import { NavBar } from "@/components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col gap-8 pb-16">
      <NavBar />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4">{children}</main>
    </div>
  );
}
