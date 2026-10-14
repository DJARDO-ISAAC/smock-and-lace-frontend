import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import type { ArtSpec } from "@/lib/api/types";
import { ContentPage } from "@/components/content/page-shell";
import { ProductArt } from "@/components/product/product-art";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our story",
  description: "Smock & Lace works with strip-weavers in northern Ghana to make fugu, batakari and lace-fusion clothing.",
  alternates: { canonical: "/about" },
};

const ART: ArtSpec[] = [
  { kind: "smock", view: "detail", palette: ["#6b4a2f", "#ead9bb", "#a4472a", "#1b1a17"], seed: 7 },
  { kind: "smock", view: "front", palette: ["#1e2a4a", "#efe7d6", "#3d5283", "#b98a2e"], seed: 19, backdrop: "#e6dccb" },
];

const VALUES = [
  { title: "Made by hand, start to finish", text: "Spinning, dyeing, weaving and sewing are all done by hand. Nothing is printed to look woven." },
  { title: "Paid fairly, paid first", text: "Weavers are paid when cloth is delivered to us, not when it sells, so the risk sits with us, not them." },
  { title: "Named, not anonymous", text: "Every product page tells you where the cloth was woven and by whom, because provenance matters." },
];

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="Our story"
      crumb="Our story"
      title="From the loom in the north to your wardrobe"
      intro="Fugu has been woven in northern Ghana for centuries: narrow strips of cotton, sewn edge to edge into cloth with real weight and character. We started Smock & Lace to bring that cloth to more people, without losing the hands behind it."
      wide
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[5/4] overflow-hidden rounded-3xl">
          <ProductArt spec={ART[0]} />
        </div>
        <div className="prose-shop">
          <h2>Why strip-cloth?</h2>
          <p>
            Strip-weaving is slow. A weaver works a narrow loom, making long bands of cloth about a hand&apos;s width wide. A single smock can need forty strips or
            more, each one sewn by hand to the next. The result is cloth that breathes, wears in rather than out, and carries the rhythm of the person who wove it.
          </p>
          <p>
            Since Ghana began wearing fugu every Wednesday, demand has grown faster than looms can keep up. We work directly with weaving families in Daboya, Bolgatanga,
            Tamale, Yendi and Wa, and plan our collections around what they can make well, not the other way round.
          </p>
        </div>
      </div>

      <ul className="mt-20 grid gap-6 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <li key={v.title} className="rounded-2xl bg-white/70 p-7 ring-1 ring-line">
            <span className="font-display text-3xl text-clay">0{i + 1}</span>
            <h3 className="mt-4 text-2xl">{v.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{v.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="prose-shop lg:order-2">
          <h2>Where lace comes in</h2>
          <p>
            Our Accra studio pairs handwoven strips with fine lace, the fabric of so many Ghanaian celebrations. Lace-fusion pieces put a band of strip-cloth where the
            eye goes first: the yoke, the cuff, the hem. They are made for weddings, outdoorings and every Saturday in between.
          </p>
          <p>
            Some pieces are ready to ship. Others, especially ceremonial gowns, are woven and cut only after you order, to your measurements.
          </p>
        </div>
        <div className="aspect-[5/4] overflow-hidden rounded-3xl lg:order-1">
          <ProductArt spec={ART[1]} />
        </div>
      </div>

      <div className="mt-20 rounded-3xl bg-indigo p-10 text-center text-cotton sm:p-16">
        <h2 className="text-4xl">Wear the work of many hands</h2>
        <p className="mx-auto mt-4 max-w-lg text-cotton/75">Every piece comes with the story of where it was woven.</p>
        <LinkButton href="/shop" size="lg" className="mt-8 bg-cotton text-indigo hover:bg-white">
          Shop the collection <ArrowRight className="size-4" />
        </LinkButton>
      </div>
    </ContentPage>
  );
}
