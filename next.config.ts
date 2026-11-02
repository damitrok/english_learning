import type { NextConfig } from "next";
import { STATIC_SECURITY_HEADERS } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    // Compared with /api/version at runtime to detect a newer deployment.
    NEXT_PUBLIC_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
  },
  experimental: {
    // Failed navigations / Server Actions wait for the network and retry
    // instead of throwing (vocab reviews made offline are sent later).
    useOffline: true,
  },
  async headers() {
    return [
      // The per-request Content-Security-Policy is set in src/proxy.ts.
      { source: "/:path*", headers: [...STATIC_SECURITY_HEADERS] },
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
