import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { RandomPicker } from "./RandomPicker";

export default function Page() {
  const tool = getToolBySlug("random-picker")!;
  return (
    <ToolLayout tool={tool}>
      <RandomPicker />
    </ToolLayout>
  );
}
