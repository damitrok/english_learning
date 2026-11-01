// Server-side checks for values that arrive from the browser in Server Actions. A Server Action is
// a public POST endpoint, so TypeScript types alone prove nothing about what a client really sent.
import { LESSON_TYPES, type StepName } from "@/lib/dates";
import type { SrsResult } from "@/lib/supabase/types";

/** A lesson that lasts longer than this is a stuck tab, not study time. */
export const MAX_SECONDS = 4 * 60 * 60;
/** Longest typed answer we store. */
export const MAX_ANSWER_LENGTH = 500;
/** Largest number of questions in one reading text. */
export const MAX_QUESTIONS = 50;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SRS_RESULTS: readonly string[] = ["forgot", "hard", "normal", "easy"];

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export function isStepName(value: unknown): value is StepName {
  return typeof value === "string" && (LESSON_TYPES as readonly string[]).includes(value);
}

export function isSrsResult(value: unknown): value is SrsResult {
  return typeof value === "string" && SRS_RESULTS.includes(value);
}

/** Whole seconds in [0, MAX_SECONDS]; anything that is not a finite number counts as 0. */
export function clampSeconds(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(MAX_SECONDS, Math.max(0, Math.round(value)));
}

/** A whole number in [0, max]; anything that is not a finite number counts as 0. */
export function clampCount(value: unknown, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, Math.trunc(value)));
}

/** The typed answer, or null when it is not a string or is too long. */
export function cleanAnswer(value: unknown): string | null {
  return typeof value === "string" && value.length <= MAX_ANSWER_LENGTH ? value : null;
}
