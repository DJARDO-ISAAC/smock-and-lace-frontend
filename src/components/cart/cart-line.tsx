"use client";

import Link from "next/link";
import { AlertTriangle, Clock, Ruler, Trash2 } from "lucide-react";
import type { CartLine as Line } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatGHS } from "@/lib/money";
import { cn } from "@/lib/utils";
import { MAX_QUANTITY_PER_LINE } from "@/lib/cart/backend";
import { useCart } from "@/stores/cart";
import { toast } from "@/stores/toast";
import { ProductMedia } from "@/components/product/product-media";
import { QuantityStepper } from "@/components/ui/quantity";

export function warningText(line: Line) {
  switch (line.warning) {
    case "unavailable":
      return "This piece is no longer available. Please remove it to continue.";
    case "sold_out":
      return "This size and colour sold out since you added it.";
    case "insufficient_stock":
      return `Only ${line.available_quantity} left. Lower the quantity to continue.`;
    case "price_changed":
      return `Price changed from ${formatGHS(line.price_when_added, { compact: true })} to ${formatGHS(line.unit_price, { compact: true })}.`;
    default:
      return null;
  }
}

export const BLOCKING_WARNINGS = new Set(["unavailable", "sold_out", "insufficient_stock"]);

export function CartLine({ line, compact, onNavigate }: { line: Line; compact?: boolean; onNavigate?: () => void }) {
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);
  const busy = useCart((s) => s.busyLines.includes(line.id));
  const warning = warningText(line);
  const max = Math.min(MAX_QUANTITY_PER_LINE, line.available_quantity ?? MAX_QUANTITY_PER_LINE);

  const run = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      toast({ title: error instanceof ApiError ? error.message : (error as Error).message || "Couldn't update your cart", tone: "error" });
    }
  };

  const options = [line.colour, line.size].filter(Boolean).join(" · ");
  const measured = line.custom_measurements && Object.keys(line.custom_measurements).length > 0;

  return (
    <li className={cn("flex gap-4 py-5 transition-opacity", busy && "opacity-60")}>
      <Link href={`/products/${line.product_slug}`} onClick={onNavigate} className={cn("relative shrink-0 overflow-hidden rounded-lg bg-cotton-deep", compact ? "aspect-[4/5] w-20" : "aspect-[4/5] w-24 sm:w-28")}>
        <ProductMedia url={line.image} art={line.art} alt={line.product_name} sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${line.product_slug}`} onClick={onNavigate} className="font-medium leading-snug hover:underline">
              {line.product_name}
            </Link>
            {options && <p className="mt-0.5 text-sm text-muted">{options}</p>}
          </div>
          <p className="shrink-0 text-[0.9375rem] font-medium tabular-nums">{formatGHS(line.line_total, { compact: true })}</p>
        </div>

        {line.is_made_to_order && line.lead_time_days && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-indigo">
            <Clock className="size-3.5" /> Made to order · ships in about {line.lead_time_days} days
          </p>
        )}
        {(measured || line.measurement_note) && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
            <Ruler className="size-3.5" /> {measured ? "Your measurements attached" : "Sizing note attached"}
          </p>
        )}
        {warning && (
          <p role="alert" className={cn("mt-2 flex items-start gap-1.5 rounded-md px-2.5 py-1.5 text-xs", BLOCKING_WARNINGS.has(line.warning!) ? "bg-danger-soft text-danger" : "bg-clay-soft text-clay-deep")}>
            <AlertTriangle className="mt-px size-3.5 shrink-0" /> {warning}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={Math.max(max, line.quantity)}
            disabled={busy || line.warning === "unavailable" || line.warning === "sold_out"}
            onChange={(q) => run(() => update(line.id, { quantity: q }))}
          />
          <button type="button" onClick={() => run(() => remove(line.id))} disabled={busy} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-danger" aria-label={`Remove ${line.product_name}`}>
            <Trash2 className="size-4" /> <span className={cn(compact && "sr-only")}>Remove</span>
          </button>
        </div>
      </div>
    </li>
  );
}
