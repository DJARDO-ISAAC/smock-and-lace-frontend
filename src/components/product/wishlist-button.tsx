"use client";

import { Heart } from "lucide-react";
import { useSaved } from "@/stores/saved";
import { toast } from "@/stores/toast";
import { cn } from "@/lib/utils";

export function WishlistButton({ slug, name, className, withLabel }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const saved = useSaved((s) => s.wishlist.includes(slug));
  const toggle = useSaved((s) => s.toggleWishlist);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel ? undefined : saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(slug);
        toast({
          title: added ? "Saved to your wishlist" : "Removed from your wishlist",
          tone: "success",
          action: added ? { label: "View", href: "/account/wishlist" } : undefined,
        });
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors",
        withLabel ? "h-12 rounded-full border border-ink/20 px-5 text-sm font-medium hover:border-ink" : "size-9 rounded-full bg-cotton/90 text-ink shadow-sm backdrop-blur hover:bg-cotton",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition-transform", saved && "scale-110 fill-clay text-clay")} strokeWidth={1.75} />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
