import { getReviewLesson } from "@/lib/practice";
import { GrammarSession } from "@/components/GrammarSession";
import { AutoComplete } from "@/components/AutoComplete";

export default async function ReviewSessionPage() {
  const lesson = await getReviewLesson();
  if (!lesson) return <AutoComplete step="review" message="Ошибок для повтора нет — так держать!" />;
  return <GrammarSession lesson={lesson} step="review" />;
}
