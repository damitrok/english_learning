"use client";

import { useEffect, useRef } from "react";
import { markStepDone } from "@/lib/steps";
import type { StepName } from "@/lib/dates";

/** Records the lesson as finished (once) when `done` becomes true, with the time spent since mount. */
export function useStepOnce(step: StepName, done: boolean) {
  const startedAt = useRef<number | null>(null);
  const marked = useRef(false);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (!done || marked.current) return;
    marked.current = true;
    const seconds = (performance.now() - (startedAt.current ?? performance.now())) / 1000;
    markStepDone(step, seconds).catch(() => {
      marked.current = false;
    });
  }, [done, step]);
}
