"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import type { Order } from "@/lib/api/types";
import { fetchOrder } from "@/lib/checkout";
import { formatGHS } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { whatsappLink } from "@/lib/config";
import { useAuth } from "@/stores/auth";
import { LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductMedia } from "@/components/product/product-media";
import { SummaryRow } from "@/components/cart/cart-summary";
import { OrderTimeline } from "@/components/account/order-timeline";
import { CreateAccountCard } from "./create-account-card";

const PAYMENT_LABEL = { momo: "Mobile Money", card: "Card", pay_on_delivery: "Pay on delivery" };

export function Confirmation({ number }: { number: string }) {
  const { access, status, user } = useAuth();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (status === "unknown") return;
    fetchOrder(number, access).then(setOrder);
  }, [number, access, status]);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="mx-auto h-12 w-64" />
        <Skeleton className="mt-8 h-80 w-full rounded-3xl" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl">Order {number}</h1>
        <p className="mt-3 text-muted">We couldn&apos;t show this order here. Check your email for the confirmation, or sign in to see your orders.</p>
        <div className="mt-7 flex justify-center gap-3">
          <LinkButton href="/account/orders">Your orders</LinkButton>
          <LinkButton href={whatsappLink(`Hello, I have a question about order ${number}.`)} target="_blank" variant="outline">
            Ask on WhatsApp
          </LinkButton>
        </div>
      </div>
    );
  }

  const firstName = order.full_name.split(" ")[0];
  const awaitingPayment = order.status === "pending" && order.payment_method !== "pay_on_delivery";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-leaf" strokeWidth={1.5} />
        <p className="eyebrow mt-5 text-clay">Order {order.number}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{awaitingPayment ? "We're confirming your payment" : `Thank you, ${firstName}`}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
          {awaitingPayment
            ? "This usually takes a few seconds. We'll email you as soon as it's confirmed."
            : "Your order is in. Our team in Accra is getting it ready."}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
          <Mail className="size-4" /> Confirmation sent to {order.email}
        </p>
      </div>

      <div className="mt-10 rounded-3xl bg-white/80 p-6 ring-1 ring-line sm:p-8">
        <OrderTimeline order={order} />
        {order.expected_ship_date && (
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-soft px-4 py-3 text-sm text-indigo">
            <Clock className="size-4 shrink-0" /> Expected to ship by {formatDate(order.expected_ship_date, { weekday: "long", day: "numeric", month: "long" })}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl bg-white/80 p-6 ring-1 ring-line sm:p-8" aria-labelledby="items-heading">
          <h2 id="items-heading" className="text-2xl">
            Your pieces
          </h2>
          <ul className="mt-5 space-y-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex gap-3.5">
                <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg bg-cotton-deep">
                  <ProductMedia url={item.image} art={item.art} alt="" sizes="64px" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-muted">
                    {[item.colour, item.size].filter(Boolean).join(" · ")} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm tabular-nums">{formatGHS(item.line_total, { compact: true })}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-5">
            <SummaryRow label="Subtotal" value={formatGHS(order.subtotal)} />
            {order.discount > 0 && <SummaryRow label="Discount" value={`−${formatGHS(order.discount)}`} tone="leaf" />}
            <SummaryRow label="Delivery" value={order.delivery_fee ? formatGHS(order.delivery_fee) : "Free"} />
            <div className="border-t border-line pt-3">
              <SummaryRow label="Total" value={formatGHS(order.total)} strong />
            </div>
          </dl>
        </section>
        <section className="space-y-6 rounded-3xl bg-white/80 p-6 text-sm ring-1 ring-line sm:p-8" aria-label="Delivery and payment">
          <div>
            <h2 className="eyebrow text-muted">Delivering to</h2>
            <address className="mt-2 leading-relaxed not-italic">
              {order.full_name}
              <br />
              {order.shipping_address.line1}
              {order.shipping_address.line2 && (
                <>
                  <br />
                  {order.shipping_address.line2}
                </>
              )}
              <br />
              {order.shipping_address.city}, {order.shipping_address.region}
              <br />
              {order.shipping_address.country}
              <br />
              {order.phone}
            </address>
          </div>
          <div>
            <h2 className="eyebrow text-muted">Delivery</h2>
            <p className="mt-2">{order.delivery_option.name}</p>
          </div>
          <div>
            <h2 className="eyebrow text-muted">Payment</h2>
            <p className="mt-2">{PAYMENT_LABEL[order.payment_method]}</p>
          </div>
        </section>
      </div>

      {!user && <CreateAccountCard email={order.email} fullName={order.full_name} phone={order.phone} />}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <LinkButton href="/shop" size="lg">
          Continue shopping
        </LinkButton>
        <LinkButton href={whatsappLink(`Hello, I have a question about my order ${order.number}.`)} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
          <WhatsAppIcon className="size-4 text-[#1f7a4d]" /> Questions? WhatsApp us
        </LinkButton>
      </div>
    </div>
  );
}
