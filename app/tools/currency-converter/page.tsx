import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CurrencyConverter } from "./CurrencyConverter";

export default function Page() {
  const tool = getToolBySlug("currency-converter")!;
  return (
    <ToolLayout tool={tool}>
      <CurrencyConverter />
    </ToolLayout>
  );
}
