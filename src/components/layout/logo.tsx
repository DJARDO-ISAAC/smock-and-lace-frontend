import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <rect x="2" y="3" width="5" height="22" rx="1" fill="var(--color-indigo)" />
      <rect x="8.5" y="3" width="5" height="22" rx="1" fill="var(--color-clay)" />
      <rect x="15" y="3" width="5" height="22" rx="1" fill="var(--color-indigo)" />
      <rect x="21.5" y="3" width="4.5" height="22" rx="1" fill="var(--color-kola)" />
      <path d="M2 9h24M2 19h24" stroke="var(--color-cotton)" strokeWidth="1" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", tone === "light" ? "text-cotton" : "text-ink", className)} aria-label="Smock & Lace, home">
      <LogoMark className="size-7 shrink-0 transition-transform duration-500 group-hover:rotate-[-4deg]" />
      <span className="font-display text-[1.375rem] leading-none tracking-tight whitespace-nowrap">
        Smock <span className="italic text-clay">&amp;</span> Lace
      </span>
    </Link>
  );
}
