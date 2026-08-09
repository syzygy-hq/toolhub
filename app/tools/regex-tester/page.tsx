import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { RegexTester } from "./RegexTester";

export default function Page() {
  const tool = getToolBySlug("regex-tester")!;
  return (
    <ToolLayout tool={tool}>
      <RegexTester />
    </ToolLayout>
  );
}
