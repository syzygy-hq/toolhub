import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { MemeGenerator } from "./MemeGenerator";

export default function Page() {
  const tool = getToolBySlug("meme-generator")!;
  return (
    <ToolLayout tool={tool}>
      <MemeGenerator />
    </ToolLayout>
  );
}
