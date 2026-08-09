import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ImagesToPdf } from "./ImagesToPdf";

export default function Page() {
  const tool = getToolBySlug("images-to-pdf")!;
  return (
    <ToolLayout tool={tool}>
      <ImagesToPdf />
    </ToolLayout>
  );
}
