/** One caption line of a video: shown together, its words are spread evenly over start..end. */
export interface ListeningLine {
  /** Seconds from the start of the video. */
  start: number;
  end: number;
  text: string;
}

/** A video prepared by `npm run listening` (src/content/listening/videos/<id>.json). */
export interface ListeningVideo {
  /** YouTube video id. */
  id: string;
  url: string;
  title: string;
  channel: string;
  durationSeconds: number;
  language: "en";
  /** "manual": captions written by people; "auto": YouTube's speech recognition (may contain errors). */
  captions: "manual" | "auto";
  /** ISO date the video was added. */
  addedAt: string;
  lines: ListeningLine[];
}

/** What the video list needs, without the transcript. */
export interface ListeningVideoMeta {
  id: string;
  url: string;
  title: string;
  channel: string;
  durationSeconds: number;
  captions: "manual" | "auto";
  lineCount: number;
  wordCount: number;
}
