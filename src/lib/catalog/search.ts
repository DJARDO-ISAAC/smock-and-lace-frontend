/** Small, dependency-free filtering used by the mock catalogue (the API does this server-side). */
import type { Facets, Paginated, ProductDetail, ProductQuery, ProductSummary } from "@/lib/api/types";

export const DEFAULT_PAGE_SIZE = 12;

function normalise(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ");
}

function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** Every query word must match a word in the product (prefix, or one typo for words of 4+ letters). */
export function matchesSearch(product: ProductDetail, q: string) {
  const haystack = normalise(
    [product.name, product.fabric, product.origin, product.category.name, product.description, ...product.colours.map((c) => c.name)].join(" "),
  )
    .split(/\s+/)
    .filter(Boolean);
  return normalise(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) =>
      haystack.some(
        (word) =>
          word.startsWith(term) ||
          (term.length >= 4 && (withinOneEdit(term, word) || withinOneEdit(term, word.slice(0, term.length)))),
      ),
    );
}

export function toSummary(p: ProductDetail): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    kind: p.kind,
    category: p.category,
    price: p.price,
    compare_at_price: p.compare_at_price,
    length_yards: p.length_yards,
    is_made_to_order: p.is_made_to_order,
    lead_time_days: p.lead_time_days,
    in_stock: p.in_stock,
    colours: p.colours,
    sizes: p.sizes,
    images: p.images.filter((i) => i.variant_id === null || i.art?.view === "detail").slice(0, 2),
    origin: p.origin,
    fabric: p.fabric,
    rating_average: p.rating_average,
    rating_count: p.rating_count,
    is_new: p.is_new,
    created_at: p.created_at,
  };
}

export function queryProducts(
  all: ProductDetail[],
  query: ProductQuery,
  popularity: Record<string, number>,
): Paginated<ProductSummary> {
  let list = all.filter((p) => {
    if (query.category && p.category.slug !== query.category) return false;
    if (query.kind && p.kind !== query.kind) return false;
    if (query.collection && !p.collections.some((c) => c.slug === query.collection)) return false;
    if (query.q && !matchesSearch(p, query.q)) return false;
    if (query.size?.length && !p.sizes.some((s) => query.size!.includes(s))) return false;
    if (query.colour?.length && !p.colours.some((c) => query.colour!.includes(c.name))) return false;
    if (query.origin?.length && !query.origin.includes(p.origin)) return false;
    if (query.min_price !== undefined && p.price < query.min_price) return false;
    if (query.max_price !== undefined && p.price > query.max_price) return false;
    if (query.in_stock && !p.in_stock) return false;
    if (query.made_to_order && !p.is_made_to_order) return false;
    if (query.featured && !p.is_featured) return false;
    return true;
  });

  const ordering = query.ordering ?? "popularity";
  list = [...list].sort((a, b) => {
    switch (ordering) {
      case "price":
        return a.price - b.price;
      case "-price":
        return b.price - a.price;
      case "newest":
        return b.created_at.localeCompare(a.created_at);
      default:
        // Sold-out pieces sink to the end of the default sort.
        return Number(b.in_stock) - Number(a.in_stock) || (popularity[b.slug] ?? 0) - (popularity[a.slug] ?? 0);
    }
  });

  const pageSize = query.page_size ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, query.page ?? 1);
  const start = (page - 1) * pageSize;
  return {
    count: list.length,
    next: start + pageSize < list.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
    results: list.slice(start, start + pageSize).map(toSummary),
  };
}

export function facetsFor(list: ProductDetail[]): Facets {
  const sizeOrder = ["0–6M", "6–12M", "1–2Y", "2–3Y", "4–5Y", "6–7Y", "8–9Y", "XS", "S", "S/M", "M", "L", "L/XL", "XL", "XXL", "56 cm", "58 cm", "60 cm", "One size", "Made to measure"];
  const sizes = [...new Set(list.flatMap((p) => p.sizes))].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  const colourMap = new Map<string, string>();
  list.forEach((p) => p.colours.forEach((c) => colourMap.set(c.name, c.hex)));
  const prices = list.map((p) => p.price);
  return {
    sizes,
    colours: [...colourMap].map(([name, hex]) => ({ name, hex })),
    origins: [...new Set(list.map((p) => p.origin))].sort((a, b) => a.localeCompare(b)),
    price_min: prices.length ? Math.min(...prices) : 0,
    price_max: prices.length ? Math.max(...prices) : 0,
  };
}
