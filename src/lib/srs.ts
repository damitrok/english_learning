import type { SrsResult } from "@/lib/supabase/types";

export interface SrsCardState {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

export interface SrsReviewResult extends SrsCardState {
  due_at: string;
}

const MIN_EASE_FACTOR = 1.3;
const FIXED_STEPS_DAYS = [1, 3, 7];

/** SM-2 style review, per docs/DESIGN development plan's SRS section. */
export function reviewCard(
  card: SrsCardState,
  result: SrsResult,
  now: Date = new Date()
): SrsReviewResult {
  if (result === "forgot") {
    return finish({ ease_factor: card.ease_factor, interval_days: 1, repetitions: 0 }, now);
  }

  const repetitions = card.repetitions + 1;
  const step = FIXED_STEPS_DAYS[repetitions - 1];

  if (step !== undefined) {
    return finish({ ease_factor: card.ease_factor, interval_days: step, repetitions }, now);
  }

  switch (result) {
    case "hard": {
      const ease_factor = Math.max(MIN_EASE_FACTOR, card.ease_factor - 0.15);
      return finish(
        { ease_factor, interval_days: card.interval_days * 1.2, repetitions },
        now
      );
    }
    case "normal": {
      return finish(
        {
          ease_factor: card.ease_factor,
          interval_days: card.interval_days * card.ease_factor,
          repetitions,
        },
        now
      );
    }
    case "easy": {
      const ease_factor = card.ease_factor + 0.15;
      return finish(
        {
          ease_factor,
          interval_days: card.interval_days * card.ease_factor * 1.3,
          repetitions,
        },
        now
      );
    }
  }
}

function finish(state: SrsCardState, now: Date): SrsReviewResult {
  const dueAt = new Date(now.getTime() + state.interval_days * 24 * 60 * 60 * 1000);
  return { ...state, interval_days: round2(state.interval_days), due_at: dueAt.toISOString() };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
