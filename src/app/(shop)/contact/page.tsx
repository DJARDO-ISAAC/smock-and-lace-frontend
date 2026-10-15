import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContentPage } from "@/components/content/page-shell";
import { TikTokIcon, WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = { title: "Contact us", description: "Call or WhatsApp Fugu Tribe on 059 770 8233, email fugutribe@gmail.com, or visit our shop at Oyarifa Crossing, Accra.", alternates: { canonical: "/contact" } };

const CHANNELS = [
  { icon: WhatsAppIcon, title: "WhatsApp", text: "Fastest for choosing cloth, custom orders and order updates.", cta: "Start a chat", href: whatsappLink("Hello Fugu Tribe, I have a question."), external: true, primary: true },
  { icon: Phone, title: "Call", text: siteConfig.phoneDisplay, cta: "Call us", href: `tel:+${siteConfig.whatsappNumber}` },
  { icon: Mail, title: "Email", text: siteConfig.email, cta: "Send an email", href: `mailto:${siteConfig.email}` },
  { icon: TikTokIcon, title: "TikTok", text: siteConfig.tiktokHandle, cta: "See new cloth", href: siteConfig.tiktok, external: true },
];

export default function ContactPage() {
  return (
    <ContentPage crumb="Contact" eyebrow="Get in touch" title="We'd love to hear from you" intro="Choosing cloth for an outfit, planning a wedding party, or checking on an order? Reach us whichever way suits you." wide>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map(({ icon: Icon, title, text, cta, href, external, primary }) => (
          <li key={title}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={primary ? "group flex h-full flex-col rounded-2xl bg-[#1f7a4d] p-6 text-white" : "group flex h-full flex-col rounded-2xl bg-white/80 p-6 ring-1 ring-line transition hover:ring-ink/30"}
            >
              <Icon className="size-6" />
              <p className="mt-5 font-display text-2xl">{title}</p>
              <p className={primary ? "mt-1 flex-1 text-sm text-white" : "mt-1 flex-1 text-sm break-words text-muted"}>{text}</p>
              <span className="mt-5 text-sm font-medium underline-offset-4 group-hover:underline">{cta} →</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-12 grid gap-6 rounded-3xl bg-cotton-deep/70 p-8 sm:grid-cols-2 sm:p-10">
        <div>
          <p className="flex items-center gap-2 font-medium">
            <MapPin className="size-5 text-clay" /> Visit the shop
          </p>
          <p className="mt-2 text-ink-soft">{siteConfig.location}.{" "}
            <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Open in Google Maps
            </a>
            . See the cloth in person, collect online orders, or talk to us about a custom order.</p>
        </div>
        <div>
          <p className="flex items-center gap-2 font-medium">
            <Clock className="size-5 text-clay" /> Opening hours
          </p>
          <p className="mt-2 text-ink-soft">
            Call or WhatsApp {siteConfig.phoneDisplay} before you visit, especially for large or custom orders.
          </p>
        </div>
      </div>
    </ContentPage>
  );
}
