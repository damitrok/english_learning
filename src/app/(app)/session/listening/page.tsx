import { getTodayListening } from "@/lib/listening";
import { ListeningSession } from "@/components/ListeningSession";

export default async function ListeningSessionPage() {
  const today = await getTodayListening();
  return <ListeningSession key={today.dialogue?.id} today={today} />;
}
