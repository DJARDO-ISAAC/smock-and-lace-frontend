"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { whatsappLink } from "@/lib/config";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error); // Sentry hooks in here (NFR-LOG-1)
  }, [error]);

  return (
    <main id="main" className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="strip-weave h-2 w-24 rounded-full" aria-hidden />
      <p className="eyebrow mt-8 text-clay">Something went wrong</p>
      <h1 className="mt-4 text-5xl">We dropped a stitch</h1>
      <p className="mt-4 text-lg text-ink-soft">Sorry, this page didn&apos;t load properly. Please try again. If it keeps happening, let us know on WhatsApp.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <LinkButton href="/shop" variant="outline">
          Back to the shop
        </LinkButton>
      </div>
      <a href={whatsappLink(`Hello, a page on your site isn't loading${error.digest ? ` (ref ${error.digest})` : ""}.`)} className="mt-6 text-sm underline underline-offset-4" target="_blank" rel="noopener noreferrer">
        Report this on WhatsApp
      </a>
    </main>
  );
}
