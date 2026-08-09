import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CaseConverter } from "./CaseConverter";

export default function Page() {
  const tool = getToolBySlug("case-converter")!;
  return (
    <ToolLayout tool={tool}>
      <CaseConverter />
    </ToolLayout>
  );
}
