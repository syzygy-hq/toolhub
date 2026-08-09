import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { MetaTagGenerator } from "./MetaTagGenerator";

export default function Page() {
  const tool = getToolBySlug("meta-tag-generator")!;
  return (
    <ToolLayout tool={tool}>
      <MetaTagGenerator />
    </ToolLayout>
  );
}
