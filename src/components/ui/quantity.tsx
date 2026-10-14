"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  label?: string;
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-line bg-white", h, disabled && "opacity-60")} role="group" aria-label={label}>
      <button type="button" className={cn("grid h-full place-items-center rounded-l-full text-ink transition-colors hover:bg-ink/5 disabled:text-muted/50", w)} onClick={() => onChange(value - 1)} disabled={disabled || value <= min} aria-label="Decrease quantity">
        <Minus className="size-3.5" />
      </button>
      <output className="min-w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </output>
      <button type="button" className={cn("grid h-full place-items-center rounded-r-full text-ink transition-colors hover:bg-ink/5 disabled:text-muted/50", w)} onClick={() => onChange(value + 1)} disabled={disabled || value >= max} aria-label="Increase quantity">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
