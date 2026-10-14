import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContentPage } from "@/components/content/page-shell";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = { title: "Contact us", description: "Reach Smock & Lace on WhatsApp, phone or email, or visit our studio in Osu, Accra.", alternates: { canonical: "/contact" } };

const CHANNELS = [
  { icon: WhatsAppIcon, title: "WhatsApp", text: "Fastest for sizing, custom orders and order updates.", cta: "Start a chat", href: whatsappLink("Hello Smock & Lace, I have a question."), external: true, primary: true },
  { icon: Phone, title: "Call", text: siteConfig.phoneDisplay, cta: "Call us", href: `tel:+${siteConfig.whatsappNumber}` },
  { icon: Mail, title: "Email", text: siteConfig.email, cta: "Send an email", href: `mailto:${siteConfig.email}` },
  { icon: InstagramIcon, title: "Instagram", text: siteConfig.instagramHandle, cta: "Follow us", href: siteConfig.instagram, external: true },
];

export default function ContactPage() {
  return (
    <ContentPage crumb="Contact" eyebrow="Get in touch" title="We'd love to hear from you" intro="Questions about sizing, a custom piece for a wedding, or an order on its way? Reach us whichever way suits you." wide>
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
              <p className={primary ? "mt-1 flex-1 text-sm text-white/80" : "mt-1 flex-1 text-sm break-words text-muted"}>{text}</p>
              <span className="mt-5 text-sm font-medium underline-offset-4 group-hover:underline">{cta} →</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-12 grid gap-6 rounded-3xl bg-cotton-deep/70 p-8 sm:grid-cols-2 sm:p-10">
        <div>
          <p className="flex items-center gap-2 font-medium">
            <MapPin className="size-5 text-clay" /> Visit the studio
          </p>
          <p className="mt-2 text-ink-soft">{siteConfig.location}. Try pieces on, collect online orders, or get measured for made-to-order.</p>
        </div>
        <div>
          <p className="flex items-center gap-2 font-medium">
            <Clock className="size-5 text-clay" /> Opening hours
          </p>
          <p className="mt-2 text-ink-soft">
            Monday to Friday, 9am – 6pm
            <br />
            Saturday, 10am – 4pm
            <br />
            Closed Sundays and public holidays
          </p>
        </div>
      </div>
    </ContentPage>
  );
}
