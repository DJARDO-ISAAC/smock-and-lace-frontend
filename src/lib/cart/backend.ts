import { apiFetch } from "@/lib/api/client";
import type { AddCartItemInput, Cart, CartLine } from "@/lib/api/types";
import { imageForColour } from "@/lib/catalog/images";
import { findVariant } from "@/lib/catalog/mock-data";
import { siteConfig } from "@/lib/config";
import { readCartToken, writeCartToken } from "./token";

export type CartPatch = Partial<Pick<CartLine, "quantity" | "custom_measurements" | "measurement_note">>;

export interface CartBackend {
  get(token: string | null): Promise<Cart>;
  add(input: AddCartItemInput, token: string | null): Promise<Cart>;
  update(lineId: number, patch: CartPatch, token: string | null): Promise<Cart>;
  remove(lineId: number, token: string | null): Promise<Cart>;
  clear(token: string | null): Promise<Cart>;
  applyDiscount(code: string, token: string | null): Promise<Cart>;
  removeDiscount(token: string | null): Promise<Cart>;
}

export const MAX_QUANTITY_PER_LINE = 10;

/* ---------- Django API (cart app) ---------- */

function apiCall(path: string, init: { method?: string; body?: unknown }, access: string | null) {
  return apiFetch<Cart>(path, {
    ...init,
    token: access,
    cartToken: readCartToken(),
    onResponse: (res) => {
      const token = res.headers.get("X-Cart-Token");
      if (token) writeCartToken(token);
    },
  }).then((cart) => {
    // Customers' carts have no token; drop any stale guest token once merged.
    writeCartToken(cart.token);
    return cart;
  });
}

const apiBackend: CartBackend = {
  get: (access) => apiCall("/cart/", {}, access),
  add: (input, access) => apiCall("/cart/items/", { method: "POST", body: input }, access),
  update: (id, patch, access) => apiCall(`/cart/items/${id}/`, { method: "PATCH", body: patch }, access),
  remove: (id, access) => apiCall(`/cart/items/${id}/`, { method: "DELETE" }, access),
  clear: (access) => apiCall("/cart/", { method: "DELETE" }, access),
  applyDiscount: (code, access) => apiCall("/cart/discount/", { method: "POST", body: { code } }, access),
  removeDiscount: (access) => apiCall("/cart/discount/", { method: "DELETE" }, access),
};

/* ---------- Browser cart for mock mode: same response shape and rules as the API ---------- */

type StoredLine = {
  id: number;
  variant_id: number;
  quantity: number;
  price_when_added: number;
  custom_measurements: Record<string, string> | null;
  measurement_note: string;
};

const STORAGE_KEY = "sl_local_cart";
const DISCOUNT_KEY = "sl_local_discount";

/** Sample codes for mock mode. Real codes are managed in the admin (FR-ADM-C-2). */
const MOCK_CODES: Record<string, { percent: number; minSpend: number }> = {
  AKWAABA10: { percent: 10, minSpend: 0 },
  FUGUWED15: { percent: 15, minSpend: 100000 },
};

class CartRuleError extends Error {
  status = 400;
  code: string;
  fields = {};
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function load(): StoredLine[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(lines: StoredLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage full or blocked: cart lives for this page only */
  }
}

function loadCode() {
  try {
    return localStorage.getItem(DISCOUNT_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveCode(code: string) {
  try {
    if (code) localStorage.setItem(DISCOUNT_KEY, code);
    else localStorage.removeItem(DISCOUNT_KEY);
  } catch {
    /* ignore */
  }
}

function priced(lines: StoredLine[]): Cart {
  const items: CartLine[] = [];
  for (const line of lines) {
    const found = findVariant(line.variant_id);
    if (!found) continue;
    const { product, variant } = found;
    const available = product.is_made_to_order ? null : variant.available_quantity;
    let warning: CartLine["warning"] = null;
    if (!variant.is_active) warning = "unavailable";
    else if (available === 0) warning = "sold_out";
    else if (available !== null && line.quantity > available) warning = "insufficient_stock";
    else if (variant.price !== line.price_when_added) warning = "price_changed";
    const image = imageForColour(product, variant.colour);
    items.push({
      id: line.id,
      variant_id: variant.id,
      sku: variant.sku,
      size: variant.size,
      colour: variant.colour,
      product_name: product.name,
      product_slug: product.slug,
      image: image?.url ?? null,
      art: image?.art ? { ...image.art, view: "front" } : undefined,
      quantity: line.quantity,
      unit_price: variant.price,
      compare_at_price: variant.compare_at_price,
      price_when_added: line.price_when_added,
      line_total: variant.price * line.quantity,
      is_made_to_order: product.is_made_to_order,
      lead_time_days: product.lead_time_days,
      available_quantity: available,
      warning,
      custom_measurements: line.custom_measurements,
      measurement_note: line.measurement_note,
    });
  }
  const subtotal = items.reduce((sum, l) => sum + l.line_total, 0);
  const leadTimes = items.filter((l) => l.is_made_to_order && l.lead_time_days).map((l) => l.lead_time_days!);
  const code = loadCode();
  const rule = MOCK_CODES[code];
  const discount = rule && subtotal >= rule.minSpend ? Math.round((subtotal * rule.percent) / 100) : 0;
  return {
    token: null,
    items,
    item_count: items.reduce((sum, l) => sum + l.quantity, 0),
    subtotal,
    discount,
    discount_code: discount ? code : "",
    delivery_fee: null,
    total: subtotal - discount,
    currency: "GHS",
    has_warnings: items.some((l) => l.warning),
    made_to_order_lead_time_days: leadTimes.length ? Math.max(...leadTimes) : null,
  };
}

function checkQuantity(variantId: number, quantity: number) {
  const found = findVariant(variantId);
  if (!found || !found.variant.is_active) throw new CartRuleError("unavailable", "This item is no longer available.");
  if (quantity > MAX_QUANTITY_PER_LINE)
    throw new CartRuleError("max_quantity", `You can add up to ${MAX_QUANTITY_PER_LINE} of one item.`);
  const available = found.product.is_made_to_order ? null : found.variant.available_quantity;
  if (available === 0) throw new CartRuleError("sold_out", "Sorry, this size and colour has just sold out.");
  if (available !== null && quantity > available)
    throw new CartRuleError("insufficient_stock", `Only ${available} left in stock.`);
  return found;
}

const delay = <T,>(value: T) => new Promise<T>((r) => setTimeout(() => r(value), 180));

const localBackend: CartBackend = {
  get: () => delay(priced(load())),
  add: (input) => {
    const lines = load();
    const existing = lines.find((l) => l.variant_id === input.variant_id);
    const quantity = (existing?.quantity ?? 0) + input.quantity;
    const { variant } = checkQuantity(input.variant_id, quantity);
    if (existing) {
      existing.quantity = quantity;
      if (input.custom_measurements !== undefined) existing.custom_measurements = input.custom_measurements;
      if (input.measurement_note !== undefined) existing.measurement_note = input.measurement_note;
    } else {
      lines.push({
        id: Date.now(),
        variant_id: input.variant_id,
        quantity,
        price_when_added: variant.price,
        custom_measurements: input.custom_measurements ?? null,
        measurement_note: input.measurement_note ?? "",
      });
    }
    save(lines);
    return delay(priced(lines));
  },
  update: (id, patch) => {
    const lines = load();
    const line = lines.find((l) => l.id === id);
    if (!line) return Promise.reject(new CartRuleError("not_found", "That item is no longer in your cart."));
    if (patch.quantity !== undefined) {
      checkQuantity(line.variant_id, patch.quantity);
      line.quantity = patch.quantity;
    }
    if (patch.custom_measurements !== undefined) line.custom_measurements = patch.custom_measurements;
    if (patch.measurement_note !== undefined) line.measurement_note = patch.measurement_note;
    save(lines);
    return delay(priced(lines));
  },
  remove: (id) => {
    const lines = load().filter((l) => l.id !== id);
    save(lines);
    return delay(priced(lines));
  },
  clear: () => {
    save([]);
    saveCode("");
    return delay(priced([]));
  },
  applyDiscount: (raw) => {
    const code = raw.trim().toUpperCase();
    const rule = MOCK_CODES[code];
    if (!rule) return Promise.reject(new CartRuleError("invalid_code", "That code isn't valid or has expired."));
    const subtotal = priced(load()).subtotal;
    if (subtotal < rule.minSpend) {
      return Promise.reject(
        new CartRuleError("min_spend", `This code needs a minimum spend of GH₵ ${(rule.minSpend / 100).toLocaleString()}.`),
      );
    }
    saveCode(code);
    return delay(priced(load()));
  },
  removeDiscount: () => {
    saveCode("");
    return delay(priced(load()));
  },
};

export const cartBackend: CartBackend = siteConfig.dataSource === "api" ? apiBackend : localBackend;
