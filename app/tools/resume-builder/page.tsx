import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResumeBuilder } from "./ResumeBuilder";

export default function Page() {
  const tool = getToolBySlug("resume-builder")!;
  return (
    <ToolLayout tool={tool}>
      <ResumeBuilder />
    </ToolLayout>
  );
}
