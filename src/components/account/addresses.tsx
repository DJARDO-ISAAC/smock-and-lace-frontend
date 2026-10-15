"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Plus } from "lucide-react";
import type { Address } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { COUNTRIES, GHANA_REGIONS, countryName } from "@/lib/shipping";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, FormAlert, Input, Select } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountShell } from "./account-shell";
import { useOwned } from "./use-owned";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter the recipient's name."),
  phone: z.string().trim().min(7, "Enter a phone number."),
  line1: z.string().trim().min(3, "Enter a street address or GhanaPost GPS."),
  line2: z.string().trim(),
  city: z.string().trim().min(2, "Enter a town or city."),
  region: z.string().trim(),
  country: z.string().min(1),
  postal_code: z.string().trim(),
  is_default: z.boolean(),
});
type Values = z.infer<typeof schema>;

const EMPTY: Values = { full_name: "", phone: "", line1: "", line2: "", city: "Accra", region: "Greater Accra", country: "GH", postal_code: "", is_default: false };

function AddressForm({ initial, onSubmit, onCancel }: { initial: Values; onSubmit: (v: Values) => Promise<void>; onCancel: () => void }) {
  const [error, setError] = useState("");
  const { register, handleSubmit, formState, watch, setError: setFieldError } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: initial });
  const errors = formState.errors;
  const country = watch("country");
  return (
    <form
      noValidate
      className="grid gap-5 p-5 sm:p-6"
      onSubmit={handleSubmit(async (v) => {
        try {
          await onSubmit(v);
        } catch (err) {
          if (err instanceof ApiError) Object.keys(err.fields).forEach((k) => setFieldError(k as keyof Values, { message: err.fieldError(k) }));
          setError((err as Error).message);
        }
      })}
    >
      {error && <FormAlert>{error}</FormAlert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="a-name" error={errors.full_name?.message}>
          <Input id="a-name" autoComplete="name" {...register("full_name")} />
        </Field>
        <Field label="Phone" htmlFor="a-phone" error={errors.phone?.message}>
          <Input id="a-phone" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
      </div>
      <Field label="Street address or GhanaPost GPS" htmlFor="a-line1" error={errors.line1?.message}>
        <Input id="a-line1" autoComplete="address-line1" {...register("line1")} />
      </Field>
      <Field label="Landmark or apartment" htmlFor="a-line2" optional>
        <Input id="a-line2" autoComplete="address-line2" {...register("line2")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Country" htmlFor="a-country">
          <Select id="a-country" {...register("country")}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={country === "GH" ? "Region" : "State / county"} htmlFor="a-region">
          {country === "GH" ? (
            <Select id="a-region" {...register("region")}>
              {GHANA_REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          ) : (
            <Input id="a-region" {...register("region")} />
          )}
        </Field>
        <Field label="Town or city" htmlFor="a-city" error={errors.city?.message}>
          <Input id="a-city" autoComplete="address-level2" {...register("city")} />
        </Field>
        <Field label="Postcode" htmlFor="a-postcode" optional>
          <Input id="a-postcode" autoComplete="postal-code" {...register("postal_code")} />
        </Field>
      </div>
      <Checkbox label="Use as my default address" {...register("is_default")} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={formState.isSubmitting}>
          Save address
        </Button>
      </div>
    </form>
  );
}

export function Addresses() {
  const { items, error, save, remove } = useOwned<Address>("/me/addresses/");
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  return (
    <AccountShell
      active="/account/addresses"
      title="Addresses"
      description="Saved addresses fill in automatically at checkout."
      action={
        <Button onClick={() => setEditing("new")} icon={<Plus className="size-4" />}>
          Add address
        </Button>
      }
    >
      {error && <FormAlert>{error}</FormAlert>}
      {items === null ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <MapPin className="size-9 text-muted" strokeWidth={1.5} />
          <p className="mt-4 font-display text-2xl">No saved addresses yet</p>
          <p className="mt-2 text-sm text-muted">Add one now, or it will be saved when you check out.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((a) => (
            <li key={a.id} className="flex flex-col rounded-2xl bg-white/80 p-6 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{a.full_name}</p>
                {a.is_default && <span className="rounded-full bg-leaf-soft px-2.5 py-0.5 text-xs font-medium text-leaf">Default</span>}
              </div>
              <address className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft not-italic">
                {a.line1}
                {a.line2 && <>, {a.line2}</>}
                <br />
                {a.city}, {a.region}
                <br />
                {countryName(a.country)}
                <br />
                {a.phone}
              </address>
              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <button type="button" onClick={() => setEditing(a)} className="font-medium underline underline-offset-4">
                  Edit
                </button>
                {!a.is_default && (
                  <button type="button" onClick={() => save({ is_default: true }, a.id).catch((e) => toast({ title: e.message, tone: "error" }))} className="underline underline-offset-4">
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this address?")) remove(a.id).then(() => toast({ title: "Address deleted" }), (e) => toast({ title: e.message, tone: "error" }));
                  }}
                  className="text-danger underline underline-offset-4"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add an address" : "Edit address"}>
        {editing !== null && (
          <AddressForm
            key={editing === "new" ? "new" : editing.id}
            initial={editing === "new" ? EMPTY : { ...EMPTY, ...editing }}
            onCancel={() => setEditing(null)}
            onSubmit={async (v) => {
              await save(v, editing === "new" ? undefined : editing.id);
              setEditing(null);
              toast({ title: "Address saved", tone: "success" });
            }}
          />
        )}
      </Dialog>
    </AccountShell>
  );
}
