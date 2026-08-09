import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PomodoroTimer } from "./PomodoroTimer";

export default function Page() {
  const tool = getToolBySlug("pomodoro-timer")!;
  return (
    <ToolLayout tool={tool}>
      <PomodoroTimer />
    </ToolLayout>
  );
}
