import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ImageBase64Converter } from "./ImageBase64Converter";

export default function Page() {
  const tool = getToolBySlug("image-base64-converter")!;
  return (
    <ToolLayout tool={tool}>
      <ImageBase64Converter />
    </ToolLayout>
  );
}
