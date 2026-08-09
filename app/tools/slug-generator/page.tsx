import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { SlugGenerator } from "./SlugGenerator";

export default function Page() {
  const tool = getToolBySlug("slug-generator")!;
  return (
    <ToolLayout tool={tool}>
      <SlugGenerator />
    </ToolLayout>
  );
}
