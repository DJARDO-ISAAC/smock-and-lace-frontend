"use client";

import { usePathname } from "next/navigation";
import { whatsappLink, siteConfig } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Floating WhatsApp link with a pre-filled message for the current page (FR-UI-8). */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;
  const onProduct = pathname.startsWith("/products/");
  const message = onProduct
    ? `Hello Fugu Tribe, I'm interested in this piece: ${siteConfig.url}${pathname}`
    : "Hello Fugu Tribe, I have a question.";

  return (
    <aside aria-label="Chat with us">
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "group fixed right-4 z-30 flex items-center gap-2 rounded-full bg-[#1f7a4d] p-3.5 text-white shadow-lift transition-all hover:bg-[#186640] sm:right-6 sm:bottom-6",
        "bottom-4",
        onProduct && "hidden lg:flex", // product pages have WhatsApp in the sticky buy bar on phones
      )}
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-40 sm:inline">
        Chat with us
      </span>
    </a>
    </aside>
  );
}
