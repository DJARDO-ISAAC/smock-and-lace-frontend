import type { Metadata } from "next";
import Image from "next/image";
import { Palette, PhoneCall, Truck } from "lucide-react";
import { ContentPage } from "@/components/content/page-shell";
import { CustomRequestForm } from "@/components/custom/custom-request-form";

export const metadata: Metadata = {
  title: "Custom & group orders",
  description: "Custom fugu cloth and sewing for individuals, bridal parties, families and companies. Custom colourways at no extra cost.",
  alternates: { canonical: "/custom-orders" },
};

const STEPS = [
  { icon: Palette, title: "Tell us what you need", text: "Colours, how many people or pieces, and when you need them." },
  { icon: PhoneCall, title: "We call you", text: "Within one working day we agree the design, price and timing with you." },
  { icon: Truck, title: "We weave, sew and deliver", text: "Pick up at Oyarifa Crossing, or we deliver across Ghana and worldwide." },
];

export default function CustomOrdersPage() {
  return (
    <ContentPage
      crumb="Custom orders"
      eyebrow="Custom & group orders"
      title="Made for your day, your people, your brand"
      intro="We customise fugu cloth and outfits for individuals, groups and corporate institutions. Choose your own colourway at no extra cost."
      wide
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <ol className="space-y-6">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-indigo text-cotton">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-medium">
                    {i + 1}. {title}
                  </p>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="relative mt-10 hidden aspect-[3/4] overflow-hidden rounded-3xl lg:block">
            <Image src="/demo/bolga-orchid.jpg" alt="Folded fugu cloth in orchid and purple" fill sizes="30vw" className="object-cover" />
          </div>
        </div>
        <CustomRequestForm />
      </div>
    </ContentPage>
  );
}
