import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { PasswordStrengthChecker } from "./PasswordStrengthChecker";

export default function Page() {
  const tool = getToolBySlug("password-strength-checker")!;
  return (
    <ToolLayout tool={tool}>
      <PasswordStrengthChecker />
    </ToolLayout>
  );
}
