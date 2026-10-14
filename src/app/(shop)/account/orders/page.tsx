import type { Metadata } from "next";
import { Orders } from "@/components/account/orders";

export const metadata: Metadata = { title: "Your orders", robots: { index: false } };

export default function Page() {
  return <Orders />;
}
