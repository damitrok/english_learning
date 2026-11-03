"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** The part of the YouTube IFrame Player API this app uses. */
export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  destroy(): void;
}

interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YT_ENDED = 0;

let apiPromise: Promise<void> | null = null;

/** Loads https://www.youtube.com/iframe_api once for the whole app. */
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error("YouTube API failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

/**
 * Creates a YouTube player (privacy-enhanced host, no YouTube controls) inside `containerRef`.
 * `error` is set when the API can't load or the video can't be played in an embed.
 */
export function useYouTubePlayer(videoId: string, containerRef: RefObject<HTMLDivElement | null>, onEnded?: () => void) {
  const playerRef = useRef<YTPlayer | null>(null);
  const endedRef = useRef(onEnded);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    endedRef.current = onEnded;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    const mount = document.createElement("div");
    container.appendChild(mount);

    loadYouTubeApi()
      .then(() => {
        if (cancelled || !window.YT) return;
        playerRef.current = new window.YT.Player(mount, {
          videoId,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0, modestbranding: 1, fs: 0, iv_load_policy: 3, origin: window.location.origin },
          events: {
            onReady: () => !cancelled && setReady(true),
            onStateChange: (e) => {
              if (e.data === YT_ENDED) endedRef.current?.();
            },
            onError: (e) =>
              !cancelled &&
              setError(
                e.data === 101 || e.data === 150 || e.data === 153
                  ? "Автор запретил показ этого видео вне YouTube."
                  : "Видео не загрузилось. Проверьте интернет и попробуйте ещё раз.",
              ),
          },
        });
      })
      .catch(() => !cancelled && setError("Не удалось загрузить плеер YouTube. Проверьте интернет."));

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // already gone
      }
      playerRef.current = null;
      mount.remove();
    };
  }, [videoId, containerRef]);

  return { playerRef, ready, error };
}
