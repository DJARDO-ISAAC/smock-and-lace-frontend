import { apiFetch, toQueryString } from "@/lib/api/client";
import type { DeliveryOption } from "@/lib/api/types";
import { siteConfig } from "@/lib/config";

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Eastern",
  "Western",
  "Western North",
  "Volta",
  "Oti",
  "Bono",
  "Bono East",
  "Ahafo",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
];

export const COUNTRIES = [
  "Ghana",
  "United Kingdom",
  "United States",
  "Canada",
  "Germany",
  "Netherlands",
  "Nigeria",
  "Côte d'Ivoire",
  "South Africa",
  "Other",
];

/* Sample zones until the shipping app is live; managers edit the real ones in the admin (SRS 8.2.1). */
const MOCK_OPTIONS: Record<"accra" | "ghana" | "international", DeliveryOption[]> = {
  accra: [
    { id: "accra-rider", zone: "Accra & Tema", name: "Dispatch rider", description: "Delivered to your door by our rider", fee: 4000, eta_days_min: 1, eta_days_max: 2 },
    { id: "accra-pickup", zone: "Accra & Tema", name: "Studio pickup, Osu", description: "Collect from our studio, Mon–Sat", fee: 0, eta_days_min: 1, eta_days_max: 1 },
  ],
  ghana: [
    { id: "ghana-courier", zone: "Rest of Ghana", name: "Nationwide courier", description: "Tracked delivery to your town", fee: 8000, eta_days_min: 2, eta_days_max: 4 },
  ],
  international: [
    { id: "intl-express", zone: "International", name: "DHL Express", description: "Tracked. Import duties are paid by the customer on arrival.", fee: 65000, eta_days_min: 4, eta_days_max: 8 },
  ],
};

export function zoneFor(country: string, region: string) {
  if (country !== "Ghana") return "international" as const;
  return region === "Greater Accra" ? ("accra" as const) : ("ghana" as const);
}

export async function getDeliveryOptions(country: string, region: string): Promise<DeliveryOption[]> {
  if (siteConfig.dataSource === "api") {
    return apiFetch<DeliveryOption[]>(`/shipping/quote/${toQueryString({ country, region })}`);
  }
  return MOCK_OPTIONS[zoneFor(country, region)];
}

/** Cheapest fee per zone, for "from" estimates in the cart and on product pages. */
export const DELIVERY_ESTIMATES = [
  { zone: "Accra & Tema", fee: 4000, eta: "1–2 working days" },
  { zone: "Rest of Ghana", fee: 8000, eta: "2–4 working days" },
  { zone: "International", fee: 65000, eta: "4–8 working days" },
];
