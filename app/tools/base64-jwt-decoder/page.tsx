import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { Base64JwtDecoder } from "./Base64JwtDecoder";

export default function Page() {
  const tool = getToolBySlug("base64-jwt-decoder")!;
  return (
    <ToolLayout tool={tool}>
      <Base64JwtDecoder />
    </ToolLayout>
  );
}
