import { Check } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/api/types";
import { cn, formatDate } from "@/lib/utils";

const FLOW: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Order placed" },
  { status: "paid", label: "Payment confirmed" },
  { status: "processing", label: "Being prepared" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  processing: "Being prepared",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  return_requested: "Return requested",
};

export const STATUS_TONES: Record<OrderStatus, string> = {
  pending: "bg-clay-soft text-clay-deep",
  paid: "bg-indigo-soft text-indigo",
  processing: "bg-indigo-soft text-indigo",
  shipped: "bg-indigo-soft text-indigo",
  delivered: "bg-leaf-soft text-leaf",
  cancelled: "bg-ink/5 text-muted",
  refunded: "bg-ink/5 text-muted",
  return_requested: "bg-clay-soft text-clay-deep",
};

/** Status timeline shown on confirmation and in order history (FR-ACC-4, SRS 8.2.2). */
export function OrderTimeline({ order }: { order: Order }) {
  const reached = FLOW.findIndex((s) => s.status === order.status);
  const at = (s: OrderStatus) => order.status_history.find((h) => h.status === s)?.at;
  return (
    <ol className="relative grid sm:grid-cols-5">
      {FLOW.map((s, i) => {
        const done = reached >= i;
        const when = at(s.status);
        const label = s.status === "paid" && order.payment_method === "pay_on_delivery" ? "Paid on delivery" : s.label;
        return (
          <li key={s.status} className="relative flex gap-3 pb-6 last:pb-0 sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center">
            {i < FLOW.length - 1 && (
              <span aria-hidden className={cn("absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5 sm:top-[15px] sm:left-1/2 sm:h-0.5 sm:w-full", reached > i ? "bg-leaf" : "bg-line")} />
            )}
            <span className={cn("relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white", done ? "bg-leaf text-cotton" : "bg-cotton-deep text-muted")}>
              {done ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
            </span>
            <div>
              <p className={cn("text-sm font-medium", !done && "text-muted")}>{label}</p>
              {when && <p className="text-xs text-muted">{formatDate(when, { day: "numeric", month: "short" })}</p>}
              {s.status === "shipped" && order.tracking_number && (
                <p className="text-xs text-muted">
                  {order.courier} · {order.tracking_number}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
