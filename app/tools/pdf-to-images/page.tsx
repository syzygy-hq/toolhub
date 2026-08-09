import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PdfToImages } from "./PdfToImages";

export default function Page() {
  const tool = getToolBySlug("pdf-to-images")!;
  return (
    <ToolLayout tool={tool}>
      <PdfToImages />
    </ToolLayout>
  );
}
