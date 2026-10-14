import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-cotton/95 text-ink ring-1 ring-ink/10",
  indigo: "bg-indigo text-cotton",
  clay: "bg-clay text-cotton",
  leaf: "bg-leaf-soft text-leaf",
  warning: "bg-clay-soft text-clay-deep",
  dark: "bg-ink text-cotton",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-semibold tracking-wide uppercase", tones[tone], className)}>
      {children}
    </span>
  );
}
