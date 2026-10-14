"use client";

import Link from "next/link";
import { useState } from "react";
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
  phone: z.string().trim().refine((v) => !v || GHANA_PHONE.test(normalisePhone(v)) || INTL_PHONE.test(normalisePhone(v)), "Enter a valid phone number."),
});

function ProfileForm({ user }: { user: User }) {
  const { authFetch, setUser } = useAuth();
  const [saved, setSaved] = useState(false);
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
          setSaved(true);
          toast({ title: "Profile saved", tone: "success" });
        } catch (err) {
          toast({ title: err instanceof ApiError ? err.message : "Couldn't save your profile", tone: "error" });
        }
      })}
    >
      <h2 className="text-2xl">Profile</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
          <Input id="full_name" autoComplete="name" {...register("full_name")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Email" htmlFor="email" hint="Contact us to change the email on your account.">
          <Input id="email" value={user.email} disabled readOnly />
        </Field>
        <Field label="Member since" htmlFor="since">
          <Input id="since" value={formatDate(user.date_joined, { month: "long", year: "numeric" })} disabled readOnly />
        </Field>
      </div>
      <Button type="submit" className="mt-6" loading={formState.isSubmitting} disabled={!formState.isDirty && saved}>
        Save changes
      </Button>
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
          <ul className="grid gap-4 sm:grid-cols-3">
            {LINKS.map(({ href, title, text, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full flex-col rounded-2xl bg-white/80 p-5 ring-1 ring-line transition hover:ring-ink/30">
                  <Icon className="size-5 text-clay" strokeWidth={1.75} />
                  <p className="mt-4 font-medium">{title}</p>
                  <p className="mt-1 flex-1 text-sm text-muted">{text}</p>
                  <ArrowRight className="mt-3 size-4 transition-transform group-hover:translate-x-1" />
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
