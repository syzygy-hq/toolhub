import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { TimezonePlanner } from "./TimezonePlanner";

export default function Page() {
  const tool = getToolBySlug("timezone-planner")!;
  return (
    <ToolLayout tool={tool}>
      <TimezonePlanner />
    </ToolLayout>
  );
}
