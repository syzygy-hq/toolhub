import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PdfMerge } from "./PdfMerge";

export default function Page() {
  const tool = getToolBySlug("pdf-merge")!;
  return (
    <ToolLayout tool={tool}>
      <PdfMerge />
    </ToolLayout>
  );
}
