import { getTodayVocabQueue } from "@/lib/vocab";
import { VocabSession } from "@/components/VocabSession";

export default async function VocabSessionPage() {
  const queue = await getTodayVocabQueue();
  return <VocabSession queue={queue} />;
}
