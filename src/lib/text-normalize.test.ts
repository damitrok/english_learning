import { describe, expect, it } from "vitest";
import { normalizeAnswer } from "@/lib/text-normalize";

describe("normalizeAnswer", () => {
  it("lowercases and trims", () => expect(normalizeAnswer("  Hello  ")).toBe("hello"));
  it("collapses inner whitespace", () => expect(normalizeAnswer("a   b\tc")).toBe("a b c"));
  it("straightens curly apostrophes", () => expect(normalizeAnswer("don’t")).toBe("don't"));
  it("drops trailing punctuation but keeps inner", () => expect(normalizeAnswer("Yes, I do.")).toBe("yes, i do"));
});
