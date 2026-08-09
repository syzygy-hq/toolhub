import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { BarcodeGenerator } from "./BarcodeGenerator";

export default function Page() {
  const tool = getToolBySlug("barcode-generator")!;
  return (
    <ToolLayout tool={tool}>
      <BarcodeGenerator />
    </ToolLayout>
  );
}
