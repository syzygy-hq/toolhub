import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ImageResizer } from "./ImageResizer";

export default function Page() {
  const tool = getToolBySlug("image-resizer")!;
  return (
    <ToolLayout tool={tool}>
      <ImageResizer />
    </ToolLayout>
  );
}
