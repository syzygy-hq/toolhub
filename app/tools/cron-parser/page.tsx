import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CronExplainer } from "./CronExplainer";

export default function Page() {
  const tool = getToolBySlug("cron-parser")!;
  return (
    <ToolLayout tool={tool}>
      <CronExplainer />
    </ToolLayout>
  );
}
