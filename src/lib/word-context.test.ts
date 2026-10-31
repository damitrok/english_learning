import { describe, expect, it } from "vitest";
import { blankWord } from "@/lib/word-context";

describe("blankWord", () => {
  it("blanks the exact headword", () => {
    expect(blankWord("I agree with your idea.", "agree")).toEqual({
      before: "I ",
      after: " with your idea.",
      answers: ["agree"],
    });
  });
  it("blanks an inflected form and accepts both it and the headword", () => {
    const r = blankWord("Hackers attacked the server last night.", "attack");
    expect(r?.before).toBe("Hackers ");
    expect(r?.after).toBe(" the server last night.");
    expect(r?.answers).toEqual(["attacked", "attack"]);
  });
  it("is case-insensitive and keeps the sentence's own capitalization as the answer", () => {
    expect(blankWord("Agree or not?", "agree")?.answers[0]).toBe("Agree");
  });
  it("does not match inside longer words", () => {
    expect(blankWord("The disagreement was long.", "agree")).toBeNull();
  });
  it("returns null when the word is absent", () => {
    expect(blankWord("Nothing here.", "agree")).toBeNull();
  });
});
