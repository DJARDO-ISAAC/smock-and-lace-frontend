/** Palettes and shapes for the generated strip-cloth artwork shown until real photos exist. */
import type { ArtSpec, Category, Collection, GarmentKind, ProductDetail, ProductImage, ProductSummary } from "@/lib/api/types";
import { hashString } from "@/lib/utils";

export const PALETTES: Record<string, string[]> = {
  Indigo: ["#1e2a4a", "#efe7d6", "#3d5283", "#b98a2e"],
  Earth: ["#6b4a2f", "#ead9bb", "#a4472a", "#1b1a17"],
  Natural: ["#e6d8bd", "#2b2926", "#a4472a", "#6b4a2f"],
  Kola: ["#b98a2e", "#f4ead4", "#5a3d1e", "#1e2a4a"],
  Oxblood: ["#6e1f1f", "#ecdcc0", "#1b1a17", "#b98a2e"],
  Forest: ["#2f4f3a", "#ebe1c9", "#c79b3b", "#1b1a17"],
  Charcoal: ["#2b2926", "#f2ece0", "#8c8478", "#a4472a"],
  "Ivory lace": ["#f3ecdc", "#d9c9a8", "#b98a2e", "#6b4a2f"],
  Blush: ["#e2b6a3", "#f6ece4", "#a4472a", "#6b4a2f"],
  "Royal blue": ["#27408b", "#f0e9da", "#b98a2e", "#16224a"],
};

export const BACKDROPS = ["#ece4d6", "#e6dccb", "#efe9df", "#e2d7c3"];

export function artFor(kind: GarmentKind, colour: string, seed: number, view: ArtSpec["view"] = "front", hex?: string): ArtSpec {
  const palette = PALETTES[colour] ?? (hex ? [hex, "#efe7d6", "#b98a2e", "#1b1a17"] : PALETTES.Indigo);
  return { kind, view, palette, seed, backdrop: BACKDROPS[seed % BACKDROPS.length] };
}

const CATEGORY_KIND: Record<string, GarmentKind> = {
  "womens-fugu": "dress",
  kids: "kids",
};

/** Best guess at a garment shape from its name, then its category. */
export function guessKind(name: string, categorySlug?: string): GarmentKind {
  const n = name.toLowerCase();
  if (/\bcaps?\b/.test(n)) return "cap";
  if (/tote|bag|pocket square/.test(n)) return "bag";
  if (/mini|kids|baby|naming/.test(n)) return "kids";
  if (/\bset\b/.test(n)) return "set";
  if (/dress|kaftan|bridal/.test(n)) return "dress";
  if (/\btop\b|blouse|short-sleeve/.test(n)) return "top";
  return (categorySlug && CATEGORY_KIND[categorySlug]) || "smock";
}

const hasPhoto = (images: ProductImage[]) => images.some((i) => i.url);

/** API products without photos get artwork per colour, in the same layout as the sample catalogue. */
export function withPlaceholderArt<T extends ProductSummary>(product: T): T {
  if (hasPhoto(product.images)) return product;
  const kind = guessKind(product.name, product.category.slug);
  const seed = hashString(product.slug);
  const variants = (product as Partial<ProductDetail>).variants;
  const colours = product.colours.length ? product.colours : [{ name: "Indigo", hex: "#1e2a4a" }];
  const images: ProductImage[] = [];

  colours.forEach((colour, ci) => {
    if (!variants && ci > 0) return; // cards only need the first colour
    const firstVariant = variants?.find((v) => v.colour === colour.name);
    // Cloth is shown as the fabric itself; garments as the garment shape.
    const views: ArtSpec["view"][] =
      product.kind === "cloth" ? ["detail", "detail"] : ci === 0 && variants ? ["front", "detail", "back", "detail"] : ["front", "detail"];
    views.forEach((view, vi) => {
      images.push({
        id: -(product.id * 1000 + ci * 10 + vi),
        url: null,
        alt:
          product.kind === "cloth"
            ? `${product.name} fugu cloth${vi ? ", close-up" : ""}`
            : `${product.name} in ${colour.name.toLowerCase()}, ${view === "detail" ? "close-up of the handwoven strips" : `${view} view`}`,
        // First colour's images belong to the product; others to a variant of that colour.
        variant_id: ci === 0 ? null : (firstVariant?.id ?? null),
        art: artFor(kind, colour.name, seed + ci * 7 + vi, view, colour.hex),
      });
    });
  });
  return { ...product, images };
}

const CATEGORY_COLOUR: Record<string, string> = {
  "fugu-cloth": "Kola",
  "smocks-batakari": "Indigo",
  "womens-fugu": "Blush",
  kids: "Forest",
};

export function withCategoryArt(category: Category): Category {
  if (category.image?.url) return category;
  const colour = CATEGORY_COLOUR[category.slug] ?? Object.keys(PALETTES)[hashString(category.slug) % 10];
  return {
    ...category,
    image: { id: 0, url: null, alt: category.name, variant_id: null, art: artFor(guessKind(category.name, category.slug), colour, hashString(category.slug), category.slug === "fugu-cloth" ? "detail" : "front") },
  };
}

export function withCollectionArt(collection: Collection): Collection {
  if (collection.banner_image?.url) return collection;
  const colour = Object.keys(PALETTES)[hashString(collection.slug) % 10];
  return {
    ...collection,
    banner_image: { id: 0, url: null, alt: collection.name, variant_id: null, art: artFor("smock", colour, hashString(collection.slug)) },
  };
}
