import { LessonPath } from "@/components/LessonPath";
import { StreakWidget } from "@/components/StreakWidget";
import { getPathOverview } from "@/lib/overview";

export default async function PathPage() {
  const { lessonsCompleted } = await getPathOverview();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 sm:pt-4">
      <StreakWidget />
      <LessonPath completed={lessonsCompleted} />
    </div>
  );
}
