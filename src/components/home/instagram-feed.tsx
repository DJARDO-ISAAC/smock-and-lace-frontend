import type { ProductImage } from "@/lib/api/types";
import { Container } from "@/components/ui/container";
import { InstagramIcon } from "@/components/ui/icons";
import { ProductMedia } from "@/components/product/product-media";
import { siteConfig } from "@/lib/config";

/** Placeholder grid until the approved Instagram embed or cached images are wired up (FR-CON-4). */
export function InstagramFeed({ images }: { images: ProductImage[] }) {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow text-clay">Follow along</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-clay">
              {siteConfig.instagramHandle}
            </a>
          </h2>
          <p className="mt-3 text-muted">New drops, weaver visits and how our customers wear their fugu.</p>
        </div>
        <ul className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {images.slice(0, 6).map((img) => (
            <li key={img.id}>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-lg bg-cotton-deep" aria-label={`View on Instagram: ${img.alt}`}>
                <ProductMedia url={img.url} art={img.art} alt="" sizes="(min-width: 1024px) 16vw, 33vw" className="transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 text-cotton opacity-0 transition-all group-hover:bg-ink/35 group-hover:opacity-100">
                  <InstagramIcon className="size-7" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
