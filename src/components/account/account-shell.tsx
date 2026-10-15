"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Heart, LogOut, MapPin, Package, Ruler, User } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const NAV = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/measurements", label: "Measurements", icon: Ruler },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

/**
 * Account page frame. Pages that need a signed-in customer pass requireAuth;
 * the wishlist works for guests too (it lives in the browser).
 */
export function AccountShell({ active, title, description, children, requireAuth = true, action }: { active: string; title: string; description?: string; children: ReactNode; requireAuth?: boolean; action?: ReactNode }) {
  const { status, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === "anonymous") router.replace(`/login?next=${encodeURIComponent(active)}`);
  }, [requireAuth, status, router, active]);

  const ready = !requireAuth || status === "authenticated";

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        {user && (
          <nav aria-label="Account" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-4 hidden text-muted lg:block">My account</p>
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
              {NAV.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={href === active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm whitespace-nowrap transition-colors lg:rounded-lg",
                      href === active ? "bg-ink text-cotton" : "bg-white/70 ring-1 ring-line hover:bg-white lg:bg-transparent lg:ring-0 lg:hover:bg-ink/5",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} /> {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.replace("/");
                  }}
                  className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm whitespace-nowrap text-muted ring-1 ring-line hover:text-ink lg:rounded-lg lg:ring-0 lg:hover:bg-ink/5"
                >
                  <LogOut className="size-4" strokeWidth={1.75} /> Sign out
                </button>
              </li>
            </ul>
          </nav>
        )}
        <div className={cn("min-w-0", !user && "lg:col-span-2")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl">{title}</h1>
              {description && <p className="mt-3 text-ink-soft">{description}</p>}
            </div>
            {ready && action}
          </div>
          <div className="mt-8">
            {ready ? (
              children
            ) : (
              <div className="space-y-4" role="status" aria-label="Loading">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
