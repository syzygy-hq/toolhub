import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { BrokenLinkChecker } from "./BrokenLinkChecker";

export default function Page() {
  const tool = getToolBySlug("broken-link-checker")!;
  return (
    <ToolLayout tool={tool}>
      <BrokenLinkChecker />
    </ToolLayout>
  );
}
