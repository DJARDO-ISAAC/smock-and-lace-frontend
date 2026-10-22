"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Side = "right" | "left" | "bottom" | "center";

const panel: Record<Side, string> = {
  right: "ml-auto h-dvh max-h-dvh w-full max-w-md animate-slide-in-right",
  left: "mr-auto h-dvh max-h-dvh w-[88vw] max-w-sm animate-slide-in-left",
  bottom: "mt-auto max-h-[90dvh] w-full rounded-t-2xl animate-slide-up",
  center: "m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl rounded-2xl animate-slide-up",
};

/**
 * Native <dialog> (top layer, focus trap, Esc to close, inert page behind) styled as a drawer or modal.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  side = "center",
  children,
  footer,
  className,
  hideTitle,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: Side;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hideTitle?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Closing on unmount (e.g. navigating while hidden by <Activity>) keeps the page interactive.
  useEffect(() => {
    const dialog = ref.current;
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={hideTitle ? title : undefined}
      aria-labelledby={hideTitle ? undefined : titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // The dialog fills the viewport and positions the panel inside it. Tailwind's reset zeroes the browser's
      // margin: auto, which is what would otherwise centre a <dialog>, so a centred modal sat in the top-left corner.
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] open:flex"
    >
      <div className={cn("flex flex-col overflow-hidden bg-cotton shadow-lift", panel[side], className)}>
        {!hideTitle && (
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 id={titleId} className="font-display text-2xl">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/5" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line bg-cotton px-5 py-4 pb-safe sm:px-6">{footer}</div>}
      </div>
    </dialog>
  );
}
