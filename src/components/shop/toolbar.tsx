"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Facets } from "@/lib/api/types";
import { PRICE_BANDS, SORT_OPTIONS } from "@/lib/catalog/query";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/utils";
import { useFilters } from "./filters-context";
import { FilterPanel } from "./filter-panel";

export function SortSelect() {
  const f = useFilters();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-muted sm:inline">Sort by</span>
      <span className="relative">
        <select
          value={f.value("sort") ?? "popularity"}
          onChange={(e) => f.set("sort", e.target.value === "popularity" ? null : e.target.value)}
          className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-white pr-9 pl-4 text-sm font-medium outline-none hover:border-ink focus-visible:border-indigo"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-muted" aria-hidden>
          ▾
        </span>
      </span>
    </label>
  );
}

export function MobileFilters({ facets, count, activeCount }: { facets: Facets; count: number; activeCount: number }) {
  const [open, setOpen] = useState(false);
  const f = useFilters();
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink lg:hidden">
        <SlidersHorizontal className="size-4" /> Filter
        {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-indigo text-[10px] text-cotton">{activeCount}</span>}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        side="bottom"
        title="Filter"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={f.clear} disabled={!activeCount}>
              Clear all
            </Button>
            <Button className="flex-[2]" onClick={() => setOpen(false)} loading={f.pending}>
              Show {pluralize(count, "result")}
            </Button>
          </div>
        }
      >
        <div className="px-5 py-5">
          <FilterPanel facets={facets} />
        </div>
      </Dialog>
    </>
  );
}

export function ActiveFilters() {
  const f = useFilters();
  const chips: { key: string; value: string | null; label: string }[] = [];
  f.values("size").forEach((v) => chips.push({ key: "size", value: v, label: `Size ${v}` }));
  f.values("colour").forEach((v) => chips.push({ key: "colour", value: v, label: v }));
  f.values("origin").forEach((v) => chips.push({ key: "origin", value: v, label: v }));
  const price = f.value("price");
  if (price) chips.push({ key: "price", value: null, label: PRICE_BANDS.find((b) => b.value === price)?.label ?? "Price" });
  if (f.value("in_stock")) chips.push({ key: "in_stock", value: null, label: "In stock" });
  if (f.value("made_to_order")) chips.push({ key: "made_to_order", value: null, label: "Made to order" });
  if (!chips.length) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <li key={`${c.key}-${c.label}`}>
          <button
            type="button"
            onClick={() => (c.value ? f.toggle(c.key, c.value) : f.set(c.key, null))}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink/[0.06] pr-2.5 pl-3.5 text-sm transition-colors hover:bg-ink/10"
            aria-label={`Remove filter: ${c.label}`}
          >
            {c.label} <X className="size-3.5" />
          </button>
        </li>
      ))}
      <li>
        <button type="button" onClick={f.clear} className="ml-1 text-sm text-muted underline underline-offset-4 hover:text-ink">
          Clear all
        </button>
      </li>
    </ul>
  );
}
