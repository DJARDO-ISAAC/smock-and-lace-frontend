"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/cart";
import { useSaved } from "@/stores/saved";

/** Restores the session (refresh cookie), loads the cart and rehydrates saved items once on boot. */
export function AppBootstrap() {
  const status = useAuth((s) => s.status);
  const bootstrap = useAuth((s) => s.bootstrap);
  const loadCart = useCart((s) => s.load);

  useEffect(() => {
    useSaved.persist.rehydrate();
    bootstrap();
  }, [bootstrap]);

  // Reload the cart whenever the session changes (login merges the guest cart server-side).
  useEffect(() => {
    if (status !== "unknown") loadCart();
  }, [status, loadCart]);

  return null;
}
