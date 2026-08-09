import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { WordCounter } from "./WordCounter";

export default function Page() {
  const tool = getToolBySlug("word-counter")!;
  return (
    <ToolLayout tool={tool}>
      <WordCounter />
    </ToolLayout>
  );
}
