// RU→EN phrase corpus for the build-a-sentence and translate lessons: 690 phrases each, in blocks
// of 6 per path section, following the grammar-unit order and rising from A1 to B1.
// Parts: units 1–14, 15–28, 29–43, 44–57, 58–72, 73–86, 87–100, 101–115.
import * as p1 from "./phrases/part-1";
import * as p2 from "./phrases/part-2";
import * as p3 from "./phrases/part-3";
import * as p4 from "./phrases/part-4";
import * as p5 from "./phrases/part-5";
import * as p6 from "./phrases/part-6";
import * as p7 from "./phrases/part-7";
import * as p8 from "./phrases/part-8";

export type { Phrase, PhraseLevel } from "./phrase-types";

const parts = [p1, p2, p3, p4, p5, p6, p7, p8];

export const BUILD_PHRASES = parts.flatMap((p) => p.BUILD);
export const TRANSLATE_PHRASES = parts.flatMap((p) => p.TRANSLATE);
