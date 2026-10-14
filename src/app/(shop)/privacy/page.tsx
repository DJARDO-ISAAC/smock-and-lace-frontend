import type { Metadata } from "next";
import { ContentPage } from "@/components/content/page-shell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

// DRAFT: have this reviewed against the Data Protection Act, 2012 (Act 843) before launch (NFR-PRIV-1).
export default function PrivacyPage() {
  return (
    <ContentPage crumb="Privacy policy" title="Privacy policy" intro="How we collect, use and protect your personal data.">
      <div className="prose-shop">
        <p>
          {siteConfig.legalName} (&ldquo;we&rdquo;) respects your privacy and handles personal data in line with Ghana&apos;s Data Protection Act, 2012 (Act 843).
        </p>
        <h2>What we collect</h2>
        <ul>
          <li>Contact details: your name, email address and phone number.</li>
          <li>Delivery details: the addresses you ship to.</li>
          <li>Measurements, if you choose to save or send them for made-to-order pieces.</li>
          <li>Order history and communication with us.</li>
          <li>With your consent, analytics and marketing cookies that tell us how the site is used.</li>
        </ul>
        <p>We never receive or store your card number or Mobile Money PIN. Payments are processed by our payment partner.</p>
        <h2>How we use it</h2>
        <ul>
          <li>To process, deliver and support your orders.</li>
          <li>To send order updates by email, SMS or WhatsApp.</li>
          <li>To send newsletters, only if you have opted in. You can unsubscribe at any time.</li>
          <li>To prevent fraud and keep the shop secure.</li>
        </ul>
        <h2>Who we share it with</h2>
        <p>
          Only with the services needed to run the shop: our payment partner, delivery couriers, and email and SMS providers. We do not sell your personal data.
        </p>
        <h2>Your rights</h2>
        <p>
          You can ask for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it. Email {siteConfig.email} and we&apos;ll respond
          within 30 days. We keep order records for as long as the law requires for accounting.
        </p>
        <h2>Contact</h2>
        <p>Questions about this policy? Email {siteConfig.email}.</p>
      </div>
    </ContentPage>
  );
}
