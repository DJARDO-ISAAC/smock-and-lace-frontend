import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection, ProductSummary } from "@/lib/api/types";
import { LinkButton } from "@/components/ui/button";
import { ProductMedia } from "@/components/product/product-media";
import { formatGHS } from "@/lib/money";

export function CollectionFeature({ collection, products }: { collection: Collection; products: ProductSummary[] }) {
  return (
    <section className="relative overflow-hidden bg-indigo text-cotton">
      <div className="absolute inset-y-0 right-0 w-1/3 strip-weave opacity-[0.07]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.6fr] lg:items-center lg:px-10">
        <div className="max-w-md">
          <p className="eyebrow text-kola">Every Wednesday</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">{collection.name}</h2>
          <p className="mt-5 text-lg leading-relaxed text-cotton/80">{collection.description}</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-cotton/65">
            Ghana now wears fugu every Wednesday. These are our lightest, easiest pieces for the office, campus or a midweek outing.
          </p>
          <LinkButton href={`/collections/${collection.slug}`} size="lg" className="mt-8 bg-cotton text-indigo hover:bg-white">
            Shop the edit <ArrowRight className="size-4" />
          </LinkButton>
        </div>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {products.slice(0, 3).map((p) => (
            <li key={p.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
              <Link href={`/products/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-indigo-deep">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                    <ProductMedia url={p.images[0]?.url} art={p.images[0]?.art} alt={p.images[0]?.alt ?? p.name} sizes="(min-width: 640px) 22vw, 68vw" />
                  </div>
                </div>
                <p className="mt-3 text-[0.9375rem] font-medium group-hover:underline">{p.name}</p>
                <p className="text-sm text-cotton/70 tabular-nums">{formatGHS(p.price, { compact: true })}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
