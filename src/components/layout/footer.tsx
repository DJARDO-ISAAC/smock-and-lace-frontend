import Link from "next/link";
import { cacheLife } from "next/cache";
import { MapPin, Mail, Phone } from "lucide-react";
import { footerNav, siteConfig, whatsappLink } from "@/lib/config";
import { PaymentMarks, TikTokIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow text-cotton/60">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[0.9375rem] text-cotton/85 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-indigo-deep text-cotton">
      <div className="strip-weave h-1.5 opacity-90" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-md">
            <Logo tone="light" />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-cotton/75">
              Northern Ghana heritage in luxury pieces. Handwoven fugu cloth, vintage and modern designs, and smocks made for individuals, groups and companies.
            </p>
            <div className="mt-8">
              <p className="font-display text-xl">First look at new drops</p>
              <NewsletterForm tone="dark" className="mt-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[1fr_1fr_1fr_1.5fr]">
            <FooterColumn title="Shop" links={footerNav.shop} />
            <FooterColumn title="Help" links={footerNav.help} />
            <FooterColumn title="Company" links={footerNav.company} />
            <div>
              <h2 className="eyebrow text-cotton/60">Visit &amp; talk</h2>
              <ul className="mt-4 space-y-3 text-[0.9375rem] text-cotton/85">
                <li>
                  <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-white">
                    <MapPin className="mt-1 size-4 shrink-0 text-cotton/50" /> {siteConfig.location}
                  </a>
                </li>
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-white">
                    <WhatsAppIcon className="mt-1 size-4 shrink-0 text-cotton/50" /> WhatsApp us
                  </a>
                </li>
                <li>
                  <a href={`tel:+${siteConfig.whatsappNumber}`} className="flex gap-2.5 hover:text-white">
                    <Phone className="mt-1 size-4 shrink-0 text-cotton/50" /> {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="flex gap-2.5 [overflow-wrap:anywhere] hover:text-white">
                    <Mail className="mt-1 size-4 shrink-0 text-cotton/50" /> {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-white">
                    <TikTokIcon className="mt-1 size-4 shrink-0 text-cotton/50" /> {siteConfig.tiktokHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-cotton/15 pt-8 text-sm text-cotton/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.legalName}. Prices in Ghana cedis (GH₵).
          </p>
          <PaymentMarks className="flex flex-wrap gap-2 text-cotton/75" />
        </div>
      </div>
    </footer>
  );
}
