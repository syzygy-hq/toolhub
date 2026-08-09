import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { HashtagGenerator } from "./HashtagGenerator";

export default function Page() {
  const tool = getToolBySlug("hashtag-generator")!;
  return (
    <ToolLayout tool={tool}>
      <HashtagGenerator />
    </ToolLayout>
  );
}
