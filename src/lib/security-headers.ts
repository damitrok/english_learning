// Security headers. The static ones are applied by next.config.ts; the Content-Security-Policy
// carries a fresh nonce per request, so the proxy builds it (see src/proxy.ts).

/** Headers that do not depend on the request. */
export const STATIC_SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
] as const;

/**
 * The page CSP. Scripts run only with the request's nonce (`strict-dynamic` lets Next's own loader
 * pull in its chunks). Inline style *attributes* (React `style={…}`) need `style-src-attr`; inline
 * `<style>` elements still need the nonce. Dev mode adds `unsafe-eval`, which React uses for
 * debugging information.
 */
export function buildCsp(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function newNonce(): string {
  return btoa(crypto.randomUUID());
}
