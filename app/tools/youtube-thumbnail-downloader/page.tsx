import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { YoutubeThumbnailDownloader } from "./YoutubeThumbnailDownloader";

export default function Page() {
  const tool = getToolBySlug("youtube-thumbnail-downloader")!;
  return (
    <ToolLayout tool={tool}>
      <YoutubeThumbnailDownloader />
    </ToolLayout>
  );
}
