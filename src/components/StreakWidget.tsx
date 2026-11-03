import { DailyTasks } from "@/components/DailyTasks";
import { getDailyOverview } from "@/lib/overview";

/** The streak pill in the top-right corner of the main tabs; it opens today's tasks. */
export async function StreakWidget() {
  return <DailyTasks {...await getDailyOverview()} />;
}
