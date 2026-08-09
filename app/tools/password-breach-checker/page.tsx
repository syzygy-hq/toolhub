import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PasswordBreachChecker } from "./PasswordBreachChecker";

export default function Page() {
  const tool = getToolBySlug("password-breach-checker")!;
  return (
    <ToolLayout tool={tool}>
      <PasswordBreachChecker />
    </ToolLayout>
  );
}
