import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProduct, getProductSlugs, getRelatedProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";
import { getDeliveryEstimates } from "@/lib/delivery-estimates";
import { describeDelivery } from "@/lib/shipping";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { AccordionItem } from "@/components/ui/accordion";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/product/product-card";
import { ProductExperience } from "@/components/product/product-experience";
import { StoryBlock } from "@/components/product/story-block";
import { Reviews } from "@/components/product/reviews";
import { RecentlyViewed } from "@/components/product/recently-viewed";

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const description = product.seo_description || product.description.slice(0, 155);
  const image = product.images[0]?.url;
  return {
    title: product.seo_title || product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description, type: "website", ...(image ? { images: [image] } : {}) },
  };
}

function productJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.variants[0]?.sku,
    category: product.category.name,
    material: product.fabric,
    brand: { "@type": "Brand", name: siteConfig.name },
    image: product.images.map((i) => i.url).filter(Boolean),
    ...(product.rating_average && product.rating_count
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating_average, reviewCount: product.rating_count } }
      : {}),
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      price: (v.price / 100).toFixed(2),
      priceCurrency: "GHS",
      url: `${siteConfig.url}/products/${product.slug}`,
      availability:
        v.available_quantity === null
          ? "https://schema.org/PreOrder"
          : v.available_quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
    })),
  };
}

async function Related({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product) return null;
  const related = await getRelatedProducts(product);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-3xl">
        You may also like
      </h2>
      <ProductGrid products={related} className="mt-8" />
    </section>
  );
}

async function ProductContent({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  const [product, estimates] = await Promise.all([getProduct(slug), getDeliveryEstimates()]);
  if (!product) notFound();

  const details = (
    <div className="border-t border-line">
      <AccordionItem title={product.kind === "cloth" ? "About this cloth" : "Description"} defaultOpen>
        <p>{product.description}</p>
      </AccordionItem>
      <AccordionItem title="Fabric & care">
        <p>
          <strong className="font-medium text-ink">Cloth:</strong> {product.fabric}
        </p>
        <p className="mt-3">{product.care}</p>
      </AccordionItem>
      <AccordionItem title="Delivery & returns">
        <ul className="list-disc space-y-1.5 pl-5">
          {estimates.map((e) => (
            <li key={e.zone}>
              <strong className="font-medium text-ink">{e.zone}:</strong> {describeDelivery(e)}
            </li>
          ))}
          {estimates.length === 0 && <li>Delivery options and fees are shown at checkout.</li>}
          <li>
            {product.kind === "cloth"
              ? `Return uncut, unwashed cloth within ${siteConfig.returnWindowDays} days for an exchange or refund. Cut cloth can't be returned.`
              : product.is_made_to_order
                ? "Made-to-measure pieces are sewn for you, so they can't be returned, but we'll adjust the fit free within 14 days."
                : `Return unworn pieces within ${siteConfig.returnWindowDays} days for an exchange or refund.`}
          </li>
        </ul>
      </AccordionItem>
    </div>
  );

  return (
    <>
      <Container className="pt-4 pb-16 sm:pt-6">
        <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: product.category.name, href: `/shop/${product.category.slug}` }, { label: product.name }]} className="mb-6 hidden sm:block" />
        <ProductExperience product={product} details={details} />
      </Container>
      <Container className="space-y-20 pb-24 sm:space-y-28">
        <StoryBlock product={product} />
        <Reviews product={product} />
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <Related slug={product.slug} />
        </Suspense>
        <RecentlyViewed exclude={product.slug} />
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }} />
    </>
  );
}

function ProductFallback() {
  return (
    <Container className="pt-6 pb-16">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-8 h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
