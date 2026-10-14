"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Wishlist and recently viewed (FR-ACC-5). Kept in the browser until the wishlist API exists. */
type SavedState = {
  wishlist: string[];
  recent: string[];
  toggleWishlist: (slug: string) => boolean;
  addRecent: (slug: string) => void;
};

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recent: [],
      toggleWishlist: (slug) => {
        const has = get().wishlist.includes(slug);
        set({ wishlist: has ? get().wishlist.filter((s) => s !== slug) : [slug, ...get().wishlist] });
        return !has;
      },
      addRecent: (slug) => set({ recent: [slug, ...get().recent.filter((s) => s !== slug)].slice(0, 12) }),
    }),
    { name: "sl_saved", skipHydration: true },
  ),
);
