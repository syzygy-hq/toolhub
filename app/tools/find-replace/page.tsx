import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { FindReplace } from "./FindReplace";

export default function Page() {
  const tool = getToolBySlug("find-replace")!;
  return (
    <ToolLayout tool={tool}>
      <FindReplace />
    </ToolLayout>
  );
}
