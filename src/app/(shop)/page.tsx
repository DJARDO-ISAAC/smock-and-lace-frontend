import { ArrowRight } from "lucide-react";
import { getCategories, getCollection, getProducts } from "@/lib/catalog";
import { Container, SectionHeading } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-card";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategoryTiles } from "@/components/home/category-tiles";
import { CollectionFeature } from "@/components/home/collection-feature";
import { Process } from "@/components/home/process";
import { MadeToOrder } from "@/components/home/made-to-order";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramFeed } from "@/components/home/instagram-feed";

export default async function HomePage() {
  const [popular, newest, categories, fuguWednesday, fuguProducts] = await Promise.all([
    getProducts({ ordering: "popularity", page_size: 3, in_stock: true }),
    getProducts({ ordering: "newest", page_size: 8 }),
    getCategories(),
    getCollection("fugu-wednesday"),
    getProducts({ collection: "fugu-wednesday", page_size: 3, in_stock: true }),
  ]);

  return (
    <>
      <Hero featured={popular.results} />
      <TrustStrip />
      <CategoryTiles categories={categories} />
      {fuguWednesday && <CollectionFeature collection={fuguWednesday} products={fuguProducts.results} />}

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Just off the loom"
            title="New arrivals"
            action={
              <LinkButton href="/collections/new-in" variant="outline" className="self-start sm:self-auto">
                View all <ArrowRight className="size-4" />
              </LinkButton>
            }
          />
          <ProductGrid products={newest.results} className="mt-10" />
        </Container>
      </section>

      <MadeToOrder />
      <Process />
      <Testimonials />
      <InstagramFeed images={newest.results.flatMap((p) => p.images.slice(0, 1))} />
    </>
  );
}
