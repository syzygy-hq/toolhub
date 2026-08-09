import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { FakeDataGenerator } from "./FakeDataGenerator";

export default function Page() {
  const tool = getToolBySlug("fake-data-generator")!;
  return (
    <ToolLayout tool={tool}>
      <FakeDataGenerator />
    </ToolLayout>
  );
}
