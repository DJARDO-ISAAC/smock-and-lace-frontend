/**
 * API contract types. Shapes that already exist in the Django API (auth, me, addresses,
 * measurements, cart) mirror its serializers exactly. Catalogue, shipping, checkout and
 * order shapes follow SRS sections 6 and 7 and are the contract the backend should match.
 * All money fields are integer pesewas.
 */

export type ApiErrorBody = {
  code: string;
  detail: string;
  fields: Record<string, string[] | string>;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/* ---------- Users (users app) ---------- */

export type User = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  date_joined: string;
};

export type AuthResponse = { access: string; user: User };

export type Address = {
  id: number;
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  is_default: boolean;
};

export type Measurement = {
  id: number;
  label: string;
  chest: string | null;
  waist: string | null;
  hips: string | null;
  shoulder: string | null;
  sleeve: string | null;
  length: string | null;
  height: string | null;
  notes: string;
};

/* ---------- Catalogue (products app) ---------- */

export type GarmentKind = "smock" | "dress" | "cap" | "top" | "set" | "bag" | "kids";

/** cloth: sold by the piece (a set length in yards) for customers to sew; garment: ready-made in sizes. */
export type ProductKind = "cloth" | "garment";

/** Generated artwork used until real product photography is uploaded. */
export type ArtSpec = {
  kind: GarmentKind;
  /** front = whole garment, detail = close-up of the weave, back = rear view */
  view?: "front" | "detail" | "back";
  palette: string[];
  seed: number;
  backdrop?: string;
};

export type ProductImage = {
  id: number;
  url: string | null;
  alt: string;
  variant_id: number | null;
  art?: ArtSpec;
};

export type CategoryRef = { slug: string; name: string };

export type Category = CategoryRef & {
  description: string;
  image: ProductImage | null;
  product_count: number;
  parent: string | null;
  /** Ticked "Show in menu" in the admin. Missing from APIs older than the setting. */
  show_in_menu?: boolean;
};

export type Collection = {
  slug: string;
  name: string;
  description: string;
  banner_image: ProductImage | null;
  is_featured: boolean;
  show_in_menu?: boolean;
};

export type Variant = {
  id: number;
  sku: string;
  /** For cloth this is the piece label, e.g. "6 yards". */
  size: string;
  colour: string;
  /** Cloth only: length of one piece in yards. */
  length_yards: number | null;
  price: number;
  compare_at_price: number | null;
  /** null = made to order, no stock limit */
  available_quantity: number | null;
  is_active: boolean;
};

export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  kind: ProductKind;
  category: CategoryRef;
  price: number;
  compare_at_price: number | null;
  /** Cloth: yards in the cheapest piece (the price above is per piece). */
  length_yards: number | null;
  is_made_to_order: boolean;
  lead_time_days: number | null;
  in_stock: boolean;
  colours: { name: string; hex: string }[];
  sizes: string[];
  images: ProductImage[];
  origin: string;
  fabric: string;
  rating_average: number | null;
  rating_count: number;
  is_new: boolean;
  /** Ticked Is featured in the admin: a home page pick. Missing from older APIs. */
  is_featured?: boolean;
  created_at: string;
};

export type Review = {
  id: number;
  rating: number;
  title: string;
  body: string;
  author_name: string;
  location: string;
  created_at: string;
  is_verified_buyer: boolean;
};

export type ProductDetail = ProductSummary & {
  description: string;
  care: string;
  story: string;
  weaver: string;
  strip_details: string;
  variants: Variant[];
  reviews: Review[];
  collections: { slug: string; name: string }[];
  seo_title: string;
  seo_description: string;
};

export type ProductOrdering = "newest" | "price" | "-price" | "popularity";

export type ProductQuery = {
  category?: string;
  collection?: string;
  kind?: ProductKind;
  q?: string;
  size?: string[];
  colour?: string[];
  origin?: string[];
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  made_to_order?: boolean;
  /** Only products ticked Is featured in the admin. */
  featured?: boolean;
  ordering?: ProductOrdering;
  page?: number;
  page_size?: number;
};

export type Facets = {
  sizes: string[];
  colours: { name: string; hex: string }[];
  origins: string[];
  price_min: number;
  price_max: number;
};

/* ---------- Cart (cart app) ---------- */

export type CartWarning = "unavailable" | "sold_out" | "insufficient_stock" | "price_changed" | null;

export type CartLine = {
  id: number;
  variant_id: number;
  sku: string;
  size: string;
  colour: string;
  length_yards: number | null;
  product_kind: ProductKind;
  product_name: string;
  product_slug: string;
  image: string | null;
  quantity: number;
  unit_price: number;
  compare_at_price: number | null;
  price_when_added: number;
  line_total: number;
  is_made_to_order: boolean;
  lead_time_days: number | null;
  available_quantity: number | null;
  warning: CartWarning;
  custom_measurements: Record<string, string> | null;
  measurement_note: string;
  /** Frontend-only: artwork for lines that have no uploaded photo yet. */
  art?: ArtSpec;
};

export type Cart = {
  token: string | null;
  items: CartLine[];
  item_count: number;
  subtotal: number;
  discount: number;
  discount_code: string;
  delivery_fee: number | null;
  total: number;
  currency: string;
  has_warnings: boolean;
  made_to_order_lead_time_days: number | null;
};

export type AddCartItemInput = {
  variant_id: number;
  quantity: number;
  custom_measurements?: Record<string, string> | null;
  measurement_note?: string;
};

/* ---------- Shipping, checkout and orders ---------- */

export type DeliveryOption = {
  id: string;
  zone: string;
  name: string;
  description: string;
  fee: number;
  eta_days_min: number;
  eta_days_max: number;
  /** The method lets the customer pay the rider instead of paying online. */
  allows_pay_on_delivery?: boolean;
};

export type DeliveryMethodSummary = {
  name: string;
  description: string;
  fee: number;
  eta_days_min: number;
  eta_days_max: number;
};

/** Starting delivery fee and time for a zone, before an address is known. */
export type DeliveryEstimate = {
  zone: string;
  /** Pesewas; the cheapest paid method, or 0 if every method is free. */
  fee_from: number;
  eta_days_min: number;
  eta_days_max: number;
  /** The zone's methods in admin order. Missing from older APIs. */
  methods?: DeliveryMethodSummary[];
};

export type PaymentMethod = "momo" | "card" | "pay_on_delivery";

export type CheckoutInput = {
  email: string;
  phone: string;
  full_name: string;
  shipping_address: {
    line1: string;
    line2: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
  };
  delivery_option: string;
  payment_method: PaymentMethod;
  marketing_opt_in: boolean;
  note: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "return_requested";

export type OrderItem = {
  product_name: string;
  product_slug: string;
  size: string;
  colour: string;
  length_yards: number | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  is_made_to_order: boolean;
  art?: ArtSpec;
  image: string | null;
};

export type Order = {
  number: string;
  status: OrderStatus;
  email: string;
  full_name: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  currency: string;
  delivery_option: DeliveryOption;
  shipping_address: CheckoutInput["shipping_address"];
  payment_method: PaymentMethod | "manual";
  expected_ship_date: string | null;
  tracking_number: string;
  courier: string;
  created_at: string;
  status_history: { status: OrderStatus; at: string; note: string }[];
  /** Only in the checkout response: lets a guest open this order later. */
  access_key?: string;
};

export type CheckoutResult = {
  order: Order;
  /** Gateway hosted page; null when no online payment is needed (pay on delivery, mock mode). */
  payment_url: string | null;
};

/* ---------- Custom requests (orders app) ---------- */

export type CustomRequestInput = {
  request_type: "individual" | "group" | "corporate";
  need: "cloth" | "sewn" | "both";
  occasion: "" | "wedding" | "funeral" | "festival" | "corporate" | "birthday" | "other";
  colours: string;
  quantity: number;
  needed_by: string | null;
  budget: string;
  details: string;
  full_name: string;
  email: string;
  phone: string;
  organisation: string;
  country: string;
};
