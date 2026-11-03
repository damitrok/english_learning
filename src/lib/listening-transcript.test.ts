import { describe, expect, it } from "vitest";
import {
  SUMMARY_END,
  SUMMARY_START,
  applySummary,
  cleanCaptionText,
  countWords,
  formatDuration,
  groupLines,
  parseJson3,
  parseLinks,
  parseVideoId,
  parseVtt,
  pickCaptionTrack,
  renderIndex,
  renderSummary,
} from "../../scripts/listening-lib.mjs";

describe("parseVideoId", () => {
  const id = "abcDEF12345";
  it.each([
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtube.com/watch?v=${id}&t=90s&list=PL123`,
    `http://m.youtube.com/watch?v=${id}`,
    `https://music.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}`,
    `https://youtu.be/${id}?si=xyz`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube.com/live/${id}?feature=share`,
    `www.youtube.com/watch?v=${id}`,
    id,
  ])("extracts the id from %s", (input) => {
    expect(parseVideoId(input)).toBe(id);
  });
  it.each([
    "",
    "not a link",
    "https://example.com/watch?v=abcDEF12345",
    "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/watch?v=abcDEF12345678",
    "https://www.youtube.com/@somechannel",
    "https://youtu.be/",
    "https://evil.com/youtu.be/abcDEF12345",
  ])("rejects %j", (input) => {
    expect(parseVideoId(input)).toBeNull();
  });
});

describe("parseLinks", () => {
  it("skips blanks and # comments, keeps order, flags bad lines", () => {
    const text = [
      "# comment",
      "",
      "https://youtu.be/abcDEF12345   # my note",
      "garbage line",
      "  https://www.youtube.com/watch?v=ZZZZZZZZZZZ  ",
      "# === СВОДКА ===",
    ].join("\n");
    expect(parseLinks(text)).toEqual([
      { line: "https://youtu.be/abcDEF12345", id: "abcDEF12345" },
      { line: "garbage", id: null },
      { line: "https://www.youtube.com/watch?v=ZZZZZZZZZZZ", id: "ZZZZZZZZZZZ" },
    ]);
  });
  it("handles Windows line endings and empty input", () => {
    expect(parseLinks("https://youtu.be/abcDEF12345\r\n")).toHaveLength(1);
    expect(parseLinks("")).toEqual([]);
  });
});

describe("cleanCaptionText", () => {
  it("removes tags, sound cues, speaker marks and decodes entities", () => {
    expect(cleanCaptionText("<c>Hello</c> &amp; welcome [Music]")).toBe("Hello & welcome");
    expect(cleanCaptionText(">> So, it&#39;s (applause) fine.")).toBe("So, it's fine.");
    expect(cleanCaptionText("♪ la la ♪ words")).toBe("la la words");
    expect(cleanCaptionText("one\ntwo   three")).toBe("one two three");
    expect(cleanCaptionText("- first\n- second")).toBe("first second");
  });
  it("keeps ordinary parentheses", () => {
    expect(cleanCaptionText("a cache (like Redis) helps")).toBe("a cache (like Redis) helps");
  });
  it("returns an empty string for nothing", () => {
    expect(cleanCaptionText("[Music]")).toBe("");
    expect(cleanCaptionText(undefined)).toBe("");
  });
});

describe("parseJson3", () => {
  it("turns events into segments, skipping empty and newline-only ones", () => {
    const data = {
      events: [
        { tStartMs: 1000, dDurationMs: 2000, segs: [{ utf8: "hello " }, { utf8: "there", tOffsetMs: 500 }] },
        { tStartMs: 3000, dDurationMs: 100, segs: [{ utf8: "\n" }] },
        { tStartMs: 3500, dDurationMs: 1500, segs: [{ utf8: "[Music]" }] },
        { tStartMs: 4000, dDurationMs: 1000, aAppend: 1 },
        { tStartMs: 5000, dDurationMs: 2000, segs: [{ utf8: "second part" }] },
      ],
    };
    expect(parseJson3(data)).toEqual([
      { start: 1, end: 3, text: "hello there" },
      { start: 5, end: 7, text: "second part" },
    ]);
    expect(parseJson3(JSON.stringify(data))).toHaveLength(2);
  });
  it("trims overlaps so segments do not run into each other", () => {
    const segs = parseJson3({
      events: [
        { tStartMs: 0, dDurationMs: 5000, segs: [{ utf8: "first" }] },
        { tStartMs: 2000, dDurationMs: 3000, segs: [{ utf8: "second" }] },
      ],
    });
    expect(segs[0].end).toBe(2);
    expect(segs[1].start).toBe(2);
  });
  it("copes with empty data", () => {
    expect(parseJson3({})).toEqual([]);
  });
});

describe("parseVtt", () => {
  const vtt = `WEBVTT
Kind: captions
Language: en

00:00:01.000 --> 00:00:03.000
first line of speech

00:00:03.000 --> 00:00:03.010
first line of speech

00:00:03.010 --> 00:00:05.000
first line of speech
<00:00:03.500><c>and</c><00:00:03.800><c> more</c>

00:01:05,500 --> 00:01:07.000
a later line
`;
  it("parses cues, strips inline tags and drops the rolling repeats", () => {
    const segs = parseVtt(vtt);
    expect(segs.map((s) => s.text)).toEqual(["first line of speech", "and more", "a later line"]);
    expect(segs[0]).toMatchObject({ start: 1, end: 3 });
    expect(segs[2].start).toBe(65.5);
  });
  it("accepts the MM:SS.mmm form", () => {
    expect(parseVtt("WEBVTT\n\n01:02.500 --> 01:04.000\nshort stamp")[0]).toMatchObject({ start: 62.5, end: 64 });
  });
});

describe("groupLines", () => {
  const seg = (start: number, end: number, text: string) => ({ start, end, text });
  it("joins short segments into lines and ends them at a sentence end", () => {
    const lines = groupLines([
      seg(0, 2, "we start with a quick overview"),
      seg(2, 4, "of the whole system."),
      seg(4, 6, "Then we look at details"),
    ]);
    expect(lines).toEqual([
      { start: 0, end: 4, text: "we start with a quick overview of the whole system." },
      { start: 4, end: 6, text: "Then we look at details" },
    ]);
  });
  it("breaks on a pause, on length and on duration", () => {
    expect(groupLines([seg(0, 1, "a"), seg(5, 6, "b")])).toHaveLength(2);
    expect(groupLines([seg(0, 1, "x".repeat(70)), seg(1, 2, "y".repeat(70))])).toHaveLength(2);
    expect(groupLines([seg(0, 4, "a"), seg(4, 8, "b")])).toHaveLength(2);
  });
  it("returns lines in time order without overlaps and without losing text", () => {
    const segs = Array.from({ length: 40 }, (_, i) => seg(i * 2, i * 2 + 2, `word${i} another${i}`));
    const lines = groupLines(segs);
    expect(lines.map((l) => l.text).join(" ")).toBe(segs.map((s) => s.text).join(" "));
    for (let i = 1; i < lines.length; i++) expect(lines[i].start).toBeGreaterThanOrEqual(lines[i - 1].end);
    expect(groupLines([])).toEqual([]);
  });
});

describe("pickCaptionTrack", () => {
  it("prefers people's English captions, then original speech recognition", () => {
    expect(pickCaptionTrack({ subtitles: { de: [], "en-GB": [] }, automatic_captions: { en: [] } })).toEqual({ lang: "en-GB", kind: "manual" });
    expect(pickCaptionTrack({ subtitles: {}, automatic_captions: { en: [], "en-orig": [], de: [] } })).toEqual({ lang: "en-orig", kind: "auto" });
    expect(pickCaptionTrack({ automatic_captions: { en: [] } })).toEqual({ lang: "en", kind: "auto" });
  });
  it("returns null without English captions", () => {
    expect(pickCaptionTrack({ subtitles: { de: [] }, automatic_captions: { fr: [] } })).toBeNull();
    expect(pickCaptionTrack({})).toBeNull();
    expect(pickCaptionTrack(undefined)).toBeNull();
  });
});

describe("formatDuration", () => {
  it("formats minutes and hours", () => {
    expect(formatDuration(59)).toBe("0:59");
    expect(formatDuration(754)).toBe("12:34");
    expect(formatDuration(3725)).toBe("1:02:05");
  });
});

describe("summary block", () => {
  const entries = [
    { status: "ok", id: "abcDEF12345", title: "Talk", channel: "Chan", durationSeconds: 754, captions: "auto" },
    { status: "error", id: "ZZZZZZZZZZZ", error: "у видео нет английских субтитров" },
    { status: "invalid", line: "garbage" },
    { status: "duplicate", id: "abcDEF12345" },
  ];
  it("numbers every link and counts the results", () => {
    const text = renderSummary(entries);
    expect(text.startsWith(SUMMARY_START)).toBe(true);
    expect(text.endsWith(SUMMARY_END)).toBe(true);
    expect(text).toContain("Всего ссылок: 4 · готово: 1 · ошибки: 2");
    expect(text).toContain("# 1. ✓ Talk — Chan · 12:34 · автосубтитры · abcDEF12345");
    expect(text).toContain("# 2. ✗ ZZZZZZZZZZZ: у видео нет английских субтитров");
    expect(text).toContain("# 3. ✗ не похоже на ссылку YouTube: garbage");
    expect(text).toContain("# 4. = повтор ссылки abcDEF12345");
    expect(renderSummary([])).toContain("Всего ссылок: 0 · готово: 0 · ошибки: 0");
  });
  it("is inserted after the header and then replaced in place, links untouched", () => {
    const header = "# header 1\n# header 2\n\nhttps://youtu.be/abcDEF12345\n";
    const once = applySummary(header, renderSummary(entries.slice(0, 1)));
    expect(once.startsWith("# header 1\n# header 2\n\n" + SUMMARY_START)).toBe(true);
    expect(once.endsWith("\n\nhttps://youtu.be/abcDEF12345\n")).toBe(true);
    const twice = applySummary(once, renderSummary(entries));
    expect(twice.split(SUMMARY_START)).toHaveLength(2);
    expect(twice).toContain("Всего ссылок: 4");
    expect(twice.endsWith("\n\nhttps://youtu.be/abcDEF12345\n")).toBe(true);
    expect(applySummary(twice, renderSummary(entries.slice(0, 1)))).toBe(once);
  });
  it("works on an empty file", () => {
    expect(applySummary("", renderSummary([]))).toContain(SUMMARY_START);
  });
});

describe("renderIndex", () => {
  const video = {
    id: "abcDEF12345",
    url: "https://www.youtube.com/watch?v=abcDEF12345",
    title: 'A "quoted" title',
    channel: "Chan",
    durationSeconds: 100,
    captions: "manual",
    lines: [
      { start: 0, end: 2, text: "Hello there, it's fine" },
      { start: 2, end: 4, text: "Second line" },
    ],
  };
  it("counts words with contractions as one", () => {
    expect(countWords(video.lines)).toBe(6);
  });
  it("lists the videos in order with a lazy loader for each", () => {
    const src = renderIndex([video, { ...video, id: "ZZZZZZZZZZZ", title: "Second" }]);
    expect(src).toContain('"id": "abcDEF12345"');
    expect(src).toContain('"title": "A \\"quoted\\" title"');
    expect(src).toContain('"lineCount": 2');
    expect(src).toContain('"wordCount": 6');
    expect(src).toContain('"abcDEF12345": () => import("./videos/abcDEF12345.json"),');
    expect(src.indexOf("abcDEF12345")).toBeLessThan(src.indexOf("ZZZZZZZZZZZ"));
    expect(src).not.toContain('"lines"');
  });
  it("renders an empty index", () => {
    expect(renderIndex([])).toContain("LISTENING_VIDEOS: ListeningVideoMeta[] = []");
  });
});
