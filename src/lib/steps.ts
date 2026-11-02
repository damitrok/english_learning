"use server";

import { recordStep } from "@/lib/day-server";
import { clampSeconds, isStepName } from "@/lib/input-guards";

/** Client-callable: marks a step done (used by steps without their own save action). */
export async function markStepDone(step: string, secondsSpent: number): Promise<void> {
  if (!isStepName(step)) throw new Error("Unknown step");
  await recordStep(step, clampSeconds(secondsSpent));
}
