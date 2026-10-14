import type { Metadata } from "next";
import { AccountOverview } from "@/components/account/overview";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function Page() {
  return <AccountOverview />;
}
