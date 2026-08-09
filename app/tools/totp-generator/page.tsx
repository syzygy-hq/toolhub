import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { TotpGenerator } from "./TotpGenerator";

export default function Page() {
  const tool = getToolBySlug("totp-generator")!;
  return (
    <ToolLayout tool={tool}>
      <TotpGenerator />
    </ToolLayout>
  );
}
