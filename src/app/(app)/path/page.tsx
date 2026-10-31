import { LessonPath } from "@/components/LessonPath";
import { StreakWidget } from "@/components/StreakWidget";
import { getPathOverview } from "@/lib/overview";

export default async function PathPage() {
  const { lessonsCompleted, lessonsToday, streak, dayComplete } = await getPathOverview();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 pt-10 sm:pt-4">
      <StreakWidget streak={streak} lessonsToday={lessonsToday} dayComplete={dayComplete} />
      <LessonPath completed={lessonsCompleted} />
    </div>
  );
}
