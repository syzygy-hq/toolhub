import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { TimestampConverter } from "./TimestampConverter";

export default function Page() {
  const tool = getToolBySlug("timestamp-converter")!;
  return (
    <ToolLayout tool={tool}>
      <TimestampConverter />
    </ToolLayout>
  );
}
