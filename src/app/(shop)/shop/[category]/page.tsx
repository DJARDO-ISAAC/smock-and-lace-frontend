import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories, getCategory } from "@/lib/catalog";
import { Listing, ListingHeader } from "@/components/shop/listing";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  return { title: category.name, description: category.description, alternates: { canonical: `/shop/${category.slug}` } };
}

export default function CategoryPage({ params, searchParams }: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<ListingHeader title=" " crumbs={[{ label: "Shop", href: "/shop" }]} />}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryContent({ params, searchParams }: PageProps<"/shop/[category]">) {
  const category = await getCategory((await params).category);
  if (!category) notFound();
  return (
    <>
      <ListingHeader eyebrow="Shop" title={category.name} description={category.description} crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]} />
      <Listing scope={{ category: category.slug }} basePath={`/shop/${category.slug}`} searchParams={searchParams} />
    </>
  );
}
