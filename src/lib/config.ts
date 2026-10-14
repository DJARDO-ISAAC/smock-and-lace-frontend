export const siteConfig = {
  name: "Smock & Lace",
  legalName: "Fugu Tribe (Smock & Lace)",
  tagline: "Handwoven fugu and lace, made in Ghana",
  description:
    "Handwoven Ghanaian fugu smocks, batakari and lace-fusion fashion, made by weavers in northern Ghana. Delivered across Ghana and worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, ""),
  dataSource: (process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? "api" : "mock") as "api" | "mock",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233200000000",
  email: "hello@smockandlace.com",
  phoneDisplay: "+233 20 000 0000",
  instagram: "https://www.instagram.com/",
  instagramHandle: "@smockandlace",
  location: "Osu, Accra, Ghana",
  returnWindowDays: 14,
  reservationMinutes: 15,
};

export const mainNav = [
  { label: "New in", href: "/collections/new-in" },
  { label: "Men", href: "/shop/mens-smocks" },
  { label: "Women", href: "/shop/womens-smocks-dresses" },
  { label: "Lace Fusion", href: "/shop/lace-fusion" },
  { label: "Caps & Accessories", href: "/shop/caps" },
  { label: "Kids", href: "/shop/kids" },
  { label: "Our Story", href: "/about" },
] as const;

export const footerNav = {
  shop: [
    { label: "All products", href: "/shop" },
    { label: "Fugu Wednesday", href: "/collections/fugu-wednesday" },
    { label: "Wedding & ceremony", href: "/collections/wedding" },
    { label: "Made to order", href: "/shop?made_to_order=true" },
    { label: "Gift a cap", href: "/shop/caps" },
  ],
  help: [
    { label: "Size guide", href: "/size-guide" },
    { label: "Shipping & returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact us", href: "/contact" },
    { label: "Track an order", href: "/account/orders" },
  ],
  company: [
    { label: "Our story", href: "/about" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of sale", href: "/terms" },
  ],
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
