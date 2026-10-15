import { apiFetch } from "@/lib/api/client";
import type { CustomRequestInput } from "@/lib/api/types";
import { siteConfig } from "@/lib/config";

/** Sends a custom or group order request to the shop (orders app). Returns its reference, e.g. CR-00012. */
export async function submitCustomRequest(input: CustomRequestInput): Promise<string> {
  if (siteConfig.dataSource === "api") {
    const result = await apiFetch<{ reference: string }>("/custom-requests/", { method: "POST", body: input });
    return result.reference;
  }
  await new Promise((r) => setTimeout(r, 700));
  return `CR-${String(Math.floor(10000 + Math.random() * 90000))}`;
}
