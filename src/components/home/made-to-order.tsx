import { Check } from "lucide-react";
import type { ArtSpec } from "@/lib/api/types";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProductArt } from "@/components/product/product-art";
import { whatsappLink } from "@/lib/config";

const art: ArtSpec = { kind: "dress", view: "front", palette: ["#f3ecdc", "#d9c9a8", "#b98a2e", "#6b4a2f"], seed: 91, backdrop: "#e2d7c3" };

export function MadeToOrder() {
  return (
    <section className="bg-cotton-deep/70 py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] max-w-md overflow-hidden rounded-2xl shadow-soft">
            <ProductArt spec={art} />
          </div>
          <div className="absolute -right-2 bottom-8 max-w-[14rem] rounded-xl bg-cotton p-4 shadow-lift sm:right-6 lg:-right-6">
            <p className="eyebrow text-clay">Lead time</p>
            <p className="mt-1 font-display text-2xl">14–28 days</p>
            <p className="mt-1 text-xs text-muted">Shown on every made-to-order piece before you pay.</p>
          </div>
        </div>
        <div className="order-1 max-w-lg lg:order-2">
          <p className="eyebrow text-clay">Made to order</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Woven for you, cut to your measurements</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            For weddings, durbars and once-in-a-lifetime days, our weavers start your cloth only after you order.
          </p>
          <ul className="mt-7 space-y-3">
            {["Send your measurements at checkout or save them to your account", "We confirm the fit with you on WhatsApp before weaving begins", "Track progress from loom to delivery in your account"].map((t) => (
              <li key={t} className="flex gap-3 text-[0.9375rem]">
                <Check className="mt-0.5 size-5 shrink-0 text-leaf" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/shop?made_to_order=true" size="lg">
              Explore made to order
            </LinkButton>
            <LinkButton href={whatsappLink("Hello, I'd like to talk about a made-to-order piece.")} target="_blank" rel="noopener noreferrer" size="lg" variant="outline">
              Talk to a tailor
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
