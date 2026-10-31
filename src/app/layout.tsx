import type { Metadata, Viewport } from "next";
// Self-hosted variable fonts (no network at build time); Inter includes Cyrillic.
import "@fontsource-variable/inter";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { headers } from "next/headers";
import { ServiceWorker } from "@/components/ServiceWorker";
import { InstallGate } from "@/components/InstallGate";
import { parseUserAgent } from "@/lib/device";

export const metadata: Metadata = {
  title: "English for IT",
  description: "Ежедневная практика технического английского: слова, грамматика, чтение, переводы.",
  appleWebApp: { capable: true, title: "English IT", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#040506",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialPhone = parseUserAgent((await headers()).get("user-agent")).isPhone;
  return (
    <html lang="ru" className="antialiased">
      <body className="bg-void-black text-pure-white">
        <ServiceWorker />
        <InstallGate initialPhone={initialPhone}>{children}</InstallGate>
      </body>
    </html>
  );
}
