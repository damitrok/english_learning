import { describe, expect, it } from "vitest";
import { checkWordAnswer, editDistance, gradeAttempt, hintFor } from "@/lib/word-check";

describe("editDistance", () => {
  it("counts insert, delete, substitute and adjacent swap as one edit", () => {
    expect(editDistance("cat", "cat")).toBe(0);
    expect(editDistance("cat", "cart")).toBe(1);
    expect(editDistance("cart", "cat")).toBe(1);
    expect(editDistance("cat", "cut")).toBe(1);
    expect(editDistance("recieve", "receive")).toBe(1);
    expect(editDistance("abc", "xyz")).toBe(3);
  });
});

describe("checkWordAnswer", () => {
  it("accepts exact answers ignoring case, spaces and punctuation", () => {
    expect(checkWordAnswer("  Deploy ", ["deploy"])).toBe("correct");
    expect(checkWordAnswer("deploy.", ["deploy"])).toBe("correct");
    expect(checkWordAnswer("attacked", ["attacked", "attack"])).toBe("correct");
  });
  it("treats a one-letter slip in a longer word as near", () => {
    expect(checkWordAnswer("recieve", ["receive"])).toBe("near");
    expect(checkWordAnswer("deploi", ["deploy"])).toBe("near");
  });
  it("does not forgive slips in short words or bigger mistakes", () => {
    expect(checkWordAnswer("cut", ["cat"])).toBe("wrong");
    expect(checkWordAnswer("develop", ["deploy"])).toBe("wrong");
    expect(checkWordAnswer("", ["deploy"])).toBe("wrong");
  });
});

describe("gradeAttempt", () => {
  const base = { verdict: "correct" as const, usedHint: false, gaveUp: false, seconds: 3 };
  it("fast and unaided is easy, slow is normal", () => {
    expect(gradeAttempt(base)).toBe("easy");
    expect(gradeAttempt({ ...base, seconds: 20 })).toBe("normal");
  });
  it("hint or typo is hard", () => {
    expect(gradeAttempt({ ...base, usedHint: true })).toBe("hard");
    expect(gradeAttempt({ ...base, verdict: "near" })).toBe("hard");
  });
  it("wrong or giving up is forgot", () => {
    expect(gradeAttempt({ ...base, verdict: "wrong" })).toBe("forgot");
    expect(gradeAttempt({ ...base, gaveUp: true })).toBe("forgot");
  });
});

describe("hintFor", () => {
  it("shows the first letter and blanks", () => {
    expect(hintFor("deploy")).toBe("d_____");
    expect(hintFor("a")).toBe("a");
    expect(hintFor("")).toBe("");
  });
});
