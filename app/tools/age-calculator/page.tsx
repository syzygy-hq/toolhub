import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { AgeCalculator } from "./AgeCalculator";

export default function Page() {
  const tool = getToolBySlug("age-calculator")!;
  return (
    <ToolLayout tool={tool}>
      <AgeCalculator />
    </ToolLayout>
  );
}
