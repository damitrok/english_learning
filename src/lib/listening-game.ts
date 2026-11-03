// Pure logic of the «Аудирование» game: which words of a transcript become gaps, how fast they come,
// and which options are offered next to the right word.
import type { ListeningLine } from "@/content/listening/types";

export type LevelId = "easy" | "normal" | "hard";

export const LEVELS: { id: LevelId; label: string; hint: string; secondsPerGap: number }[] = [
  { id: "easy", label: "Лёгкий", hint: "пропуск раз в ~15 секунд", secondsPerGap: 15 },
  { id: "normal", label: "Средний", hint: "пропуск раз в ~9 секунд", secondsPerGap: 9 },
  { id: "hard", label: "Сложный", hint: "пропуск раз в ~5 секунд", secondsPerGap: 5 },
];

/** A gap is a word of the transcript the learner has to fill in after hearing it. */
export interface Gap {
  /** Index in the list of gaps (playback order). */
  id: number;
  /** Index of the caption line. */
  line: number;
  /** The word as written in the transcript. */
  word: string;
  /** Position of the word inside the line text. */
  charStart: number;
  charEnd: number;
  /** Estimated time (seconds) the word is spoken: the line's time spread evenly over its characters. */
  start: number;
  end: number;
}

const WORD = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;
const MIN_LETTERS = 4;
/** Two gaps are at least this many seconds apart, so the next one is never right on the heels of the answer. */
const MIN_SPACING = 1.5;

/** Common words that make dull gaps: filler, pronouns, auxiliaries, conjunctions. */
export const STOPWORDS = new Set(
  (
    "about above actually after again against also always another around because been before being between " +
    "both come could does doing down during each even every from gonna going gotta have having here into " +
    "just kind know like little look make many maybe more most much must okay only other over really right " +
    "same should since some something still such sure than thank thanks that their them then there these " +
    "they thing things think this those through very wanna want well were what when where which while will " +
    "with would yeah your yours yourself"
  ).split(" "),
);

/** Small seeded random generator (mulberry32): the same seed gives the same game. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return h;
}

export function isCandidate(word: string): boolean {
  const w = word.toLowerCase();
  return w.length >= MIN_LETTERS && !/['’]/.test(w) && !STOPWORDS.has(w);
}

/** The words of one caption line with their estimated timing. */
export function tokenizeLine(line: ListeningLine, lineIndex: number): Omit<Gap, "id">[] {
  const duration = Math.max(0, line.end - line.start);
  const len = Math.max(1, line.text.length);
  const out: Omit<Gap, "id">[] = [];
  for (const m of line.text.matchAll(WORD)) {
    const charStart = m.index ?? 0;
    const charEnd = charStart + m[0].length;
    out.push({
      line: lineIndex,
      word: m[0],
      charStart,
      charEnd,
      start: line.start + (charStart / len) * duration,
      end: line.start + (charEnd / len) * duration,
    });
  }
  return out;
}

/**
 * Picks the gaps for one play: about one every `secondsPerGap` seconds of the video, chosen at random
 * among meaningful words (4+ letters, no filler). A word is not gapped twice unless the transcript
 * offers nothing new for a whole period.
 */
export function buildGaps(lines: ListeningLine[], secondsPerGap: number, seed: number): Gap[] {
  const rng = mulberry32(seed);
  const gaps: Gap[] = [];
  const used = new Set<string>();
  let nextAt = (lines[0]?.start ?? 0) + secondsPerGap * 0.6;
  let lastEnd = -Infinity;

  lines.forEach((line, li) => {
    if (line.end < nextAt) return;
    const candidates = tokenizeLine(line, li).filter(
      (w) => isCandidate(w.word) && w.end >= nextAt && w.start >= lastEnd + MIN_SPACING,
    );
    if (candidates.length === 0) return;
    const fresh = candidates.filter((w) => !used.has(w.word.toLowerCase()));
    // A repeated word is only allowed once the gap is a whole period overdue; until then wait for a later line.
    if (fresh.length === 0 && line.start < nextAt + secondsPerGap) return;
    const pool = fresh.length > 0 ? fresh : candidates;
    const pick = pool[Math.floor(rng() * pool.length)];
    gaps.push({ ...pick, id: gaps.length });
    used.add(pick.word.toLowerCase());
    lastEnd = pick.end;
    nextAt = pick.end + secondsPerGap;
  });
  return gaps;
}

/** Roughly how many gaps a level gives for this transcript (for the level picker). */
export function estimateGaps(lines: ListeningLine[], secondsPerGap: number): number {
  return buildGaps(lines, secondsPerGap, 1).length;
}

/** All distinct meaningful words of the transcript (lower case): the pool of wrong options. */
export function collectVocabulary(lines: ListeningLine[]): string[] {
  const set = new Set<string>();
  for (const line of lines) {
    for (const m of line.text.matchAll(WORD)) if (isCandidate(m[0])) set.add(m[0].toLowerCase());
  }
  return [...set];
}

/**
 * The options for one multiple-choice gap: the right word and up to `count - 1` other words of the
 * same transcript, preferring ones of similar length. All lower case, shuffled.
 */
export function buildOptions(word: string, vocabulary: string[], rng: () => number, count = 4): string[] {
  const right = word.toLowerCase();
  const others = vocabulary.filter((w) => w !== right);
  // Shuffle first so equally close words are picked at random, then favour similar lengths.
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  others.sort((a, b) => Math.abs(a.length - right.length) - Math.abs(b.length - right.length));
  const options = [right, ...others.slice(0, count - 1)];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export interface LinePart {
  text: string;
  gap?: Gap;
}

/** A line cut into plain text and gaps, in reading order. */
export function lineParts(text: string, gaps: Gap[]): LinePart[] {
  const parts: LinePart[] = [];
  let at = 0;
  for (const gap of [...gaps].sort((a, b) => a.charStart - b.charStart)) {
    if (gap.charStart > at) parts.push({ text: text.slice(at, gap.charStart) });
    parts.push({ text: text.slice(gap.charStart, gap.charEnd), gap });
    at = gap.charEnd;
  }
  if (at < text.length) parts.push({ text: text.slice(at) });
  return parts;
}

/** Index of the line being spoken at `time` (the last line that has started), or 0 before the first one. */
export function activeLineIndex(lines: ListeningLine[], time: number): number {
  let lo = 0;
  let hi = lines.length - 1;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lines[mid].start <= time) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}
