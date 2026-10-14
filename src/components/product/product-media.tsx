import Image from "next/image";
import type { ArtSpec } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

/** A real photo when one is uploaded, otherwise the generated strip-cloth artwork. */
export function ProductMedia({
  url,
  art,
  alt,
  sizes,
  priority,
  className,
}: {
  url: string | null | undefined;
  art?: ArtSpec;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (url) {
    return <Image src={url} alt={alt} fill sizes={sizes} priority={priority} quality={85} className={cn("object-cover", className)} />;
  }
  if (art) return <ProductArt spec={art} title={alt} className={className} />;
  return <div className={cn("h-full w-full bg-cotton-deep strip-weave opacity-30", className)} role="img" aria-label={alt} />;
}
