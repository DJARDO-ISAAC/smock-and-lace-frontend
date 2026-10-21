import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ContentPage } from "@/components/content/page-shell";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our story",
  description: "FuguTribe brings northern Ghana heritage to luxury pieces: handwoven fugu cloth in vintage and modern designs, smocks, and custom work for individuals, groups and companies.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { title: "Handwoven cloth", text: "Fugu, also called northern kente, is woven in narrow strips and sewn edge to edge. Every piece is slightly different." },
  { title: "Vintage and modern", text: "Classic northern patterns and earthy tones sit alongside bold, bright colourways for today's weddings and parties." },
  { title: "Made for you", text: "We customise colours and outfits for individuals, groups and corporate institutions, at no extra cost for the colourway." },
];

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="Our story"
      crumb="Our story"
      title="Northern Ghana heritage in luxury pieces"
      intro="FuguTribe is a fugu shop at Oyarifa Crossing in Accra. We sell handwoven fugu cloth by the piece, ready-made smocks and batakari, and custom work for weddings, families and companies, delivered across Ghana and worldwide."
      wide
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cotton-deep">
          <Image src="/demo/shop-oyarifa.jpg" alt="Shelves of folded fugu cloth at the FuguTribe shop" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="prose-shop">
          <h2>Cloth with a heritage</h2>
          <p>
            Fugu has been woven in northern Ghana for generations: narrow strips of cotton made on small looms, then sewn together into cloth
            with real weight and character. It is the cloth of chiefs, of celebrations and, more and more, of everyday Ghanaian style.
          </p>
          <p>
            We bring that cloth to you in pieces ready for your tailor, so you can make the outfit you have in mind, or wear one of our
            ready-made smocks.
          </p>
          <h2>For you, your people and your brand</h2>
          <p>
            Brides, grooms and whole bridal parties come to us for coordinated colours. Families dress alike for big days, and companies
            order cloth and outfits for their teams. Tell us what you need and we&apos;ll weave and sew it.
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

      <div className="mt-20 rounded-3xl bg-indigo p-10 text-center text-cotton sm:p-16">
        <h2 className="text-4xl">Find your colourway</h2>
        <p className="mx-auto mt-4 max-w-lg text-cotton/75">Browse our fugu cloth, or tell us the colours you have in mind.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/shop/fugu-cloth" size="lg" className="bg-cotton text-indigo hover:bg-white">
            Shop fugu cloth <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/custom-orders" size="lg" variant="outline" className="border-cotton/40 text-cotton hover:border-cotton hover:bg-cotton/10">
            Start a custom order
          </LinkButton>
        </div>
      </div>
    </ContentPage>
  );
}
