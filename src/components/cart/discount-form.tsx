"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/stores/cart";

export function DiscountForm() {
  const code = useCart((s) => s.cart?.discount_code ?? "");
  const apply = useCart((s) => s.applyDiscount);
  const removeCode = useCart((s) => s.removeDiscount);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (code) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-leaf-soft px-3 py-2 text-sm text-leaf">
        <span className="inline-flex items-center gap-2 font-medium">
          <Tag className="size-4" /> {code} applied
        </span>
        <button type="button" onClick={() => removeCode()} className="grid size-7 place-items-center rounded-full hover:bg-leaf/10" aria-label={`Remove code ${code}`}>
          <X className="size-4" />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-sm text-ink-soft underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
        <Tag className="size-4" /> Add a discount code
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        setLoading(true);
        setError("");
        try {
          await apply(value);
          setValue("");
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      }}
    >
      <label htmlFor="discount-code" className="sr-only">
        Discount code
      </label>
      <div className="flex gap-2">
        <input
          id="discount-code"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="Discount code"
          autoComplete="off"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "discount-error" : undefined}
          className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm tracking-wider uppercase outline-none focus:border-indigo aria-invalid:border-danger"
          autoFocus
        />
        <button type="submit" disabled={loading} className="h-11 rounded-lg bg-ink px-4 text-sm font-medium text-cotton transition-colors hover:bg-ink-soft disabled:opacity-60">
          {loading ? "Checking…" : "Apply"}
        </button>
      </div>
      {error && (
        <p id="discount-error" role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
