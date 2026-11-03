import { notFound } from "next/navigation";
import { loadListeningVideo } from "@/content/listening";
import { ListeningGame } from "@/components/ListeningGame";

export default async function ListeningSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const video = await loadListeningVideo((await params).id);
  if (!video) notFound();
  return <ListeningGame key={video.id} video={video} />;
}
