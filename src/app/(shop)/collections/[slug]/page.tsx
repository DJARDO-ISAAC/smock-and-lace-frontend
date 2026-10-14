import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCollection, getCollections } from "@/lib/catalog";
import { Listing } from "@/components/shop/listing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ProductMedia } from "@/components/product/product-media";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const collection = await getCollection((await params).slug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description, alternates: { canonical: `/collections/${collection.slug}` } };
}

export default function CollectionPage({ params, searchParams }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<div className="h-80 bg-indigo" />}>
      <CollectionContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CollectionContent({ params, searchParams }: PageProps<"/collections/[slug]">) {
  const collection = await getCollection((await params).slug);
  if (!collection) notFound();
  return (
    <>
      <header className="relative overflow-hidden bg-indigo text-cotton">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] md:block">
          <ProductMedia url={collection.banner_image?.url} art={collection.banner_image?.art} alt="" sizes="42vw" priority className="opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo via-indigo/40 to-transparent" />
        </div>
        <Container className="relative pt-6 pb-14 sm:pb-20">
          <Breadcrumbs items={[{ label: "Collections" }, { label: collection.name }]} className="text-cotton/70 [&_[aria-current]]:text-cotton [&_a:hover]:text-cotton" />
          <div className="mt-10 max-w-xl">
            <p className="eyebrow text-kola">Collection</p>
            <h1 className="mt-3 text-5xl sm:text-6xl">{collection.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-cotton/80">{collection.description}</p>
          </div>
        </Container>
      </header>
      <Listing scope={{ collection: collection.slug }} basePath={`/collections/${collection.slug}`} searchParams={searchParams} />
    </>
  );
}
