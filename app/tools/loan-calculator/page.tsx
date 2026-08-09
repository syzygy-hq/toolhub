import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { LoanCalculator } from "./LoanCalculator";

export default function Page() {
  const tool = getToolBySlug("loan-calculator")!;
  return (
    <ToolLayout tool={tool}>
      <LoanCalculator />
    </ToolLayout>
  );
}
