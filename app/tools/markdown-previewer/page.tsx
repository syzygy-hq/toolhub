import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { MarkdownPreviewer } from "./MarkdownPreviewer";

export default function Page() {
  const tool = getToolBySlug("markdown-previewer")!;
  return (
    <ToolLayout tool={tool}>
      <MarkdownPreviewer />
    </ToolLayout>
  );
}
