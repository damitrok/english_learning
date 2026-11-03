import Link from "next/link";
import { LISTENING_VIDEOS } from "@/content/listening";
import { StreakWidget } from "@/components/StreakWidget";

function duration(seconds: number): string {
  const m = Math.round(seconds / 60);
  return m >= 60 ? `${Math.floor(m / 60)} ч ${m % 60} мин` : `${m} мин`;
}

export default function ListeningPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-4 pt-10 sm:pt-4">
      <StreakWidget />
      <div>
        <h1 className="text-heading-sm font-medium text-pure-white">Аудирование</h1>
        <p className="text-body text-ash">
          Выберите видео: оно играет, а в тексте пропущены слова. Услышали — впишите или выберите.
        </p>
      </div>

      {LISTENING_VIDEOS.length === 0 ? (
        <div className="rounded-cards border border-border-hairline bg-obsidian p-5 text-body text-ash">
          Видео пока нет. Добавьте ссылку на YouTube в <code className="text-pure-white">src/content/listening/links.txt</code> и
          запустите <code className="text-pure-white">npm run listening</code>.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {LISTENING_VIDEOS.map((v) => (
            <li key={v.id}>
              <Link
                href={`/session/listening/${v.id}`}
                className="flex h-full flex-col overflow-hidden rounded-cards border border-border-hairline bg-obsidian transition-colors active:bg-graphite sm:hover:bg-graphite"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail, no optimisation needed */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full bg-graphite object-cover"
                />
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h2 className="line-clamp-2 text-body-lg font-medium text-pure-white">{v.title}</h2>
                  <p className="text-body text-ash">{v.channel}</p>
                  <p className="mt-auto pt-2 text-body text-smoke">
                    {duration(v.durationSeconds)} · {v.wordCount} слов
                    {v.captions === "auto" ? " · автотекст" : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
