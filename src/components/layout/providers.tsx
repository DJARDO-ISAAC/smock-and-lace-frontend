"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/cart";
import { useSaved } from "@/stores/saved";

/** Restores the session (refresh cookie), loads the cart and rehydrates saved items once on boot,
 * then keeps the cart and wishlist in step with sign-in and sign-out. */
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

  // Signed in: merge a guest wishlist into the account. Signed out: drop the account's list from this device.
  useEffect(() => {
    if (status === "authenticated") useSaved.getState().syncWithAccount();
    if (status === "anonymous") useSaved.getState().forgetAccount();
  }, [status]);

  return null;
}
