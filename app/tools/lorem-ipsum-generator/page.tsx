import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { LoremIpsumGenerator } from "./LoremIpsumGenerator";

export default function Page() {
  const tool = getToolBySlug("lorem-ipsum-generator")!;
  return (
    <ToolLayout tool={tool}>
      <LoremIpsumGenerator />
    </ToolLayout>
  );
}
