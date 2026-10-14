"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { ProductImage } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { ProductMedia } from "./product-media";

/** Swipeable on phones, thumbnails + hover zoom on desktop, full-screen zoom for weave detail (FR-UI-2). */
export function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [origin, setOrigin] = useState<string | null>(null);
  const track = useRef<HTMLUListElement>(null);


  const go = (i: number) => {
    const next = (i + images.length) % images.length;
    setActive(next);
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
  };

  const current = images[active] ?? images[0];

  return (
    <div className="lg:grid lg:grid-cols-[76px_1fr] lg:gap-4">
      {/* Desktop thumbnails */}
      <ul className="hidden max-h-[calc(100dvh-10rem)] flex-col gap-3 overflow-y-auto scrollbar-none lg:flex" aria-label="Product images">
        {images.map((img, i) => (
          <li key={img.id}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active || undefined}
              className={cn("relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-cotton-deep ring-offset-2 ring-offset-cotton transition", i === active ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100")}
            >
              <ProductMedia url={img.url} art={img.art} alt="" sizes="76px" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative">
        {/* Mobile: native scroll-snap carousel */}
        <ul
          ref={track}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto scrollbar-none sm:mx-0 lg:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== active) setActive(i);
          }}
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <li key={img.id} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-cotton-deep sm:overflow-hidden sm:rounded-xl">
              <button type="button" className="absolute inset-0" onClick={() => setZoomOpen(true)} aria-label={`Zoom image ${i + 1}`}>
                <ProductMedia url={img.url} art={img.art} alt={img.alt || name} sizes="100vw" priority={i === 0} />
              </button>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden" aria-hidden>
          {images.map((img, i) => (
            <span key={img.id} className={cn("h-1.5 rounded-full bg-ink/80 transition-all", i === active ? "w-5" : "w-1.5 bg-ink/30")} />
          ))}
        </div>

        {/* Desktop: hover to magnify, click for full screen */}
        <div
          className="relative hidden aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl bg-cotton-deep lg:block"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
          onMouseLeave={() => setOrigin(null)}
          onClick={() => setZoomOpen(true)}
        >
          <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: origin ? "scale(1.9)" : "scale(1)", transformOrigin: origin ?? "center" }}>
            {current && <ProductMedia url={current.url} art={current.art} alt={current.alt || name} sizes="(min-width: 1024px) 45vw, 100vw" priority />}
          </div>
          <span className="pointer-events-none absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-cotton/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <Expand className="size-3.5" /> Hover to zoom
          </span>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(active - 1); }} className="absolute top-1/2 left-4 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-cotton/90 shadow-sm backdrop-blur hover:bg-cotton" aria-label="Previous image">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); go(active + 1); }} className="absolute top-1/2 right-4 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-cotton/90 shadow-sm backdrop-blur hover:bg-cotton" aria-label="Next image">
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} title={name} side="center" className="max-w-5xl">
        <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cotton-deep">
              <ProductMedia url={img.url} art={img.art} alt={img.alt || name} sizes="(min-width: 640px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
