"use client";

import { Clock, Lock, Truck } from "lucide-react";
import type { Cart } from "@/lib/api/types";
import { formatGHS } from "@/lib/money";
import { useDeliveryEstimates } from "@/components/shipping/delivery-estimates";
import { LinkButton } from "@/components/ui/button";
import { BLOCKING_WARNINGS } from "./cart-line";
import { DiscountForm } from "./discount-form";

export function SummaryRow({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: "leaf" }) {
  return (
    <div className={strong ? "flex items-baseline justify-between text-lg font-medium" : "flex items-baseline justify-between text-[0.9375rem]"}>
      <dt className={strong ? "" : "text-ink-soft"}>{label}</dt>
      <dd className={tone === "leaf" ? "text-leaf tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}

export function CartSummary({ cart, onCheckout }: { cart: Cart; onCheckout?: () => void }) {
  const [nearest] = useDeliveryEstimates();
  const blocked = cart.items.some((l) => l.warning && BLOCKING_WARNINGS.has(l.warning));
  return (
    <div className="space-y-5">
      <DiscountForm />
      <dl className="space-y-2.5">
        <SummaryRow label="Subtotal" value={formatGHS(cart.subtotal)} />
        {cart.discount > 0 && <SummaryRow label={`Discount (${cart.discount_code})`} value={`−${formatGHS(cart.discount)}`} tone="leaf" />}
        <div className="flex items-baseline justify-between text-[0.9375rem]">
          <dt className="text-ink-soft">Delivery</dt>
          <dd className="text-right text-sm text-muted">
            {!nearest
              ? "Calculated at checkout"
              : nearest.fee_from
                ? `From ${formatGHS(nearest.fee_from, { compact: true })} in ${nearest.zone}`
                : `Free in ${nearest.zone}`}
          </dd>
        </div>
        <div className="border-t border-line pt-3">
          <SummaryRow label="Total" value={formatGHS(cart.total)} strong />
          <p className="mt-1 text-xs text-muted">Delivery fee confirmed at checkout before you pay.</p>
        </div>
      </dl>

      {cart.made_to_order_lead_time_days && (
        <p className="flex gap-2.5 rounded-lg bg-indigo-soft px-3.5 py-3 text-sm text-indigo">
          <Clock className="mt-0.5 size-4 shrink-0" />
          <span>
            Your order includes made-to-order pieces. Everything ships together in about <strong>{cart.made_to_order_lead_time_days} days</strong>.
          </span>
        </p>
      )}

      <LinkButton href="/checkout" size="lg" className="w-full" aria-disabled={blocked || undefined} onClick={(e) => (blocked ? e.preventDefault() : onCheckout?.())}>
        <Lock className="size-4" /> Checkout securely
      </LinkButton>
      {blocked && (
        <p role="alert" className="text-center text-sm text-danger">
          Fix the items marked above to continue.
        </p>
      )}
      <p className="flex items-center justify-center gap-2 text-xs text-muted">
        <Truck className="size-4" /> Pay with MoMo or card · Delivery across Ghana &amp; worldwide
      </p>
    </div>
  );
}
