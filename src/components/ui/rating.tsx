import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ value, className, size = 14 }: { value: number; className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-kola", className)} aria-label={`Rated ${value.toFixed(1)} out of 5`} role="img">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i + 1));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden>
            <Star className="absolute inset-0 text-kola/30" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function RatingSummary({ average, count, className }: { average: number | null; count: number; className?: string }) {
  if (!average || !count) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm text-muted", className)}>
      <Stars value={average} />
      <span className="tabular-nums">
        {average.toFixed(1)} <span className="text-muted">({count})</span>
      </span>
    </span>
  );
}
