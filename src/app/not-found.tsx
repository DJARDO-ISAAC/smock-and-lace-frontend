import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-10">
          <Logo />
        </div>
      </div>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <div className="strip-weave h-2 w-24 rounded-full" aria-hidden />
        <p className="eyebrow mt-8 text-clay">Error 404</p>
        <h1 className="mt-4 text-5xl">This thread came loose</h1>
        <p className="mt-4 text-lg text-ink-soft">We couldn&apos;t find that page. It may have sold out, moved, or never existed.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/shop">Browse the shop</LinkButton>
          <LinkButton href="/" variant="outline">
            Go home
          </LinkButton>
        </div>
        <p className="mt-10 text-sm text-muted">
          Popular: <Link href="/collections/fugu-wednesday" className="underline underline-offset-4">Fugu Wednesday</Link> ·{" "}
          <Link href="/shop/mens-smocks" className="underline underline-offset-4">Men&apos;s smocks</Link> ·{" "}
          <Link href="/shop/lace-fusion" className="underline underline-offset-4">Lace fusion</Link>
        </p>
      </div>
    </main>
  );
}
