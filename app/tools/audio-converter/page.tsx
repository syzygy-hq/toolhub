import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { AudioConverter } from "./AudioConverter";

export default function Page() {
  const tool = getToolBySlug("audio-converter")!;
  return (
    <ToolLayout tool={tool}>
      <AudioConverter />
    </ToolLayout>
  );
}
