import type { ReactNode } from "react";
import type { ArtSpec } from "@/lib/api/types";
import { ProductArt } from "@/components/product/product-art";

const ART: ArtSpec = { kind: "smock", view: "detail", palette: ["#1e2a4a", "#efe7d6", "#3d5283", "#b98a2e"], seed: 4242 };

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-10rem)] max-w-6xl items-stretch gap-0 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-3xl lg:block">
        <ProductArt spec={ART} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep/90 via-indigo-deep/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-cotton">
          <p className="font-display text-3xl leading-snug">“Every strip carries the hands that wove it.”</p>
          <p className="mt-4 text-sm text-cotton/70">Save your measurements, track made-to-order pieces from the loom, and check out in seconds.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl sm:text-[2.75rem]">{title}</h1>
          {subtitle && <p className="mt-3 text-ink-soft">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
