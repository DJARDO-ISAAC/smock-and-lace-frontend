"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Newsletter signup with explicit consent (FR-CON-3, NFR-PRIV-1). */
export function NewsletterForm({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const dark = tone === "dark";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      if (siteConfig.dataSource === "api") {
        await apiFetch("/newsletter/", { method: "POST", body: { email, consent: true } });
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }
      setState("done");
    } catch (error) {
      setState("error");
      setMessage((error as Error).message);
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={cn("flex items-center gap-2 text-sm", dark ? "text-cotton" : "text-leaf", className)}>
        <Check className="size-4" /> You&apos;re on the list. Watch your inbox for new drops.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div className={cn("flex items-center rounded-full border p-1 pl-5 transition-colors focus-within:ring-3", dark ? "border-cotton/25 bg-cotton/5 focus-within:border-cotton/60 focus-within:ring-cotton/10" : "border-line bg-white focus-within:border-indigo focus-within:ring-indigo/10")}>
        <label htmlFor={`newsletter-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${tone}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={cn("h-10 min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none", dark ? "text-cotton placeholder:text-cotton/50" : "placeholder:text-muted/70")}
        />
        <button type="submit" disabled={state === "loading"} className={cn("inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors disabled:opacity-60", dark ? "bg-cotton text-indigo hover:bg-white" : "bg-indigo text-cotton hover:bg-indigo-deep")}>
          Subscribe <ArrowRight className="size-4" />
        </button>
      </div>
      <p className={cn("mt-2.5 text-xs", dark ? "text-cotton/60" : "text-muted")}>
        {state === "error" ? <span className="text-clay-soft">{message}</span> : "By subscribing you agree to receive emails from us. Unsubscribe at any time."}
      </p>
    </form>
  );
}
