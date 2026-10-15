import { z } from "zod";

/** Ghana mobile numbers: 0XX XXX XXXX or +233 XX XXX XXXX (NFR-I18N-1). */
export const GHANA_PHONE = /^(?:\+233|233|0)[2-5]\d{8}$/;
/** International numbers must include the country code, e.g. +44 7700 900123 or 0044…. */
export const INTL_PHONE = /^(?:\+|00)\d{7,15}$/;

export const normalisePhone = (v: string) => v.replace(/[\s()-]/g, "");

export function formatGhanaPhone(v: string) {
  const d = normalisePhone(v);
  const local = d.replace(/^(\+233|233)/, "0");
  return /^0\d{9}$/.test(local) ? `+233${local.slice(1)}` : d;
}

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .refine((v) => !/^\d+$/.test(v), "Use letters as well as numbers.");

export const emailSchema = z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address, like name@example.com.");
