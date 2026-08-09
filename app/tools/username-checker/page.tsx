import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { UsernameChecker } from "./UsernameChecker";

export default function Page() {
  const tool = getToolBySlug("username-checker")!;
  return (
    <ToolLayout tool={tool}>
      <UsernameChecker />
    </ToolLayout>
  );
}
