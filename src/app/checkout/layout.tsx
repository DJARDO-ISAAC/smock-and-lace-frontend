import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/config";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-cotton">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to cart</span>
          </Link>
          <Logo />
          <p className="inline-flex items-center gap-1.5 text-sm text-leaf">
            <Lock className="size-4" /> <span className="hidden sm:inline">Secure checkout</span>
          </p>
        </div>
      </header>
      <main id="main" className="flex-1 bg-cotton">
        {children}
      </main>
      <footer className="border-t border-line py-6 text-center text-sm text-muted">
        Need help?{" "}
        <a href={whatsappLink("Hello, I need help with checkout.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4">
          <WhatsAppIcon className="size-4 text-[#1f7a4d]" /> Chat with us on WhatsApp
        </a>
      </footer>
    </>
  );
}
