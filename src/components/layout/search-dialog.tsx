"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import type { ProductSummary } from "@/lib/api/types";
import { searchProducts } from "@/lib/catalog/client";
import { formatGHS } from "@/lib/money";
import { ProductMedia } from "@/components/product/product-media";

const POPULAR = ["Batakari", "Indigo smock", "Lace top", "Fugu cap", "Wedding", "Kids"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProductSummary[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      inputRef.current?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const page = await searchProducts(term, 5);
        if (!cancelled) {
          setResults(page.results);
          setTotal(page.count);
        }
      } catch {
        if (!cancelled) setResults([]);
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  const shown = q.trim().length >= 2 ? results : null;

  const submit = (term: string) => {
    if (!term.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Search the shop"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 mt-0 h-auto max-h-dvh w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="animate-fade-in bg-cotton shadow-lift">
        <div className="mx-auto max-w-3xl px-4 pt-4 pb-6 sm:px-6 sm:pt-8 sm:pb-10">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit(q);
            }}
            className="flex items-center gap-3 border-b-2 border-ink pb-3"
          >
            <Search className="size-5 shrink-0 text-muted" aria-hidden />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search smocks, lace, caps…"
              autoComplete="off"
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-muted/60 sm:text-3xl [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="button" onClick={onClose} className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full hover:bg-ink/5" aria-label="Close search">
              <X className="size-5" />
            </button>
          </form>

          {shown === null ? (
            <div className="mt-6">
              <p className="eyebrow text-muted">Popular searches</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <li key={term}>
                    <button type="button" onClick={() => submit(term)} className="rounded-full border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-ink">
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : shown.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="font-display text-xl">Nothing matches “{q.trim()}”</p>
              <p className="mt-2 text-sm text-muted">Try a fabric, colour or style, like “indigo” or “lace”.</p>
            </div>
          ) : (
            <div className="mt-4" aria-live="polite">
              <ul className="divide-y divide-line">
                {shown.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-4 py-3">
                      <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-md bg-cotton-deep">
                        <ProductMedia url={p.images[0]?.url} art={p.images[0]?.art} alt="" sizes="56px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium group-hover:underline">{p.name}</p>
                        <p className="text-sm text-muted">{p.category.name}</p>
                      </div>
                      <p className="text-sm tabular-nums">{formatGHS(p.price, { compact: true })}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => submit(q)} className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
                See all {total} results <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
