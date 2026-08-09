import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ExifViewer } from "./ExifViewer";

export default function Page() {
  const tool = getToolBySlug("exif-viewer")!;
  return (
    <ToolLayout tool={tool}>
      <ExifViewer />
    </ToolLayout>
  );
}
