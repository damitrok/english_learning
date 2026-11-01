import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { buildCsp, newNonce } from "@/lib/security-headers";

export function proxy(request: NextRequest) {
  const nonce = newNonce();
  return updateSession(request, { nonce, csp: buildCsp(nonce, process.env.NODE_ENV === "development") });
}

export const config = {
  matcher: [
    // PWA files (service worker, manifest, offline page) must load without a session.
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.webmanifest|offline\\.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
