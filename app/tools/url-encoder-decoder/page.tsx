import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { UrlEncoderDecoder } from "./UrlEncoderDecoder";

export default function Page() {
  const tool = getToolBySlug("url-encoder-decoder")!;
  return (
    <ToolLayout tool={tool}>
      <UrlEncoderDecoder />
    </ToolLayout>
  );
}
