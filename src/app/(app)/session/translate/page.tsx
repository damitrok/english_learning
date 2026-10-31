import { TRANSLATE_PHRASES } from "@/content/phrases";
import { TranslateSession } from "@/components/TranslateSession";
import { pickPhrases } from "@/lib/phrases-lesson";

export default async function TranslateSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const cycle = Number((await searchParams).n) || 0;
  return <TranslateSession key={cycle} items={pickPhrases(TRANSLATE_PHRASES, cycle)} />;
}
