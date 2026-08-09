import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { SslCertificateChecker } from "./SslCertificateChecker";

export default function Page() {
  const tool = getToolBySlug("ssl-certificate-checker")!;
  return (
    <ToolLayout tool={tool}>
      <SslCertificateChecker />
    </ToolLayout>
  );
}
