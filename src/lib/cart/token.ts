/** Guest cart token, kept in a first-party cookie so the cart survives across sessions (FR-CART-1). */
const NAME = "sl_cart";
const MAX_AGE = 60 * 60 * 24 * 30;

export function readCartToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function writeCartToken(token: string | null) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = token
    ? `${NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`
    : `${NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
