// Word-level comparison of what the learner said (speech recognition output)
// against the target line. No I/O — safe to unit-test.

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan't\b/g, "can not"],
  [/\bcannot\b/g, "can not"],
  [/\bwon't\b/g, "will not"],
  [/n't\b/g, " not"],
  [/'m\b/g, " am"],
  [/'re\b/g, " are"],
  [/'ll\b/g, " will"],
  [/'ve\b/g, " have"],
  [/'d\b/g, " would"],
  // "it's / that's / what's / let's": recognizers output both forms, so fold them
  // to the long form on both sides ("let's" → "let us" stays consistent too).
  [/\blet'?s\b/g, "let us"], // recognizers often drop the apostrophe: "lets"
  [/\bokay\b/g, "ok"],
  [/'s\b/g, " is"],
];

const NUMBERS: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
  "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
  "11": "eleven", "12": "twelve", "18": "eighteen", "20": "twenty", "50": "fifty",
};

/** Lowercase words with contractions expanded, digits spelled out and punctuation dropped. */
export function toWords(text: string): string[] {
  let s = text.toLowerCase().replace(/[‘’ʼ`]/g, "'");
  for (const [re, long] of CONTRACTIONS) s = s.replace(re, long);
  return s
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => NUMBERS[w] ?? w.replace(/'/g, ""));
}

export interface ShadowingResult {
  /** One entry per word of the target (in toWords form): was it said? */
  words: { word: string; matched: boolean }[];
  /** Share of target words that were said, 0-100. */
  accuracy: number;
}

/** Marks which target words appear, in order, in what was said (longest common subsequence). */
export function compareSpeech(target: string, spoken: string): ShadowingResult {
  const a = toWords(target);
  const b = toWords(spoken);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const matched = new Array<boolean>(a.length).fill(false);
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (a[i] === b[j]) {
      matched[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  const hits = matched.filter(Boolean).length;
  return {
    words: a.map((word, i) => ({ word, matched: matched[i] })),
    accuracy: a.length === 0 ? 0 : Math.round((hits / a.length) * 100),
  };
}
