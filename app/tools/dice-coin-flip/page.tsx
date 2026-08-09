import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { DiceCoinFlip } from "./DiceCoinFlip";

export default function Page() {
  const tool = getToolBySlug("dice-coin-flip")!;
  return (
    <ToolLayout tool={tool}>
      <DiceCoinFlip />
    </ToolLayout>
  );
}
