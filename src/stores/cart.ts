"use client";

import { create } from "zustand";
import type { AddCartItemInput, Cart } from "@/lib/api/types";
import { cartBackend, type CartPatch } from "@/lib/cart/backend";
import { useAuth } from "./auth";

type CartState = {
  cart: Cart | null;
  status: "idle" | "loading" | "ready" | "error";
  /** Line ids with a request in flight, so their controls can show progress. */
  busyLines: number[];
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  load: () => Promise<void>;
  add: (input: AddCartItemInput) => Promise<Cart>;
  update: (lineId: number, patch: CartPatch) => Promise<void>;
  remove: (lineId: number) => Promise<void>;
  clear: () => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
};

const access = () => useAuth.getState().access;

export const useCart = create<CartState>((set, get) => {
  const withLine = async (lineId: number, run: () => Promise<Cart>) => {
    set({ busyLines: [...get().busyLines, lineId] });
    try {
      set({ cart: await run() });
    } finally {
      set({ busyLines: get().busyLines.filter((id) => id !== lineId) });
    }
  };

  return {
    cart: null,
    status: "idle",
    busyLines: [],
    drawerOpen: false,
    openDrawer: () => set({ drawerOpen: true }),
    closeDrawer: () => set({ drawerOpen: false }),

    load: async () => {
      if (get().status === "idle") set({ status: "loading" });
      try {
        set({ cart: await cartBackend.get(access()), status: "ready" });
      } catch {
        set({ status: get().cart ? "ready" : "error" });
      }
    },

    add: async (input) => {
      const cart = await cartBackend.add(input, access());
      set({ cart, status: "ready" });
      return cart;
    },

    update: (lineId, patch) => withLine(lineId, () => cartBackend.update(lineId, patch, access())),
    remove: (lineId) => withLine(lineId, () => cartBackend.remove(lineId, access())),
    clear: async () => set({ cart: await cartBackend.clear(access()) }),
    applyDiscount: async (code) => set({ cart: await cartBackend.applyDiscount(code, access()) }),
    removeDiscount: async () => set({ cart: await cartBackend.removeDiscount(access()) }),
  };
});
