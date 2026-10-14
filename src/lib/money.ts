/** Money arrives from the API as integer pesewas (GH₵ 1 = 100 pesewas), never floats. */

const withDecimals = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const whole = new Intl.NumberFormat("en-GH", { maximumFractionDigits: 0 });

export function formatGHS(pesewas: number, options: { compact?: boolean } = {}) {
  const cedis = pesewas / 100;
  const isWhole = pesewas % 100 === 0;
  const amount = options.compact && isWhole ? whole.format(cedis) : withDecimals.format(cedis);
  return `GH₵ ${amount}`;
}

export function percentOff(price: number, compareAt: number | null | undefined) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
