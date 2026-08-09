import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PdfWatermark } from "./PdfWatermark";

export default function Page() {
  const tool = getToolBySlug("pdf-watermark")!;
  return (
    <ToolLayout tool={tool}>
      <PdfWatermark />
    </ToolLayout>
  );
}
