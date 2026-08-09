import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { UuidGenerator } from "./UuidGenerator";

export default function Page() {
  const tool = getToolBySlug("uuid-generator")!;
  return (
    <ToolLayout tool={tool}>
      <UuidGenerator />
    </ToolLayout>
  );
}
