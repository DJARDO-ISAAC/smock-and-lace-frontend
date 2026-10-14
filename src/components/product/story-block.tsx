import type { ProductDetail } from "@/lib/api/types";
import { ProductArt } from "./product-art";

/** Provenance: weaver, region and strip details (FR-CAT-6). */
export function StoryBlock({ product }: { product: ProductDetail }) {
  const detail = product.images.find((i) => i.art?.view === "detail");
  return (
    <section aria-labelledby="story-heading" className="overflow-hidden rounded-3xl bg-indigo text-cotton">
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        <div className="relative min-h-64 lg:min-h-full">
          {detail?.art ? <ProductArt spec={detail.art} className="absolute inset-0" /> : <div className="absolute inset-0 strip-weave opacity-40" />}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-indigo/40" />
        </div>
        <div className="p-8 sm:p-12 lg:p-14">
          <p className="eyebrow text-kola">The story of this piece</p>
          <h2 id="story-heading" className="mt-4 text-3xl sm:text-4xl">
            Woven in {product.origin}
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-cotton/85">{product.story}</p>
          <dl className="mt-8 grid gap-6 border-t border-cotton/15 pt-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-cotton/55">Made by</dt>
              <dd className="mt-2 text-[0.9375rem]">{product.weaver}</dd>
            </div>
            <div>
              <dt className="eyebrow text-cotton/55">Region</dt>
              <dd className="mt-2 text-[0.9375rem]">{product.origin}</dd>
            </div>
            <div>
              <dt className="eyebrow text-cotton/55">The strips</dt>
              <dd className="mt-2 text-[0.9375rem]">{product.strip_details}</dd>
            </div>
            <div>
              <dt className="eyebrow text-cotton/55">Cloth</dt>
              <dd className="mt-2 text-[0.9375rem]">{product.fabric}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
