import { BUILD_PHRASES } from "@/content/phrases";
import { BuildSession } from "@/components/BuildSession";
import { pickPhrases, seededShuffle, tokenize } from "@/lib/phrases-lesson";

export default async function BuildSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const cycle = Number((await searchParams).n) || 0;
  const items = pickPhrases(BUILD_PHRASES, cycle).map((p, i) => ({
    ...p,
    tokens: seededShuffle(tokenize(p.en), cycle * 100 + i + 1),
  }));
  return <BuildSession key={cycle} items={items} />;
}
