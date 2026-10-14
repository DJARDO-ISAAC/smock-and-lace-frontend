import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "link" | "clay";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 active:translate-y-px select-none";

const variants: Record<Variant, string> = {
  primary: "bg-indigo text-cotton hover:bg-indigo-deep shadow-[inset_0_-1px_0_rgb(0_0_0/0.2)]",
  clay: "bg-clay text-cotton hover:bg-clay-deep",
  secondary: "bg-cotton-deep text-ink hover:bg-sand",
  outline: "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink/[0.03]",
  ghost: "text-ink hover:bg-ink/5",
  link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink px-0 h-auto",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-6 text-[0.9375rem] rounded-full",
  lg: "h-13 px-8 text-base rounded-full",
  icon: "size-10 rounded-full",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; loading?: boolean; icon?: ReactNode };

export function Button({ variant, size, loading, icon, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Spinner className="size-4" /> : icon}
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
