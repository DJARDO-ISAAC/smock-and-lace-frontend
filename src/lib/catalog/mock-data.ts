/**
 * SAMPLE CATALOGUE for development and design review (NEXT_PUBLIC_DATA_SOURCE=mock).
 *
 * Product names, weaver stories, prices, stock and reviews are illustrative placeholders
 * inferred from the fugu / smock-and-lace concept (SRS 1, 2.1). Replace with the real
 * catalogue from the Django admin before launch.
 */
import type {
  ArtSpec,
  Category,
  Collection,
  GarmentKind,
  ProductDetail,
  ProductImage,
  Review,
  Variant,
} from "@/lib/api/types";
import { hashString } from "@/lib/utils";

export const COLOURS: Record<string, string> = {
  Indigo: "#1e2a4a",
  Earth: "#6b4a2f",
  Natural: "#e6d8bd",
  Kola: "#b98a2e",
  Oxblood: "#6e1f1f",
  Forest: "#2f4f3a",
  Charcoal: "#2b2926",
  "Ivory lace": "#f3ecdc",
  Blush: "#e2b6a3",
  "Royal blue": "#27408b",
};

const PALETTES: Record<string, string[]> = {
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

const BACKDROPS = ["#ece4d6", "#e6dccb", "#efe9df", "#e2d7c3"];

export const categories: Category[] = [
  {
    slug: "mens-smocks",
    name: "Men's Smocks",
    description: "Batakari and fugu tunics woven in narrow strips and hand-sewn, from everyday Wednesday wear to ceremonial pieces.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "womens-smocks-dresses",
    name: "Women's Smocks & Dresses",
    description: "Smock dresses, wrap skirts and tailored tunics cut from handwoven strip-cloth.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "lace-fusion",
    name: "Lace Fusion",
    description: "Strip-cloth meets fine lace: tops and sets for weddings, outdoorings and nights out.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "caps",
    name: "Caps",
    description: "Woven fugu caps to finish the look, or to gift.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Bags, pocket squares and small goods from offcuts of the loom.",
    image: null,
    product_count: 0,
    parent: null,
  },
  {
    slug: "kids",
    name: "Kids",
    description: "Little batakari for naming ceremonies, birthdays and Fugu Wednesdays at school.",
    image: null,
    product_count: 0,
    parent: null,
  },
];

export const collections: Collection[] = [
  {
    slug: "new-in",
    name: "New in",
    description: "Fresh off the loom this month.",
    banner_image: null,
    is_featured: true,
  },
  {
    slug: "fugu-wednesday",
    name: "Fugu Wednesday",
    description: "Easy, breathable smocks for the midweek tradition, ready to ship from Accra.",
    banner_image: null,
    is_featured: true,
  },
  {
    slug: "wedding",
    name: "Wedding & Ceremony",
    description: "Statement pieces for the groom, the bride's family and every guest in between.",
    banner_image: null,
    is_featured: true,
  },
];

type Seed = {
  name: string;
  category: string;
  kind: GarmentKind;
  price: number;
  compareAt?: number;
  colours: string[];
  sizes: string[];
  madeToOrder?: number; // lead time in days
  soldOut?: boolean;
  lowStock?: boolean;
  origin: string;
  fabric: string;
  weaver: string;
  strips: string;
  story: string;
  description: string;
  collections: string[];
  daysAgo: number;
  popularity: number;
  rating?: [number, number];
};

const ADULT = ["S", "M", "L", "XL", "XXL"];
const WOMEN = ["XS", "S", "M", "L", "XL"];
const KIDS = ["2–3Y", "4–5Y", "6–7Y", "8–9Y"];
const CAP = ["56 cm", "58 cm", "60 cm"];
const ONE = ["One size"];

const SMOCK_CARE =
  "Hand wash cold or dry clean. Do not wring; roll in a towel and dry in the shade, inside out. Handwoven cloth softens and relaxes with every wear. Small irregularities in the weave are the mark of the loom, not faults.";
const LACE_CARE =
  "Dry clean recommended. If hand washing, use cold water and mild soap, and keep lace panels flat to dry. Steam rather than iron directly on lace.";

const seeds: Seed[] = [
  {
    name: "Daboya Indigo Batakari",
    category: "mens-smocks",
    kind: "smock",
    price: 145000,
    colours: ["Indigo", "Earth"],
    sizes: ADULT,
    origin: "Daboya",
    fabric: "Hand-spun cotton, indigo dyed",
    weaver: "A family of strip-weavers in Daboya, Savannah Region",
    strips: "38 strips, each about 10 cm wide, hand-sewn with a flat felled seam",
    story:
      "Daboya has dyed cloth with indigo for generations. The yarn is dipped many times to build the deep blue, then woven on narrow horizontal looms into strips that are sewn edge to edge into this full-cut tunic.",
    description:
      "The classic Wednesday smock: a generous, breathable cut with deep side pleats, a hand-finished V neck and two front pockets. Wear it loose over trousers, or belted over a kaftan for evenings.",
    collections: ["fugu-wednesday", "new-in"],
    daysAgo: 4,
    popularity: 98,
    rating: [4.9, 38],
  },
  {
    name: "Bolga Earth-Stripe Smock",
    category: "mens-smocks",
    kind: "smock",
    price: 98000,
    colours: ["Earth", "Natural", "Charcoal"],
    sizes: ADULT,
    lowStock: true,
    origin: "Bolgatanga",
    fabric: "Handwoven cotton strip-cloth",
    weaver: "A three-loom workshop outside Bolgatanga, Upper East Region",
    strips: "32 strips in alternating earth and natural stripes",
    story:
      "Woven in the dry season when the farms rest, this cloth uses undyed cotton alongside threads coloured with local bark dyes. Each strip carries a slightly different stripe rhythm, so no two smocks match exactly.",
    description:
      "An everyday batakari in warm, muted stripes. Lighter than our ceremonial pieces, with a shorter hem that sits well over jeans or chinos.",
    collections: ["fugu-wednesday"],
    daysAgo: 20,
    popularity: 91,
    rating: [4.8, 52],
  },
  {
    name: "Tamale Royal Fugu",
    category: "mens-smocks",
    kind: "smock",
    price: 240000,
    compareAt: 275000,
    colours: ["Oxblood", "Royal blue"],
    sizes: ADULT,
    origin: "Tamale",
    fabric: "Handwoven cotton with silk-blend accent strips",
    weaver: "Master weavers in Tamale, Northern Region",
    strips: "44 narrow strips with embroidered neckline and pocket",
    story:
      "Fuller cuts with many strips have long been worn for important occasions in the north. This piece follows that tradition, with hand embroidery around the neck worked over three days.",
    description:
      "Our most ceremonial ready-to-wear smock. A wide, sweeping cut with heavy pleating, hand-embroidered neckline and a matching pocket square.",
    collections: ["wedding"],
    daysAgo: 45,
    popularity: 77,
    rating: [5, 14],
  },
  {
    name: "Chief's Gown, Made to Measure",
    category: "mens-smocks",
    kind: "smock",
    price: 380000,
    colours: ["Indigo", "Oxblood", "Forest"],
    sizes: ["Made to measure"],
    madeToOrder: 21,
    origin: "Yendi",
    fabric: "Heavyweight handwoven cotton",
    weaver: "A Yendi workshop that has made ceremonial gowns for three generations",
    strips: "Up to 60 strips depending on your measurements",
    story:
      "This is the full-length gown worn for durbars and weddings. It is woven and sewn only after you order, cut to your measurements, and finished with hand embroidery.",
    description:
      "Floor-length ceremonial gown with full sleeves, cut and sewn to your measurements. Includes a fitting call on WhatsApp before the weaving starts.",
    collections: ["wedding"],
    daysAgo: 60,
    popularity: 64,
    rating: [5, 9],
  },
  {
    name: "Savannah Short-Sleeve Smock",
    category: "mens-smocks",
    kind: "top",
    price: 72000,
    colours: ["Natural", "Indigo"],
    sizes: ADULT,
    origin: "Daboya",
    fabric: "Lightweight handwoven cotton",
    weaver: "A family of strip-weavers in Daboya, Savannah Region",
    strips: "24 strips, straight cut with side vents",
    story:
      "A lighter weave for Accra heat. The cotton is spun looser so air moves through the cloth.",
    description:
      "A straight-cut, short-sleeve smock shirt for warm days and casual Fridays. Mandarin collar, side vents, one chest pocket.",
    collections: ["fugu-wednesday", "new-in"],
    daysAgo: 2,
    popularity: 86,
    rating: [4.7, 21],
  },
  {
    name: "Kologo Smock Midi Dress",
    category: "womens-smocks-dresses",
    kind: "dress",
    price: 128000,
    colours: ["Indigo", "Kola"],
    sizes: WOMEN,
    origin: "Bolgatanga",
    fabric: "Handwoven cotton strip-cloth",
    weaver: "A women-led weaving group near Bolgatanga",
    strips: "Horizontal strips across the bodice, vertical in the skirt",
    story:
      "Named for the two-string lute of the Upper East, this dress plays the strips in two directions, so the stripes change as you move.",
    description:
      "A fitted bodice opening into a full midi skirt with pockets. Concealed back zip, adjustable tie waist.",
    collections: ["new-in", "fugu-wednesday"],
    daysAgo: 3,
    popularity: 95,
    rating: [4.9, 41],
  },
  {
    name: "Nima Wrap Dress",
    category: "womens-smocks-dresses",
    kind: "dress",
    price: 115000,
    colours: ["Earth", "Blush"],
    sizes: WOMEN,
    soldOut: true,
    origin: "Tamale",
    fabric: "Handwoven cotton",
    weaver: "Master weavers in Tamale, Northern Region",
    strips: "28 strips, cut on the bias for drape",
    story: "Cutting strip-cloth on the bias is slow work, but it lets a stiff handwoven fabric fall softly.",
    description: "A wrap dress with flutter sleeves and a deep V, tied at the side. Falls just below the knee.",
    collections: [],
    daysAgo: 30,
    popularity: 88,
    rating: [4.6, 27],
  },
  {
    name: "Women's Classic Batakari",
    category: "womens-smocks-dresses",
    kind: "smock",
    price: 105000,
    colours: ["Indigo", "Natural", "Forest"],
    sizes: WOMEN,
    origin: "Daboya",
    fabric: "Hand-spun cotton",
    weaver: "A family of strip-weavers in Daboya, Savannah Region",
    strips: "30 strips with a tapered side seam",
    story: "The traditional cut, re-proportioned for a narrower shoulder and a softer flare.",
    description: "A tunic-length batakari with a tapered fit through the shoulders. Wear as a mini dress or over trousers.",
    collections: ["fugu-wednesday"],
    daysAgo: 12,
    popularity: 82,
    rating: [4.8, 19],
  },
  {
    name: "Made-to-Measure Bridal Smock Gown",
    category: "womens-smocks-dresses",
    kind: "dress",
    price: 450000,
    colours: ["Ivory lace", "Kola"],
    sizes: ["Made to measure"],
    madeToOrder: 28,
    origin: "Tamale",
    fabric: "Handwoven cotton with French lace overlay",
    weaver: "Master weavers in Tamale, with lace work finished in our Accra studio",
    strips: "Fine 6 cm strips for a smoother drape",
    story: "Woven to order for one bride. We weave finer, narrower strips for this gown so the cloth sits close to the body under the lace.",
    description:
      "A floor-length gown with strip-woven bodice and a lace overlay skirt. Includes two virtual fittings and a final adjustment in Accra.",
    collections: ["wedding"],
    daysAgo: 50,
    popularity: 58,
    rating: [5, 6],
  },
  {
    name: "Osu Lace-Fusion Top",
    category: "lace-fusion",
    kind: "top",
    price: 78000,
    compareAt: 92000,
    colours: ["Ivory lace", "Charcoal"],
    sizes: WOMEN,
    origin: "Accra studio",
    fabric: "Handwoven cotton yoke, cotton lace body",
    weaver: "Strip-cloth from Daboya, lace cut and sewn in our Accra studio",
    strips: "A 4-strip woven yoke across the shoulders",
    story: "Our signature: a band of handwoven strip-cloth set into soft lace, so the weave frames the face.",
    description: "A relaxed lace blouse with a handwoven yoke and three-quarter sleeves. Pairs with the Osu wide-leg trousers.",
    collections: ["new-in"],
    daysAgo: 6,
    popularity: 90,
    rating: [4.8, 33],
  },
  {
    name: "Outdooring Lace Set",
    category: "lace-fusion",
    kind: "set",
    price: 165000,
    colours: ["Ivory lace", "Blush", "Kola"],
    sizes: WOMEN,
    lowStock: true,
    origin: "Accra studio",
    fabric: "Lace with handwoven trim",
    weaver: "Strip-cloth from Bolgatanga, lace work in our Accra studio",
    strips: "Woven trim along the hem and cuffs",
    story: "Made for naming ceremonies: soft enough to hold a baby in, smart enough for the photos.",
    description: "A two-piece set: boxy lace top with woven cuffs, and a matching wrap skirt with woven hem.",
    collections: ["wedding", "new-in"],
    daysAgo: 8,
    popularity: 80,
    rating: [4.9, 15],
  },
  {
    name: "Lace & Strip Kaftan",
    category: "lace-fusion",
    kind: "dress",
    price: 135000,
    colours: ["Indigo", "Ivory lace"],
    sizes: ["S/M", "L/XL"],
    origin: "Accra studio",
    fabric: "Handwoven cotton panels with lace insets",
    weaver: "Strip-cloth from Daboya, lace work in our Accra studio",
    strips: "Two vertical woven panels framing a lace centre",
    story: "A kaftan that works for everyone at the party: a loose, easy shape with the weave at its edges.",
    description: "A floor-length kaftan with lace centre panel and woven side panels. Relaxed fit, two sizes.",
    collections: ["wedding"],
    daysAgo: 25,
    popularity: 72,
    rating: [4.7, 11],
  },
  {
    name: "Groom's Lace-Trim Fugu",
    category: "lace-fusion",
    kind: "smock",
    price: 195000,
    colours: ["Ivory lace", "Indigo"],
    sizes: ["Made to measure"],
    madeToOrder: 14,
    origin: "Tamale",
    fabric: "Handwoven cotton with lace trim",
    weaver: "Master weavers in Tamale, lace finishing in our Accra studio",
    strips: "36 strips with lace-edged neck and pockets",
    story: "A wedding fugu that matches the bride's lace. Send us a swatch photo and we will match the trim.",
    description: "A ceremonial smock with lace trim at the neck, pocket and hem, made to your measurements.",
    collections: ["wedding"],
    daysAgo: 15,
    popularity: 69,
    rating: [5, 8],
  },
  {
    name: "Fugu Cap, Indigo Stripe",
    category: "caps",
    kind: "cap",
    price: 22000,
    colours: ["Indigo", "Earth", "Charcoal"],
    sizes: CAP,
    origin: "Daboya",
    fabric: "Handwoven cotton strip-cloth",
    weaver: "A family of strip-weavers in Daboya, Savannah Region",
    strips: "6 strips gathered to a soft crown",
    story: "Made from the same cloth as our smocks, so you can match your cap to your fugu.",
    description: "A soft, foldable cap that keeps its shape. Sized by head circumference.",
    collections: ["fugu-wednesday"],
    daysAgo: 18,
    popularity: 93,
    rating: [4.8, 64],
  },
  {
    name: "Embroidered Ceremony Cap",
    category: "caps",
    kind: "cap",
    price: 34000,
    colours: ["Oxblood", "Royal blue", "Kola"],
    sizes: CAP,
    origin: "Tamale",
    fabric: "Handwoven cotton with hand embroidery",
    weaver: "Master weavers in Tamale, Northern Region",
    strips: "8 strips with an embroidered band",
    story: "Embroidered by hand to match our Royal Fugu.",
    description: "A structured cap with an embroidered band, made to sit upright.",
    collections: ["wedding"],
    daysAgo: 40,
    popularity: 70,
    rating: [4.9, 17],
  },
  {
    name: "Strip-Cloth Tote",
    category: "accessories",
    kind: "bag",
    price: 26000,
    colours: ["Indigo", "Earth", "Natural"],
    sizes: ONE,
    origin: "Bolgatanga",
    fabric: "Handwoven cotton, leather handles",
    weaver: "A three-loom workshop outside Bolgatanga, Upper East Region",
    strips: "Lined in plain cotton with an inside pocket",
    story: "Made from strip lengths too short for a smock, so nothing from the loom goes to waste.",
    description: "A sturdy everyday tote with leather handles and an inner zip pocket. Fits a 14-inch laptop.",
    collections: ["new-in"],
    daysAgo: 1,
    popularity: 76,
    rating: [4.7, 22],
  },
  {
    name: "Pocket Square Trio",
    category: "accessories",
    kind: "bag",
    price: 12000,
    colours: ["Kola", "Indigo"],
    sizes: ONE,
    origin: "Daboya",
    fabric: "Handwoven cotton",
    weaver: "A family of strip-weavers in Daboya, Savannah Region",
    strips: "Three hand-rolled squares",
    story: "Offcuts from our smocks, hand-rolled at the edges.",
    description: "Three pocket squares in coordinating stripes, boxed for gifting.",
    collections: ["wedding"],
    daysAgo: 35,
    popularity: 55,
    rating: [4.6, 12],
  },
  {
    name: "Mini Batakari",
    category: "kids",
    kind: "kids",
    price: 48000,
    colours: ["Indigo", "Kola", "Forest"],
    sizes: KIDS,
    origin: "Daboya",
    fabric: "Soft hand-spun cotton",
    weaver: "A family of strip-weavers in Daboya, Savannah Region",
    strips: "16 strips, softened for children's skin",
    story: "The same cloth as the grown-ups', washed twice before sewing so it is soft from the first wear.",
    description: "A little smock for little people, with roomy arms and an easy pull-on neck.",
    collections: ["fugu-wednesday", "new-in"],
    daysAgo: 5,
    popularity: 89,
    rating: [5, 29],
  },
  {
    name: "Naming Day Smock Set",
    category: "kids",
    kind: "kids",
    price: 62000,
    colours: ["Ivory lace", "Natural"],
    sizes: ["0–6M", "6–12M", "1–2Y"],
    origin: "Accra studio",
    fabric: "Handwoven cotton and cotton lace",
    weaver: "Strip-cloth from Daboya, lace work in our Accra studio",
    strips: "A woven smock with matching lace cap",
    story: "For the outdooring: a gentle, breathable smock and a matching cap.",
    description: "Baby smock and cap set with snap shoulder for easy dressing. Gift boxed.",
    collections: ["wedding"],
    daysAgo: 22,
    popularity: 67,
    rating: [4.9, 13],
  },
  {
    name: "Wa Two-Tone Smock",
    category: "mens-smocks",
    kind: "smock",
    price: 118000,
    colours: ["Forest", "Charcoal"],
    sizes: ADULT,
    origin: "Wa",
    fabric: "Handwoven cotton strip-cloth",
    weaver: "A weaving family in Wa, Upper West Region",
    strips: "34 strips in two tones, split down the centre",
    story: "A modern take: one tone on the left, another on the right, joined by a hand-sewn centre seam.",
    description: "A mid-length smock in two blocks of colour, with contrast pocket. Regular fit.",
    collections: ["new-in"],
    daysAgo: 7,
    popularity: 74,
    rating: [4.6, 10],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function art(kind: GarmentKind, colour: string, seed: number, view: ArtSpec["view"] = "front"): ArtSpec {
  return {
    kind,
    view,
    palette: PALETTES[colour] ?? PALETTES.Indigo,
    seed,
    backdrop: BACKDROPS[seed % BACKDROPS.length],
  };
}

const REVIEW_SAMPLES: Omit<Review, "id" | "created_at">[] = [
  {
    rating: 5,
    title: "Better than the photos",
    body: "The weave is tight and even and the indigo is deep. Got compliments at work every Wednesday since.",
    author_name: "Kwame A.",
    location: "Accra",
    is_verified_buyer: true,
  },
  {
    rating: 5,
    title: "Arrived in London in six days",
    body: "Well packed, size chart was spot on. It felt like a piece of home.",
    author_name: "Akosua M.",
    location: "London, UK",
    is_verified_buyer: true,
  },
  {
    rating: 4,
    title: "Lovely, size up if between sizes",
    body: "Beautiful cloth. The cut is generous but the shoulders run slightly narrow, so I'd size up.",
    author_name: "Ibrahim S.",
    location: "Kumasi",
    is_verified_buyer: true,
  },
  {
    rating: 5,
    title: "Worth the wait",
    body: "They called me on WhatsApp to confirm measurements before starting. Fit is perfect.",
    author_name: "Efua D.",
    location: "Houston, USA",
    is_verified_buyer: true,
  },
];

const NOW = Date.UTC(2026, 9, 14);

function build(seed: Seed, index: number): ProductDetail {
  const slug = slugify(seed.name);
  const id = index + 1;
  const hash = hashString(slug);

  let variantId = id * 100;
  const variants: Variant[] = [];
  for (const colour of seed.colours) {
    for (const size of seed.sizes) {
      variantId += 1;
      const sku = `SL-${slug.split("-").map((w) => w[0]).join("").toUpperCase()}-${colour.slice(0, 3).toUpperCase()}-${size.replace(/[^A-Z0-9]/gi, "").toUpperCase() || "OS"}`;
      const roll = hashString(sku) % 9;
      let stock: number | null = seed.madeToOrder ? null : roll === 0 ? 0 : roll;
      if (seed.soldOut) stock = 0;
      else if (seed.lowStock && stock !== null) stock = Math.min(stock, 2);
      variants.push({
        id: variantId,
        sku,
        size,
        colour,
        price: seed.price,
        compare_at_price: seed.compareAt ?? null,
        available_quantity: stock,
        is_active: true,
      });
    }
  }

  const images: ProductImage[] = [];
  seed.colours.forEach((colour, ci) => {
    const colourVariant = variants.find((v) => v.colour === colour)!;
    const views: ArtSpec["view"][] = ci === 0 ? ["front", "detail", "back", "detail"] : ["front", "detail"];
    views.forEach((view, vi) => {
      images.push({
        id: id * 1000 + ci * 10 + vi,
        url: null,
        alt: `${seed.name} in ${colour.toLowerCase()}, ${view === "detail" ? "close-up of the handwoven strips" : `${view} view`}`,
        variant_id: ci === 0 && vi === 0 ? null : colourVariant.id,
        art: art(seed.kind, colour, hash + ci * 7 + vi, view),
      });
    });
  });

  const reviewCount = seed.rating?.[1] ?? 0;
  const reviews: Review[] = reviewCount
    ? REVIEW_SAMPLES.slice(0, Math.min(4, 2 + (hash % 3))).map((r, i) => ({
        ...r,
        id: id * 10 + i,
        rating: seed.rating![0] === 5 ? 5 : r.rating,
        created_at: new Date(NOW - (i * 9 + 3) * 86400000).toISOString(),
      }))
    : [];

  return {
    id,
    slug,
    name: seed.name,
    category: { slug: seed.category, name: categories.find((c) => c.slug === seed.category)!.name },
    price: seed.price,
    compare_at_price: seed.compareAt ?? null,
    is_made_to_order: Boolean(seed.madeToOrder),
    lead_time_days: seed.madeToOrder ?? null,
    in_stock: variants.some((v) => v.available_quantity === null || v.available_quantity > 0),
    colours: seed.colours.map((name) => ({ name, hex: COLOURS[name] })),
    sizes: seed.sizes,
    images,
    origin: seed.origin,
    fabric: seed.fabric,
    rating_average: seed.rating?.[0] ?? null,
    rating_count: reviewCount,
    is_new: seed.daysAgo <= 10,
    created_at: new Date(NOW - seed.daysAgo * 86400000).toISOString(),
    description: seed.description,
    care: seed.kind === "set" || seed.category === "lace-fusion" ? LACE_CARE : SMOCK_CARE,
    story: seed.story,
    weaver: seed.weaver,
    strip_details: seed.strips,
    variants,
    reviews,
    collections: seed.collections.map((s) => ({ slug: s, name: collections.find((c) => c.slug === s)!.name })),
    seo_title: "",
    seo_description: "",
  };
}

export const products: ProductDetail[] = seeds.map(build);

export const popularity: Record<string, number> = Object.fromEntries(
  seeds.map((s) => [slugify(s.name), s.popularity]),
);

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
