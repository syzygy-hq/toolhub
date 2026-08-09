import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { SitemapGenerator } from "./SitemapGenerator";

export default function Page() {
  const tool = getToolBySlug("sitemap-generator")!;
  return (
    <ToolLayout tool={tool}>
      <SitemapGenerator />
    </ToolLayout>
  );
}
