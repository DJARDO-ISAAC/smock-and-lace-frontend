import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className, size = "default" }: { children: ReactNode; className?: string; size?: "default" | "narrow" | "wide" }) {
  const widths = { narrow: "max-w-3xl", default: "max-w-7xl", wide: "max-w-[1600px]" };
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-10", widths[size], className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", align === "center" && "items-center text-center sm:flex-col sm:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3 text-clay">{eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {description && <p className="mt-4 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
