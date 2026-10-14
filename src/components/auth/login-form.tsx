"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { emailSchema } from "@/lib/validation";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/form";

const schema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password.") });

/** Only allow same-site relative redirects after login. */
export function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} className="pr-12" />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function LoginForm() {
  const login = useAuth((s) => s.login);
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const errors = formState.errors;

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError("");
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setError("That email and password don't match. Check them and try again.");
      else if (err instanceof ApiError && err.status === 429) setError("Too many attempts. Please wait a minute and try again.");
      else setError((err as Error).message);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <FormAlert>{error}</FormAlert>}
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email || undefined} {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="current-password" aria-invalid={!!errors.password || undefined} {...register("password")} />
      </Field>
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
