/**
 * Server-side catalogue reads for pages (SSR/ISR, SRS 9.4.2).
 * Source is chosen by NEXT_PUBLIC_DATA_SOURCE: the sample catalogue, or GET /api/v1/products/ etc.
 */
import { cacheLife, cacheTag } from "next/cache";
import { apiFetch, toQueryString } from "@/lib/api/client";
import type {
  Category,
  Collection,
  Facets,
  Paginated,
  ProductDetail,
  ProductQuery,
  ProductSummary,
} from "@/lib/api/types";
import { siteConfig, type NavItem } from "@/lib/config";
import * as mock from "./mock-data";
import { withCategoryArt, withCollectionArt, withPlaceholderArt } from "./art";
import { DEFAULT_PAGE_SIZE, facetsFor, queryProducts, toSummary } from "./search";

const useApi = siteConfig.dataSource === "api";

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  if (useApi) return (await apiFetch<Category[]>("/categories/")).map(withCategoryArt);
  return mock.categories;
}

export async function getCategory(slug: string) {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("collections");
  if (useApi) return (await apiFetch<Collection[]>("/collections/")).map(withCollectionArt);
  return mock.collections;
}

export async function getCollection(slug: string) {
  const all = await getCollections();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(query: ProductQuery = {}): Promise<Paginated<ProductSummary>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  if (useApi) {
    const page = await apiFetch<Paginated<ProductSummary>>(
      `/products/${toQueryString({ page_size: DEFAULT_PAGE_SIZE, ...query })}`,
    );
    return { ...page, results: page.results.map(withPlaceholderArt) };
  }
  return queryProducts(mock.products, query, mock.popularity);
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products", `product-${slug}`);
  if (useApi) {
    try {
      return withPlaceholderArt(await apiFetch<ProductDetail>(`/products/${encodeURIComponent(slug)}/`));
    } catch (error) {
      if ((error as { status?: number }).status === 404) return null;
      throw error;
    }
  }
  return mock.products.find((p) => p.slug === slug) ?? null;
}

export async function getProductSlugs(): Promise<string[]> {
  if (useApi) {
    const page = await getProducts({ page_size: 100 });
    return page.results.map((p) => p.slug);
  }
  return mock.products.map((p) => p.slug);
}

export async function getRelatedProducts(product: ProductDetail, limit = 4): Promise<ProductSummary[]> {
  const sameCategory = await getProducts({ category: product.category.slug, page_size: limit + 1 });
  const related = sameCategory.results.filter((p) => p.slug !== product.slug);
  if (related.length >= limit) return related.slice(0, limit);
  const popular = await getProducts({ page_size: limit * 2 });
  for (const p of popular.results) {
    if (related.length >= limit) break;
    if (p.slug !== product.slug && !related.some((r) => r.slug === p.slug)) related.push(p);
  }
  return related;
}

export async function getFacets(scope: { category?: string; collection?: string } = {}): Promise<Facets> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  if (useApi) return apiFetch<Facets>(`/products/facets/${toQueryString(scope)}`);
  const list = mock.products.filter(
    (p) =>
      (!scope.category || p.category.slug === scope.category) &&
      (!scope.collection || p.collections.some((c) => c.slug === scope.collection)),
  );
  return facetsFor(list);
}

/**
 * Catalogue links for the header and footer: categories, then collections, ticked "Show in menu" in the admin.
 * If nothing is ticked (or the API predates the setting), every top-level category with products is listed.
 * Never throws: without the API the menu just shows the fixed pages.
 */
export async function getMenu(): Promise<NavItem[]> {
  try {
    const [categories, collections] = await Promise.all([getCategories(), getCollections()]);
    const ticked = [
      ...categories.filter((c) => c.show_in_menu).map((c) => ({ label: c.name, href: `/shop/${c.slug}` })),
      ...collections.filter((c) => c.show_in_menu).map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
    ];
    if (ticked.length) return ticked;
    return categories.filter((c) => !c.parent && c.product_count > 0).map((c) => ({ label: c.name, href: `/shop/${c.slug}` }));
  } catch {
    return [];
  }
}

export { toSummary };
