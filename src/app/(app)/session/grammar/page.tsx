import { getGrammarLesson } from "@/lib/grammar";
import { GrammarSession } from "@/components/GrammarSession";

export default async function GrammarSessionPage() {
  const lesson = await getGrammarLesson();
  return <GrammarSession lesson={lesson} />;
}
