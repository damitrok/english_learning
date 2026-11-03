"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ListeningVideo } from "@/content/listening/types";
import {
  LEVELS,
  activeLineIndex,
  buildGaps,
  buildOptions,
  collectVocabulary,
  estimateGaps,
  hashSeed,
  lineParts,
  mulberry32,
  type Gap,
  type LevelId,
} from "@/lib/listening-game";
import { checkWordAnswer } from "@/lib/word-check";
import { SessionFrame } from "@/components/SessionFrame";
import { useYouTubePlayer } from "@/components/useYouTubePlayer";

type Mode = "choice" | "type";
type Phase = "setup" | "play" | "done";
type Outcome = "hit" | "miss";

/** The video stops this long after the gap word has been spoken, so the learner has heard all of it. */
const PAUSE_AFTER_WORD = 0.25;
/** "Repeat" restarts the phrase a little before the line begins. */
const REPLAY_LEAD = 0.3;
const POLL_MS = 120;

const inputClass =
  "min-h-14 w-full rounded-cards border border-border-hairline bg-obsidian px-4 text-body-lg text-pure-white placeholder:text-smoke focus:border-ash focus:outline-none";

/**
 * Fill-in-the-gaps listening game: the video plays, the transcript is shown with some words missing,
 * and after each gap word has been spoken the video stops and the learner picks or types it.
 */
export function ListeningGame({ video }: { video: ListeningVideo }) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [level, setLevel] = useState<LevelId>("normal");
  const [mode, setMode] = useState<Mode>("choice");
  const [round, setRound] = useState(0);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [results, setResults] = useState<Record<number, Outcome>>({});
  const [asking, setAsking] = useState<Gap | null>(null);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [playing, setPlaying] = useState(false);
  /** Index of the first gap not settled yet (mirrors nextRef for rendering). */
  const [nextGap, setNextGap] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const gapsRef = useRef<Gap[]>([]);
  const nextRef = useRef(0);
  const askingRef = useRef<Gap | null>(null);
  const phaseRef = useRef<Phase>("setup");
  const firstTry = useRef(true);
  const finishRef = useRef<() => void>(() => {});

  const { playerRef, ready, error } = useYouTubePlayer(video.id, containerRef, () => {
    // The video ended with gaps still waiting (e.g. the last words): finish the game.
    if (phaseRef.current === "play" && !askingRef.current) finishRef.current();
  });
  const vocabulary = useMemo(() => collectVocabulary(video.lines), [video.lines]);
  const levelInfo = LEVELS.find((l) => l.id === level) ?? LEVELS[1];
  const counts = useMemo(() => LEVELS.map((l) => estimateGaps(video.lines, l.secondsPerGap)), [video.lines]);
  const options = useMemo(
    () => (asking ? buildOptions(asking.word, vocabulary, mulberry32(hashSeed(`${video.id}:${asking.id}:${round}`))) : []),
    [asking, vocabulary, video.id, round],
  );

  function setPhaseBoth(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }

  function finish() {
    try {
      playerRef.current?.pauseVideo();
    } catch {
      // player already gone
    }
    askingRef.current = null;
    setAsking(null);
    setPlaying(false);
    setPhaseBoth("done");
  }

  useEffect(() => {
    finishRef.current = finish;
  });

  function start() {
    const picked = buildGaps(video.lines, levelInfo.secondsPerGap, hashSeed(`${video.id}:${level}:${round}`));
    gapsRef.current = picked;
    nextRef.current = 0;
    setNextGap(0);
    askingRef.current = null;
    setGaps(picked);
    setResults({});
    setAsking(null);
    setWrongPicks([]);
    setTyped("");
    setRevealed(false);
    setActiveLine(0);
    setPhaseBoth("play");
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(Math.max(0, (video.lines[0]?.start ?? 0) - 1), true);
    p.playVideo();
    setPlaying(true);
  }

  // Follow the playback: highlight the current line and stop at the next gap.
  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setInterval(() => {
      const p = playerRef.current;
      if (!p || askingRef.current) return;
      const t = p.getCurrentTime();
      setActiveLine(activeLineIndex(video.lines, t));
      const gap = gapsRef.current[nextRef.current];
      if (gap && t >= gap.end + PAUSE_AFTER_WORD) {
        p.pauseVideo();
        askingRef.current = gap;
        firstTry.current = true;
        setWrongPicks([]);
        setTyped("");
        setRevealed(false);
        setPlaying(false);
        setAsking(gap);
      } else if (!gap && t >= (video.lines.at(-1)?.end ?? 0)) {
        finish();
      }
    }, POLL_MS);
    return () => window.clearInterval(timer);
    // finish() only touches refs and setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, video.lines, playerRef]);

  // Bring the open gap into view above the answer panel.
  useEffect(() => {
    if (!asking) return;
    document.querySelector("[data-open-gap]")?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [asking]);

  function settle(outcome: Outcome) {
    const gap = askingRef.current;
    if (!gap) return;
    if (firstTry.current) setResults((r) => ({ ...r, [gap.id]: outcome }));
    firstTry.current = false;
  }

  /** The right word was chosen (or revealed): carry on with the video. */
  function resume() {
    const gap = askingRef.current;
    if (!gap) return;
    nextRef.current = gap.id + 1;
    setNextGap(gap.id + 1);
    askingRef.current = null;
    setAsking(null);
    setTyped("");
    setRevealed(false);
    setWrongPicks([]);
    if (nextRef.current >= gapsRef.current.length) {
      finish();
      return;
    }
    playerRef.current?.playVideo();
    setPlaying(true);
  }

  function pick(option: string) {
    if (!asking || wrongPicks.includes(option)) return;
    if (option === asking.word.toLowerCase()) {
      settle("hit");
      resume();
    } else {
      settle("miss");
      setWrongPicks((w) => [...w, option]);
    }
  }

  function submitTyped() {
    if (!asking || revealed) return;
    const verdict = checkWordAnswer(typed, [asking.word]);
    if (verdict === "wrong") {
      settle("miss");
      setRevealed(true);
    } else {
      settle("hit");
      resume();
    }
  }

  function giveUp() {
    if (!asking) return;
    settle("miss");
    setRevealed(true);
  }

  function replay() {
    const p = playerRef.current;
    const gap = asking ?? gapsRef.current[nextRef.current];
    if (!p || !gap) return;
    p.seekTo(Math.max(0, video.lines[gap.line].start - REPLAY_LEAD), true);
    askingRef.current = null;
    setAsking(null);
    p.playVideo();
    setPlaying(true);
  }

  function togglePlay() {
    const p = playerRef.current;
    if (!p || asking) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
    setPlaying(!playing);
  }

  function again() {
    setRound((r) => r + 1);
    setPhaseBoth("setup");
  }

  const answered = Object.keys(results).length;
  const hits = Object.values(results).filter((o) => o === "hit").length;
  const progress = phase === "done" ? 1 : gaps.length ? (asking ? asking.id : nextGap) / gaps.length : 0;
  const gapsByLine = useMemo(() => {
    const map = new Map<number, Gap[]>();
    for (const g of gaps) map.set(g.line, [...(map.get(g.line) ?? []), g]);
    return map;
  }, [gaps]);

  const player = (
    <div className="relative mx-auto w-full overflow-hidden rounded-cards bg-obsidian" style={{ maxWidth: "min(100%, 53dvh)" }}>
      <div ref={containerRef} className="aspect-video w-full [&_iframe]:h-full [&_iframe]:w-full" />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-obsidian p-4 text-center">
          <p className="text-body text-coral-pulse">{error}</p>
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-body text-electric-sky underline">
            Открыть на YouTube
          </a>
        </div>
      )}
    </div>
  );

  if (phase === "done") {
    const missed = gaps.filter((g) => results[g.id] === "miss");
    const total = gaps.length;
    return (
      <SessionFrame
        progress={1}
        backHref="/listening"
        footer={
          <div className="flex gap-3">
            <Link href="/listening" className="btn-secondary flex-1">
              К видео
            </Link>
            <button onClick={again} className="btn-primary flex-1">
              Ещё раз
            </button>
          </div>
        }
      >
        <div className="sr-only" aria-hidden>
          {player}
        </div>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-heading-sm font-medium text-pure-white">
            Верно с первого раза: {hits} из {total}
          </p>
          <p className="text-body-lg text-ash">{total ? `${Math.round((hits / total) * 100)}%` : "Пропусков не было"}</p>
        </div>
        {missed.length > 0 && (
          <div className="rounded-cards border border-border-hairline bg-obsidian p-4">
            <p className="mb-3 text-body font-medium text-ash">Слова, которые стоит повторить</p>
            <ul className="flex flex-col gap-2">
              {missed.map((g) => (
                <li key={g.id} className="text-body-lg text-pure-white">
                  <span className="font-medium text-coral-pulse">{g.word.toLowerCase()}</span>
                  <span className="text-ash"> — {video.lines[g.line].text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SessionFrame>
    );
  }

  if (phase === "setup") {
    return (
      <SessionFrame
        progress={0}
        backHref="/listening"
        footer={
          <button onClick={start} disabled={!ready || !!error || counts[LEVELS.indexOf(levelInfo)] === 0} className="btn-primary disabled:opacity-50">
            {error ? "Видео недоступно" : ready ? "Начать" : "Загружаю видео…"}
          </button>
        }
      >
        {player}
        <div>
          <h1 className="text-heading-sm font-medium text-pure-white">{video.title}</h1>
          <p className="text-body text-ash">{video.channel}</p>
        </div>
        {video.captions === "auto" && (
          <p className="rounded-cards border border-border-hairline bg-obsidian p-3 text-body text-ash">
            Текст сделан автоматически (YouTube), в нём бывают ошибки — если слово звучит иначе, это не ваша вина.
          </p>
        )}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-body font-medium text-ash">Сколько пропусков</legend>
          {LEVELS.map((l, i) => (
            <label
              key={l.id}
              className={`flex min-h-tap cursor-pointer items-center justify-between rounded-cards border px-4 py-3 ${
                level === l.id ? "border-coral-pulse bg-ember-hush" : "border-border-hairline bg-obsidian"
              }`}
            >
              <span>
                <input type="radio" name="level" checked={level === l.id} onChange={() => setLevel(l.id)} className="sr-only" />
                <span className="text-body-lg font-medium text-pure-white">{l.label}</span>
                <span className="block text-body text-ash">{l.hint}</span>
              </span>
              <span className="text-body text-ash">≈ {counts[i]}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-body font-medium text-ash">Как отвечать</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["choice", "type"] as const).map((m) => (
              <label
                key={m}
                className={`flex min-h-tap cursor-pointer items-center justify-center rounded-cards border px-4 py-3 text-body-lg font-medium ${
                  mode === m ? "border-coral-pulse bg-ember-hush text-pure-white" : "border-border-hairline bg-obsidian text-ash"
                }`}
              >
                <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                {m === "choice" ? "Выбрать слово" : "Вписать слово"}
              </label>
            ))}
          </div>
        </fieldset>
      </SessionFrame>
    );
  }

  // phase === "play"
  const shown = [activeLine - 1, activeLine, activeLine + 1].filter((i) => i >= 0 && i < video.lines.length);
  const footer = asking ? (
    mode === "choice" ? (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => pick(o)}
              disabled={wrongPicks.includes(o)}
              className={`min-h-14 rounded-cards border px-3 text-body-lg font-medium ${
                wrongPicks.includes(o)
                  ? "border-coral-edge bg-ember-hush text-coral-pulse opacity-70"
                  : "border-border-hairline bg-obsidian text-pure-white active:bg-graphite"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        <button onClick={replay} className="btn-secondary">
          Послушать ещё раз
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {revealed ? (
          <>
            <p className="text-center text-body-lg text-pure-white">
              Правильно: <span className="font-medium text-success-green">{asking.word}</span>
            </p>
            {/* No autoFocus: the Enter that submitted the answer would press this button too. */}
            <button onClick={resume} className="btn-primary">
              Дальше
            </button>
          </>
        ) : (
          <>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitTyped()}
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Впиши услышанное слово"
              aria-label="Пропущенное слово"
              className={inputClass}
            />
            <div className="flex gap-2">
              <button onClick={giveUp} className="btn-secondary flex-1">
                Не знаю
              </button>
              <button onClick={replay} className="btn-secondary flex-1">
                Ещё раз
              </button>
              <button onClick={submitTyped} disabled={!typed.trim()} className="btn-primary flex-1 disabled:opacity-50">
                Проверить
              </button>
            </div>
          </>
        )}
      </div>
    )
  ) : (
    <div className="flex gap-3">
      <button onClick={togglePlay} className="btn-secondary flex-1">
        {playing ? "Пауза" : "Играть"}
      </button>
      <button onClick={replay} className="btn-secondary flex-1">
        Повторить фразу
      </button>
    </div>
  );

  return (
    <SessionFrame progress={progress} backHref="/listening" footer={footer}>
      {player}
      <p className="text-body text-ash" aria-live="polite">
        Пропуск {Math.min((asking ? asking.id : nextGap) + 1, gaps.length)} из {gaps.length} · верно {hits}/{answered}
      </p>
      <div className="flex flex-col gap-3 rounded-cards border border-border-hairline bg-obsidian p-4">
        {shown.map((i) => (
          <p key={i} className={`text-body-lg leading-relaxed ${i === activeLine ? "text-pure-white" : "text-smoke"}`}>
            {lineParts(video.lines[i].text, gapsByLine.get(i) ?? []).map((part, k) => {
              const gap = part.gap;
              if (!gap) return <Fragment key={k}>{part.text}</Fragment>;
              const outcome = results[gap.id];
              const isCurrent = asking?.id === gap.id;
              const resolved = gap.id < (asking ? asking.id : nextGap);
              if (resolved || (isCurrent && revealed)) {
                return (
                  <span key={k} className={outcome === "hit" ? "font-medium text-success-green" : "font-medium text-coral-pulse"}>
                    {part.text}
                  </span>
                );
              }
              return (
                <span
                  key={k}
                  data-open-gap={isCurrent ? "" : undefined}
                  aria-label="пропущенное слово"
                  className={`inline-block rounded-badges align-baseline ${isCurrent ? "bg-coral-pulse/30" : "bg-graphite"}`}
                  style={{ minWidth: `${Math.max(3, part.text.length) * 0.6}em` }}
                >
                  &nbsp;
                </span>
              );
            })}
          </p>
        ))}
      </div>
      {asking && <div aria-hidden style={{ height: "14rem" }} />}
    </SessionFrame>
  );
}
