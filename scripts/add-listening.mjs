#!/usr/bin/env node
// «Слушанье»: reads the YouTube links from src/content/listening/links.txt, downloads the English
// transcript of every new one with yt-dlp, saves it as src/content/listening/videos/<id>.json and
// refreshes the generated index (src/content/listening/index.ts) and the summary in links.txt.
//
//   npm run listening            # process new links
//   npm run listening -- --force # download every transcript again
//
// Needs yt-dlp on your machine (macOS: `brew install yt-dlp`). Only your own computer talks to
// YouTube: nothing here runs in the app or on the server.
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import {
  applySummary,
  groupLines,
  parseJson3,
  parseLinks,
  parseVtt,
  pickCaptionTrack,
  renderIndex,
  renderSummary,
} from "./listening-lib.mjs";

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/content/listening");
const LINKS_FILE = join(DIR, "links.txt");
const VIDEOS_DIR = join(DIR, "videos");
const INDEX_FILE = join(DIR, "index.ts");
const MIN_LINES = 10;
const force = process.argv.includes("--force");

async function ytdlp(args) {
  return run("yt-dlp", args, { timeout: 180_000, maxBuffer: 64 * 1024 * 1024 });
}

async function hasYtdlp() {
  try {
    await run("yt-dlp", ["--version"], { timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

/** Downloads metadata + the English transcript of one video and returns the video record. */
async function fetchVideo(id) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const { stdout } = await ytdlp(["--dump-single-json", "--no-playlist", "--no-warnings", url]);
  const info = JSON.parse(stdout);
  if (info.language && !/^en(-|$)/i.test(info.language)) {
    throw new Error(`видео не на английском (язык: ${info.language})`);
  }
  const track = pickCaptionTrack(info);
  if (!track) throw new Error("у видео нет английских субтитров");

  const tmp = await mkdtemp(join(tmpdir(), "listening-"));
  try {
    await ytdlp([
      "--skip-download", "--no-playlist", "--no-warnings",
      track.kind === "manual" ? "--write-subs" : "--write-auto-subs",
      "--sub-langs", track.lang,
      "--sub-format", "json3/vtt",
      "-o", join(tmp, "%(id)s.%(ext)s"),
      url,
    ]);
    const files = await readdir(tmp);
    const json3 = files.find((f) => f.endsWith(".json3"));
    const vtt = files.find((f) => f.endsWith(".vtt"));
    if (!json3 && !vtt) throw new Error("yt-dlp не скачал субтитры");
    const segments = json3
      ? parseJson3(await readFile(join(tmp, json3), "utf8"))
      : parseVtt(await readFile(join(tmp, vtt), "utf8"));
    const lines = groupLines(segments);
    if (lines.length < MIN_LINES) throw new Error(`расшифровка слишком короткая (${lines.length} строк)`);
    return {
      id,
      url,
      title: String(info.title ?? id).trim(),
      channel: String(info.channel ?? info.uploader ?? "—").trim(),
      durationSeconds: Math.round(info.duration ?? lines.at(-1).end),
      language: "en",
      captions: track.kind,
      addedAt: new Date().toISOString().slice(0, 10),
      lines,
    };
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

async function readSaved(id) {
  const file = join(VIDEOS_DIR, `${id}.json`);
  return existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : null;
}

async function main() {
  await mkdir(VIDEOS_DIR, { recursive: true });
  const linksText = existsSync(LINKS_FILE) ? await readFile(LINKS_FILE, "utf8") : "";
  const links = parseLinks(linksText);

  const pending = [];
  for (const l of links) if (l.id && (force || !existsSync(join(VIDEOS_DIR, `${l.id}.json`)))) pending.push(l.id);
  const todo = [...new Set(pending)];

  if (todo.length > 0 && !(await hasYtdlp())) {
    console.error("Не найден yt-dlp. Установи его (macOS: brew install yt-dlp) и запусти команду снова.");
    process.exit(1);
  }

  const failures = new Map();
  for (const id of todo) {
    process.stdout.write(`→ ${id} … `);
    try {
      const video = await fetchVideo(id);
      await writeFile(join(VIDEOS_DIR, `${id}.json`), `${JSON.stringify(video, null, 2)}\n`);
      console.log(`готово: «${video.title}» (${video.lines.length} строк, ${video.captions === "manual" ? "субтитры" : "автосубтитры"})`);
    } catch (e) {
      const reason = String(e?.stderr ?? e?.message ?? e).split("\n").filter(Boolean).at(-1) ?? "неизвестная ошибка";
      failures.set(id, reason);
      console.log(`ошибка: ${reason}`);
    }
  }

  // Summary of links.txt (in file order) and the index of videos (same order).
  const seen = new Set();
  const entries = [];
  const ready = [];
  for (const l of links) {
    if (!l.id) {
      entries.push({ status: "invalid", line: l.line });
    } else if (seen.has(l.id)) {
      entries.push({ status: "duplicate", id: l.id });
    } else {
      seen.add(l.id);
      const saved = failures.has(l.id) ? null : await readSaved(l.id);
      if (saved) {
        ready.push(saved);
        entries.push({ status: "ok", ...saved });
      } else {
        entries.push({ status: "error", id: l.id, error: failures.get(l.id) ?? "расшифровка не скачана" });
      }
    }
  }

  const header = linksText.trim()
    ? linksText
    : [
        "# Ссылки на YouTube-видео для вкладки «Слушанье».",
        "# Добавь ссылку новой строкой ниже (одна на строку) и запусти:  npm run listening",
        "# Скрипт скачает английскую расшифровку в src/content/listening/videos/,",
        "# обновит список видео в приложении и сводку ниже. Строки с # — комментарии.",
        "",
      ].join("\n");
  await writeFile(LINKS_FILE, applySummary(header, renderSummary(entries)).replace(/\n*$/, "\n"));
  await writeFile(INDEX_FILE, renderIndex(ready));

  console.log(`\nВидео в «Слушанье»: ${ready.length}. Ссылок в файле: ${links.length}.`);
  if (failures.size > 0 || entries.some((e) => e.status === "invalid")) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
