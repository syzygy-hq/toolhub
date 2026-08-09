import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { TipCalculator } from "./TipCalculator";

export default function Page() {
  const tool = getToolBySlug("tip-calculator")!;
  return (
    <ToolLayout tool={tool}>
      <TipCalculator />
    </ToolLayout>
  );
}
