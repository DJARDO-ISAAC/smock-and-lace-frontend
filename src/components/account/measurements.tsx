"use client";

import { useState } from "react";
import { Plus, Ruler } from "lucide-react";
import type { Measurement } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, FormAlert, Input, Textarea } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountShell } from "./account-shell";
import { useOwned } from "./use-owned";

const FIELDS = [
  { key: "chest", label: "Chest / bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "length", label: "Garment length" },
  { key: "height", label: "Height" },
] as const;

type Draft = Record<string, string>;

function MeasurementForm({ initial, onSubmit, onCancel }: { initial: Draft; onSubmit: (d: Draft) => Promise<void>; onCancel: () => void }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="grid gap-5 p-5 sm:p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!draft.label?.trim()) {
          setErrors({ label: "Give these measurements a name, like “Me” or “My husband”." });
          return;
        }
        setBusy(true);
        try {
          await onSubmit(draft);
        } catch (err) {
          setErrors(err instanceof ApiError ? Object.fromEntries(Object.keys(err.fields).map((k) => [k, err.fieldError(k) ?? ""])) : {});
          if (!(err instanceof ApiError) || !Object.keys(err.fields).length) setErrors({ form: (err as Error).message });
        } finally {
          setBusy(false);
        }
      }}
    >
      {errors.form && <FormAlert>{errors.form}</FormAlert>}
      <Field label="Name" htmlFor="m-label" error={errors.label}>
        <Input id="m-label" value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. Me" />
      </Field>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {FIELDS.map((f) => (
          <Field key={f.key} label={`${f.label} (cm)`} htmlFor={`m-${f.key}`} error={errors[f.key]}>
            <Input id={`m-${f.key}`} inputMode="decimal" value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value.replace(/[^0-9.]/g, "") })} />
          </Field>
        ))}
      </div>
      <Field label="Notes for the tailor" htmlFor="m-notes" optional>
        <Textarea id="m-notes" rows={2} value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
      </Field>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save measurements
        </Button>
      </div>
    </form>
  );
}

export function Measurements() {
  const { items, error, save, remove } = useOwned<Measurement>("/me/measurements/");
  const [editing, setEditing] = useState<Measurement | "new" | null>(null);

  const toDraft = (m: Measurement): Draft => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v == null ? "" : String(v)]));
  const fromDraft = (d: Draft) => ({ label: d.label.trim(), notes: d.notes ?? "", ...Object.fromEntries(FIELDS.map((f) => [f.key, d[f.key] ? d[f.key] : null])) });

  return (
    <AccountShell
      active="/account/measurements"
      title="Measurements"
      description="Saved measurements for made-to-measure pieces. Measure over light clothing, in centimetres."
      action={
        <Button onClick={() => setEditing("new")} icon={<Plus className="size-4" />}>
          Add measurements
        </Button>
      }
    >
      {error && <FormAlert>{error}</FormAlert>}
      {items === null ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <Ruler className="size-9 text-muted" strokeWidth={1.5} />
          <p className="mt-4 font-display text-2xl">No measurements saved</p>
          <p className="mt-2 max-w-sm text-sm text-muted">Save measurements for yourself or family members, and pick them when ordering made-to-measure pieces.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((m) => (
            <li key={m.id} className="rounded-2xl bg-white/80 p-6 ring-1 ring-line">
              <p className="font-display text-2xl">{m.label}</p>
              <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
                {FIELDS.map((f) => (
                  <div key={f.key}>
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="tabular-nums">{m[f.key] ? `${m[f.key]} cm` : "—"}</dd>
                  </div>
                ))}
              </dl>
              {m.notes && <p className="mt-4 text-sm text-ink-soft">{m.notes}</p>}
              <div className="mt-5 flex gap-4 text-sm">
                <button type="button" onClick={() => setEditing(m)} className="font-medium underline underline-offset-4">
                  Edit
                </button>
                <button type="button" onClick={() => confirm(`Delete “${m.label}”?`) && remove(m.id).catch((e) => toast({ title: e.message, tone: "error" }))} className="text-danger underline underline-offset-4">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add measurements" : "Edit measurements"}>
        {editing !== null && (
          <MeasurementForm
            key={editing === "new" ? "new" : editing.id}
            initial={editing === "new" ? {} : toDraft(editing)}
            onCancel={() => setEditing(null)}
            onSubmit={async (d) => {
              await save(fromDraft(d) as Partial<Measurement>, editing === "new" ? undefined : editing.id);
              setEditing(null);
              toast({ title: "Measurements saved", tone: "success" });
            }}
          />
        )}
      </Dialog>
    </AccountShell>
  );
}
