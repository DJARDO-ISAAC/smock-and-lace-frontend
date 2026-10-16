import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getMenu } from "@/lib/catalog";
import { pageNav } from "@/lib/config";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const catalogue = await getMenu();
  return (
    <>
      <AnnouncementBar />
      <Header nav={[...catalogue, ...pageNav]} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer catalogue={catalogue} />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </>
  );
}
