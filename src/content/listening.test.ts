import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LISTENING_VIDEOS, loadListeningVideo } from "@/content/listening";
import type { ListeningVideo } from "@/content/listening/types";
import { applySummary, parseLinks, renderIndex, renderSummary, SUMMARY_START } from "../../scripts/listening-lib.mjs";

const DIR = join(process.cwd(), "src/content/listening");
const VIDEOS_DIR = join(DIR, "videos");
const files = existsSync(VIDEOS_DIR) ? readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".json")) : [];
const videos: ListeningVideo[] = files.map((f) => JSON.parse(readFileSync(join(VIDEOS_DIR, f), "utf8")));

describe("listening content", () => {
  it("the generated index lists exactly the saved videos", () => {
    expect(LISTENING_VIDEOS.map((v) => v.id).sort()).toEqual(videos.map((v) => v.id).sort());
  });

  it("the index file is what the script would generate from the saved videos", () => {
    const ordered = LISTENING_VIDEOS.map((m) => videos.find((v) => v.id === m.id)!);
    expect(readFileSync(join(DIR, "index.ts"), "utf8")).toBe(renderIndex(ordered));
  });

  it("links.txt lists every saved video, and its summary matches the saved data", () => {
    const text = readFileSync(join(DIR, "links.txt"), "utf8");
    const ids = parseLinks(text).map((l) => l.id);
    for (const v of videos) expect(ids, `${v.id} is saved but not in links.txt`).toContain(v.id);
    expect(text).toContain(SUMMARY_START);
    const entries = [...new Set(ids)].map((id) => {
      const v = videos.find((x) => x.id === id);
      return v ? { status: "ok", ...v } : null;
    });
    // Every link of the file has been processed (no pending or failed ones are committed).
    expect(entries.every(Boolean)).toBe(true);
    expect(text).toContain(`Всего ссылок: ${ids.length} · готово: ${videos.length}`);
    const again = applySummary(text, renderSummary(ids.map((id) => ({ status: "ok", ...videos.find((x) => x.id === id)! }))));
    expect(again.replace(/\n*$/, "\n")).toBe(text.replace(/\n*$/, "\n").replace(/Всего ссылок: \d+ · готово: \d+ · ошибки: \d+/, again.match(/Всего ссылок: \d+ · готово: \d+ · ошибки: \d+/)![0]));
  });

  it.each(videos.map((v) => [v.id, v] as const))("%s has a well-formed transcript", async (id, v) => {
    expect(file(id)).toBe(`${id}.json`);
    expect(v.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
    expect(v.url).toBe(`https://www.youtube.com/watch?v=${id}`);
    expect(v.title.trim()).not.toBe("");
    expect(v.channel.trim()).not.toBe("");
    expect(v.durationSeconds).toBeGreaterThan(0);
    expect(v.language).toBe("en");
    expect(["manual", "auto"]).toContain(v.captions);
    expect(v.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(v.lines.length).toBeGreaterThanOrEqual(10);
    v.lines.forEach((l, i) => {
      expect(l.text.trim(), `line ${i} is empty`).not.toBe("");
      expect(l.text, `line ${i} has markup`).not.toMatch(/[<>[\]]|&\w+;/);
      expect(l.end, `line ${i} ends before it starts`).toBeGreaterThan(l.start);
      if (i > 0) expect(l.start, `line ${i} overlaps the previous one`).toBeGreaterThanOrEqual(v.lines[i - 1].end - 1e-6);
    });
    expect((await loadListeningVideo(id))?.id).toBe(id);
  });

  it("an unknown id is not found", async () => {
    expect(await loadListeningVideo("nope")).toBeNull();
    expect(await loadListeningVideo("__proto__")).toBeNull();
    expect(await loadListeningVideo("constructor")).toBeNull();
  });
});

function file(id: string): string {
  return files.find((f) => f === `${id}.json`) ?? "";
}
