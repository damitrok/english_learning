import { getContextLesson } from "@/lib/practice";
import { ContextSession } from "@/components/ContextSession";

export default async function ContextSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const cycle = Number((await searchParams).n) || 0;
  return <ContextSession key={cycle} items={await getContextLesson(cycle)} />;
}
