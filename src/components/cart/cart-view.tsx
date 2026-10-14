"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/stores/cart";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { pluralize } from "@/lib/utils";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const cart = useCart((s) => s.cart);
  const status = useCart((s) => s.status);
  const loading = !cart && (status === "idle" || status === "loading");

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl">Your cart</h1>
        {cart && cart.items.length > 0 && <p className="pb-1 text-muted">{pluralize(cart.item_count, "item")}</p>}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]" role="status" aria-label="Loading cart">
          <div className="space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="aspect-[4/5] w-28 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : status === "error" && !cart ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="font-display text-2xl">We couldn&apos;t load your cart</p>
          <p className="mt-2 text-muted">Check your connection and refresh the page.</p>
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl bg-cotton-deep/60 px-6 py-20 text-center">
          <ShoppingBag className="size-10 text-muted" strokeWidth={1.5} />
          <p className="mt-5 font-display text-3xl">Your cart is empty</p>
          <p className="mt-2 max-w-sm text-muted">Each piece is handwoven in small runs. Have a look at what&apos;s on the loom this week.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <LinkButton href="/shop">Shop all</LinkButton>
            <LinkButton href="/collections/new-in" variant="outline">
              New in
            </LinkButton>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {cart.items.map((line) => (
                <CartLine key={line.id} line={line} />
              ))}
            </ul>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <ArrowLeft className="size-4" /> Continue shopping
            </Link>
          </div>
          <aside className="rounded-2xl bg-white/70 p-6 ring-1 ring-line lg:sticky lg:top-28" aria-label="Order summary">
            <h2 className="mb-5 text-2xl">Summary</h2>
            <CartSummary cart={cart} />
          </aside>
        </div>
      )}

      <div className="mt-24">
        <RecentlyViewed />
      </div>
    </Container>
  );
}
