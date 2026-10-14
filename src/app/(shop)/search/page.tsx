import type { Metadata } from "next";
import { Suspense } from "react";
import { Listing, ListingHeader } from "@/components/shop/listing";
import { SearchForm } from "@/components/shop/search-form";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

async function SearchHeading({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const q = (await searchParams).q;
  const term = (Array.isArray(q) ? q[0] : q)?.trim();
  return (
    <ListingHeader title={term ? <>Results for “{term}”</> : "Search the shop"} crumbs={[{ label: "Search" }]}>
      <SearchForm defaultValue={term ?? ""} />
    </ListingHeader>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <Suspense fallback={<ListingHeader title="Search the shop" crumbs={[{ label: "Search" }]} />}>
        <SearchHeading searchParams={searchParams} />
      </Suspense>
      <Listing scope={{}} basePath="/search" searchParams={searchParams} />
    </>
  );
}
