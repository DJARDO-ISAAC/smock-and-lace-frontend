"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { emailSchema, GHANA_PHONE, INTL_PHONE, normalisePhone, passwordSchema } from "@/lib/validation";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/form";
import { PasswordInput, safeNext } from "./login-form";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name."),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .refine((v) => !v || GHANA_PHONE.test(normalisePhone(v)) || INTL_PHONE.test(normalisePhone(v)), "Enter a valid phone number, like 024 123 4567."),
  password: passwordSchema,
});
type Values = z.infer<typeof schema>;

export function RegisterForm() {
  const registerUser = useAuth((s) => s.register);
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState("");
  const { register, handleSubmit, formState, setError: setFieldError } = useForm<Values>({ resolver: zodResolver(schema) });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      await registerUser({ ...values, phone: normalisePhone(values.phone) });
      router.replace(next);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) {
        Object.keys(err.fields).forEach((k) => k in values && setFieldError(k as keyof Values, { message: err.fieldError(k) }));
        if (err.fields.non_field_errors) setError(String(err.fieldError("non_field_errors")));
      } else setError((err as Error).message);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <FormAlert>{error}</FormAlert>}
      <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
        <Input id="full_name" autoComplete="name" aria-invalid={!!errors.full_name || undefined} {...register("full_name")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email || undefined} {...register("email")} />
      </Field>
      <Field label="Phone" htmlFor="phone" optional error={errors.phone?.message} hint="For delivery calls and WhatsApp updates.">
        <Input id="phone" type="tel" autoComplete="tel" placeholder="024 123 4567" aria-invalid={!!errors.phone || undefined} {...register("phone")} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters, not only numbers.">
        <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password || undefined} {...register("password")} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting}>
        Create account
      </Button>
      <p className="text-center text-xs text-muted">
        By creating an account you agree to our terms of sale and privacy policy.
      </p>
    </form>
  );
}
