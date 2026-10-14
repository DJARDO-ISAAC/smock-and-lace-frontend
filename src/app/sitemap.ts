import type { MetadataRoute } from "next";
import { getCategories, getCollections, getProductSlugs } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, collections, slugs] = await Promise.all([getCategories(), getCollections(), getProductSlugs()]);
  const url = (path: string) => `${siteConfig.url}${path}`;
  const pages = ["", "/shop", "/about", "/size-guide", "/shipping-returns", "/faq", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.5 })),
    ...categories.map((c) => ({ url: url(`/shop/${c.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
    ...collections.map((c) => ({ url: url(`/collections/${c.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
    ...slugs.map((s) => ({ url: url(`/products/${s}`), changeFrequency: "daily" as const, priority: 0.9 })),
  ];
}
