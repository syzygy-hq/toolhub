import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ImageFormatConverter } from "./ImageFormatConverter";

export default function Page() {
  const tool = getToolBySlug("image-format-converter")!;
  return (
    <ToolLayout tool={tool}>
      <ImageFormatConverter />
    </ToolLayout>
  );
}
