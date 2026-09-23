import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Failed navigations / Server Actions wait for the network and retry
    // instead of throwing (vocab reviews made offline are sent later).
    useOffline: true,
  },
  async headers() {
    return [
      {
        // Always fetch the newest service worker (see public/sw.js).
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
