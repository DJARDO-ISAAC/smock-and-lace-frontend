import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { Listing, ListingHeader } from "@/components/shop/listing";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Handwoven fugu cloth by the piece, ready-made smocks and batakari, and women's fugu from Fugu Tribe, Accra.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const categories = await getCategories();
  return (
    <>
      <ListingHeader eyebrow="The collection" title="Shop all" description="Every piece is woven by hand, so stock is small and changes often." crumbs={[{ label: "Shop" }]}>
        <nav aria-label="Categories" className="-mx-4 mt-8 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:flex-wrap">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm whitespace-nowrap transition-colors hover:border-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ListingHeader>
      <Listing scope={{}} basePath="/shop" searchParams={searchParams} />
    </>
  );
}
