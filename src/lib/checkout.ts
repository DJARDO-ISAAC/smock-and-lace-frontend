import { apiFetch } from "@/lib/api/client";
import type { Cart, CheckoutInput, CheckoutResult, DeliveryOption, Order } from "@/lib/api/types";
import { readCartToken } from "@/lib/cart/token";
import { siteConfig } from "@/lib/config";
import { addDays } from "@/lib/utils";

const ORDERS_KEY = "sl_mock_orders";
const ORDER_KEYS = "sl_order_keys";

/** Guests prove they own an order with the key from checkout (or the confirmation email link). */
export function rememberOrderKey(number: string, key: string) {
  try {
    const keys = JSON.parse(localStorage.getItem(ORDER_KEYS) || "{}");
    keys[number] = key;
    // Keep the most recent few only.
    const recent = Object.fromEntries(Object.entries(keys).slice(-10));
    localStorage.setItem(ORDER_KEYS, JSON.stringify(recent));
  } catch {
    /* storage blocked: the email link still works */
  }
}

export function orderKey(number: string): string | null {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEYS) || "{}")[number] ?? null;
  } catch {
    return null;
  }
}

/** Start (or retry) the gateway payment for a pending order and return the payment page URL. */
export async function startPayment(number: string, access: string | null): Promise<string> {
  const result = await apiFetch<{ payment_url: string }>("/payments/initialize/", {
    method: "POST",
    body: { order_number: number, callback_url: `${window.location.origin}/order/${number}/confirmation`, key: orderKey(number) ?? "" },
    token: access,
  });
  return result.payment_url;
}

export type PaymentCheck = { payment_status: "initialized" | "success" | "failed" | "abandoned"; order_status: string };

/** After the gateway redirects back: the server asks the gateway, never trusting the redirect alone. */
export async function verifyPayment(reference: string, number: string, access: string | null): Promise<PaymentCheck> {
  const key = orderKey(number);
  return apiFetch<PaymentCheck>(`/payments/verify/?reference=${encodeURIComponent(reference)}${key ? `&key=${encodeURIComponent(key)}` : ""}`, {
    token: access,
  });
}

/**
 * API flow (SRS 7.3): POST /checkout/ re-prices and reserves stock, then POST /payments/initialize/
 * returns the gateway URL. The order only becomes "paid" after the server verifies the webhook.
 */
export async function placeOrder(input: CheckoutInput, access: string | null, cart: Cart, delivery: DeliveryOption): Promise<CheckoutResult> {
  if (siteConfig.dataSource === "api") {
    const order = await apiFetch<Order>("/checkout/", { method: "POST", body: input, token: access, cartToken: readCartToken() });
    if (order.access_key) rememberOrderKey(order.number, order.access_key);
    if (input.payment_method === "pay_on_delivery") return { order, payment_url: null };
    return { order, payment_url: await startPayment(order.number, access) };
  }

  // Mock mode: simulate the round trip and keep the order in this browser.
  await new Promise((r) => setTimeout(r, 900));
  const now = new Date();
  const lead = cart.made_to_order_lead_time_days ?? 1;
  const order: Order = {
    number: `SL-${String(Math.floor(100000 + Math.random() * 900000))}`,
    status: input.payment_method === "pay_on_delivery" ? "pending" : "paid",
    email: input.email,
    full_name: input.full_name,
    phone: input.phone,
    items: cart.items.map((l) => ({
      product_name: l.product_name,
      product_slug: l.product_slug,
      size: l.size,
      colour: l.colour,
      unit_price: l.unit_price,
      quantity: l.quantity,
      line_total: l.line_total,
      is_made_to_order: l.is_made_to_order,
      art: l.art,
      image: l.image,
    })),
    subtotal: cart.subtotal,
    discount: cart.discount,
    delivery_fee: delivery.fee,
    total: cart.total + delivery.fee,
    currency: "GHS",
    delivery_option: delivery,
    shipping_address: input.shipping_address,
    payment_method: input.payment_method,
    expected_ship_date: addDays(now, lead).toISOString(),
    tracking_number: "",
    courier: "",
    created_at: now.toISOString(),
    status_history: [
      { status: "pending", at: now.toISOString(), note: "Order placed" },
      ...(input.payment_method === "pay_on_delivery" ? [] : [{ status: "paid" as const, at: now.toISOString(), note: "Payment confirmed" }]),
    ],
  };
  const all = loadMockOrders();
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all].slice(0, 20)));
  return { order, payment_url: null };
}

export function loadMockOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export async function fetchOrder(number: string, access: string | null): Promise<Order | null> {
  if (siteConfig.dataSource === "api") {
    const key = orderKey(number);
    try {
      return await apiFetch<Order>(`/orders/${encodeURIComponent(number)}/${key ? `?key=${encodeURIComponent(key)}` : ""}`, { token: access });
    } catch {
      return null;
    }
  }
  return loadMockOrders().find((o) => o.number === number) ?? null;
}

export async function fetchOrders(access: string | null): Promise<Order[]> {
  if (siteConfig.dataSource === "api") {
    const page = await apiFetch<{ results: Order[] }>("/orders/", { token: access });
    return page.results;
  }
  return loadMockOrders();
}
