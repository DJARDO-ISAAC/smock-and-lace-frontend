import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RawSearchParams } from "@/lib/catalog/query";
import { cn } from "@/lib/utils";

function href(basePath: string, params: RawSearchParams, page: number) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (k === "page") return;
    (Array.isArray(v) ? v : v ? [v] : []).forEach((x) => sp.append(k, x));
  });
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current, current - 1, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({ basePath, params, page, totalPages }: { basePath: string; params: RawSearchParams; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const arrow = "grid size-11 place-items-center rounded-full border border-line bg-white transition-colors hover:border-ink";
  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(basePath, params, page - 1)} className={arrow} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      <ol className="flex items-center gap-1">
        {pages(page, totalPages).map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-2 text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={href(basePath, params, p)}
                aria-current={p === page ? "page" : undefined}
                className={cn("grid size-11 place-items-center rounded-full text-sm tabular-nums transition-colors", p === page ? "bg-ink text-cotton" : "hover:bg-ink/5")}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < totalPages ? (
        <Link href={href(basePath, params, page + 1)} className={arrow} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
