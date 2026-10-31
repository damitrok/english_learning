import { describe, expect, it } from "vitest";
import { splitByHeadwords } from "./highlight";

const words = (segs: ReturnType<typeof splitByHeadwords>) =>
  segs.filter((s) => s.kind === "word").map((s) => (s.kind === "word" ? [s.value, s.headword] : []));

describe("splitByHeadwords", () => {
  it("returns the whole body as text when there are no headwords", () => {
    expect(splitByHeadwords("hello world", [])).toEqual([{ kind: "text", value: "hello world" }]);
    expect(splitByHeadwords("hello", [""])).toEqual([{ kind: "text", value: "hello" }]);
  });
  it("splits text around matches and reassembles losslessly", () => {
    const body = "I fix the bug. Then we test it!";
    const segs = splitByHeadwords(body, ["fix", "test"]);
    expect(segs.map((s) => s.value).join("")).toBe(body);
    expect(words(segs)).toEqual([["fix", "fix"], ["test", "test"]]);
  });
  it("matches case-insensitively, keeps original casing in value", () => {
    expect(words(splitByHeadwords("Fix it", ["FIX"]))).toEqual([["Fix", "fix"]]);
  });
  it("matches simple inflections", () => {
    const segs = splitByHeadwords("He fixes, tested, fixed, testing and fixs.", ["fix", "test"]);
    expect(words(segs)).toEqual([
      ["fixes", "fix"], ["tested", "test"], ["fixed", "fix"], ["testing", "test"], ["fixs", "fix"],
    ]);
  });
  it("matches -d inflection for words ending in e", () => {
    expect(words(splitByHeadwords("She used it", ["use"]))).toEqual([["used", "use"]]);
  });
  it("does not match inside longer words", () => {
    expect(words(splitByHeadwords("prefix testify contest fixture", ["fix", "test"]))).toEqual([]);
  });
  it("prefers the longest headword", () => {
    const segs = splitByHeadwords("Open a pull request now", ["request", "pull request"]);
    expect(words(segs)).toEqual([["pull request", "pull request"]]);
  });
  it("escapes regex special characters in headwords", () => {
    expect(() => splitByHeadwords("a (b) c", ["(b"])).not.toThrow();
    expect(words(splitByHeadwords("use c++ daily", ["c++"]))).toEqual([]); // known: \b after '+' needs a word char
  });
  it("ignores duplicate headwords", () => {
    expect(words(splitByHeadwords("fix", ["fix", "Fix"]))).toEqual([["fix", "fix"]]);
  });
});
