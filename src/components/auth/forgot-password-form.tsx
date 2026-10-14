"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { emailSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/form";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  if (state === "sent") {
    return (
      <div className="rounded-2xl bg-leaf-soft p-6 text-leaf">
        <MailCheck className="size-8" strokeWidth={1.5} />
        <p className="mt-3 font-medium">Check your inbox</p>
        <p className="mt-1 text-sm">If an account exists for {email}, we&apos;ve sent a link to reset your password. It expires in one hour.</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = emailSchema.safeParse(email);
        if (!parsed.success) {
          setFieldError(parsed.error.issues[0].message);
          return;
        }
        setFieldError("");
        setError("");
        setState("loading");
        try {
          await apiFetch("/auth/password-reset/", { method: "POST", body: { email: parsed.data } });
          setState("sent");
        } catch (err) {
          setState("idle");
          setError((err as Error).message);
        }
      }}
    >
      {error && <FormAlert>{error}</FormAlert>}
      <Field label="Email" htmlFor="email" error={fieldError}>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fieldError || undefined} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={state === "loading"}>
        Send reset link
      </Button>
    </form>
  );
}
