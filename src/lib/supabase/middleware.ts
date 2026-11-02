import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_OPTIONS } from "@/lib/supabase/cookie-options";
import { isPublicPath } from "@/lib/supabase/public-paths";

/**
 * Refreshes the session and guards the private pages. `csp` / `nonce` come from the proxy: the
 * page is rendered with the request's nonce and the response carries the matching policy.
 */
export async function updateSession(request: NextRequest, security: { csp: string; nonce: string }) {
  // Built from the request's *current* headers each time, so cookies refreshed below reach the render.
  const forward = () => {
    const headers = new Headers(request.headers);
    headers.set("x-nonce", security.nonce);
    headers.set("content-security-policy", security.csp);
    return NextResponse.next({ request: { headers } });
  };
  const sealed = <T extends NextResponse>(res: T): T => {
    res.headers.set("Content-Security-Policy", security.csp);
    return res;
  };

  let supabaseResponse = forward();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = forward();
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          // Cache-Control: no-store etc. — keeps a CDN from caching a response that carries a session.
          Object.entries(headers ?? {}).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
        },
      },
    }
  );

  // getClaims() verifies the JWT locally (no round trip to Supabase Auth on every request, unlike
  // getUser()) and still refreshes an expired session, writing the new cookies via setAll above.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return sealed(NextResponse.redirect(url));
  }

  return sealed(supabaseResponse);
}
