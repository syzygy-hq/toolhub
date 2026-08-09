import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { RobotsGenerator } from "./RobotsGenerator";

export default function Page() {
  const tool = getToolBySlug("robots-generator")!;
  return (
    <ToolLayout tool={tool}>
      <RobotsGenerator />
    </ToolLayout>
  );
}
