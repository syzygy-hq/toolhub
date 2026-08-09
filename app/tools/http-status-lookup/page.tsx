import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { HttpStatusLookup } from "./HttpStatusLookup";

export default function Page() {
  const tool = getToolBySlug("http-status-lookup")!;
  return (
    <ToolLayout tool={tool}>
      <HttpStatusLookup />
    </ToolLayout>
  );
}
