import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { YoutubeTimestampLink } from "./YoutubeTimestampLink";

export default function Page() {
  const tool = getToolBySlug("youtube-timestamp-link")!;
  return (
    <ToolLayout tool={tool}>
      <YoutubeTimestampLink />
    </ToolLayout>
  );
}
