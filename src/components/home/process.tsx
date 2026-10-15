import type { ArtSpec } from "@/lib/api/types";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductArt } from "@/components/product/product-art";

const steps = [
  {
    n: "01",
    title: "Spun & dyed",
    text: "Cotton is hand-spun into yarn, then dipped again and again in indigo or bark dyes until the colour is deep and even.",
    art: { kind: "smock", view: "detail", palette: ["#1e2a4a", "#efe7d6", "#3d5283", "#b98a2e"], seed: 11 } as ArtSpec,
  },
  {
    n: "02",
    title: "Woven in strips",
    text: "On narrow horizontal looms, weavers make long strips about a hand's width wide, then sew them edge to edge into a full piece of cloth.",
    art: { kind: "smock", view: "detail", palette: ["#6b4a2f", "#ead9bb", "#a4472a", "#1b1a17"], seed: 23 } as ArtSpec,
  },
  {
    n: "03",
    title: "Sewn & finished",
    text: "The strips are sewn edge to edge into cloth, cut, pleated and finished by tailors, with embroidery done by hand.",
    art: { kind: "smock", view: "front", palette: ["#2f4f3a", "#ebe1c9", "#c79b3b", "#1b1a17"], seed: 37, backdrop: "#e6dccb" } as ArtSpec,
  },
];

export function Process() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it's made"
          title={
            <>
              From cotton to cloth, <em>by hand</em>
            </>
          }
          description="Every piece of fugu cloth passes through many hands in northern Ghana before it reaches our shelves."
        />
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
          {steps.map((s) => (
            <li key={s.n}>
              <div className="aspect-[5/4] overflow-hidden rounded-xl bg-cotton-deep">
                <ProductArt spec={s.art} className="h-full" />
              </div>
              <div className="mt-6 flex gap-5">
                <span className="font-display text-3xl text-clay">{s.n}</span>
                <div>
                  <h3 className="text-2xl">{s.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
