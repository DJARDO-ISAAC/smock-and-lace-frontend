/**
 * SAMPLE CATALOGUE for development and design review (NEXT_PUBLIC_DATA_SOURCE=mock).
 *
 * Cloth photos are Fugu Tribe's own TikTok posts (public/demo). The 6-yard piece at GH₵ 500 comes
 * from the shop's post; other prices, stock and the garments are placeholders. The real catalogue is
 * managed in the Django admin, and `python manage.py seed_catalogue` loads this same data there.
 */
import type {
  ArtSpec,
  Category,
  Collection,
  GarmentKind,
  ProductDetail,
  ProductImage,
  ProductKind,
  Variant,
} from "@/lib/api/types";
import { hashString } from "@/lib/utils";
import { artFor } from "./art";

export const categories: Category[] = [
  {
    slug: "fugu-cloth",
    name: "Fugu cloth",
    description: "Handwoven northern kente, sold by the piece for you and your tailor to sew. Vintage and modern designs.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "smocks-batakari",
    name: "Smocks & batakari",
    description: "Ready-to-wear fugu smocks and batakari, sewn from our own cloth.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "womens-fugu",
    name: "Women's fugu",
    description: "Kaftans and easy pieces cut from handwoven fugu cloth.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "kids",
    name: "Kids",
    description: "Little smocks for naming ceremonies, birthdays and Fugu Wednesdays at school.",
    image: null,
    product_count: 0,
    parent: null,
  },
];

export const collections: Collection[] = [
  { slug: "new-in", name: "New in", description: "Fresh off the loom.", banner_image: null, is_featured: true },
  {
    slug: "modern",
    name: "Modern designs",
    description: "Bold colour and clean stripes for today's weddings, parties and Fugu Wednesdays.",
    banner_image: null,
    is_featured: true,
  },
  {
    slug: "vintage",
    name: "Vintage designs",
    description: "Classic northern patterns and earthy tones, woven the way they always have been.",
    banner_image: null,
    is_featured: true,
  },
  {
    slug: "bridal-occasion",
    name: "Bridal & occasion",
    description: "Cloth for brides, grooms and whole bridal parties. Ask us to match your colours.",
    banner_image: null,
    is_featured: true,
  },
];

type ClothSeed = {
  name: string;
  colour: string;
  hex: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  collections: string[];
  daysAgo: number;
  popularity: number;
};

type GarmentSeed = {
  name: string;
  category: string;
  art: GarmentKind;
  price: number;
  colours: [string, string][];
  sizes: string[];
  madeToOrder?: number;
  description: string;
  collections: string[];
  daysAgo: number;
  popularity: number;
};

const CLOTH_LENGTH = 6;
const CLOTH_FABRIC = "Handwoven cotton strip-cloth (northern kente)";
const CLOTH_CARE =
  "Dry clean, or hand wash cold and dry in the shade. Ask your tailor to pre-wash before cutting if you plan to wash the finished piece. Small irregularities are the mark of hand weaving.";
const CLOTH_STORY =
  "Woven on narrow looms in northern Ghana, strip by strip, then sewn edge to edge into a full piece. Every piece is slightly different.";

const cloth: ClothSeed[] = [
  { name: "Bush Green & White", colour: "Green & white", hex: "#5b7a2e", image: "bush-green-white", description: "Crisp olive-green and white bands. A bright, fresh choice for traditional weddings and Fugu Wednesday.", price: 50000, stock: 8, collections: ["modern", "new-in"], daysAgo: 3, popularity: 99 },
  { name: "Savannah Sunset", colour: "Orange & gold", hex: "#d9771f", image: "savannah-sunset", description: "Warm orange with fine gold stripes. Glows in daylight photos.", price: 50000, stock: 6, collections: ["modern", "bridal-occasion"], daysAgo: 6, popularity: 92 },
  { name: "Royal Volta", colour: "Royal blue & yellow", hex: "#2f4fb0", image: "royal-volta", description: "Deep royal blue with yellow and green accents. A classic for grooms and chiefs.", price: 50000, stock: 5, collections: ["modern"], daysAgo: 4, popularity: 90 },
  { name: "Emerald Strip", colour: "Emerald greens", hex: "#2e8b3e", image: "emerald-strip", description: "Bands of emerald and lime. Bold for celebrations, easy to match with gold.", price: 50000, stock: 7, collections: ["modern", "new-in"], daysAgo: 2, popularity: 88 },
  { name: "Bolga Orchid", colour: "Orchid & purple", hex: "#9a4f9a", image: "bolga-orchid", description: "Orchid pink and purple stripes on a deep base. A favourite for bridesmaids.", price: 50000, stock: 9, collections: ["modern", "bridal-occasion"], daysAgo: 8, popularity: 86 },
  { name: "Blush Kente", colour: "Blush pink", hex: "#d98aa8", image: "blush-kente", description: "Soft blush and rose with a fine texture. Made for brides and engagement looks.", price: 50000, stock: 4, collections: ["bridal-occasion", "new-in"], daysAgo: 1, popularity: 85 },
  { name: "Daboya Flame", colour: "Flame orange & peach", hex: "#e0702a", image: "daboya-flame", description: "Flame orange, peach and olive. Strong colour for a statement smock.", price: 50000, stock: 3, collections: ["modern"], daysAgo: 10, popularity: 80 },
  { name: "Rose Clay", colour: "Rose & lilac", hex: "#b85c5c", image: "rose-clay", description: "Dusty rose with lilac pinstripes. Gentle and elegant.", price: 50000, stock: 5, collections: ["bridal-occasion"], daysAgo: 12, popularity: 78 },
  { name: "Sage Loom", colour: "Sage green", hex: "#6f9c84", image: "sage-loom", description: "Muted sage with forest-green stripes. Calm and modern.", price: 50000, stock: 6, collections: ["modern"], daysAgo: 14, popularity: 74 },
  { name: "Golden Millet", colour: "Gold & stone", hex: "#c9a227", image: "golden-millet", description: "Mustard gold bands on a stone-grey ground, with a light shimmer thread.", price: 55000, stock: 4, collections: ["vintage", "bridal-occasion"], daysAgo: 16, popularity: 76 },
  { name: "Tamale Ember", colour: "Ember brown & orange", hex: "#8a4a2a", image: "tamale-ember", description: "A dense vintage weave in brown, orange and white. Rich and traditional.", price: 55000, stock: 2, collections: ["vintage"], daysAgo: 20, popularity: 72 },
  { name: "Harmattan Slate", colour: "Slate & olive", hex: "#4a5577", image: "harmattan-slate", description: "Slate blue and olive in a fine, tight weave. Understated and versatile.", price: 55000, stock: 5, collections: ["vintage"], daysAgo: 25, popularity: 68 },
  { name: "Laterite Rust", colour: "Rust & peach", hex: "#b5583a", image: "laterite-rust", description: "The colour of northern earth: rust and peach in soft bands.", price: 55000, stock: 0, collections: ["vintage"], daysAgo: 30, popularity: 70 },
];

const garments: GarmentSeed[] = [
  {
    name: "Northern Batakari",
    category: "smocks-batakari",
    art: "smock",
    price: 95000,
    colours: [["Indigo", "#1e2a4a"], ["Earth", "#6b4a2f"]],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Our everyday batakari: a generous cut with side pleats and front pockets, sewn from our own cloth.",
    collections: ["new-in"],
    daysAgo: 5,
    popularity: 84,
  },
  {
    name: "Embroidered Fugu Smock",
    category: "smocks-batakari",
    art: "smock",
    price: 140000,
    colours: [["Royal blue", "#27408b"], ["Oxblood", "#6e1f1f"]],
    sizes: ["M", "L", "XL", "XXL"],
    description: "A fuller smock with hand embroidery at the neck, for weddings, durbars and big days.",
    collections: ["bridal-occasion"],
    daysAgo: 18,
    popularity: 79,
  },
  {
    name: "Chief's Smock, Made to Measure",
    category: "smocks-batakari",
    art: "smock",
    price: 250000,
    colours: [["Indigo", "#1e2a4a"], ["Kola", "#b98a2e"], ["Forest", "#2f4f3a"]],
    sizes: ["Made to measure"],
    madeToOrder: 21,
    description: "Sewn to your measurements from the cloth of your choice. We confirm the fit with you on WhatsApp before cutting.",
    collections: ["bridal-occasion"],
    daysAgo: 40,
    popularity: 66,
  },
  {
    name: "Fugu Kaftan",
    category: "womens-fugu",
    art: "dress",
    price: 85000,
    colours: [["Blush", "#e2b6a3"], ["Indigo", "#1e2a4a"]],
    sizes: ["S/M", "L/XL"],
    description: "A relaxed, floor-length kaftan with a V neck and side slits. Easy to wear, easy to dress up.",
    collections: ["new-in"],
    daysAgo: 7,
    popularity: 82,
  },
  {
    name: "Kids' Fugu Smock",
    category: "kids",
    art: "kids",
    price: 45000,
    colours: [["Indigo", "#1e2a4a"], ["Kola", "#b98a2e"]],
    sizes: ["2–3Y", "4–5Y", "6–7Y", "8–9Y"],
    description: "A little smock with roomy arms and an easy neck, softened for children's skin.",
    collections: [],
    daysAgo: 9,
    popularity: 75,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const NOW = Date.UTC(2026, 9, 14);
const yards = (n: number) => `${n} yards`;

function baseProduct(id: number, name: string, kind: ProductKind, category: string, daysAgo: number, collectionSlugs: string[]) {
  return {
    id,
    slug: slugify(name),
    name,
    kind,
    category: { slug: category, name: categories.find((c) => c.slug === category)!.name },
    rating_average: null,
    rating_count: 0,
    is_new: daysAgo <= 10,
    created_at: new Date(NOW - daysAgo * 86400000).toISOString(),
    reviews: [],
    collections: collectionSlugs.map((s) => ({ slug: s, name: collections.find((c) => c.slug === s)!.name })),
    seo_title: "",
    seo_description: "",
  };
}

function buildCloth(seed: ClothSeed, index: number): ProductDetail {
  const id = index + 1;
  const variant: Variant = {
    id: id * 100 + 1,
    sku: `FT-${slugify(seed.name).toUpperCase().slice(0, 12)}-${CLOTH_LENGTH}Y`,
    size: yards(CLOTH_LENGTH),
    colour: seed.colour,
    length_yards: CLOTH_LENGTH,
    price: seed.price,
    compare_at_price: null,
    available_quantity: seed.stock,
    is_active: true,
  };
  const image: ProductImage = { id: id * 1000, url: `/demo/${seed.image}.jpg`, alt: `${seed.name} fugu cloth, folded`, variant_id: null };
  return {
    ...baseProduct(id, seed.name, "cloth", "fugu-cloth", seed.daysAgo, seed.collections),
    price: seed.price,
    compare_at_price: null,
    length_yards: CLOTH_LENGTH,
    is_made_to_order: false,
    lead_time_days: null,
    in_stock: seed.stock > 0,
    colours: [{ name: seed.colour, hex: seed.hex }],
    sizes: [variant.size],
    images: [image],
    origin: "Northern Ghana",
    fabric: CLOTH_FABRIC,
    description: seed.description,
    care: CLOTH_CARE,
    story: CLOTH_STORY,
    weaver: "Weavers in northern Ghana",
    strip_details: `One ${CLOTH_LENGTH}-yard piece of strips sewn edge to edge, ready for your tailor.`,
    variants: [variant],
  };
}

function art(kind: GarmentKind, colour: string, hex: string, seed: number, view: ArtSpec["view"]): ArtSpec {
  return artFor(kind, colour, seed, view, hex);
}

function buildGarment(seed: GarmentSeed, index: number): ProductDetail {
  const id = 100 + index + 1;
  const slug = slugify(seed.name);
  const hash = hashString(slug);
  let variantId = id * 100;
  const variants: Variant[] = [];
  for (const [colour] of seed.colours) {
    for (const size of seed.sizes) {
      variantId += 1;
      const roll = hashString(`${slug}-${colour}-${size}`) % 7;
      variants.push({
        id: variantId,
        sku: `FT-${slug.toUpperCase().slice(0, 10)}-${colour.slice(0, 3).toUpperCase()}-${size.replace(/[^A-Z0-9]/gi, "").toUpperCase()}`,
        size,
        colour,
        length_yards: null,
        price: seed.price,
        compare_at_price: null,
        available_quantity: seed.madeToOrder ? null : roll,
        is_active: true,
      });
    }
  }
  const images: ProductImage[] = [];
  seed.colours.forEach(([colour, hex], ci) => {
    const first = variants.find((v) => v.colour === colour)!;
    const views: ArtSpec["view"][] = ci === 0 ? ["front", "detail", "back"] : ["front", "detail"];
    views.forEach((view, vi) =>
      images.push({
        id: id * 1000 + ci * 10 + vi,
        url: null,
        alt: `${seed.name} in ${colour.toLowerCase()}, ${view === "detail" ? "close-up of the cloth" : `${view} view`}`,
        variant_id: ci === 0 ? null : first.id,
        art: art(seed.art, colour, hex, hash + ci * 7 + vi, view),
      }),
    );
  });
  return {
    ...baseProduct(id, seed.name, "garment", seed.category, seed.daysAgo, seed.collections),
    price: seed.price,
    compare_at_price: null,
    length_yards: null,
    is_made_to_order: Boolean(seed.madeToOrder),
    lead_time_days: seed.madeToOrder ?? null,
    in_stock: variants.some((v) => v.available_quantity === null || v.available_quantity > 0),
    colours: seed.colours.map(([name, hex]) => ({ name, hex })),
    sizes: seed.sizes,
    images,
    origin: "Northern Ghana",
    fabric: CLOTH_FABRIC,
    description: seed.description,
    care: CLOTH_CARE,
    story: "Sewn in Accra from cloth woven in northern Ghana.",
    weaver: "Weavers in northern Ghana, sewn by our tailors in Accra",
    strip_details: "Hand-sewn strip-cloth with flat-felled seams.",
    variants,
  };
}

export const products: ProductDetail[] = [...cloth.map(buildCloth), ...garments.map(buildGarment)];

export const popularity: Record<string, number> = Object.fromEntries([
  ...cloth.map((c) => [slugify(c.name), c.popularity]),
  ...garments.map((g) => [slugify(g.name), g.popularity]),
]);

/** Used by the backend seed export: which file backs each cloth product's photo. */
export const clothImages: Record<string, string> = Object.fromEntries(cloth.map((c) => [slugify(c.name), `${c.image}.jpg`]));

for (const category of categories) {
  const inCategory = products.filter((p) => p.category.slug === category.slug);
  category.product_count = inCategory.length;
  category.image = inCategory[0]?.images[0] ?? null;
}
for (const collection of collections) {
  const first = products.find((p) => p.collections.some((c) => c.slug === collection.slug));
  collection.banner_image = first?.images[0] ?? null;
}

export function findVariant(variantId: number) {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}
