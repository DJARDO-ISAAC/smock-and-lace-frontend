"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { mainNav, siteConfig, whatsappLink } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/cart";
import { useSaved } from "@/stores/saved";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { Logo } from "./logo";
import { SearchDialog } from "./search-dialog";

function IconLink({ href, label, children, className }: { href: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} aria-label={label} className={cn("relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5", className)}>
      {children}
    </Link>
  );
}

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute top-0.5 right-0.5 grid min-w-[18px] place-items-center rounded-full bg-clay px-1 text-[10px] leading-[18px] font-semibold text-cotton tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

function DesktopNav({ pathname = "" }: { pathname?: string }) {
  return (
    <ul className="flex items-center gap-1 xl:gap-2">
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3 py-2 text-[0.875rem] font-medium text-ink-soft transition-colors hover:text-ink",
              "after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 hover:after:scale-x-100",
              isActive(pathname, item.href) && "text-ink after:scale-x-100",
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MobileNav({ pathname = "" }: { pathname?: string }) {
  return (
    <ul className="divide-y divide-line">
      <li>
        <Link href="/shop" className="flex items-center justify-between py-4 font-display text-2xl">
          Shop all
        </Link>
      </li>
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} className="flex items-center justify-between py-4 font-display text-2xl aria-[current=page]:text-clay">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Reading the URL is dynamic, so it lives in small Suspense-wrapped pieces and the header stays in the static shell. */
function WithPathname({ render }: { render: (pathname: string) => React.ReactNode }) {
  return <>{render(usePathname())}</>;
}

function OnNavigate({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  useEffect(() => onNavigate(), [pathname, onNavigate]);
  return null;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCart((s) => s.cart?.item_count ?? 0);
  const openCart = useCart((s) => s.openDrawer);
  const wishlistCount = useSaved((s) => s.wishlist.length);
  const user = useAuth((s) => s.user);
  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <>
      <header className={cn("sticky top-0 z-40 border-b bg-cotton/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300", scrolled ? "border-line shadow-[0_8px_24px_-20px_rgb(0_0_0/0.4)]" : "border-transparent")}>
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-[72px] lg:grid-cols-[auto_1fr_auto] lg:px-10">
          <div className="flex items-center lg:hidden">
            <button type="button" onClick={() => setMenuOpen(true)} className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Open menu" aria-expanded={menuOpen}>
              <Menu className="size-[22px]" strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Search">
              <Search className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <Logo className="justify-self-center lg:justify-self-start" />

          <nav aria-label="Main" className="hidden justify-center lg:flex">
            <Suspense fallback={<DesktopNav />}>
              <WithPathname render={(p) => <DesktopNav pathname={p} />} />
            </Suspense>
          </nav>

          <div className="flex items-center justify-self-end">
            <button type="button" onClick={() => setSearchOpen(true)} className="hidden size-10 place-items-center rounded-full hover:bg-ink/5 lg:grid" aria-label="Search">
              <Search className="size-5" strokeWidth={1.75} />
            </button>
            <IconLink href={user ? "/account" : "/login"} label={user ? "Your account" : "Sign in"} className="hidden sm:grid">
              <User className="size-5" strokeWidth={1.75} />
            </IconLink>
            <IconLink href="/account/wishlist" label={`Wishlist, ${wishlistCount} items`} className="hidden sm:grid">
              <Heart className="size-5" strokeWidth={1.75} />
              <CountBadge count={wishlistCount} />
            </IconLink>
            <button type="button" onClick={openCart} className="relative -mr-2 grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label={`Open cart, ${itemCount} items`}>
              <ShoppingBag className="size-5" strokeWidth={1.75} />
              <CountBadge count={itemCount} />
            </button>
          </div>
        </div>
      </header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu" hideTitle>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-line px-5">
            <Logo />
            <button type="button" onClick={() => setMenuOpen(false)} className="-mr-2 grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Close menu">
              <span aria-hidden className="text-2xl leading-none">×</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            <Suspense fallback={<MobileNav />}>
              <WithPathname render={(p) => <MobileNav pathname={p} />} />
            </Suspense>
            <ul className="mt-6 space-y-3 text-[0.9375rem] text-ink-soft">
              <li>
                <Link href={user ? "/account" : "/login"} className="flex items-center gap-3">
                  <User className="size-5" strokeWidth={1.75} /> {user ? `Hi, ${user.full_name.split(" ")[0] || "there"}` : "Sign in or create an account"}
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="flex items-center gap-3">
                  <Heart className="size-5" strokeWidth={1.75} /> Wishlist {wishlistCount ? `(${wishlistCount})` : ""}
                </Link>
              </li>
              <li>
                <a href={whatsappLink("Hello Smock & Lace, I have a question.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <WhatsAppIcon className="size-5" /> Chat on WhatsApp
                </a>
              </li>
              <li>
                <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <InstagramIcon className="size-5" /> {siteConfig.instagramHandle}
                </a>
              </li>
            </ul>
          </nav>
          <div className="strip-weave h-2 opacity-80" aria-hidden />
        </div>
      </Dialog>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Suspense fallback={null}>
        <OnNavigate onNavigate={closeMenus} />
      </Suspense>
    </>
  );
}
