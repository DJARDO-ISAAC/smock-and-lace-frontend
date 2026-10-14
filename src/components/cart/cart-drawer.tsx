"use client";

import { ShoppingBag } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { LinkButton } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { pluralize } from "@/lib/utils";
import { useCart } from "@/stores/cart";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

export function CartDrawer() {
  const { cart, status, drawerOpen, closeDrawer } = useCart();
  const count = cart?.item_count ?? 0;

  return (
    <Dialog
      open={drawerOpen}
      onClose={closeDrawer}
      side="right"
      title="Your cart"
      description={count ? pluralize(count, "item") : undefined}
      footer={cart && cart.items.length > 0 ? <CartSummary cart={cart} onCheckout={closeDrawer} /> : undefined}
    >
      {status === "loading" && !cart ? (
        <div className="space-y-6 p-6" role="status" aria-label="Loading cart">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="aspect-[4/5] w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-cotton-deep">
            <ShoppingBag className="size-7 text-muted" strokeWidth={1.5} />
          </div>
          <p className="mt-5 font-display text-2xl">Your cart is empty</p>
          <p className="mt-2 max-w-xs text-sm text-muted">Every piece is woven by hand in small batches. Find yours before it sells out.</p>
          <LinkButton href="/shop" className="mt-6" onClick={closeDrawer}>
            Start shopping
          </LinkButton>
        </div>
      ) : (
        <ul className="divide-y divide-line px-5 sm:px-6">
          {cart.items.map((line) => (
            <CartLine key={line.id} line={line} compact onNavigate={closeDrawer} />
          ))}
        </ul>
      )}
    </Dialog>
  );
}
