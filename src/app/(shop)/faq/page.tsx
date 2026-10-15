import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/page-shell";
import { AccordionItem } from "@/components/ui/accordion";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = { title: "FAQ", description: "Answers about buying fugu cloth by the piece, custom orders, payments, delivery and caring for handwoven cloth.", alternates: { canonical: "/faq" } };

const FAQ: { group: string; items: [string, string][] }[] = [
  {
    group: "Fugu cloth",
    items: [
      ["How is the cloth sold?", "By the piece. Each design shows its piece length (for example 6 yards) and the price per piece. Add as many pieces as you need."],
      ["How much cloth do I need?", "It depends on the style and the size of the person. Tell us the style on WhatsApp, or ask your tailor, and we'll help you choose the number of pieces."],
      ["Can I get my own colours?", "Yes. We customise colourways for individuals, groups and companies at no extra cost. Use the custom orders page or message us on WhatsApp."],
      ["Do you sew too?", "Yes. We sell ready-made smocks and batakari, and we can sew from our cloth for you or your whole group."],
    ],
  },
  {
    group: "Orders & payment",
    items: [
      ["How can I pay?", "Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Visa or Mastercard, through our secure payment partner. In Accra you can also pay on delivery or when you pick up at our shop."],
      ["Is it safe to pay on your site?", "Yes. Payments are handled on our payment partner's secure page. We never see or store your card number or MoMo PIN."],
      ["Do I need an account?", "No. You can check out as a guest. An account lets you track orders, save addresses and measurements, and check out faster."],
      ["Can I change or cancel my order?", "Message us on WhatsApp as soon as possible. Ready-to-ship orders can be changed until they're dispatched. Custom pieces can be changed until weaving or sewing starts."],
    ],
  },
  {
    group: "Delivery",
    items: [
      ["How long will delivery take?", "1–2 working days in Accra and Tema, 2–4 working days elsewhere in Ghana, and 4–8 working days internationally. Made-to-order pieces ship after their lead time."],
      ["Do you ship outside Ghana?", "Yes, worldwide by DHL Express. Import duties are charged by your country on arrival and paid by you."],
    ],
  },
  {
    group: "Sizing & made to order",
    items: [
      ["How do smocks fit?", "Generously. Fugu is traditionally a loose, flowing garment. If you're between sizes, size down for a neater look. See our size guide for measurements."],
      ["What does made to order mean?", "The cloth is woven and sewn after you order, often to your measurements. The lead time is shown on the product page before you pay."],
      ["Can you match a colour for a wedding?", "Often, yes. Send us a photo of the fabric or colour on WhatsApp and we'll tell you what our weavers can do."],
    ],
  },
  {
    group: "Care",
    items: [
      ["How do I wash my smock?", "Hand wash cold or dry clean. Don't wring it; roll it in a towel and dry in the shade, inside out. The cloth softens with every wear."],
      ["Is the colour going to run?", "Natural indigo can release a little colour in the first few washes. Wash it alone the first time."],
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((g) => g.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))),
  };
  return (
    <ContentPage crumb="FAQ" eyebrow="Help" title="Questions, answered" intro="Can't find what you need? We reply on WhatsApp within a few hours, Monday to Saturday.">
      <div className="space-y-12">
        {FAQ.map((g) => (
          <section key={g.group} aria-labelledby={g.group}>
            <h2 id={g.group} className="text-2xl">
              {g.group}
            </h2>
            <div className="mt-3 border-t border-line">
              {g.items.map(([q, a]) => (
                <AccordionItem key={q} title={q}>
                  <p>{a}</p>
                </AccordionItem>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-12 text-ink-soft">
        Still have a question?{" "}
        <a href={whatsappLink("Hello, I have a question.")} className="font-medium text-ink underline underline-offset-4" target="_blank" rel="noopener noreferrer">
          Message us on WhatsApp
        </a>{" "}
        or{" "}
        <Link href="/contact" className="font-medium text-ink underline underline-offset-4">
          contact us
        </Link>
        . You can also email {siteConfig.email}.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </ContentPage>
  );
}
