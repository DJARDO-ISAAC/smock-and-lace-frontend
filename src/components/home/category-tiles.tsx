import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/api/types";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductMedia } from "@/components/product/product-media";
import { pluralize } from "@/lib/utils";

export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Shop by category" title="Find your piece" />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-cotton-deep sm:aspect-[5/6]">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  <ProductMedia url={c.image?.url} art={c.image?.art} alt="" sizes="(min-width: 1024px) 30vw, 50vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-cotton sm:p-5">
                  <div>
                    <h3 className="text-xl leading-tight sm:text-2xl">{c.name}</h3>
                    <p className="mt-1 text-xs text-cotton/75">{pluralize(c.product_count, "piece")}</p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cotton/15 backdrop-blur transition-colors group-hover:bg-cotton group-hover:text-ink">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
