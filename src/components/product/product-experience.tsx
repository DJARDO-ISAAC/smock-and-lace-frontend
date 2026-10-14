"use client";

import { useState, type ReactNode } from "react";
import type { ProductDetail } from "@/lib/api/types";
import { imagesForColour } from "@/lib/catalog/images";
import { Gallery } from "./gallery";
import { PurchasePanel } from "./purchase-panel";

/** Gallery and buy box share the selected colour, so picking a colour swaps the photos. */
export function ProductExperience({ product, details }: { product: ProductDetail; details: ReactNode }) {
  const firstAvailable =
    product.colours.find((c) => product.variants.some((v) => v.colour === c.name && (v.available_quantity === null || v.available_quantity > 0)))?.name ??
    product.colours[0]?.name ??
    "";
  const [colour, setColour] = useState(firstAvailable);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14 xl:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        {/* Keyed by colour so a new image set starts from its first image. */}
        <Gallery key={colour} images={imagesForColour(product, colour)} name={product.name} />
      </div>
      <div className="min-w-0">
        <PurchasePanel product={product} colour={colour} onColourChange={setColour} />
        <div className="mt-10">{details}</div>
      </div>
    </div>
  );
}
