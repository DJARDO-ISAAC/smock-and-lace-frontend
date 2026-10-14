"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input } from "@/components/ui/form";
import { passwordSchema } from "@/lib/validation";

/** Optional account creation after a guest checkout (FR-CHK-1). */
export function CreateAccountCard({ email, fullName, phone }: { email: string; fullName: string; phone: string }) {
  const register = useAuth((s) => s.register);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  if (state === "done") {
    return (
      <div className="mt-6">
        <FormAlert tone="success">
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" /> Account created. Your next checkout will be faster.
          </span>
        </FormAlert>
      </div>
    );
  }

  return (
    <form
      className="mt-6 rounded-3xl bg-cotton-deep/70 p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const parsed = passwordSchema.safeParse(password);
        if (!parsed.success) {
          setError(parsed.error.issues[0].message);
          return;
        }
        setState("loading");
        setError("");
        try {
          await register({ email, password, full_name: fullName, phone });
          setState("done");
        } catch (err) {
          setState("idle");
          setError((err as Error).message);
        }
      }}
    >
      <h2 className="text-2xl">Save your details for next time</h2>
      <p className="mt-2 text-sm text-ink-soft">Create an account with {email} to track this order, save addresses and measurements, and check out faster.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="Choose a password" htmlFor="new-password" error={error} className="flex-1">
          <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error || undefined} />
        </Field>
        <Button type="submit" size="lg" className="h-12 rounded-lg" loading={state === "loading"}>
          Create account
        </Button>
      </div>
    </form>
  );
}
