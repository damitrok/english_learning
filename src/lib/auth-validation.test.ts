import { describe, expect, it } from "vitest";
import {
  authErrorMessage,
  isValidCode,
  isValidEmail,
  normalizeCode,
  normalizeEmail,
  validatePassword,
} from "@/lib/auth-validation";

describe("email", () => {
  it("normalizes case and spaces", () => expect(normalizeEmail("  Me@Example.COM ")).toBe("me@example.com"));
  it.each(["a@b.co", "first.last+tag@sub.example.org"])("accepts %s", (e) => expect(isValidEmail(e)).toBe(true));
  it.each(["", "plain", "a@b", "a b@c.com", "@x.com", "a@.com", `${"a".repeat(250)}@b.com`])("rejects %j", (e) =>
    expect(isValidEmail(e)).toBe(false)
  );
});

describe("password", () => {
  it("rejects short passwords", () => expect(validatePassword("abc123")).toMatch(/минимум 8/));
  it("rejects digits only", () => expect(validatePassword("12345678")).toMatch(/букв/));
  it("rejects too long (bytes, not characters)", () => {
    expect(validatePassword("a".repeat(73))).toMatch(/длинный/);
    expect(validatePassword("я".repeat(37))).toMatch(/длинный/); // 74 bytes
  });
  it("accepts a normal password", () => {
    expect(validatePassword("correct horse 7")).toBeNull();
    expect(validatePassword("abcdefgh")).toBeNull();
  });
});

describe("code", () => {
  it("keeps only digits, max 8", () => expect(normalizeCode("12 34-56 78 9")).toBe("12345678"));
  it("needs at least 6 digits", () => {
    expect(isValidCode("12345")).toBe(false);
    expect(isValidCode("123 456")).toBe(true);
  });
});

describe("authErrorMessage", () => {
  it("maps known codes", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toMatch(/Неверный/);
    expect(authErrorMessage({ code: "email_not_confirmed" })).toMatch(/не подтверждён/);
    expect(authErrorMessage({ code: "over_email_send_rate_limit" })).toMatch(/не чаще/);
  });
  it("falls back to message heuristics", () => {
    expect(authErrorMessage({ message: "Invalid login credentials" })).toMatch(/Неверный/);
    expect(authErrorMessage({ message: "Token has expired or is invalid" })).toMatch(/устарел/);
    expect(authErrorMessage({ message: "For security purposes, you can only request this after 8 seconds." })).toMatch(/не чаще/);
  });
  it("has a generic fallback and handles empty", () => {
    expect(authErrorMessage({ message: "boom" })).toMatch(/Что-то пошло не так/);
    expect(authErrorMessage(null)).toBe("");
  });
});
