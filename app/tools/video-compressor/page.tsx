import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { VideoCompressor } from "./VideoCompressor";

export default function Page() {
  const tool = getToolBySlug("video-compressor")!;
  return (
    <ToolLayout tool={tool}>
      <VideoCompressor />
    </ToolLayout>
  );
}
