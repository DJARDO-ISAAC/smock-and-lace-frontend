import Form from "next/form";
import { Search } from "lucide-react";

export function SearchForm({ defaultValue }: { defaultValue: string }) {
  return (
    <Form action="/search" role="search" className="mt-6 flex max-w-lg items-center gap-2 rounded-full border border-line bg-white p-1 pl-5 focus-within:border-indigo focus-within:ring-3 focus-within:ring-indigo/10">
      <Search className="size-4 shrink-0 text-muted" aria-hidden />
      <label htmlFor="search-page-q" className="sr-only">
        Search products
      </label>
      <input id="search-page-q" name="q" type="search" defaultValue={defaultValue} placeholder="Smock, lace, indigo…" className="h-10 min-w-0 flex-1 bg-transparent outline-none" />
      <button type="submit" className="h-10 rounded-full bg-indigo px-5 text-sm font-medium text-cotton hover:bg-indigo-deep">
        Search
      </button>
    </Form>
  );
}
