"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
  action?: { label: string; href?: string; onClick?: () => void };
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = Date.now() + Math.random();
    set({ toasts: [...get().toasts.slice(-2), { ...toast, id }] });
    setTimeout(() => get().dismiss(id), 4500);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = (t: Omit<Toast, "id">) => useToasts.getState().show(t);
