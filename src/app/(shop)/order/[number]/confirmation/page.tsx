import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/checkout/confirmation";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

async function Content({ params }: { params: PageProps<"/order/[number]/confirmation">["params"] }) {
  const { number } = await params;
  return <Confirmation number={number} />;
}

export default function ConfirmationPage({ params }: PageProps<"/order/[number]/confirmation">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16"><Skeleton className="h-96 w-full rounded-3xl" /></div>}>
      <Content params={params} />
    </Suspense>
  );
}
