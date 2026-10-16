export const siteConfig = {
  name: "Fugu Tribe",
  legalName: "Fugu Tribe",
  tagline: "Northern Ghana heritage in luxury pieces",
  description:
    "Handwoven fugu cloth (northern kente) by the piece, ready-made smocks and batakari, and custom designs for individuals, groups and companies. Shop in Accra, delivery worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, ""),
  dataSource: (process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? "api" : "mock") as "api" | "mock",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233597708233",
  email: "fugutribe@gmail.com",
  phoneDisplay: "059 770 8233",
  tiktok: "https://www.tiktok.com/@fugutribe",
  tiktokHandle: "@fugutribe",
  location: "Oyarifa Crossing, Accra",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Fugu+Tribe+Oyarifa+Crossing+Accra",
  returnWindowDays: 14,
  reservationMinutes: 15,
};

export type NavItem = { label: string; href: string };

/** Fixed pages after the catalogue links in the main menu. Categories and collections come from getMenu(). */
export const pageNav: NavItem[] = [
  { label: "Custom orders", href: "/custom-orders" },
  { label: "Our story", href: "/about" },
];

export const footerNav = {
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
