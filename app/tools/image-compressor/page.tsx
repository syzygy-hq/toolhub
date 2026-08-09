import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ImageCompressor } from "./ImageCompressor";

export default function Page() {
  const tool = getToolBySlug("image-compressor")!;
  return (
    <ToolLayout tool={tool}>
      <ImageCompressor />
    </ToolLayout>
  );
}
