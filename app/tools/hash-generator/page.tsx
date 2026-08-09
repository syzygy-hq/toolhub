import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { HashGenerator } from "./HashGenerator";

export default function Page() {
  const tool = getToolBySlug("hash-generator")!;
  return (
    <ToolLayout tool={tool}>
      <HashGenerator />
    </ToolLayout>
  );
}
