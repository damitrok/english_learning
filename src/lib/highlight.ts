export type TextSegment =
  | { kind: "text"; value: string }
  | { kind: "word"; value: string; headword: string };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits `body` into plain text and occurrences of `headwords`, matching whole
 * words case-insensitively plus simple inflections (-s/-es/-ed/-d/-ing), so
 * "fixes" and "tested" count as "fix" and "test". Longer headwords win, so
 * "pull request" is matched before "request". No I/O — safe to unit-test.
 */
export function splitByHeadwords(body: string, headwords: string[]): TextSegment[] {
  const unique = [...new Set(headwords.map((h) => h.toLowerCase()))].filter(Boolean);
  if (unique.length === 0) return [{ kind: "text", value: body }];

  unique.sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `\\b(${unique.map(escapeRegExp).join("|")})(?:s|es|ed|d|ing)?\\b`,
    "gi"
  );

  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of body.matchAll(pattern)) {
    const start = match.index;
    if (start > last) segments.push({ kind: "text", value: body.slice(last, start) });
    segments.push({ kind: "word", value: match[0], headword: match[1].toLowerCase() });
    last = start + match[0].length;
  }
  if (last < body.length) segments.push({ kind: "text", value: body.slice(last) });
  return segments;
}
