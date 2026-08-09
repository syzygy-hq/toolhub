import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { YamlJsonConverter } from "./YamlJsonConverter";

export default function Page() {
  const tool = getToolBySlug("yaml-json-converter")!;
  return (
    <ToolLayout tool={tool}>
      <YamlJsonConverter />
    </ToolLayout>
  );
}
