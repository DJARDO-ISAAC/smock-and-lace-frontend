/** Server-side read of the starting delivery fee per zone (GET /shipping/estimates/). */
import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import type { DeliveryEstimate } from "@/lib/api/types";
import { siteConfig } from "@/lib/config";
import { mockEstimates } from "@/lib/shipping";

async function fetchEstimates(): Promise<DeliveryEstimate[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("shipping");
  if (siteConfig.dataSource === "api") return apiFetch<DeliveryEstimate[]>("/shipping/estimates/");
  return mockEstimates();
}

/** Never throws: without estimates the pages say fees are shown at checkout. */
export async function getDeliveryEstimates(): Promise<DeliveryEstimate[]> {
  try {
    return await fetchEstimates();
  } catch {
    return [];
  }
}
