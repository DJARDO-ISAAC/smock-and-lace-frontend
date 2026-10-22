"use client";

import { useId, useState } from "react";
import type { Order, ReturnReason } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { siteConfig } from "@/lib/config";
import { useAuth } from "@/stores/auth";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, FormAlert, Select, Textarea } from "@/components/ui/form";

const REASONS: { value: ReturnReason; label: string }[] = [
  { value: "wrong_size", label: "Wrong size or fit" },
  { value: "not_as_expected", label: "Not as expected (colour or cloth)" },
  { value: "damaged", label: "Damaged or faulty" },
  { value: "wrong_item", label: "Wrong item sent" },
  { value: "changed_mind", label: "Changed my mind" },
  { value: "other", label: "Other" },
];

/** Delivered, inside the return window, and with something that isn't made to order. */
export function canRequestReturn(order: Order) {
  if (order.status !== "delivered") return false;
  if (order.items.every((i) => i.is_made_to_order)) return false;
  if (order.return_until !== undefined) return order.return_until !== null && Date.now() < new Date(order.return_until).getTime();
  const deliveredAt = order.status_history.find((h) => h.status === "delivered")?.at ?? order.created_at;
  return Date.now() - new Date(deliveredAt).getTime() < siteConfig.returnWindowDays * 86400000;
}

/** "Request a return" button and form for one order in the account's order history. */
export function ReturnRequest({ order, onRequested }: { order: Order; onRequested: (order: Order) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-9 items-center rounded-full border border-ink/20 px-4 text-sm font-medium hover:border-ink">
        Request a return
      </button>
      {open && <ReturnForm order={order} onClose={() => setOpen(false)} onRequested={onRequested} />}
    </>
  );
}

function ReturnForm({ order, onClose, onRequested }: { order: Order; onClose: () => void; onRequested: (order: Order) => void }) {
  const authFetch = useAuth((s) => s.authFetch);
  const id = useId();
  const returnable = order.items.map((item, index) => ({ item, index })).filter(({ item }) => !item.is_made_to_order);
  const [chosen, setChosen] = useState<Record<number, number>>(
    returnable.length === 1 ? { [returnable[0].index]: returnable[0].item.quantity } : {},
  );
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const toggle = (index: number, quantity: number) => {
    setError("");
    setChosen((c) => {
      const next = { ...c };
      if (next[index]) delete next[index];
      else next[index] = quantity;
      return next;
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const lines = Object.entries(chosen).map(([index, quantity]) => ({ item: order.items[Number(index)], quantity }));
    if (!lines.length) return setError("Choose at least one item to return.");
    if (!reason) return setError("Tell us why you're returning it.");
    if (siteConfig.dataSource === "api" && lines.some(({ item }) => item.id === undefined)) {
      // Order loaded from an API without item ids (an older version): fresh data has them.
      return setError("This page is out of date. Please refresh it and try again.");
    }
    setError("");
    if (siteConfig.dataSource !== "api") {
      toast({ title: "Return requested", description: "We'll be in touch within one working day.", tone: "success" });
      return onClose();
    }
    setSending(true);
    try {
      const updated = await authFetch<Order>(`/orders/${encodeURIComponent(order.number)}/return-request/`, {
        method: "POST",
        body: { items: lines.map(({ item, quantity }) => ({ id: item.id, quantity })), reason, note: note.trim() },
      });
      onRequested(updated);
      toast({ title: "Return requested", description: "We'll be in touch within one working day.", tone: "success" });
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const madeToOrder = order.items.filter((i) => i.is_made_to_order);
  return (
    <Dialog open onClose={onClose} title="Request a return" description={`Order ${order.number}`}>
      <form onSubmit={submit} className="space-y-6 p-5 sm:p-6" noValidate>
        {error && <FormAlert>{error}</FormAlert>}

        <fieldset>
          <legend className="text-sm font-medium text-ink">What are you returning?</legend>
          <ul className="mt-3 divide-y divide-line rounded-xl ring-1 ring-line">
            {returnable.map(({ item, index }) => {
              const selected = chosen[index] !== undefined;
              return (
                <li key={index} className="flex items-center justify-between gap-4 p-4">
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" checked={selected} onChange={() => toggle(index, item.quantity)} className="mt-0.5 size-[18px] shrink-0 accent-indigo" />
                    <span>
                      <span className="font-medium text-ink">{item.product_name}</span>
                      <span className="block text-muted">{[item.colour, item.size].filter(Boolean).join(" · ")}</span>
                    </span>
                  </label>
                  {selected && item.quantity > 1 && (
                    <Select
                      aria-label={`How many of ${item.product_name}`}
                      value={chosen[index]}
                      onChange={(e) => setChosen((c) => ({ ...c, [index]: Number(e.target.value) }))}
                      className="w-24"
                    >
                      {Array.from({ length: item.quantity }, (_, n) => n + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} of {item.quantity}
                        </option>
                      ))}
                    </Select>
                  )}
                </li>
              );
            })}
          </ul>
          {madeToOrder.length > 0 && (
            <p className="mt-2 text-sm text-muted">
              {madeToOrder.map((i) => i.product_name).join(", ")} {madeToOrder.length === 1 ? "was" : "were"} made for you, so{" "}
              {madeToOrder.length === 1 ? "it can't" : "they can't"} be returned, but we&apos;ll adjust the fit free.
            </p>
          )}
        </fieldset>

        <Field label="Reason" htmlFor={`${id}-reason`}>
          <Select id={`${id}-reason`} value={reason} onChange={(e) => (setReason(e.target.value as ReturnReason), setError(""))}>
            <option value="" disabled>
              Choose a reason
            </option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Anything we should know?" htmlFor={`${id}-note`} optional>
          <Textarea id={`${id}-note`} rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. The sleeves are too long" />
        </Field>

        <p className="rounded-xl bg-cotton-deep/70 p-4 text-sm text-ink-soft">
          Keep items unworn and unwashed with tags on; cloth must be uncut. We&apos;ll arrange pickup in Accra or send instructions, and refund to your
          original payment method within 5 working days of receiving them.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={sending}>
            Request return
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
