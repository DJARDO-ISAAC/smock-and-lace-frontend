import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/page-shell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of sale", alternates: { canonical: "/terms" } };

// DRAFT: have these terms reviewed by a Ghanaian lawyer before launch.
export default function TermsPage() {
  return (
    <ContentPage crumb="Terms of sale" title="Terms of sale" intro="The terms that apply when you buy from FuguTribe.">
      <div className="prose-shop">
        <h2>Prices and payment</h2>
        <p>
          Prices are shown and charged in Ghana cedis (GH₵) and include applicable taxes. Delivery is charged separately and shown before you pay. Your order is
          confirmed only once payment is verified by our payment partner.
        </p>
        <h2>Handmade goods</h2>
        <p>
          Our cloth is woven by hand. Small variations in stripe, colour and texture between pieces, and from photos, are part of its character and are not
          defects.
        </p>
        <h2>Stock</h2>
        <p>
          Stock is limited. Items in your cart are held for {siteConfig.reservationMinutes} minutes once you start payment. If an item sells out before payment is
          confirmed, we&apos;ll refund you in full.
        </p>
        <h2>Cloth sold by the piece</h2>
        <p>
          Each piece of cloth is sold at the length shown on its page. Uncut, unwashed cloth can be returned within{" "}
          {siteConfig.returnWindowDays} days. Once cloth has been cut or sewn it can&apos;t be returned.
        </p>
        <h2>Custom and made-to-order pieces</h2>
        <p>
          Made-to-order and made-to-measure pieces are produced after you order. Lead times shown are estimates. Because they are made for you, they can&apos;t be
          returned for a refund, but we adjust the fit free of charge within 14 days of delivery.
        </p>
        <h2>Delivery, returns and refunds</h2>
        <p>
          See{" "}
          <Link href="/shipping-returns">Shipping &amp; returns</Link>. International customers are responsible for import duties and taxes.
        </p>
        <h2>Contact</h2>
        <p>
          {siteConfig.legalName}, {siteConfig.location}. Email {siteConfig.email}.
        </p>
      </div>
    </ContentPage>
  );
}
