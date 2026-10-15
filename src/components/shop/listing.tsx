import { Suspense, type ReactNode } from "react";
import { SearchX } from "lucide-react";
import { getFacets, getProducts } from "@/lib/catalog";
import { DEFAULT_PAGE_SIZE } from "@/lib/catalog/search";
import { countActiveFilters, parseQuery, type RawSearchParams } from "@/lib/catalog/query";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-card";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { pluralize } from "@/lib/utils";
import { FiltersProvider, PendingResults } from "./filters-context";
import { FilterPanel } from "./filter-panel";
import { ActiveFilters, MobileFilters, SortSelect } from "./toolbar";
import { Pagination } from "./pagination";

type Scope = { category?: string; collection?: string };

export function ListingHeader({ eyebrow, title, description, crumbs, children }: { eyebrow?: string; title: ReactNode; description?: string; crumbs: Crumb[]; children?: ReactNode }) {
  return (
    <header className="border-b border-line">
      <Container className="pt-6 pb-10 sm:pb-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-3 text-clay">{eyebrow}</p>}
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          {description && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{description}</p>}
          {children}
        </div>
      </Container>
    </header>
  );
}

async function Results({ scope, basePath, searchParams }: { scope: Scope; basePath: string; searchParams: Promise<RawSearchParams> }) {
  const params = await searchParams;
  const query = { ...parseQuery(params), ...scope };
  const [page, facets] = await Promise.all([getProducts({ ...query, page_size: DEFAULT_PAGE_SIZE }), getFacets(scope)]);
  const active = countActiveFilters(params);
  const totalPages = Math.ceil(page.count / DEFAULT_PAGE_SIZE);
  const current = query.page ?? 1;

  return (
    <FiltersProvider params={params}>
      <div className="grid gap-10 lg:grid-cols-[240px_1fr] xl:gap-14">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 scrollbar-none">
            <FilterPanel facets={facets} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-16 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-line bg-cotton/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <p className="text-sm text-muted" aria-live="polite">
              {pluralize(page.count, page.results.length && page.results.every((p) => p.kind === "cloth") ? "design" : "item")}
            </p>
            <div className="flex items-center gap-2">
              <MobileFilters facets={facets} count={page.count} activeCount={active} />
              <SortSelect />
            </div>
          </div>

          <div className="mb-6 empty:hidden">
            <ActiveFilters />
          </div>

          <PendingResults>
            <h2 className="sr-only">Products</h2>
            {page.results.length ? (
              <>
                <ProductGrid products={page.results} priorityCount={4} />
                <Pagination basePath={basePath} params={params} page={current} totalPages={totalPages} />
              </>
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-20 text-center">
                <SearchX className="size-10 text-muted" strokeWidth={1.5} />
                <p className="mt-4 font-display text-2xl">No pieces match those filters</p>
                <p className="mt-2 max-w-sm text-muted">Try removing a filter, or ask us on WhatsApp. Many pieces can be woven to order.</p>
                <LinkButton href={basePath} variant="outline" className="mt-6">
                  Clear filters
                </LinkButton>
              </div>
            )}
          </PendingResults>
        </div>
      </div>
    </FiltersProvider>
  );
}

function ResultsFallback() {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] xl:gap-14">
      <div className="hidden space-y-4 lg:block">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div>
        <Skeleton className="mb-6 h-10 w-full" />
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}

export function Listing({ scope, basePath, searchParams }: { scope: Scope; basePath: string; searchParams: Promise<RawSearchParams> }) {
  return (
    <Container className="py-8 sm:py-12">
      <Suspense fallback={<ResultsFallback />}>
        <Results scope={scope} basePath={basePath} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
