import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { TikTokIcon, WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig, whatsappLink } from "@/lib/config";

export function VisitShop() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cotton-deep sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image src="/demo/shop-oyarifa.jpg" alt="FuguTribe shop at Oyarifa Crossing, shelves of folded fugu cloth" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-lg">
          <p className="eyebrow text-clay">Visit the shop</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">See and feel every piece at Oyarifa Crossing</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Walls of handwoven cloth, smocks on the rail, and people who can help you choose. Order online and pick up, or come in and browse.
          </p>
          <ul className="mt-8 space-y-4 text-[0.9375rem]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-clay" />
              <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {siteConfig.location} <span className="text-muted">(open in Google Maps)</span>
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-clay" />
              <a href={`tel:+${siteConfig.whatsappNumber}`} className="hover:underline">
                Call or WhatsApp {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-clay" />
              <span>Message us before you come for large or custom orders.</span>
            </li>
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href={whatsappLink("Hello FuguTribe, I'd like to visit the shop.")} target="_blank" rel="noopener noreferrer" size="lg" className="bg-[#1f7a4d] hover:bg-[#186640]">
              <WhatsAppIcon className="size-4" /> WhatsApp us
            </LinkButton>
            <LinkButton href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer" size="lg" variant="outline">
              <TikTokIcon className="size-4" /> Follow {siteConfig.tiktokHandle}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
