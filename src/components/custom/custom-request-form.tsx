"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, CheckCircle2, User, Users } from "lucide-react";
import type { CustomRequestInput } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { whatsappLink } from "@/lib/config";
import { COUNTRIES } from "@/lib/shipping";
import { submitCustomRequest } from "@/lib/custom-requests";
import { emailSchema, GHANA_PHONE, INTL_PHONE, normalisePhone } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/ui/form";
import { WhatsAppIcon } from "@/components/ui/icons";

const TYPES = [
  { value: "individual", title: "Just me", text: "One outfit or a few pieces", icon: User },
  { value: "group", title: "A group", text: "Bridal party, family, friends", icon: Users },
  { value: "corporate", title: "A company", text: "Staff, events, institutions", icon: Building2 },
] as const;

const NEEDS = [
  { value: "cloth", label: "Cloth only" },
  { value: "sewn", label: "Sewn outfits" },
  { value: "both", label: "Cloth and sewing" },
] as const;

const OCCASIONS = [
  { value: "", label: "Choose an occasion" },
  { value: "wedding", label: "Wedding or engagement" },
  { value: "funeral", label: "Funeral or memorial" },
  { value: "festival", label: "Festival or durbar" },
  { value: "corporate", label: "Corporate event or uniform" },
  { value: "birthday", label: "Birthday or celebration" },
  { value: "other", label: "Something else" },
] as const;

const schema = z
  .object({
    request_type: z.enum(["individual", "group", "corporate"]),
    need: z.enum(["cloth", "sewn", "both"]),
    occasion: z.enum(["", "wedding", "funeral", "festival", "corporate", "birthday", "other"]),
    colours: z.string().max(255),
    quantity: z.coerce.number().int("Enter a whole number.").min(1, "Enter at least 1.").max(5000, "For very large orders, tell us in the details."),
    needed_by: z.string(),
    budget: z.string().max(100),
    details: z.string().max(3000),
    full_name: z.string().trim().min(2, "Enter your name."),
    phone: z.string().trim().refine((v) => GHANA_PHONE.test(normalisePhone(v)) || INTL_PHONE.test(normalisePhone(v)), "Enter a Ghana number like 024 123 4567, or include your country code."),
    email: emailSchema,
    organisation: z.string().max(150),
    country: z.string().length(2),
  })
  .superRefine((v, ctx) => {
    if (v.request_type === "corporate" && !v.organisation.trim()) {
      ctx.addIssue({ code: "custom", path: ["organisation"], message: "Tell us the company or institution name." });
    }
    if (v.needed_by && v.needed_by < new Date().toISOString().slice(0, 10)) {
      ctx.addIssue({ code: "custom", path: ["needed_by"], message: "Choose a date in the future." });
    }
  });

type Values = z.input<typeof schema>;

export function CustomRequestForm() {
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      request_type: "group",
      need: "both",
      occasion: "",
      colours: "",
      quantity: 1,
      needed_by: "",
      budget: "",
      details: "",
      full_name: "",
      phone: "",
      email: "",
      organisation: "",
      country: "GH",
    },
  });
  const { register, handleSubmit, formState, control, getValues, setError: setFieldError } = form;
  const errors = formState.errors;
  const [type, need] = useWatch({ control, name: ["request_type", "need"] });

  const onSubmit = handleSubmit(async (raw) => {
    const v = schema.parse(raw);
    setError("");
    try {
      const input: CustomRequestInput = { ...v, needed_by: v.needed_by || null, phone: normalisePhone(v.phone) };
      setReference(await submitCustomRequest(input));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) {
        Object.keys(err.fields).forEach((k) => k in raw && setFieldError(k as keyof Values, { message: err.fieldError(k) }));
      }
      setError((err as Error).message);
    }
  });

  if (reference) {
    const v = getValues();
    const summary = `Hello Fugu Tribe, I just sent custom request ${reference}: ${v.quantity} × ${NEEDS.find((n) => n.value === v.need)?.label.toLowerCase()}${v.colours ? `, colours: ${v.colours}` : ""}${v.needed_by ? `, needed by ${v.needed_by}` : ""}.`;
    return (
      <div className="rounded-3xl bg-white/80 p-8 text-center ring-1 ring-line sm:p-12" role="status">
        <CheckCircle2 className="mx-auto size-14 text-leaf" strokeWidth={1.5} />
        <p className="eyebrow mt-5 text-clay">Request {reference}</p>
        <h2 className="mt-3 text-3xl sm:text-4xl">Thank you, {v.full_name.split(" ")[0]}</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          We&apos;ll call or WhatsApp you on {v.phone} within one working day to agree colours, price and timing.
        </p>
        <a
          href={whatsappLink(summary)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#1f7a4d] px-6 font-medium text-white hover:bg-[#186640]"
        >
          <WhatsAppIcon className="size-5" /> Send photos or ideas on WhatsApp
        </a>
      </div>
    );
  }

  const quantityLabel = need === "cloth" ? "How many pieces of cloth?" : type === "individual" ? "How many outfits?" : "How many people?";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8 rounded-3xl bg-white/80 p-6 ring-1 ring-line sm:p-9">
      {error && <FormAlert>{error}</FormAlert>}

      <fieldset>
        <legend className="text-sm font-medium">Who is it for?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {TYPES.map(({ value, title, text, icon: Icon }) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 transition-colors has-[:checked]:border-ink has-[:checked]:ring-1 has-[:checked]:ring-ink",
                "border-line hover:border-ink/40",
              )}
            >
              <input type="radio" value={value} className="sr-only" {...register("request_type")} />
              <Icon className="size-5 text-clay" strokeWidth={1.75} />
              <span className="font-medium">{title}</span>
              <span className="text-xs text-muted">{text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">What do you need?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <label key={n.value} className="cursor-pointer">
              <input type="radio" value={n.value} className="peer sr-only" {...register("need")} />
              <span className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cotton peer-focus-visible:ring-2 peer-focus-visible:ring-indigo/40 hover:border-ink">
                {n.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Occasion" htmlFor="occasion" optional>
          <Select id="occasion" {...register("occasion")}>
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={quantityLabel} htmlFor="quantity" error={errors.quantity?.message}>
          <Input id="quantity" type="number" inputMode="numeric" min={1} aria-invalid={!!errors.quantity || undefined} {...register("quantity")} />
        </Field>
        <Field label="Colours or a design you like" htmlFor="colours" optional className="sm:col-span-2" hint="e.g. blush and gold, or like our Royal Volta cloth.">
          <Input id="colours" {...register("colours")} />
        </Field>
        <Field label="Needed by" htmlFor="needed_by" optional error={errors.needed_by?.message}>
          <Input id="needed_by" type="date" aria-invalid={!!errors.needed_by || undefined} {...register("needed_by")} />
        </Field>
        <Field label="Budget" htmlFor="budget" optional>
          <Input id="budget" placeholder="e.g. GH₵ 5,000" {...register("budget")} />
        </Field>
        <Field label="Anything else we should know?" htmlFor="details" optional className="sm:col-span-2" hint="Styles, sizes, logos for uniforms, or links to inspiration.">
          <Textarea id="details" rows={4} {...register("details")} />
        </Field>
      </div>

      <div className="border-t border-line pt-8">
        <h2 className="font-display text-2xl">Your details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
            <Input id="full_name" autoComplete="name" aria-invalid={!!errors.full_name || undefined} {...register("full_name")} />
          </Field>
          <Field label="Phone or WhatsApp" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" type="tel" autoComplete="tel" placeholder="024 123 4567" aria-invalid={!!errors.phone || undefined} {...register("phone")} />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email || undefined} {...register("email")} />
          </Field>
          <Field label="Country" htmlFor="country">
            <Select id="country" autoComplete="country" {...register("country")}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          {type === "corporate" && (
            <Field label="Company or institution" htmlFor="organisation" error={errors.organisation?.message} className="sm:col-span-2">
              <Input id="organisation" autoComplete="organization" aria-invalid={!!errors.organisation || undefined} {...register("organisation")} />
            </Field>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">No payment now. We&apos;ll confirm the price with you first.</p>
        <Button type="submit" size="lg" loading={formState.isSubmitting}>
          Send request
        </Button>
      </div>
    </form>
  );
}
