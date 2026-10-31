import { getWordsSession } from "@/lib/words";
import { WordsSession } from "@/components/WordsSession";

export default async function VocabSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ more?: string }>;
}) {
  const more = (await searchParams).more === "1";
  const items = await getWordsSession(more);
  // key: a fresh queue (e.g. "learn more") starts with fresh state.
  return <WordsSession key={items.map((i) => i.wordId).join()} items={items} />;
}
