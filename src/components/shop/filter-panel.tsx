"use client";

import { Check } from "lucide-react";
import type { Facets } from "@/lib/api/types";
import { PRICE_BANDS } from "@/lib/catalog/query";
import { cn } from "@/lib/utils";
import { useFilters } from "./filters-context";

function Group({ title, children, count }: { title: string; children: React.ReactNode; count?: number }) {
  return (
    <details open className="group border-b border-line py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span>
          {title}
          {count ? <span className="ml-1.5 text-xs font-normal text-muted">({count})</span> : null}
        </span>
        <span className="text-muted transition-transform group-open:rotate-180" aria-hidden>
          ⌄
        </span>
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}

function CheckRow({ label, checked, onChange, swatch }: { label: string; checked: boolean; onChange: () => void; swatch?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[0.9375rem] text-ink-soft hover:text-ink">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="grid size-[18px] shrink-0 place-items-center rounded border border-ink/25 bg-white transition-colors peer-checked:border-indigo peer-checked:bg-indigo peer-focus-visible:ring-2 peer-focus-visible:ring-indigo/40">
        {checked && <Check className="size-3 text-cotton" strokeWidth={3} />}
      </span>
      {swatch && <span className="size-4 rounded-full ring-1 ring-ink/15" style={{ background: swatch }} aria-hidden />}
      <span className={cn(checked && "text-ink")}>{label}</span>
    </label>
  );
}

export function FilterPanel({ facets }: { facets: Facets }) {
  const f = useFilters();
  const sizes = f.values("size");
  const colours = f.values("colour");
  const origins = f.values("origin");
  const price = f.value("price");

  return (
    <div>
      <Group title="Availability">
        <CheckRow label="In stock only" checked={f.value("in_stock") === "true"} onChange={() => f.set("in_stock", f.value("in_stock") ? null : "true")} />
        <CheckRow label="Made to order" checked={f.value("made_to_order") === "true"} onChange={() => f.set("made_to_order", f.value("made_to_order") ? null : "true")} />
      </Group>

      {facets.sizes.length > 1 && (
        <Group title="Size" count={sizes.length}>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const on = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => f.toggle("size", s)}
                  className={cn("h-10 min-w-12 rounded-full border px-3.5 text-sm transition-colors", on ? "border-indigo bg-indigo text-cotton" : "border-line bg-white hover:border-ink")}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Group>
      )}

      <Group title="Colour" count={colours.length}>
        {facets.colours.map((c) => (
          <CheckRow key={c.name} label={c.name} swatch={c.hex} checked={colours.includes(c.name)} onChange={() => f.toggle("colour", c.name)} />
        ))}
      </Group>

      <Group title="Price">
        <div role="radiogroup" aria-label="Price range" className="space-y-1">
          {PRICE_BANDS.map((b) => (
            <label key={b.value} className="flex cursor-pointer items-center gap-3 py-1.5 text-[0.9375rem] text-ink-soft hover:text-ink">
              <input type="radio" name="price" className="size-[18px] accent-indigo" checked={price === b.value} onChange={() => f.set("price", b.value)} onClick={() => price === b.value && f.set("price", null)} />
              {b.label}
            </label>
          ))}
        </div>
      </Group>

      {facets.origins.length > 1 && (
        <Group title="Weave origin" count={origins.length}>
          {facets.origins.map((o) => (
            <CheckRow key={o} label={o} checked={origins.includes(o)} onChange={() => f.toggle("origin", o)} />
          ))}
        </Group>
      )}
    </div>
  );
}
