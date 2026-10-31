"use client";

import type { StepName } from "@/lib/dates";
import { StepComplete } from "@/components/StepComplete";
import { useStepOnce } from "@/components/useStepOnce";

/** A lesson with nothing to do (e.g. no mistakes to review) still counts, so the path never stalls. */
export function AutoComplete({ step, message }: { step: StepName; message: string }) {
  useStepOnce(step, true);
  return <StepComplete step={step} message={message} />;
}
