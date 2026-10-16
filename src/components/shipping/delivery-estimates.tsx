"use client";

import { createContext, useContext } from "react";
import type { DeliveryEstimate } from "@/lib/api/types";

const DeliveryEstimatesContext = createContext<DeliveryEstimate[]>([]);

/** Hands the server-loaded estimates to client components such as the cart summary and product panel. */
export function DeliveryEstimatesProvider({ estimates, children }: { estimates: DeliveryEstimate[]; children: React.ReactNode }) {
  return <DeliveryEstimatesContext value={estimates}>{children}</DeliveryEstimatesContext>;
}

export const useDeliveryEstimates = () => useContext(DeliveryEstimatesContext);
