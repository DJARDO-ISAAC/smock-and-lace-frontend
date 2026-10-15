"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, MapPin, Package, Ruler } from "lucide-react";
import type { User } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { GHANA_PHONE, INTL_PHONE, normalisePhone } from "@/lib/validation";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/stores/auth";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { AccountShell } from "./account-shell";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name."),
  phone: z.string().trim().refine((v) => !v || GHANA_PHONE.test(normalisePhone(v)) || INTL_PHONE.test(normalisePhone(v)), "Enter a Ghana number like 024 123 4567, or include your country code, like +44 7700 900123."),
});

function ProfileForm({ user }: { user: User }) {
  const { authFetch, setUser } = useAuth();
  const { register, handleSubmit, formState, reset } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), values: { full_name: user.full_name, phone: user.phone } });
  const errors = formState.errors;
  return (
    <form
      noValidate
      className="rounded-2xl bg-white/80 p-6 ring-1 ring-line sm:p-8"
      onSubmit={handleSubmit(async (values) => {
        try {
          const updated = await authFetch<User>("/me/", { method: "PATCH", body: { ...values, phone: normalisePhone(values.phone) } });
          setUser(updated);
          reset({ full_name: updated.full_name, phone: updated.phone });
          toast({ title: "Profile saved", tone: "success" });
        } catch (err) {
          toast({ title: err instanceof ApiError ? err.message : "Couldn't save your profile", tone: "error" });
        }
      })}
    >
      <h2 className="text-2xl">Profile</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
          <Input id="full_name" autoComplete="name" aria-invalid={!!errors.full_name || undefined} {...register("full_name")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone || undefined} {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="email" hint="Contact us to change the email on your account.">
          <Input id="email" value={user.email} disabled readOnly />
        </Field>
        <Field label="Member since" htmlFor="since">
          <Input id="since" value={formatDate(user.date_joined, { month: "long", year: "numeric" })} disabled readOnly />
        </Field>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
        <Button type="submit" loading={formState.isSubmitting} disabled={!formState.isDirty}>
          {formState.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        <p className="text-sm text-muted" aria-live="polite">
          {formState.isDirty ? "You have unsaved changes." : "Your details are up to date."}
        </p>
      </div>
    </form>
  );
}

const LINKS = [
  { href: "/account/orders", title: "Orders", text: "Track deliveries and made-to-order progress", icon: Package },
  { href: "/account/addresses", title: "Addresses", text: "Saved for faster checkout", icon: MapPin },
  { href: "/account/measurements", title: "Measurements", text: "For made-to-measure pieces", icon: Ruler },
];

export function AccountOverview() {
  const user = useAuth((s) => s.user);
  return (
    <AccountShell active="/account" title={user ? `Hello, ${user.full_name.split(" ")[0] || "there"}` : "Your account"}>
      {user && (
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {LINKS.map(({ href, title, text, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full items-center gap-4 rounded-2xl bg-white/80 p-4 ring-1 ring-line transition hover:ring-ink/30 sm:flex-col sm:items-start sm:gap-0 sm:p-5">
                  <Icon className="size-5 shrink-0 text-clay" strokeWidth={1.75} />
                  <div className="min-w-0 flex-1 sm:mt-4">
                    <p className="font-medium">{title}</p>
                    <p className="mt-0.5 text-sm text-muted sm:mt-1">{text}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1 sm:mt-3" />
                </Link>
              </li>
            ))}
          </ul>
          <ProfileForm user={user} />
        </div>
      )}
    </AccountShell>
  );
}
