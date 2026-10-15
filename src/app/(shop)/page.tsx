import { ArrowRight } from "lucide-react";
import { getCategories, getCollection, getCollections, getProducts } from "@/lib/catalog";
import { Container, SectionHeading } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-card";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategoryTiles } from "@/components/home/category-tiles";
import { CollectionFeature } from "@/components/home/collection-feature";
import { DesignStyles } from "@/components/home/design-styles";
import { CustomOrdersTeaser } from "@/components/home/custom-orders-teaser";
import { Process } from "@/components/home/process";
import { VisitShop } from "@/components/home/visit-shop";

export default async function HomePage() {
  const [featured, cloth, garments, categories, collections, bridal, bridalProducts] = await Promise.all([
    getProducts({ kind: "cloth", ordering: "popularity", page_size: 3, in_stock: true }),
    getProducts({ kind: "cloth", ordering: "newest", page_size: 8 }),
    getProducts({ kind: "garment", ordering: "popularity", page_size: 4 }),
    getCategories(),
    getCollections(),
    getCollection("bridal-occasion"),
    getProducts({ collection: "bridal-occasion", page_size: 3, in_stock: true }),
  ]);
  const styles = collections.filter((c) => c.slug === "vintage" || c.slug === "modern").sort((a) => (a.slug === "modern" ? -1 : 1));

  return (
    <>
      <Hero featured={featured.results} />
      <TrustStrip />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Handwoven northern kente"
            title="Fugu cloth, by the piece"
            description="Choose your colourway, take it to your tailor. Every piece is woven strip by strip in northern Ghana."
            action={
              <LinkButton href="/shop/fugu-cloth" variant="outline" className="self-start sm:self-auto">
                All designs <ArrowRight className="size-4" />
              </LinkButton>
            }
          />
          <ProductGrid products={cloth.results} className="mt-10" />
        </Container>
      </section>

      <DesignStyles collections={styles} />

      {bridal && (
        <CollectionFeature
          collection={bridal}
          products={bridalProducts.results}
          eyebrow="Weddings & big days"
          note="Dressing the bride, the groom and the whole bridal party? We match colours across pieces and sew for groups."
          secondary={{ label: "Plan a group order", href: "/custom-orders" }}
        />
      )}

      {garments.results.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="Ready to wear"
              title="Smocks & batakari"
              action={
                <LinkButton href="/shop/smocks-batakari" variant="outline" className="self-start sm:self-auto">
                  Shop smocks <ArrowRight className="size-4" />
                </LinkButton>
              }
            />
            <ProductGrid products={garments.results} className="mt-10" />
          </Container>
        </section>
      )}

      <CustomOrdersTeaser />
      <CategoryTiles categories={categories} />
      <Process />
      <VisitShop />
    </>
  );
}
