import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { WheelOfNames } from "./WheelOfNames";

export default function Page() {
  const tool = getToolBySlug("wheel-of-names")!;
  return (
    <ToolLayout tool={tool}>
      <WheelOfNames />
    </ToolLayout>
  );
}
