import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductSummary } from "@/lib/api/types";
import { LinkButton } from "@/components/ui/button";
import { ProductMedia } from "@/components/product/product-media";
import { formatGHS } from "@/lib/money";

export function Hero({ featured }: { featured: ProductSummary[] }) {
  const [main, second, third] = featured;
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-14 lg:pb-24">
        <div className="relative z-10 max-w-xl animate-slide-up">
          <p className="eyebrow text-clay">Handwoven in northern Ghana</p>
          <h1 className="mt-5 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
            Cloth with a story, <em className="text-indigo">woven strip by strip.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Fugu, batakari and lace-fusion pieces made on narrow looms in Daboya, Bolgatanga and Tamale, then finished in our Accra studio.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/shop" size="lg">
              Shop the collection <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/about" size="lg" variant="outline">
              Meet the weavers
            </LinkButton>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["100%", "Handwoven cotton"],
              ["MoMo", "& card payments"],
              ["Worldwide", "Tracked delivery"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl text-ink">{value}</dd>
                <dd className="mt-1 text-xs text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {main && (
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
              <Link href={`/products/${main.slug}`} className="group relative row-span-2 aspect-[4/5] overflow-hidden rounded-2xl bg-cotton-deep shadow-soft">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                  <ProductMedia url={main.images[0]?.url} art={main.images[0]?.art} alt={main.images[0]?.alt ?? main.name} sizes="(min-width: 1024px) 30vw, 55vw" priority />
                </div>
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl bg-cotton/95 px-4 py-3 backdrop-blur sm:inset-x-4 sm:bottom-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{main.name}</p>
                    <p className="text-sm text-muted tabular-nums">{formatGHS(main.price, { compact: true })}</p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-cotton transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
              {[second, third].filter(Boolean).map((p, i) => (
                <Link key={p!.id} href={`/products/${p!.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-cotton-deep shadow-soft">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                    <ProductMedia url={p!.images[i === 0 ? 1 : 0]?.url} art={p!.images[i === 0 ? 1 : 0]?.art ?? p!.images[0]?.art} alt={p!.name} sizes="(min-width: 1024px) 20vw, 40vw" priority />
                  </div>
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-cotton/90 px-2.5 py-1 text-2xs font-medium backdrop-blur">{p!.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
