import { describe, expect, it } from "vitest";
import { isPublicPath } from "./public-paths";

describe("isPublicPath", () => {
  it("allows the login page and the version endpoint", () => {
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/login/")).toBe(true);
    expect(isPublicPath("/api/version")).toBe(true);
  });
  it("does not treat look-alike prefixes as public", () => {
    expect(isPublicPath("/login-admin")).toBe(false);
    expect(isPublicPath("/loginxyz")).toBe(false);
    expect(isPublicPath("/api/versions")).toBe(false);
  });
  it("keeps the app private", () => {
    for (const p of ["/", "/path", "/progress", "/session/vocab", "/api/other"]) expect(isPublicPath(p)).toBe(false);
  });
});
