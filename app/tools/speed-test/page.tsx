import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { SpeedTest } from "./SpeedTest";

export default function Page() {
  const tool = getToolBySlug("speed-test")!;
  return (
    <ToolLayout tool={tool}>
      <SpeedTest />
    </ToolLayout>
  );
}
