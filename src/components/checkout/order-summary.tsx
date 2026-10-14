"use client";

import { AlertTriangle, Clock } from "lucide-react";
import type { Cart, DeliveryOption } from "@/lib/api/types";
import { formatGHS } from "@/lib/money";
import { ProductMedia } from "@/components/product/product-media";
import { SummaryRow } from "@/components/cart/cart-summary";
import { warningText } from "@/components/cart/cart-line";

export function OrderSummary({ cart, delivery }: { cart: Cart; delivery: DeliveryOption | null }) {
  return (
    <div>
      <ul className="space-y-4">
        {cart.items.map((l) => (
          <li key={l.id} className="flex gap-3.5">
            <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg bg-cotton-deep">
              <ProductMedia url={l.image} art={l.art} alt="" sizes="64px" />
              <span className="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] leading-5 font-semibold text-cotton">{l.quantity}</span>
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium leading-snug">{l.product_name}</p>
              <p className="text-muted">{[l.colour, l.size].filter(Boolean).join(" · ")}</p>
              {l.warning && (
                <p className="mt-1 flex gap-1 text-xs text-danger">
                  <AlertTriangle className="size-3.5 shrink-0" /> {warningText(l)}
                </p>
              )}
            </div>
            <p className="text-sm tabular-nums">{formatGHS(l.line_total, { compact: true })}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2.5 border-t border-line pt-5">
        <SummaryRow label="Subtotal" value={formatGHS(cart.subtotal)} />
        {cart.discount > 0 && <SummaryRow label={`Discount (${cart.discount_code})`} value={`−${formatGHS(cart.discount)}`} tone="leaf" />}
        <SummaryRow label={delivery ? `Delivery · ${delivery.name}` : "Delivery"} value={delivery ? (delivery.fee ? formatGHS(delivery.fee) : "Free") : "Enter address"} />
        <div className="border-t border-line pt-3">
          <SummaryRow label="Total" value={formatGHS(cart.total + (delivery?.fee ?? 0))} strong />
          <p className="mt-1 text-xs text-muted">Including all taxes. Charged in Ghana cedis.</p>
        </div>
      </dl>
      {cart.made_to_order_lead_time_days && (
        <p className="mt-5 flex gap-2 rounded-lg bg-indigo-soft px-3.5 py-3 text-sm text-indigo">
          <Clock className="mt-0.5 size-4 shrink-0" /> Made-to-order pieces take about {cart.made_to_order_lead_time_days} days before shipping.
        </p>
      )}
    </div>
  );
}
