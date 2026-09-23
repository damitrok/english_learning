import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "English for IT",
    short_name: "English IT",
    description: "Ежедневная практика технического английского: слова, чтение, аудирование, беглость.",
    start_url: "/",
    display: "standalone",
    background_color: "#040506",
    theme_color: "#040506",
    lang: "ru",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
