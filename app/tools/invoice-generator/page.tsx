import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { InvoiceGenerator } from "./InvoiceGenerator";

export default function Page() {
  const tool = getToolBySlug("invoice-generator")!;
  return (
    <ToolLayout tool={tool}>
      <InvoiceGenerator />
    </ToolLayout>
  );
}
