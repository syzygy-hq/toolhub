import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { LineTools } from "./LineTools";

export default function Page() {
  const tool = getToolBySlug("line-tools")!;
  return (
    <ToolLayout tool={tool}>
      <LineTools />
    </ToolLayout>
  );
}
