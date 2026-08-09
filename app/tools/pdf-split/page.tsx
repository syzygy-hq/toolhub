import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PdfSplit } from "./PdfSplit";

export default function Page() {
  const tool = getToolBySlug("pdf-split")!;
  return (
    <ToolLayout tool={tool}>
      <PdfSplit />
    </ToolLayout>
  );
}
