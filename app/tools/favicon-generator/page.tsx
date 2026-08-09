import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { FaviconGenerator } from "./FaviconGenerator";

export default function Page() {
  const tool = getToolBySlug("favicon-generator")!;
  return (
    <ToolLayout tool={tool}>
      <FaviconGenerator />
    </ToolLayout>
  );
}
