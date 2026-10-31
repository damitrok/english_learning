// The lesson path: an endless, deterministic sequence of lessons. Lesson `i`
// has the type PATTERN[i % PATTERN.length]; the path position is simply how many
// lessons the learner has finished on the path. Lessons whose material is static
// (build / translate) pick their batch from the cycle number, the others (grammar,
// reading, review) choose from the learner's progress. Words are not on the path:
// they live in their own tab (/), see src/lib/words.ts.
import type { StepName } from "@/lib/dates";

export const PATTERN: readonly StepName[] = [
  "grammar",
  "build",
  "reading",
  "translate",
  "review",
];

/** Lessons per section on the path — one full pass through PATTERN. */
export const UNIT_SIZE = PATTERN.length;

export const LESSON_LABELS: Record<StepName, string> = {
  vocab: "Слова",
  grammar: "Грамматика",
  build: "Собери предложение",
  reading: "Чтение",
  translate: "Перевод",
  review: "Повтор ошибок",
};

export const LESSON_HINTS: Record<StepName, string> = {
  vocab: "повтор и новые слова",
  grammar: "правило и упражнения",
  build: "собери английское предложение из слов",
  reading: "текст со знакомыми словами",
  translate: "переведи фразу с русского на английский",
  review: "задания, в которых ты ошибался",
};

/** Which pass through PATTERN a lesson belongs to — picks the batch of static material. */
export function lessonCycle(index: number): number {
  return Math.floor(index / PATTERN.length);
}

export interface PathLesson {
  index: number;
  type: StepName;
  state: "done" | "current" | "locked";
}

export interface PathUnit {
  number: number;
  lessons: PathLesson[];
  done: number;
}

/**
 * Units to render: all finished units are collapsed to a count (returned
 * separately), then the unit containing the current lesson and the next one.
 */
export function buildPath(completed: number): { finishedUnits: number; units: PathUnit[] } {
  const currentUnit = Math.floor(completed / UNIT_SIZE);
  const units = [currentUnit, currentUnit + 1].map((u): PathUnit => {
    const lessons = Array.from({ length: UNIT_SIZE }, (_, k): PathLesson => {
      const index = u * UNIT_SIZE + k;
      return {
        index,
        type: PATTERN[index % PATTERN.length],
        state: index < completed ? "done" : index === completed ? "current" : "locked",
      };
    });
    return { number: u + 1, lessons, done: lessons.filter((l) => l.state === "done").length };
  });
  return { finishedUnits: currentUnit, units };
}
