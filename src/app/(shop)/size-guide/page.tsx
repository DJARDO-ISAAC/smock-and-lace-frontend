import type { Metadata } from "next";
import { ContentPage } from "@/components/content/page-shell";
import { ADULT_SIZES, SizeTable, WOMEN_SIZES } from "@/components/product/size-table";

export const metadata: Metadata = { title: "Size guide", description: "How to measure yourself and find your size in smocks, dresses, caps and kids' wear.", alternates: { canonical: "/size-guide" } };

const HOW = [
  ["Chest / bust", "Around the fullest part, under the arms, keeping the tape level."],
  ["Waist", "Around your natural waist, the narrowest part of your torso."],
  ["Hips", "Around the fullest part of your hips, feet together."],
  ["Shoulder", "From the edge of one shoulder to the other, across the back."],
  ["Sleeve", "From the shoulder edge to the wrist bone, arm slightly bent."],
  ["Garment length", "From the base of the neck at the back to where you want the hem."],
];

export default function SizeGuidePage() {
  return (
    <ContentPage crumb="Size guide" eyebrow="Fit" title="Size guide" intro="Sizes for our ready-made smocks and women's fugu. All measurements are body measurements in centimetres. Buying cloth instead? Tell your tailor the style and they'll tell you how many pieces you need.">
      <section aria-labelledby="men">
        <h2 id="men" className="text-3xl">
          Smocks &amp; tunics
        </h2>
        <div className="mt-5">
          <SizeTable rows={ADULT_SIZES} cols={[{ key: "size", label: "Size" }, { key: "chest", label: "Chest" }, { key: "shoulder", label: "Shoulder" }, { key: "length", label: "Garment length" }]} />
        </div>
      </section>
      <section aria-labelledby="women" className="mt-14">
        <h2 id="women" className="text-3xl">
          Women&apos;s fugu
        </h2>
        <div className="mt-5">
          <SizeTable rows={WOMEN_SIZES} cols={[{ key: "size", label: "Size" }, { key: "bust", label: "Bust" }, { key: "waist", label: "Waist" }, { key: "hips", label: "Hips" }]} />
        </div>
      </section>
      <section aria-labelledby="caps" className="mt-14 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 id="caps" className="text-3xl">
            Caps
          </h2>
          <p className="mt-3 text-ink-soft">Measure around your head, just above the ears and across the forehead. Choose the nearest size: 56, 58 or 60 cm.</p>
        </div>
        <div>
          <h2 className="text-3xl">Kids</h2>
          <p className="mt-3 text-ink-soft">Kids&apos; sizes follow age, with room to grow. If your child is tall for their age, choose the next size up.</p>
        </div>
      </section>
      <section aria-labelledby="how" className="mt-14 rounded-3xl bg-cotton-deep/70 p-7 sm:p-10">
        <h2 id="how" className="text-3xl">
          How to measure
        </h2>
        <p className="mt-3 text-ink-soft">Use a soft tape over light clothing. Ask someone to help for shoulder and length.</p>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          {HOW.map(([t, d]) => (
            <div key={t}>
              <dt className="font-medium">{t}</dt>
              <dd className="mt-1 text-sm text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ContentPage>
  );
}
