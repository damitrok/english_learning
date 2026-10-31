import { getGrammarLesson } from "@/lib/grammar";
import { GrammarSession } from "@/components/GrammarSession";
import { AutoComplete } from "@/components/AutoComplete";

export default async function GrammarSessionPage() {
  const lesson = await getGrammarLesson();
  if (!lesson) {
    return <AutoComplete step="grammar" message="Все темы с упражнениями пройдены — урок засчитан." />;
  }
  return <GrammarSession lesson={lesson} />;
}
