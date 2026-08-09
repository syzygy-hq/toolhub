import {
  ListVideo,
  Braces,
  KeyRound,
  Type,
  Palette,
  QrCode,
  ImageDown,
  ScanText,
  Link2,
  Fingerprint,
  Hash,
  Timer,
  AlignLeft,
  Globe2,
  Table2,
  GitCompare,
  Regex,
  FileText,
  CalendarClock,
  FileCode2,
  Wand2,
  Terminal,
  CaseSensitive,
  Slash,
  Replace,
  Rows3,
  Volume2,
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
  Link2,
  Fingerprint,
  Hash,
  Timer,
  AlignLeft,
  Globe2,
  Table2,
  GitCompare,
  Regex,
  FileText,
  CalendarClock,
  FileCode2,
  Wand2,
  Terminal,
  CaseSensitive,
  Slash,
  Replace,
  Rows3,
  Volume2,
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
