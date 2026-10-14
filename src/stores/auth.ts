"use client";

import { create } from "zustand";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { AuthResponse, User } from "@/lib/api/types";
import { readCartToken } from "@/lib/cart/token";

type Status = "unknown" | "authenticated" | "anonymous";

type AuthState = {
  user: User | null;
  /** Access token lives in memory only, never in localStorage (SRS 9.4.4). */
  access: string | null;
  status: Status;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { email: string; password: string; full_name: string; phone: string }) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  /** Fetch with the access token, refreshing it once on 401. */
  authFetch: <T>(path: string, init?: { method?: string; body?: unknown }) => Promise<T>;
};

let refreshing: Promise<string | null> | null = null;

/**
 * The refresh token is an httpOnly cookie on the API's domain, so the page can't see whether one exists.
 * This non-secret flag remembers that the visitor signed in, so guests don't trigger a refresh call on every load.
 */
const SESSION_HINT = "sl_session";

function hasSessionHint() {
  try {
    return localStorage.getItem(SESSION_HINT) === "1";
  } catch {
    return false;
  }
}

function setSessionHint(on: boolean) {
  try {
    if (on) localStorage.setItem(SESSION_HINT, "1");
    else localStorage.removeItem(SESSION_HINT);
  } catch {
    /* storage blocked: we simply won't restore the session on reload */
  }
}

async function refreshAccess(): Promise<string | null> {
  refreshing ??= apiFetch<{ access: string }>("/auth/refresh/", { method: "POST" })
    .then((r) => r.access)
    .catch(() => null)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  access: null,
  status: "unknown",

  bootstrap: async () => {
    if (get().status !== "unknown") return;
    if (!hasSessionHint()) {
      set({ status: "anonymous" });
      return;
    }
    const access = await refreshAccess();
    if (!access) {
      setSessionHint(false);
      set({ status: "anonymous" });
      return;
    }
    try {
      const user = await apiFetch<User>("/me/", { token: access });
      set({ user, access, status: "authenticated" });
    } catch {
      set({ user: null, access: null, status: "anonymous" });
    }
  },

  login: async (email, password) => {
    // The guest cart token goes along so the API can merge the cart (FR-CART-2).
    const res = await apiFetch<AuthResponse>("/auth/login/", {
      method: "POST",
      body: { email, password },
      cartToken: readCartToken(),
    });
    setSessionHint(true);
    set({ user: res.user, access: res.access, status: "authenticated" });
    return res.user;
  },

  register: async (input) => {
    const res = await apiFetch<AuthResponse>("/auth/register/", {
      method: "POST",
      body: input,
      cartToken: readCartToken(),
    });
    setSessionHint(true);
    set({ user: res.user, access: res.access, status: "authenticated" });
    return res.user;
  },

  logout: async () => {
    try {
      await apiFetch("/auth/logout/", { method: "POST" });
    } finally {
      setSessionHint(false);
      set({ user: null, access: null, status: "anonymous" });
    }
  },

  setUser: (user) => set({ user }),

  authFetch: async <T,>(path: string, init: { method?: string; body?: unknown } = {}) => {
    const attempt = (token: string | null) => apiFetch<T>(path, { ...init, token });
    try {
      return await attempt(get().access);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      const access = await refreshAccess();
      if (!access) {
        setSessionHint(false);
        set({ user: null, access: null, status: "anonymous" });
        throw error;
      }
      set({ access });
      return attempt(access);
    }
  },
}));
