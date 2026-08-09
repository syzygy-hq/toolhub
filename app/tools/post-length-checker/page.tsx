import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PostLengthChecker } from "./PostLengthChecker";

export default function Page() {
  const tool = getToolBySlug("post-length-checker")!;
  return (
    <ToolLayout tool={tool}>
      <PostLengthChecker />
    </ToolLayout>
  );
}
