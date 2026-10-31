import type { Metadata, Viewport } from "next";
// Self-hosted variable fonts (no network at build time); Inter includes Cyrillic.
import "@fontsource-variable/inter";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "English for IT",
  description: "Ежедневная практика технического английского: слова, грамматика, чтение, переводы.",
  appleWebApp: { capable: true, title: "English IT", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#040506",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-void-black text-pure-white">
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
