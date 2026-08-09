import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PasswordGenerator } from "./PasswordGenerator";

export default function Page() {
  const tool = getToolBySlug("password-generator")!;
  return (
    <ToolLayout tool={tool}>
      <PasswordGenerator />
    </ToolLayout>
  );
}
