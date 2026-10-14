import type { Metadata } from "next";
import { Measurements } from "@/components/account/measurements";

export const metadata: Metadata = { title: "Measurements", robots: { index: false } };

export default function Page() {
  return <Measurements />;
}
