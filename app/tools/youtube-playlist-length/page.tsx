import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { YoutubePlaylistLength } from "./YoutubePlaylistLength";

export default function Page() {
  const tool = getToolBySlug("youtube-playlist-length")!;
  return (
    <ToolLayout tool={tool}>
      <YoutubePlaylistLength />
    </ToolLayout>
  );
}
