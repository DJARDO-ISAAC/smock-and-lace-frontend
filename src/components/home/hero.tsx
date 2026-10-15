import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductSummary } from "@/lib/api/types";
import { LinkButton } from "@/components/ui/button";
import { ProductMedia } from "@/components/product/product-media";
import { formatGHS } from "@/lib/money";

function Tile({ product, sizes, priority, className, label }: { product: ProductSummary; sizes: string; priority?: boolean; className?: string; label?: boolean }) {
  const image = product.images[0];
  return (
    <Link href={`/products/${product.slug}`} className={`group relative block overflow-hidden rounded-2xl bg-cotton-deep shadow-soft ${className ?? ""}`}>
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
        <ProductMedia url={image?.url} art={image?.art} alt={image?.alt ?? product.name} sizes={sizes} priority={priority} />
      </div>
      {label && (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl bg-cotton/95 px-4 py-3 backdrop-blur sm:inset-x-4 sm:bottom-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="text-sm text-muted tabular-nums">
              {formatGHS(product.price, { compact: true })}
              {product.length_yards ? ` · ${Number(product.length_yards)} yards` : ""}
            </p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-cotton transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-4" />
          </span>
        </div>
      )}
    </Link>
  );
}

export function Hero({ featured }: { featured: ProductSummary[] }) {
  const [main, second, third] = featured;
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-14 lg:pb-24">
        <div className="relative z-10 max-w-xl animate-slide-up">
          <p className="eyebrow text-clay">Fugu shop in Accra · Worldwide delivery</p>
          <h1 className="mt-5 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
            Northern Ghana heritage, <em className="text-indigo">in luxury pieces.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Handwoven fugu cloth by the piece, in vintage and modern designs, for you and your tailor. Plus ready-made smocks, and custom work for weddings, groups and companies.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/shop/fugu-cloth" size="lg">
              Shop fugu cloth <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/custom-orders" size="lg" variant="outline">
              Custom &amp; group orders
            </LinkButton>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["By the piece", "Ready for your tailor"],
              ["Custom", "Colours at no extra cost"],
              ["Worldwide", "Pickup or delivery"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-xl text-ink sm:text-2xl">{value}</dd>
                <dd className="mt-1 text-xs text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {main && (
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
              <Tile product={main} sizes="(min-width: 1024px) 30vw, 55vw" priority label className="row-span-2 aspect-[4/5]" />
              {second && <Tile product={second} sizes="(min-width: 1024px) 20vw, 40vw" priority className="aspect-[4/5]" />}
              {third && <Tile product={third} sizes="(min-width: 1024px) 20vw, 40vw" priority className="aspect-[4/5]" />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
