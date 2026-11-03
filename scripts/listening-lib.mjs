// Pure helpers of the «Слушанье» tool (scripts/add-listening.mjs): link parsing, caption parsing
// and cleaning, the summary block of links.txt and the generated index. No I/O here, so it is
// covered by unit tests (src/lib/listening-transcript.test.ts).

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** The 11-character YouTube id from a watch / youtu.be / embed / shorts / live link, or a bare id. */
export function parseVideoId(input) {
  const s = String(input ?? "").trim();
  if (VIDEO_ID.test(s)) return s;
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  let id = null;
  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else id = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] ?? null;
  }
  return id && VIDEO_ID.test(id) ? id : null;
}

/** Link lines of links.txt: one per line, blank lines and `#` comments are ignored. */
export function parseLinks(text) {
  const entries = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const token = line.split(/\s+/)[0];
    entries.push({ line: token, id: parseVideoId(token) });
  }
  return entries;
}

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&nbsp;": " " };
const SOUND_CUES = /\((?:music|applause|laughter|laughs|laughing|inaudible|crosstalk|silence)[^)]*\)/gi;

/** One caption text → plain spoken words: no tags, sound cues, speaker marks or odd spaces. */
export function cleanCaptionText(raw) {
  return String(raw ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39);/g, (m) => ENTITIES[m])
    .replace(/\[[^\]]*\]/g, " ")
    .replace(SOUND_CUES, " ")
    .replace(/[♪♫]+/g, " ")
    .replace(/>>+/g, " ")
    .replace(/^\s*-\s+/gm, "")
    .replace(/[​-‍﻿]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const round2 = (n) => Math.round(n * 100) / 100;

/** Makes segments non-overlapping: a segment ends where the next one starts. */
function fixOverlaps(segments) {
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].end > sorted[i + 1].start) sorted[i].end = Math.max(sorted[i].start + 0.2, sorted[i + 1].start);
  }
  return sorted;
}

/** yt-dlp `json3` subtitles → [{ start, end, text }] in seconds. */
export function parseJson3(input) {
  const data = typeof input === "string" ? JSON.parse(input) : input;
  const segments = [];
  for (const ev of data?.events ?? []) {
    if (!Array.isArray(ev.segs)) continue;
    const text = cleanCaptionText(ev.segs.map((s) => s.utf8 ?? "").join(""));
    if (!text) continue;
    const start = (ev.tStartMs ?? 0) / 1000;
    segments.push({ start, end: start + Math.max(0.2, (ev.dDurationMs ?? 0) / 1000), text });
  }
  return fixOverlaps(segments);
}

function vttSeconds(stamp) {
  const parts = stamp.replace(",", ".").split(":").map(Number);
  while (parts.length < 3) parts.unshift(0);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

/** WebVTT subtitles → [{ start, end, text }]. Drops the repeated lines of YouTube's rolling auto captions. */
export function parseVtt(input) {
  const segments = [];
  const recent = [];
  for (const block of String(input).split(/\r?\n\r?\n/)) {
    const lines = block.split(/\r?\n/);
    const at = lines.findIndex((l) => l.includes("-->"));
    if (at < 0) continue;
    const m = lines[at].match(/([\d:.,]+)\s*-->\s*([\d:.,]+)/);
    if (!m) continue;
    const start = vttSeconds(m[1]);
    const end = vttSeconds(m[2]);
    const fresh = [];
    for (const l of lines.slice(at + 1)) {
      const text = cleanCaptionText(l);
      if (text && !recent.includes(text)) fresh.push(text);
    }
    for (const t of fresh) recent.push(t);
    recent.splice(0, Math.max(0, recent.length - 4));
    if (fresh.length === 0 || end - start < 0.05) continue;
    segments.push({ start, end, text: fresh.join(" ") });
  }
  return fixOverlaps(segments);
}

/** Joins short caption segments into readable lines (a phrase or a sentence at a time). */
export function groupLines(segments, { maxChars = 110, maxSeconds = 7, gapBreak = 1.5, sentenceMin = 40 } = {}) {
  const lines = [];
  let cur = null;
  const flush = () => {
    if (cur) lines.push({ start: round2(cur.start), end: round2(cur.end), text: cur.text });
    cur = null;
  };
  for (const seg of segments) {
    if (cur) {
      const tooLong = cur.text.length + 1 + seg.text.length > maxChars || seg.end - cur.start > maxSeconds;
      const paused = seg.start - cur.end > gapBreak;
      const sentenceDone = cur.text.length >= sentenceMin && /[.!?]["')\]]?$/.test(cur.text);
      if (tooLong || paused || sentenceDone) flush();
    }
    if (cur) {
      cur.text += ` ${seg.text}`;
      cur.end = seg.end;
    } else {
      cur = { start: seg.start, end: seg.end, text: seg.text };
    }
  }
  flush();
  return lines;
}

/** Which English caption track to download for a yt-dlp info dict: people's captions first, then speech recognition. */
export function pickCaptionTrack(info) {
  const manual = Object.keys(info?.subtitles ?? {}).find((k) => /^en(-|$)/i.test(k));
  if (manual) return { lang: manual, kind: "manual" };
  const keys = Object.keys(info?.automatic_captions ?? {});
  const lang = keys.includes("en-orig") ? "en-orig" : keys.includes("en") ? "en" : keys.find((k) => /^en(-|$)/i.test(k));
  return lang ? { lang, kind: "auto" } : null;
}

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export const SUMMARY_START = "# === СВОДКА (пишет скрипт, руками не править) ===";
export const SUMMARY_END = "# === КОНЕЦ СВОДКИ ===";

/**
 * The summary block: one numbered line per link in links.txt.
 * entry = { status: "ok" | "error" | "invalid" | "duplicate", line, id?, title?, channel?,
 *           durationSeconds?, captions?, error? }
 */
export function renderSummary(entries) {
  const ok = entries.filter((e) => e.status === "ok").length;
  const bad = entries.filter((e) => e.status === "error" || e.status === "invalid").length;
  const out = [SUMMARY_START, `# Всего ссылок: ${entries.length} · готово: ${ok} · ошибки: ${bad}`];
  entries.forEach((e, i) => {
    const n = `${i + 1}.`;
    if (e.status === "ok") {
      const kind = e.captions === "manual" ? "субтитры" : "автосубтитры";
      out.push(`# ${n} ✓ ${e.title} — ${e.channel} · ${formatDuration(e.durationSeconds)} · ${kind} · ${e.id}`);
    } else if (e.status === "duplicate") {
      out.push(`# ${n} = повтор ссылки ${e.id}`);
    } else if (e.status === "invalid") {
      out.push(`# ${n} ✗ не похоже на ссылку YouTube: ${e.line}`);
    } else {
      out.push(`# ${n} ✗ ${e.id}: ${e.error}`);
    }
  });
  out.push(SUMMARY_END);
  return out.join("\n");
}

/**
 * Puts the summary block into the file text: replaces the old block, or adds one right after the
 * comment header at the top of the file.
 */
export function applySummary(fileText, summary) {
  const text = String(fileText);
  const a = text.indexOf(SUMMARY_START);
  const b = text.indexOf(SUMMARY_END);
  if (a >= 0 && b > a) return text.slice(0, a) + summary + text.slice(b + SUMMARY_END.length);
  const lines = text.split("\n");
  let header = 0;
  while (header < lines.length && lines[header].startsWith("#")) header++;
  const head = lines.slice(0, header).join("\n");
  const rest = lines.slice(header).join("\n").replace(/^\n+/, "");
  return `${head ? `${head}\n\n` : ""}${summary}\n\n${rest}`;
}

/** Counts the words of a video's lines. */
export function countWords(lines) {
  return lines.reduce((n, l) => n + (l.text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)?.length ?? 0), 0);
}

/** Source of the generated src/content/listening/index.ts for these videos (in list order). */
export function renderIndex(videos) {
  const metas = videos.map((v) => ({
    id: v.id,
    url: v.url,
    title: v.title,
    channel: v.channel,
    durationSeconds: v.durationSeconds,
    captions: v.captions,
    lineCount: v.lines.length,
    wordCount: countWords(v.lines),
  }));
  const loaders = videos.map((v) => `  ${JSON.stringify(v.id)}: () => import(${JSON.stringify(`./videos/${v.id}.json`)}),`);
  return `// Generated by scripts/add-listening.mjs (npm run listening) — do not edit by hand.
import type { ListeningVideo, ListeningVideoMeta } from "./types";

export const LISTENING_VIDEOS: ListeningVideoMeta[] = ${JSON.stringify(metas, null, 2)};

const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
${loaders.join("\n")}
};

export async function loadListeningVideo(id: string): Promise<ListeningVideo | null> {
  const load = Object.hasOwn(LOADERS, id) ? LOADERS[id] : undefined;
  return load ? ((await load()).default as ListeningVideo) : null;
}
`;
}
