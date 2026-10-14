import { formatGHS, percentOff } from "@/lib/money";
import { cn } from "@/lib/utils";

export function Price({
  amount,
  compareAt,
  size = "md",
  className,
  showSaving,
}: {
  amount: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showSaving?: boolean;
}) {
  const off = percentOff(amount, compareAt);
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 tabular-nums", sizes[size], className)}>
      <span className={cn("font-medium", off && "text-clay")}>
        {off ? <span className="sr-only">Sale price </span> : null}
        {formatGHS(amount, { compact: size !== "lg" })}
      </span>
      {off ? (
        <>
          <s className="text-[0.85em] text-muted">
            <span className="sr-only">Was </span>
            {formatGHS(compareAt!, { compact: size !== "lg" })}
          </s>
          {showSaving && <span className="text-xs font-semibold text-clay">Save {off}%</span>}
        </>
      ) : null}
    </span>
  );
}
