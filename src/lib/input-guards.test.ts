import { describe, expect, it } from "vitest";
import {
  MAX_ANSWER_LENGTH,
  MAX_SECONDS,
  clampCount,
  clampSeconds,
  cleanAnswer,
  isSrsResult,
  isStepName,
  isUuid,
} from "./input-guards";

describe("isUuid", () => {
  it("accepts a UUID and rejects everything else", () => {
    expect(isUuid("3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b")).toBe(true);
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b'; drop table cards;--")).toBe(false);
    expect(isUuid(null)).toBe(false);
    expect(isUuid(42)).toBe(false);
  });
});

describe("isStepName / isSrsResult", () => {
  it("accepts only known values", () => {
    expect(isStepName("vocab")).toBe(true);
    expect(isStepName("review")).toBe(true);
    expect(isStepName("listening")).toBe(false);
    expect(isStepName(undefined)).toBe(false);
    expect(isSrsResult("easy")).toBe(true);
    expect(isSrsResult("perfect")).toBe(false);
  });
});

describe("clampSeconds", () => {
  it("keeps sane values and rounds", () => {
    expect(clampSeconds(61.4)).toBe(61);
  });
  it("clamps huge, negative and non-finite values", () => {
    expect(clampSeconds(1e12)).toBe(MAX_SECONDS);
    expect(clampSeconds(-5)).toBe(0);
    expect(clampSeconds(NaN)).toBe(0);
    expect(clampSeconds(Infinity)).toBe(0);
    expect(clampSeconds("90")).toBe(0);
  });
});

describe("clampCount", () => {
  it("limits to [0, max] and truncates", () => {
    expect(clampCount(3.9, 10)).toBe(3);
    expect(clampCount(99, 10)).toBe(10);
    expect(clampCount(-1, 10)).toBe(0);
    expect(clampCount(NaN, 10)).toBe(0);
  });
});

describe("cleanAnswer", () => {
  it("accepts short strings, rejects long or non-strings", () => {
    expect(cleanAnswer("went")).toBe("went");
    expect(cleanAnswer("x".repeat(MAX_ANSWER_LENGTH))).not.toBeNull();
    expect(cleanAnswer("x".repeat(MAX_ANSWER_LENGTH + 1))).toBeNull();
    expect(cleanAnswer({ a: 1 })).toBeNull();
  });
});
