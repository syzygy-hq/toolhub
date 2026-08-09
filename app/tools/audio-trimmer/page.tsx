import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { AudioTrimmer } from "./AudioTrimmer";

export default function Page() {
  const tool = getToolBySlug("audio-trimmer")!;
  return (
    <ToolLayout tool={tool}>
      <AudioTrimmer />
    </ToolLayout>
  );
}
