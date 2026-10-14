"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useToasts } from "@/stores/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4 sm:top-auto sm:right-6 sm:bottom-6 sm:left-auto sm:items-end">
      {toasts.map((t) => (
        <div key={t.id} role="status" className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-start gap-3 rounded-xl bg-ink px-4 py-3.5 text-cotton shadow-lift">
          {t.tone === "error" ? <AlertCircle className="mt-0.5 size-5 shrink-0 text-clay-soft" /> : t.tone === "success" ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-leaf-soft" /> : null}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && <p className="mt-0.5 text-sm text-cotton/70">{t.description}</p>}
          </div>
          {t.action &&
            (t.action.href ? (
              <Link href={t.action.href} onClick={() => dismiss(t.id)} className="shrink-0 text-sm font-semibold underline underline-offset-4">
                {t.action.label}
              </Link>
            ) : (
              <button type="button" onClick={() => { t.action?.onClick?.(); dismiss(t.id); }} className="shrink-0 text-sm font-semibold underline underline-offset-4">
                {t.action.label}
              </button>
            ))}
          <button type="button" onClick={() => dismiss(t.id)} className={cn("-mr-1 shrink-0 rounded p-0.5 text-cotton/60 hover:text-cotton")} aria-label="Dismiss">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
