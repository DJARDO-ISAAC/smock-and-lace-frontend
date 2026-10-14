"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { ProductSummary } from "@/lib/api/types";
import { productsBySlugs } from "@/lib/catalog/client";
import { useSaved } from "@/stores/saved";
import { LinkButton } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { AccountShell } from "./account-shell";

export function Wishlist() {
  const slugs = useSaved((s) => s.wishlist);
  const [items, setItems] = useState<ProductSummary[] | null>(null);
  const key = slugs.join(",");

  useEffect(() => {
    let live = true;
    productsBySlugs(key ? key.split(",") : []).then((p) => live && setItems(p), () => live && setItems([]));
    return () => {
      live = false;
    };
  }, [key]);

  return (
    <AccountShell active="/account/wishlist" title="Wishlist" description="Pieces you've saved. Handwoven stock is small, so don't wait too long." requireAuth={false}>
      {items === null ? (
        <ProductGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <Heart className="size-9 text-muted" strokeWidth={1.5} />
          <p className="mt-4 font-display text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted">Tap the heart on any piece to keep it here.</p>
          <LinkButton href="/shop" className="mt-6">
            Browse the shop
          </LinkButton>
        </div>
      ) : (
        <ProductGrid products={items} className="xl:grid-cols-3" />
      )}
    </AccountShell>
  );
}
