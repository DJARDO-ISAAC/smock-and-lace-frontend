import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** <details> based, so it works before hydration and is keyboard accessible by default. */
export function AccordionItem({ title, children, defaultOpen, className }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  return (
    <details className={cn("group border-b border-line", className)} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <Plus className="size-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden />
      </summary>
      <div className="pb-6 text-[0.9375rem] leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}
