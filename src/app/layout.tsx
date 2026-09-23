import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "English for IT",
  description: "Ежедневная практика технического английского: слова, чтение, аудирование, беглость.",
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
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void-black text-pure-white">
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
