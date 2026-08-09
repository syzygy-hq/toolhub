import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CurlToFetch } from "./CurlToFetch";

export default function Page() {
  const tool = getToolBySlug("curl-to-fetch")!;
  return (
    <ToolLayout tool={tool}>
      <CurlToFetch />
    </ToolLayout>
  );
}
