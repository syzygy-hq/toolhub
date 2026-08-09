import {
  ListVideo,
  Braces,
  KeyRound,
  Type,
  Palette,
  QrCode,
  ImageDown,
  ScanText,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  ListVideo,
  Braces,
  KeyRound,
  Type,
  Palette,
  QrCode,
  ImageDown,
  ScanText,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = registry[name] ?? Wrench;
  return <Cmp className={className} />;
}
