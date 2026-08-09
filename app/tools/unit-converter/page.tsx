import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { UnitConverter } from "./UnitConverter";

export default function Page() {
  const tool = getToolBySlug("unit-converter")!;
  return (
    <ToolLayout tool={tool}>
      <UnitConverter />
    </ToolLayout>
  );
}
