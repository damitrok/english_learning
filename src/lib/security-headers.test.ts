import { describe, expect, it } from "vitest";
import { buildCsp, newNonce } from "./security-headers";

describe("buildCsp", () => {
  const csp = buildCsp("abc123", false);
  it("allows scripts only with the nonce, never inline or eval in production", () => {
    expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
  });
  it("forbids framing, plugins, foreign base URIs and form targets", () => {
    for (const d of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"]) {
      expect(csp).toContain(d);
    }
  });
  it("only talks to its own origin", () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("connect-src 'self'");
  });
  it("dev adds unsafe-eval and skips upgrade-insecure-requests", () => {
    const dev = buildCsp("n", true);
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).not.toContain("upgrade-insecure-requests");
    expect(csp).toContain("upgrade-insecure-requests");
  });
});

describe("newNonce", () => {
  it("is unique per call and header-safe", () => {
    const a = newNonce();
    expect(a).not.toBe(newNonce());
    expect(a).toMatch(/^[A-Za-z0-9+/=]+$/);
  });
});
