"use server";

import { recordStep } from "@/lib/day-server";
import type { StepName } from "@/lib/dates";

/** Client-callable: marks a step done (used by steps without their own save action). */
export async function markStepDone(step: StepName, secondsSpent: number): Promise<void> {
  await recordStep(step, secondsSpent);
}
