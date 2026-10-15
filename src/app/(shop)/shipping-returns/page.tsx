import type { Metadata } from "next";
import { ContentPage } from "@/components/content/page-shell";
import { siteConfig } from "@/lib/config";
import { formatGHS } from "@/lib/money";
import { DELIVERY_ESTIMATES } from "@/lib/shipping";

export const metadata: Metadata = { title: "Shipping & returns", description: "Delivery fees and times across Ghana and worldwide, and our returns policy.", alternates: { canonical: "/shipping-returns" } };

export default function ShippingPage() {
  return (
    <ContentPage crumb="Shipping & returns" eyebrow="Help" title="Shipping & returns" intro="We deliver across Ghana and worldwide. Fees are shown at checkout before you pay.">
      <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
        <table className="w-full min-w-[28rem] text-left text-[0.9375rem]">
          <thead className="bg-cotton-deep">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Where
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                From
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Delivery time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {DELIVERY_ESTIMATES.map((d) => (
              <tr key={d.zone}>
                <td className="px-5 py-4 font-medium">{d.zone}</td>
                <td className="px-5 py-4 tabular-nums">{formatGHS(d.fee, { compact: true })}</td>
                <td className="px-5 py-4 text-ink-soft">{d.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose-shop mt-12">
        <h2>Delivery</h2>
        <ul>
          <li>
            <strong>Accra &amp; Tema:</strong> our dispatch riders deliver in 1–2 working days. You can also collect free from our shop at Oyarifa Crossing.
          </li>
          <li>
            <strong>Rest of Ghana:</strong> tracked courier delivery in 2–4 working days.
          </li>
          <li>
            <strong>International:</strong> DHL Express in 4–8 working days. Import duties and taxes are charged by your country on arrival and are paid by you.
          </li>
          <li>
            <strong>Made-to-order pieces</strong> ship once they are woven and sewn. The lead time is shown on the product page and at checkout, and your order page shows
            the expected ship date.
          </li>
        </ul>
        <p>You&apos;ll get a tracking number by email and SMS as soon as your order ships.</p>

        <h2>Returns &amp; exchanges</h2>
        <p>
          If a ready-to-ship piece isn&apos;t right, you can return it within <strong>{siteConfig.returnWindowDays} days</strong> of delivery for an exchange or a refund.
          Items must be unworn, unwashed and have their tags attached.
        </p>
        <ol>
          <li>Go to your order in your account and choose &ldquo;Request a return&rdquo;, or message us on WhatsApp with your order number.</li>
          <li>We&apos;ll confirm and arrange pickup in Accra, or send you return instructions.</li>
          <li>Refunds go back to your original payment method (MoMo or card) within 5 working days of us receiving the item.</li>
        </ol>
        <h3>Cloth</h3>
        <p>
          Cloth can be returned within {siteConfig.returnWindowDays} days if it is uncut and unwashed. Once cloth has been cut or sewn, it
          can&apos;t be returned, so check the colour with us on WhatsApp first if you&apos;re unsure.
        </p>
        <h3>Made-to-order and made-to-measure</h3>
        <p>
          These pieces are made for you alone, so they can&apos;t be returned for a refund. If the fit isn&apos;t right, tell us within 14 days and we&apos;ll adjust it free
          of charge.
        </p>
      </div>
    </ContentPage>
  );
}
