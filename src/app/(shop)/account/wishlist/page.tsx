import type { Metadata } from "next";
import { Wishlist } from "@/components/account/wishlist";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function Page() {
  return <Wishlist />;
}
