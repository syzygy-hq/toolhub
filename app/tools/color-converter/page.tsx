import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ColorConverter } from "./ColorConverter";

export default function Page() {
  const tool = getToolBySlug("color-converter")!;
  return (
    <ToolLayout tool={tool}>
      <ColorConverter />
    </ToolLayout>
  );
}
