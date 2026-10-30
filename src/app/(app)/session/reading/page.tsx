import { getTodayText } from "@/lib/reading";
import { ReadingSession } from "@/components/ReadingSession";

export default async function ReadingSessionPage() {
  const text = await getTodayText();
  return <ReadingSession key={text?.id} text={text} />;
}
