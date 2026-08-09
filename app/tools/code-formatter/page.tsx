import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CodeFormatter } from "./CodeFormatter";

export default function Page() {
  const tool = getToolBySlug("code-formatter")!;
  return (
    <ToolLayout tool={tool}>
      <CodeFormatter />
    </ToolLayout>
  );
}
