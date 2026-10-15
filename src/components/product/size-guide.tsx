"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { ADULT_SIZES, SizeTable, WOMEN_SIZES } from "./size-table";

export function SizeGuideButton({ category }: { category: string }) {
  const [open, setOpen] = useState(false);
  const women = category === "womens-fugu";
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-ink-soft underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
        <Ruler className="size-4" /> Size guide
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Size guide" description="Body measurements in centimetres.">
        <div className="space-y-5 p-5 sm:p-6">
          {women ? (
            <SizeTable rows={WOMEN_SIZES} cols={[{ key: "size", label: "Size" }, { key: "bust", label: "Bust" }, { key: "waist", label: "Waist" }, { key: "hips", label: "Hips" }]} />
          ) : (
            <SizeTable rows={ADULT_SIZES} cols={[{ key: "size", label: "Size" }, { key: "chest", label: "Chest" }, { key: "shoulder", label: "Shoulder" }, { key: "length", label: "Garment length" }]} />
          )}
          <div className="rounded-lg bg-indigo-soft p-4 text-sm text-indigo">
            <p className="font-medium">Between sizes?</p>
            <p className="mt-1">Smocks are cut generously. Size down for a neater fit, or choose made to order and send us your measurements.</p>
          </div>
          <Link href="/size-guide" className="inline-block text-sm underline underline-offset-4" onClick={() => setOpen(false)}>
            How to measure yourself
          </Link>
        </div>
      </Dialog>
    </>
  );
}
