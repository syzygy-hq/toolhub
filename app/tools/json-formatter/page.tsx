import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { JsonFormatter } from "./JsonFormatter";

export default function Page() {
  const tool = getToolBySlug("json-formatter")!;
  return (
    <ToolLayout tool={tool}>
      <JsonFormatter />
    </ToolLayout>
  );
}
