/** Catalogue reads from the browser (search suggestions, wishlist). */
import { apiFetch, toQueryString } from "@/lib/api/client";
import type { Paginated, ProductSummary } from "@/lib/api/types";
import { siteConfig } from "@/lib/config";
import { withPlaceholderArt } from "./art";

export async function searchProducts(q: string, pageSize = 5): Promise<Paginated<ProductSummary>> {
  if (siteConfig.dataSource === "api") {
    const page = await apiFetch<Paginated<ProductSummary>>(`/products/${toQueryString({ q, page_size: pageSize })}`);
    return { ...page, results: page.results.map(withPlaceholderArt) };
  }
  const [{ products, popularity }, { queryProducts }] = await Promise.all([import("./mock-data"), import("./search")]);
  return queryProducts(products, { q, page_size: pageSize }, popularity);
}

export async function productsBySlugs(slugs: string[]): Promise<ProductSummary[]> {
  if (!slugs.length) return [];
  if (siteConfig.dataSource === "api") {
    const page = await apiFetch<Paginated<ProductSummary>>(`/products/${toQueryString({ slug: slugs, page_size: slugs.length })}`);
    return slugs
      .map((s) => page.results.find((p) => p.slug === s))
      .filter((p): p is ProductSummary => Boolean(p))
      .map(withPlaceholderArt);
  }
  const [{ products }, { toSummary }] = await Promise.all([import("./mock-data"), import("./search")]);
  return slugs.map((s) => products.find((p) => p.slug === s)).filter((p) => p !== undefined).map(toSummary);
}
