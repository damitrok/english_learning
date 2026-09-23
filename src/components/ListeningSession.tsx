"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { saveListening, type ExtraVideo, type ListeningToday } from "@/lib/listening";
import { compareSpeech, type ShadowingResult } from "@/lib/shadowing";
import {
  canRecognize,
  listenOnce,
  loadEnglishVoices,
  speakAsync,
  stopSpeaking,
} from "@/lib/speech";
import { StepComplete } from "@/components/StepComplete";

type Phase = "listen" | "shadow" | "done";

export function ListeningSession({ today }: { today: ListeningToday }) {
  const dialogue = today.dialogue;
  const [phase, setPhase] = useState<Phase>("listen");
  const [voices, setVoices] = useState<Map<string, SpeechSynthesisVoice>>(new Map());
  const [playingLine, setPlayingLine] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [attempt, setAttempt] = useState<{ heard: string; result: ShadowingResult } | null>(null);
  const [scores, setScores] = useState<(number | null)[]>([]);
  const [micError, setMicError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Browser capability, read on the client only (the server render assumes support).
  const recognitionSupported = useSyncExternalStore(noopSubscribe, canRecognize, () => true);
  const startedAt = useRef<number | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  // Bumped to cancel an in-progress "play all" loop between lines.
  const playRun = useRef(0);

  useEffect(() => {
    startedAt.current = performance.now();
    // One distinct voice per speaker, so a dialogue sounds like a dialogue.
    const speakers = [...new Set(dialogue?.lines.map((l) => l.speaker) ?? [])];
    loadEnglishVoices().then((all) => {
      const preferred = [
        ...all.filter((v) => v.lang === "en-US"),
        ...all.filter((v) => v.lang === "en-GB"),
        ...all.filter((v) => v.lang !== "en-US" && v.lang !== "en-GB"),
      ];
      setVoices(new Map(speakers.map((s, i) => [s, preferred[i % Math.max(preferred.length, 1)]])));
    });
    return () => stopSpeaking();
  }, [dialogue]);

  if (!dialogue) {
    return <EmptyState message="Диалогов пока нет — добавь их в supabase/content/listening.mjs." />;
  }

  const lines = dialogue.lines;
  const current = lines[index];

  function stopPlayback() {
    playRun.current++;
    stopSpeaking();
    setPlayingLine(null);
  }

  async function playAll() {
    stopSpeaking();
    const run = ++playRun.current;
    for (let i = 0; i < lines.length; i++) {
      if (playRun.current !== run) return;
      setPlayingLine(i);
      await speakAsync(lines[i].text, voices.get(lines[i].speaker));
      await new Promise((r) => setTimeout(r, 350));
    }
    setPlayingLine(null);
  }

  async function playLine(i: number, rate?: number) {
    stopPlayback();
    setPlayingLine(i);
    await speakAsync(lines[i].text, voices.get(lines[i].speaker), rate);
    setPlayingLine(null);
  }

  async function record() {
    if (!current) return;
    stopPlayback();
    setMicError(null);
    setAttempt(null);
    setRecording(true);
    const { result, stop } = listenOnce();
    stopRef.current = stop;
    try {
      const heard = await result;
      setAttempt({ heard, result: compareSpeech(current.text, heard) });
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      setMicError(
        code === "not-allowed" || code === "service-not-allowed"
          ? "Нет доступа к микрофону — разреши его в настройках браузера."
          : "Не получилось распознать речь. Попробуй ещё раз."
      );
    } finally {
      setRecording(false);
      stopRef.current = null;
    }
  }

  function nextLine(score: number | null) {
    setScores((prev) => {
      const copy = [...prev];
      copy[index] = score;
      return copy;
    });
    setAttempt(null);
    setMicError(null);
    setIndex((i) => i + 1);
  }

  async function finish(finalScores: (number | null)[]) {
    if (!dialogue) return;
    const measured = finalScores.filter((s): s is number => s !== null);
    const accuracy = measured.length
      ? measured.reduce((a, b) => a + b, 0) / measured.length
      : null;
    setSaveError(null);
    try {
      const seconds = (performance.now() - (startedAt.current ?? performance.now())) / 1000;
      await saveListening(dialogue.id, accuracy, seconds);
      setPhase("done");
    } catch {
      setSaveError("Не сохранилось — проверь соединение и попробуй ещё раз.");
    }
  }

  const header = (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">
          Аудирование · диалог {dialogue.position} / {dialogue.total}
          {dialogue.doneBefore && " · повтор"}
        </p>
        <h1 className="mt-2 text-heading-sm font-normal text-pure-white">{dialogue.title}</h1>
      </div>
      <span className="rounded-badges bg-graphite px-2 py-1 font-mono text-[12px] text-ash">
        {dialogue.level}
      </span>
    </div>
  );

  if (phase === "done") {
    const measured = scores.filter((s): s is number => s !== null);
    const avg = measured.length
      ? Math.round(measured.reduce((a, b) => a + b, 0) / measured.length)
      : null;
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-8">
        <StepComplete
          step="listening"
          message={
            avg === null
              ? "Готово! Диалог пройден."
              : `Готово! Средняя точность повтора: ${avg}%.`
          }
        />
        <ExtraVideos videos={today.videos} />
      </div>
    );
  }

  if (phase === "listen") {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
        {header}
        <p className="text-body text-ash">
          Сначала послушай диалог целиком и постарайся понять смысл. Текст можно открыть, если
          совсем непонятно.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={playAll}
            disabled={playingLine !== null}
            className="rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron disabled:opacity-40"
          >
            {playingLine !== null ? "Играет…" : "▶ Слушать диалог"}
          </button>
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="rounded-buttons border border-border-hairline px-4 py-2 text-body text-pure-white hover:bg-white/5"
          >
            {showTranscript ? "Скрыть текст" : "Показать текст"}
          </button>
        </div>
        {showTranscript && (
          <div className="flex flex-col gap-3 rounded-cards border border-border-hairline bg-ink p-6 shadow-key">
            {lines.map((l, i) => (
              <p
                key={i}
                className={`text-body-lg ${playingLine === i ? "text-pure-white" : "text-mist"}`}
              >
                <span className="font-medium text-ash">{l.speaker}: </span>
                {l.text}
              </p>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            stopPlayback();
            setPhase("shadow");
          }}
          className="self-start rounded-buttons border border-border-hairline px-4 py-2 text-body font-medium text-pure-white hover:bg-white/5"
        >
          К повтору (shadowing) →
        </button>
        <ExtraVideos videos={today.videos} />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
        {header}
        <p className="text-body-lg text-pure-white">Все реплики повторены.</p>
        <button
          onClick={() => finish(scores)}
          className="self-start rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
        >
          Завершить
        </button>
        {saveError && <p className="text-body text-coral-pulse">{saveError}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
      {header}
      <p className="text-body text-ash">
        Реплика {index + 1} / {lines.length}. Послушай и повтори вслух с той же интонацией.
      </p>

      <div className="flex flex-col gap-4 rounded-cards border border-border-hairline bg-ink p-6 shadow-key sm:p-10">
        <p className="text-body font-medium text-ash">{current.speaker}</p>
        {attempt ? (
          <p className="text-subheading leading-relaxed">
            {attempt.result.words.map((w, i) => (
              <span key={i} className={w.matched ? "text-success-green" : "text-coral-pulse"}>
                {w.word}{" "}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-subheading leading-relaxed text-pure-white">{current.text}</p>
        )}
        {attempt && (
          <p className="text-body text-ash">
            Услышано: «{attempt.heard || "—"}» · совпадение {attempt.result.accuracy}%
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => playLine(index)}
          disabled={recording}
          className="rounded-buttons border border-border-hairline px-4 py-2 text-body text-pure-white hover:bg-white/5 disabled:opacity-40"
        >
          🔊 Послушать
        </button>
        <button
          onClick={() => playLine(index, 0.7)}
          disabled={recording}
          className="rounded-buttons border border-border-hairline px-4 py-2 text-body text-pure-white hover:bg-white/5 disabled:opacity-40"
        >
          🐢 Медленно
        </button>
        {recognitionSupported &&
          (recording ? (
            <button
              onClick={() => stopRef.current?.()}
              className="rounded-buttons bg-coral-pulse px-4 py-2 text-body font-medium text-pure-white"
            >
              ● Слушаю… (стоп)
            </button>
          ) : (
            <button
              onClick={record}
              className="rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
            >
              🎙 {attempt ? "Ещё раз" : "Повторить"}
            </button>
          ))}
      </div>

      {!recognitionSupported && (
        <p className="text-body text-ash">
          Этот браузер не умеет распознавать речь (нужен Chrome, Edge или Safari). Повтори вслух
          сам и переходи дальше.
        </p>
      )}
      {micError && <p className="text-body text-coral-pulse">{micError}</p>}

      {(attempt || !recognitionSupported || micError) && (
        <button
          onClick={() => nextLine(attempt ? attempt.result.accuracy : null)}
          className="self-start rounded-buttons border border-border-hairline px-4 py-2 text-body font-medium text-pure-white hover:bg-white/5"
        >
          {index + 1 < lines.length ? "Следующая реплика →" : "Готово →"}
        </button>
      )}
    </div>
  );
}

function noopSubscribe() {
  return () => {};
}

function youtubeId(url: string): string | null {
  return url.match(/[?&]v=([\w-]{11})/)?.[1] ?? url.match(/youtu\.be\/([\w-]{11})/)?.[1] ?? null;
}

function ExtraVideos({ videos }: { videos: ExtraVideo[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (videos.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-subheading font-medium text-pure-white">Дополнительно: видео (B2)</h2>
      <p className="text-body text-ash">
        Настоящая скорость речи, без транскрипта. Слушай ради общего смысла — понимать каждое
        слово не нужно.
      </p>
      {videos.map((v) => {
        const id = youtubeId(v.url);
        const isOpen = open === v.id;
        return (
          <div key={v.id} className="rounded-cards border border-border-hairline bg-ink p-4">
            <button
              onClick={() => setOpen(isOpen ? null : v.id)}
              className="text-left text-body-lg text-pure-white"
            >
              {isOpen ? "▾" : "▸"} {v.title}
            </button>
            {isOpen && id && (
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-buttons">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${id}?start=${v.startSeconds}`}
                  title={v.title}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-8 text-center">
      <p className="text-body-lg text-pure-white">{message}</p>
      <Link
        href="/"
        className="rounded-buttons bg-mist px-4 py-2 text-body font-medium text-iron"
      >
        Вернуться к «Сегодня»
      </Link>
    </div>
  );
}
