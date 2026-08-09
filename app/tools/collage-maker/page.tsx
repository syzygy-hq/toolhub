import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CollageMaker } from "./CollageMaker";

export default function Page() {
  const tool = getToolBySlug("collage-maker")!;
  return (
    <ToolLayout tool={tool}>
      <CollageMaker />
    </ToolLayout>
  );
}
