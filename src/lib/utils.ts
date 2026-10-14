import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Deterministic 32-bit hash, used to vary generated artwork per product. */
export function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-GH", options).format(new Date(iso));
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** "Thu 23 Oct – Mon 27 Oct" */
export function formatDateRange(from: Date, to: Date) {
  const f = new Intl.DateTimeFormat("en-GH", { weekday: "short", day: "numeric", month: "short" });
  return `${f.format(from)} – ${f.format(to)}`;
}
