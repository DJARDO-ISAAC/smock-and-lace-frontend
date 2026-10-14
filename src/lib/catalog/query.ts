import type { ProductOrdering, ProductQuery } from "@/lib/api/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const SORT_OPTIONS: { value: ProductOrdering; label: string }[] = [
  { value: "popularity", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
];

/** Price bands in cedis, shown as simple choices (easier on a phone than a slider). */
export const PRICE_BANDS = [
  { value: "0-500", label: "Under GH₵ 500" },
  { value: "500-1000", label: "GH₵ 500 – 1,000" },
  { value: "1000-2000", label: "GH₵ 1,000 – 2,000" },
  { value: "2000-", label: "Over GH₵ 2,000" },
];

const list = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]).filter(Boolean);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseQuery(sp: RawSearchParams): ProductQuery {
  const ordering = one(sp.sort) as ProductOrdering | undefined;
  const price = one(sp.price);
  const [min, max] = price ? price.split("-") : [];
  const page = Number(one(sp.page));
  return {
    q: one(sp.q)?.slice(0, 100) || undefined,
    size: list(sp.size),
    colour: list(sp.colour),
    origin: list(sp.origin),
    min_price: min ? Number(min) * 100 : undefined,
    max_price: max ? Number(max) * 100 : undefined,
    in_stock: one(sp.in_stock) === "true" || undefined,
    made_to_order: one(sp.made_to_order) === "true" || undefined,
    ordering: SORT_OPTIONS.some((o) => o.value === ordering) ? ordering : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
  };
}

export function countActiveFilters(sp: RawSearchParams) {
  return ["size", "colour", "origin"].reduce((n, k) => n + list(sp[k]).length, 0) + ["price", "in_stock", "made_to_order"].filter((k) => one(sp[k])).length;
}
