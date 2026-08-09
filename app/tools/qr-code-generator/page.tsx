import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { QrCodeGenerator } from "./QrCodeGenerator";

export default function Page() {
  const tool = getToolBySlug("qr-code-generator")!;
  return (
    <ToolLayout tool={tool}>
      <QrCodeGenerator />
    </ToolLayout>
  );
}
