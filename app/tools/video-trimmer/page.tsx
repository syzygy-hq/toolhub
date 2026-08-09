import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { VideoTrimmer } from "./VideoTrimmer";

export default function Page() {
  const tool = getToolBySlug("video-trimmer")!;
  return (
    <ToolLayout tool={tool}>
      <VideoTrimmer />
    </ToolLayout>
  );
}
