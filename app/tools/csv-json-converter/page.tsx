import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { CsvJsonConverter } from "./CsvJsonConverter";

export default function Page() {
  const tool = getToolBySlug("csv-json-converter")!;
  return (
    <ToolLayout tool={tool}>
      <CsvJsonConverter />
    </ToolLayout>
  );
}
