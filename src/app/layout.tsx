import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AppBootstrap } from "@/components/layout/providers";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading", axes: ["opsz", "SOFT"], display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} · ${siteConfig.tagline}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { type: "website", siteName: siteConfig.name, locale: "en_GH" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  width: "device-width",
  initialScale: 1,
};

const organisationLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  address: { "@type": "PostalAddress", streetAddress: "Oyarifa Crossing", addressLocality: "Accra", addressCountry: "GH" },
  currenciesAccepted: "GHS",
  paymentAccepted: "Mobile Money, Visa, Mastercard",
  sameAs: [siteConfig.tiktok],
  telephone: "+233597708233",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" data-scroll-behavior="smooth" suppressHydrationWarning className={`${heading.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-cotton focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        {children}
        <CartDrawer />
        <Toaster />
        <AppBootstrap />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
