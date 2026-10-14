"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RawSearchParams } from "@/lib/catalog/query";

type Ctx = {
  params: RawSearchParams;
  pending: boolean;
  values: (key: string) => string[];
  value: (key: string) => string | undefined;
  set: (key: string, value: string | string[] | null) => void;
  toggle: (key: string, value: string) => void;
  clear: () => void;
};

const FiltersContext = createContext<Ctx | null>(null);

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside <FiltersProvider>");
  return ctx;
}

/** Filters live in the URL so results are shareable, crawlable and survive refresh. */
export function FiltersProvider({ params, children }: { params: RawSearchParams; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const values = (key: string) => {
    const v = params[key];
    return v === undefined ? [] : Array.isArray(v) ? v : [v];
  };
  const value = (key: string) => values(key)[0];

  const navigate = (next: URLSearchParams) => {
    next.delete("page"); // any filter change starts from page one
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  const current = () => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => (Array.isArray(v) ? v : v ? [v] : []).forEach((x) => sp.append(k, x)));
    return sp;
  };

  const set = (key: string, v: string | string[] | null) => {
    const sp = current();
    sp.delete(key);
    (Array.isArray(v) ? v : v ? [v] : []).forEach((x) => sp.append(key, x));
    navigate(sp);
  };

  const toggle = (key: string, v: string) => {
    const existing = values(key);
    set(key, existing.includes(v) ? existing.filter((x) => x !== v) : [...existing, v]);
  };

  const clear = () => {
    const sp = new URLSearchParams();
    const q = value("q");
    const sort = value("sort");
    if (q) sp.set("q", q);
    if (sort) sp.set("sort", sort);
    navigate(sp);
  };

  return <FiltersContext.Provider value={{ params, pending, values, value, set, toggle, clear }}>{children}</FiltersContext.Provider>;
}

export function PendingResults({ children }: { children: ReactNode }) {
  const { pending } = useFilters();
  return (
    <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
}
