"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronDown, CreditCard, Lock, Pencil, ShoppingBag, Smartphone, Wallet } from "lucide-react";
import type { Address, DeliveryOption, PaymentMethod } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { siteConfig } from "@/lib/config";
import { formatGHS } from "@/lib/money";
import { COUNTRIES, GHANA_REGIONS, getDeliveryOptions, zoneFor } from "@/lib/shipping";
import { placeOrder } from "@/lib/checkout";
import { emailSchema, formatGhanaPhone, GHANA_PHONE, INTL_PHONE, normalisePhone } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/cart";
import { Button, LinkButton } from "@/components/ui/button";
import { Checkbox, Field, FormAlert, Input, Select, Textarea } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentMarks } from "@/components/ui/icons";
import { BLOCKING_WARNINGS } from "@/components/cart/cart-line";
import { OrderSummary } from "./order-summary";

const schema = z
  .object({
    email: emailSchema,
    phone: z.string().trim().min(1, "Enter a phone number for delivery updates."),
    full_name: z.string().trim().min(2, "Enter the recipient's full name."),
    country: z.string().min(1),
    region: z.string(),
    city: z.string().trim().min(2, "Enter your town or city."),
    line1: z.string().trim().min(3, "Enter a street address, area or GhanaPost digital address."),
    line2: z.string().trim(),
    postal_code: z.string().trim(),
    delivery_option: z.string().min(1, "Choose a delivery option."),
    payment_method: z.enum(["momo", "card", "pay_on_delivery"]),
    marketing_opt_in: z.boolean(),
    note: z.string().max(500),
  })
  .superRefine((v, ctx) => {
    const phone = normalisePhone(v.phone);
    if (v.country === "Ghana") {
      if (!GHANA_PHONE.test(phone)) ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter a Ghana number, like 024 123 4567." });
      if (!v.region) ctx.addIssue({ code: "custom", path: ["region"], message: "Choose your region." });
    } else if (!INTL_PHONE.test(phone)) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter your number with country code, like +44 7700 900123." });
    }
    if (v.payment_method === "pay_on_delivery" && zoneFor(v.country, v.region) !== "accra") {
      ctx.addIssue({ code: "custom", path: ["payment_method"], message: "Pay on delivery is only available in Accra and Tema." });
    }
  });

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { n: 1, title: "Contact", fields: ["email", "phone"] as const },
  { n: 2, title: "Delivery", fields: ["full_name", "country", "region", "city", "line1", "line2", "postal_code", "delivery_option"] as const },
  { n: 3, title: "Payment", fields: ["payment_method"] as const },
];

function StepHeader({ n, title, step, summary, onEdit }: { n: number; title: string; step: number; summary?: React.ReactNode; onEdit: () => void }) {
  const done = step > n;
  const active = step === n;
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold", done ? "bg-leaf text-cotton" : active ? "bg-ink text-cotton" : "bg-cotton-deep text-muted")}>
          {done ? <Check className="size-4" /> : n}
        </span>
        <div className="pt-0.5">
          <h2 id={`step-${n}-title`} className={cn("font-display text-2xl leading-tight", !active && !done && "text-muted")}>{title}</h2>
          {done && summary && <div className="mt-1.5 text-sm text-ink-soft">{summary}</div>}
        </div>
      </div>
      {done && (
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium underline-offset-4 hover:underline">
          <Pencil className="size-3.5" /> Edit
        </button>
      )}
    </div>
  );
}

const PAYMENT_OPTIONS: { value: PaymentMethod; title: string; text: string; icon: typeof Smartphone }[] = [
  { value: "momo", title: "Mobile Money", text: "MTN MoMo, Telecel Cash or AT Money. Approve the prompt on your phone.", icon: Smartphone },
  { value: "card", title: "Debit or credit card", text: "Visa or Mastercard, with 3-D Secure.", icon: CreditCard },
  { value: "pay_on_delivery", title: "Pay on delivery", text: "Accra & Tema only. Pay the rider by MoMo or cash.", icon: Wallet },
];

export function CheckoutView() {
  const router = useRouter();
  const cart = useCart((s) => s.cart);
  const cartStatus = useCart((s) => s.status);
  const clearCart = useCart((s) => s.clear);
  const loadCart = useCart((s) => s.load);
  const { user, access, authFetch } = useAuth();
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<{ key: string; list: DeliveryOption[] } | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [placing, setPlacing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      phone: "",
      full_name: "",
      country: "Ghana",
      region: "Greater Accra",
      city: "Accra",
      line1: "",
      line2: "",
      postal_code: "",
      delivery_option: "",
      payment_method: "momo",
      marketing_opt_in: false,
      note: "",
    },
  });
  const { register, handleSubmit, setValue, getValues, trigger, control, formState } = form;
  const errors = formState.errors;
  const [country, region, deliveryId, payment] = useWatch({ control, name: ["country", "region", "delivery_option", "payment_method"] });

  // Re-check stock and prices on arrival (FR-CART-3).
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Prefill from the signed-in customer and their default address (FR-UI-3: saved details).
  useEffect(() => {
    if (!user) return;
    if (!getValues("email")) setValue("email", user.email);
    if (!getValues("phone") && user.phone) setValue("phone", user.phone);
    if (!getValues("full_name") && user.full_name) setValue("full_name", user.full_name);
    authFetch<Address[]>("/me/addresses/")
      .then((list) => {
        setSavedAddresses(list);
        const preferred = list.find((a) => a.is_default) ?? list[0];
        if (preferred && !getValues("line1")) applyAddress(preferred);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function applyAddress(a: Address) {
    const opts = { shouldValidate: formState.isSubmitted };
    setValue("full_name", a.full_name || getValues("full_name"), opts);
    if (a.phone) setValue("phone", a.phone, opts);
    setValue("line1", a.line1, opts);
    setValue("line2", a.line2, opts);
    setValue("city", a.city, opts);
    setValue("region", a.region, opts);
    setValue("country", a.country || "Ghana", opts);
    setValue("postal_code", a.postal_code, opts);
  }

  // Delivery options and fees depend on where it's going (FR-CHK-3).
  const quoteKey = `${country}|${country === "Ghana" ? region : ""}`;
  const options = quote?.key === quoteKey ? quote.list : null;
  useEffect(() => {
    let live = true;
    const [c, r] = quoteKey.split("|");
    getDeliveryOptions(c, r)
      .then((list) => {
        if (!live) return;
        setQuote({ key: quoteKey, list });
        if (!list.some((o) => o.id === getValues("delivery_option"))) setValue("delivery_option", list[0]?.id ?? "");
      })
      .catch(() => live && setQuote({ key: quoteKey, list: [] }));
    return () => {
      live = false;
    };
  }, [quoteKey, getValues, setValue]);

  useEffect(() => {
    if (payment === "pay_on_delivery" && zoneFor(country, region) !== "accra") setValue("payment_method", "momo");
  }, [country, region, payment, setValue]);

  const delivery = useMemo(() => options?.find((o) => o.id === deliveryId) ?? null, [options, deliveryId]);
  const blocked = cart?.items.some((l) => l.warning && BLOCKING_WARNINGS.has(l.warning));
  const total = (cart?.total ?? 0) + (delivery?.fee ?? 0);

  async function next(n: number) {
    const ok = await trigger([...STEPS[n - 1].fields]);
    if (ok) {
      setStep(n + 1);
      requestAnimationFrame(() => document.getElementById(`step-${n + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!cart || !delivery) return;
    setPlacing(true);
    setSubmitError("");
    try {
      const result = await placeOrder(
        {
          email: values.email,
          phone: values.country === "Ghana" ? formatGhanaPhone(values.phone) : normalisePhone(values.phone),
          full_name: values.full_name,
          shipping_address: { line1: values.line1, line2: values.line2, city: values.city, region: values.region, country: values.country, postal_code: values.postal_code },
          delivery_option: values.delivery_option,
          payment_method: values.payment_method,
          marketing_opt_in: values.marketing_opt_in,
          note: values.note,
        },
        access,
        cart,
        delivery,
      );
      if (result.payment_url) {
        window.location.assign(result.payment_url);
        return;
      }
      await clearCart();
      router.replace(`/order/${result.order.number}/confirmation`);
    } catch (error) {
      setPlacing(false);
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        Object.entries(error.fields).forEach(([k, v]) => form.setError(k as keyof FormValues, { message: Array.isArray(v) ? v[0] : String(v) }));
      }
      setSubmitError((error as Error).message || "We couldn't place your order. Please try again.");
      loadCart();
    }
  });

  if (!cart && (cartStatus === "idle" || cartStatus === "loading")) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <ShoppingBag className="size-10 text-muted" strokeWidth={1.5} />
        <h1 className="mt-5 text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add a piece to your cart to check out.</p>
        <LinkButton href="/shop" className="mt-7">
          Browse the shop
        </LinkButton>
      </div>
    );
  }

  const card = "rounded-2xl bg-white/80 p-5 ring-1 ring-line sm:p-7";
  const addressSummary = [getValues("line1"), getValues("city"), getValues("country") === "Ghana" ? getValues("region") : getValues("country")].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Mobile order summary toggle */}
      <details className="group mb-6 rounded-2xl bg-white/80 ring-1 ring-line lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <ShoppingBag className="size-4" /> <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span> order summary
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </span>
          <span className="font-medium tabular-nums">{formatGHS(total)}</span>
        </summary>
        <div className="border-t border-line px-5 py-4">
          <OrderSummary cart={cart} delivery={delivery} />
        </div>
      </details>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <h1 className="sr-only">Checkout</h1>
          {!user && step === 1 && (
            <p className="mb-2 text-sm text-muted">
              Checking out as a guest.{" "}
              <Link href="/login?next=/checkout" className="font-medium text-ink underline underline-offset-4">
                Sign in
              </Link>{" "}
              for saved addresses and faster checkout.
            </p>
          )}

          {/* 1. Contact */}
          <section id="step-1" className={card} aria-labelledby="step-1-title">
            <StepHeader n={1} title="Contact" step={step} onEdit={() => setStep(1)} summary={<>{getValues("email")} · {getValues("phone")}</>} />
            {step === 1 && (
              <div className="mt-6 grid gap-5">
                <Field label="Email" htmlFor="email" error={errors.email?.message} hint="For your receipt and order updates.">
                  <Input id="email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email || undefined} {...register("email")} />
                </Field>
                <Field label="Phone" htmlFor="phone" error={errors.phone?.message} hint="Our rider calls this number. We may also send WhatsApp updates.">
                  <Input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="024 123 4567" aria-invalid={!!errors.phone || undefined} {...register("phone")} />
                </Field>
                <Checkbox label="Email me about new drops and offers. Unsubscribe any time." {...register("marketing_opt_in")} />
                <Button type="button" size="lg" className="mt-1 w-full sm:w-auto sm:self-start" onClick={() => next(1)}>
                  Continue to delivery
                </Button>
              </div>
            )}
          </section>

          {/* 2. Delivery */}
          <section id="step-2" className={card} aria-labelledby="step-2-title">
            <StepHeader
              n={2}
              title="Delivery"
              step={step}
              onEdit={() => setStep(2)}
              summary={
                <>
                  {getValues("full_name")}, {addressSummary}
                  <br />
                  {delivery?.name} · {delivery ? (delivery.fee ? formatGHS(delivery.fee, { compact: true }) : "Free") : ""}
                </>
              }
            />
            {step === 2 && (
              <div className="mt-6 grid gap-5">
                {savedAddresses.length > 0 && (
                  <Field label="Saved addresses" htmlFor="saved-address">
                    <Select id="saved-address" defaultValue="" onChange={(e) => { const a = savedAddresses.find((x) => String(x.id) === e.target.value); if (a) applyAddress(a); }}>
                      <option value="" disabled>
                        Choose a saved address
                      </option>
                      {savedAddresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.line1}, {a.city}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
                <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
                  <Input id="full_name" autoComplete="name" aria-invalid={!!errors.full_name || undefined} {...register("full_name")} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Country" htmlFor="country">
                    <Select id="country" autoComplete="country-name" {...register("country")}>
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                  {country === "Ghana" ? (
                    <Field label="Region" htmlFor="region" error={errors.region?.message}>
                      <Select id="region" autoComplete="address-level1" aria-invalid={!!errors.region || undefined} {...register("region")}>
                        {GHANA_REGIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </Select>
                    </Field>
                  ) : (
                    <Field label="State / county" htmlFor="region" optional>
                      <Input id="region" autoComplete="address-level1" {...register("region")} />
                    </Field>
                  )}
                </div>
                <Field label="Street address or GhanaPost GPS" htmlFor="line1" error={errors.line1?.message}>
                  <Input id="line1" autoComplete="address-line1" placeholder="e.g. 12 Oxford St, or GA-123-4567" aria-invalid={!!errors.line1 || undefined} {...register("line1")} />
                </Field>
                <Field label="Landmark, apartment or directions" htmlFor="line2" optional>
                  <Input id="line2" autoComplete="address-line2" placeholder="e.g. Opposite the Total filling station" {...register("line2")} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Town or city" htmlFor="city" error={errors.city?.message}>
                    <Input id="city" autoComplete="address-level2" aria-invalid={!!errors.city || undefined} {...register("city")} />
                  </Field>
                  <Field label="Postcode" htmlFor="postal_code" optional>
                    <Input id="postal_code" autoComplete="postal-code" {...register("postal_code")} />
                  </Field>
                </div>

                <fieldset className="mt-1">
                  <legend className="mb-3 text-sm font-medium">Delivery method</legend>
                  {options === null ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                  ) : options.length === 0 ? (
                    <FormAlert>We couldn&apos;t load delivery options for this address. Please check it, or contact us on WhatsApp.</FormAlert>
                  ) : (
                    <div className="space-y-2">
                      {options.map((o) => (
                        <label key={o.id} className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-line bg-white p-4 transition-colors has-[:checked]:border-ink has-[:checked]:ring-1 has-[:checked]:ring-ink">
                          <input type="radio" value={o.id} className="mt-1 size-[18px] accent-indigo" {...register("delivery_option")} />
                          <span className="flex-1">
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="font-medium">{o.name}</span>
                              <span className="font-medium tabular-nums">{o.fee ? formatGHS(o.fee, { compact: true }) : "Free"}</span>
                            </span>
                            <span className="mt-0.5 block text-sm text-muted">
                              {o.description} · {o.eta_days_min === o.eta_days_max ? `${o.eta_days_min} working day` : `${o.eta_days_min}–${o.eta_days_max} working days`}
                              {cart.made_to_order_lead_time_days ? ` after your made-to-order pieces are ready (about ${cart.made_to_order_lead_time_days} days)` : ""}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.delivery_option && <p className="mt-2 text-sm text-danger">{errors.delivery_option.message}</p>}
                </fieldset>

                <Field label="Note for your order" htmlFor="note" optional>
                  <Textarea id="note" rows={2} placeholder="Gift message, preferred delivery time…" {...register("note")} />
                </Field>

                <Button type="button" size="lg" className="w-full sm:w-auto sm:self-start" onClick={() => next(2)} disabled={!options?.length}>
                  Continue to payment
                </Button>
              </div>
            )}
          </section>

          {/* 3. Payment & review */}
          <section id="step-3" className={card} aria-labelledby="step-3-title">
            <StepHeader n={3} title="Payment" step={step} onEdit={() => setStep(3)} />
            {step === 3 && (
              <div className="mt-6 space-y-5">
                <fieldset>
                  <legend className="sr-only">Payment method</legend>
                  <div className="space-y-2">
                    {PAYMENT_OPTIONS.filter((p) => p.value !== "pay_on_delivery" || zoneFor(country, region) === "accra").map((p) => (
                      <label key={p.value} className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-line bg-white p-4 transition-colors has-[:checked]:border-ink has-[:checked]:ring-1 has-[:checked]:ring-ink">
                        <input type="radio" value={p.value} className="mt-1 size-[18px] accent-indigo" {...register("payment_method")} />
                        <p.icon className="mt-0.5 size-5 shrink-0 text-indigo" strokeWidth={1.75} />
                        <span>
                          <span className="block font-medium">{p.title}</span>
                          <span className="mt-0.5 block text-sm text-muted">{p.text}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.payment_method && <p className="mt-2 text-sm text-danger">{errors.payment_method.message}</p>}
                </fieldset>

                <div className="rounded-xl bg-cotton-deep/70 p-4 text-sm text-ink-soft">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    <Lock className="size-4 text-leaf" /> {payment === "pay_on_delivery" ? "No payment needed now" : "You'll pay on our secure payment page"}
                  </p>
                  <p className="mt-1">
                    {payment === "pay_on_delivery"
                      ? "We'll call to confirm before dispatch."
                      : `We never see or store your card or MoMo PIN. Your items are held for ${siteConfig.reservationMinutes} minutes while you pay.`}
                  </p>
                  <PaymentMarks className="mt-3 flex flex-wrap gap-1.5 text-muted" />
                </div>

                {blocked && <FormAlert>Some items in your cart are no longer available. Please update your cart before paying.</FormAlert>}
                {submitError && <FormAlert>{submitError}</FormAlert>}

                <Button type="submit" size="lg" className="h-14 w-full text-base" loading={placing} disabled={blocked || !delivery}>
                  {payment === "pay_on_delivery" ? "Place order" : `Pay ${formatGHS(total)}`}
                </Button>
                <p className="text-center text-xs text-muted">
                  By placing your order you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2">
                    terms of sale
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            )}
          </section>
        </form>

        <aside className="hidden rounded-2xl bg-white/80 p-6 ring-1 ring-line lg:sticky lg:top-8 lg:block" aria-label="Order summary">
          <h2 className="mb-5 text-2xl">Order summary</h2>
          <OrderSummary cart={cart} delivery={delivery} />
        </aside>
      </div>
    </div>
  );
}
