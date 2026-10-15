import Link from "next/link";
import type { ProductSummary } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { percentOff } from "@/lib/money";
import { cn } from "@/lib/utils";
import { ProductMedia } from "./product-media";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product, priority, className }: { product: ProductSummary; priority?: boolean; className?: string }) {
  const [primary, secondary] = product.images;
  const off = percentOff(product.price, product.compare_at_price);
  const sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw";

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cotton-deep">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ProductMedia url={primary?.url} art={primary?.art} alt={primary?.alt ?? product.name} sizes={sizes} priority={priority} />
        </div>
        {secondary && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
            <ProductMedia url={secondary.url} art={secondary.art} alt="" sizes={sizes} />
          </div>
        )}
        {!product.in_stock && <div className="absolute inset-0 bg-cotton/35" aria-hidden />}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {!product.in_stock ? (
            <Badge tone="dark">Sold out</Badge>
          ) : (
            <>
              {off && <Badge tone="clay">−{off}%</Badge>}
              {product.is_new && !off && <Badge>New</Badge>}
              {product.is_made_to_order && <Badge tone="indigo">Made to order</Badge>}
            </>
          )}
        </div>
        <WishlistButton slug={product.slug} name={product.name} className="absolute top-3 right-3 z-10" />
      </div>

      <div className="mt-3.5 flex flex-1 flex-col gap-1">
        <p className="text-xs tracking-wide text-muted">{product.kind === "cloth" ? `Fugu cloth · ${product.colours[0]?.name ?? ""}` : product.category.name}</p>
        <h3 className="font-sans text-[0.9375rem] leading-snug font-medium text-ink">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-baseline gap-1">
            <Price amount={product.price} compareAt={product.compare_at_price} size="sm" />
            {product.kind === "cloth" && product.length_yards ? (
              <span className="text-xs text-muted">/ {Number(product.length_yards)} yds</span>
            ) : null}
          </span>
          {product.colours.length > 1 && (
            <span className="flex items-center gap-1" aria-label={`${product.colours.length} colours`}>
              {product.colours.slice(0, 4).map((c) => (
                <span key={c.name} className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} title={c.name} />
              ))}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0, className }: { products: ProductSummary[]; priorityCount?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
