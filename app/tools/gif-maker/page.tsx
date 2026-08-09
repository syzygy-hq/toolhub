import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { GifMaker } from "./GifMaker";

export default function Page() {
  const tool = getToolBySlug("gif-maker")!;
  return (
    <ToolLayout tool={tool}>
      <GifMaker />
    </ToolLayout>
  );
}
