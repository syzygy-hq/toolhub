import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PdfCompress } from "./PdfCompress";

export default function Page() {
  const tool = getToolBySlug("pdf-compress")!;
  return (
    <ToolLayout tool={tool}>
      <PdfCompress />
    </ToolLayout>
  );
}
