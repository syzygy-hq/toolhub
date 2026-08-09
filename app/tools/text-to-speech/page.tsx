import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { TextToSpeech } from "./TextToSpeech";

export default function Page() {
  const tool = getToolBySlug("text-to-speech")!;
  return (
    <ToolLayout tool={tool}>
      <TextToSpeech />
    </ToolLayout>
  );
}
