"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import type { Order } from "@/lib/api/types";
import { apiFetch } from "@/lib/api/client";
import { fetchOrders } from "@/lib/checkout";
import { siteConfig } from "@/lib/config";
import { formatGHS } from "@/lib/money";
import { cn, formatDate, pluralize } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { toast } from "@/stores/toast";
import { LinkButton } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductMedia } from "@/components/product/product-media";
import { AccountShell } from "./account-shell";
import { OrderTimeline, STATUS_LABELS, STATUS_TONES } from "./order-timeline";

function canRequestReturn(order: Order) {
  if (order.status !== "delivered") return false;
  if (order.items.every((i) => i.is_made_to_order)) return false;
  const deliveredAt = order.status_history.find((h) => h.status === "delivered")?.at ?? order.created_at;
  return Date.now() - new Date(deliveredAt).getTime() < siteConfig.returnWindowDays * 86400000;
}

/** The invoice endpoint needs the bearer token, so fetch it and hand the browser a blob (FR-ACC-4). */
async function downloadInvoice(number: string, access: string | null) {
  try {
    const res = await fetch(`${siteConfig.apiUrl}/orders/${number}/invoice/`, { headers: access ? { Authorization: `Bearer ${access}` } : {}, credentials: "include" });
    if (!res.ok) throw new Error("The invoice isn't available yet.");
    const url = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement("a"), { href: url, download: `${number}.pdf` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) {
    toast({ title: (e as Error).message, tone: "error" });
  }
}

function OrderCard({ order }: { order: Order }) {
  const access = useAuth((s) => s.access);
  const [open, setOpen] = useState(false);
  return (
    <li className="overflow-hidden rounded-2xl bg-white/80 ring-1 ring-line">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 p-5 text-left sm:p-6">
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative aspect-[4/5] w-12 overflow-hidden rounded-md bg-cotton-deep ring-2 ring-white">
              <ProductMedia url={item.image} art={item.art} alt="" sizes="48px" />
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{order.number}</p>
          <p className="text-sm text-muted">
            {formatDate(order.created_at)} · {pluralize(order.items.reduce((n, i) => n + i.quantity, 0), "item")} · {formatGHS(order.total, { compact: true })}
          </p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", STATUS_TONES[order.status])}>{STATUS_LABELS[order.status]}</span>
        <ChevronDown className={cn("size-5 text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-6 border-t border-line p-5 sm:p-6">
          <OrderTimeline order={order} />
          {order.expected_ship_date && ["paid", "processing"].includes(order.status) && (
            <p className="text-sm text-indigo">Expected to ship by {formatDate(order.expected_ship_date, { weekday: "long", day: "numeric", month: "long" })}</p>
          )}
          <ul className="divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                <Link href={`/products/${item.product_slug}`} className="hover:underline">
                  {item.product_name} <span className="text-muted">· {[item.colour, item.size].filter(Boolean).join(" · ")} × {item.quantity}</span>
                </Link>
                <span className="flex items-center gap-4">
                  {order.status === "delivered" && (
                    <Link href={`/products/${item.product_slug}#reviews`} className="font-medium whitespace-nowrap underline underline-offset-4">
                      Review this piece
                    </Link>
                  )}
                  <span className="tabular-nums">{formatGHS(item.line_total, { compact: true })}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={`/order/${order.number}/confirmation`} variant="outline" size="sm">
              Order details
            </LinkButton>
            {siteConfig.dataSource === "api" && (
              <button type="button" onClick={() => downloadInvoice(order.number, access)} className="inline-flex h-9 items-center rounded-full border border-ink/20 px-4 text-sm font-medium hover:border-ink">
                Download invoice (PDF)
              </button>
            )}
            {canRequestReturn(order) && (
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-full border border-ink/20 px-4 text-sm font-medium hover:border-ink"
                onClick={async () => {
                  try {
                    if (siteConfig.dataSource === "api") await apiFetch(`/orders/${order.number}/return-request/`, { method: "POST", token: access, body: { reason: "" } });
                    toast({ title: "Return requested", description: "We'll be in touch within one working day.", tone: "success" });
                  } catch (e) {
                    toast({ title: (e as Error).message, tone: "error" });
                  }
                }}
              >
                Request a return
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export function Orders() {
  const { access, status } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchOrders(access)
      .then(setOrders)
      .catch((e) => {
        setError((e as Error).message);
        setOrders([]);
      });
  }, [access, status]);

  return (
    <AccountShell active="/account/orders" title="Orders" description="Track deliveries and made-to-order progress.">
      {error && <FormAlert>{error}</FormAlert>}
      {orders === null ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <Package className="size-9 text-muted" strokeWidth={1.5} />
          <p className="mt-4 font-display text-2xl">No orders yet</p>
          <p className="mt-2 text-sm text-muted">When you place an order, you can follow it here.</p>
          <LinkButton href="/shop" className="mt-6">
            Start shopping
          </LinkButton>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.number} order={o} />
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
