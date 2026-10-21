"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { siteConfig } from "@/lib/config";
import { useAuth } from "@/stores/auth";
import { toast } from "@/stores/toast";

type WishlistResponse = { slugs: string[] };

/**
 * Wishlist and recently viewed (FR-ACC-5). A guest's wishlist lives in this browser; a signed-in customer's
 * is saved to their account (/wishlist/), and a guest's list is merged in when they sign in (AppBootstrap).
 * Recently viewed always stays in the browser. In sample-data mode the products aren't in the API, so it stays local.
 */
type SavedState = {
  wishlist: string[];
  recent: string[];
  /** Whose wishlist is stored here: this browser's guest list, or a copy of the signed-in account's. */
  owner: "guest" | "account";
  toggleWishlist: (slug: string) => boolean;
  addRecent: (slug: string) => void;
  /** After sign-in: merge the guest list into the account and keep the account's list. */
  syncWithAccount: () => Promise<void>;
  /** After sign-out: drop the account's list so the next person on this device doesn't see it. */
  forgetAccount: () => void;
};

const usesAccount = () => siteConfig.dataSource === "api" && useAuth.getState().status === "authenticated";

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recent: [],
      owner: "guest",
      toggleWishlist: (slug) => {
        const has = get().wishlist.includes(slug);
        const apply = (save: boolean) =>
          set({ wishlist: save ? [slug, ...get().wishlist.filter((s) => s !== slug)] : get().wishlist.filter((s) => s !== slug) });
        apply(!has);
        if (usesAccount()) {
          const { authFetch } = useAuth.getState();
          const request = has
            ? authFetch<WishlistResponse>(`/wishlist/${encodeURIComponent(slug)}/`, { method: "DELETE" })
            : authFetch<WishlistResponse>("/wishlist/", { method: "POST", body: { slugs: [slug] } });
          request.catch(() => {
            apply(has);
            toast({ title: "Couldn't update your wishlist. Please try again.", tone: "error" });
          });
        }
        return !has;
      },
      addRecent: (slug) => set({ recent: [slug, ...get().recent.filter((s) => s !== slug)].slice(0, 12) }),
      syncWithAccount: async () => {
        if (!usesAccount()) return;
        const { authFetch } = useAuth.getState();
        const guest = get().owner === "guest" ? get().wishlist : [];
        try {
          const { slugs } = guest.length
            ? await authFetch<WishlistResponse>("/wishlist/", { method: "POST", body: { slugs: guest } })
            : await authFetch<WishlistResponse>("/wishlist/");
          set({ wishlist: slugs, owner: "account" });
        } catch {
          // Keep what's here; the next sign-in or page load tries again.
        }
      },
      forgetAccount: () => {
        if (get().owner === "account") set({ wishlist: [], owner: "guest" });
      },
    }),
    { name: "sl_saved", skipHydration: true },
  ),
);
