import type { Metadata } from "next";
import { Addresses } from "@/components/account/addresses";

export const metadata: Metadata = { title: "Addresses", robots: { index: false } };

export default function Page() {
  return <Addresses />;
}
