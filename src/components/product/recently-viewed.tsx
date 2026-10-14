"use client";

import { useEffect, useState } from "react";
import type { ProductSummary } from "@/lib/api/types";
import { productsBySlugs } from "@/lib/catalog/client";
import { useSaved } from "@/stores/saved";
import { ProductGrid } from "./product-card";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const recent = useSaved((s) => s.recent);
  const [items, setItems] = useState<ProductSummary[]>([]);
  const slugs = recent.filter((s) => s !== exclude).slice(0, 4);
  const key = slugs.join(",");

  useEffect(() => {
    let live = true;
    productsBySlugs(key ? key.split(",") : []).then((p) => live && setItems(p)).catch(() => {});
    return () => {
      live = false;
    };
  }, [key]);

  if (!items.length) return null;
  return (
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="text-3xl">
        Recently viewed
      </h2>
      <ProductGrid products={items} className="mt-8" />
    </section>
  );
}
