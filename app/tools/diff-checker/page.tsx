import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { DiffChecker } from "./DiffChecker";

export default function Page() {
  const tool = getToolBySlug("diff-checker")!;
  return (
    <ToolLayout tool={tool}>
      <DiffChecker />
    </ToolLayout>
  );
}
