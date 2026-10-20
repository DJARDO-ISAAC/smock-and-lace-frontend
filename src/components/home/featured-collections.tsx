import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Collection } from "@/lib/api/types";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductMedia } from "@/components/product/product-media";
import { cn } from "@/lib/utils";

/** Collections ticked Is featured in the admin, in their admin order. */
export function FeaturedCollections({ collections }: { collections: Collection[] }) {
  if (!collections.length) return null;
  const shown = collections.slice(0, 6);
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Collections" title="Find your style" />
        <ul className={cn("mt-10 grid gap-4 sm:grid-cols-2", shown.length > 2 && shown.length !== 4 && "lg:grid-cols-3")}>
          {shown.map((c) => (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-cotton-deep sm:aspect-[5/4]">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <ProductMedia url={c.banner_image?.url} art={c.banner_image?.art} alt="" sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cotton sm:p-8">
                  <div>
                    <h3 className="text-3xl sm:text-4xl">{c.name}</h3>
                    <p className="mt-2 max-w-sm text-sm text-cotton/80">{c.description}</p>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cotton/15 backdrop-blur transition-colors group-hover:bg-cotton group-hover:text-ink">
                    <ArrowUpRight className="size-5" />
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
