import { BadgeCheck } from "lucide-react";
import type { ProductDetail } from "@/lib/api/types";
import { Stars } from "@/components/ui/rating";
import { formatDate } from "@/lib/utils";
import { ReviewForm } from "./review-form";

export function Reviews({ product }: { product: ProductDetail }) {
  const { reviews, rating_average: avg, rating_count: count } = product;
  const dist = [5, 4, 3, 2, 1].map((star) => ({ star, n: reviews.filter((r) => r.rating === star).length }));

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div>
          <h2 id="reviews-heading" className="text-3xl">
            Reviews
          </h2>
          {avg && count ? (
            <>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-display text-5xl leading-none">{avg.toFixed(1)}</span>
                <div className="pb-1">
                  <Stars value={avg} size={16} />
                  <p className="mt-1 text-sm text-muted">Based on {count} reviews</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2" aria-label="Rating breakdown of recent reviews">
                {dist.map((d) => (
                  <li key={d.star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 tabular-nums text-muted">{d.star}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cotton-deep">
                      <span className="block h-full rounded-full bg-kola" style={{ width: `${reviews.length ? (d.n / reviews.length) * 100 : 0}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-muted">No reviews yet.</p>
          )}
          <p className="mt-6 text-sm text-muted">Only verified buyers can review. Every review is checked by our team before it appears.</p>
        </div>

        <div className="space-y-8">
          <ReviewForm slug={product.slug} />
          {reviews.length > 0 && (
            <ul className="divide-y divide-line border-y border-line">
              {reviews.map((r) => (
                <li key={r.id} className="py-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Stars value={r.rating} />
                    <time dateTime={r.created_at} className="text-sm text-muted">
                      {formatDate(r.created_at)}
                    </time>
                  </div>
                  {r.title && <h3 className="mt-3 font-sans text-base font-semibold">{r.title}</h3>}
                  <p className="mt-2 leading-relaxed text-ink-soft">{r.body}</p>
                  {r.photos && r.photos.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Customer photos">
                      {r.photos.map((url, i) => (
                        <li key={url}>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="block size-20 overflow-hidden rounded-lg ring-1 ring-line hover:ring-ink sm:size-24">
                            {/* eslint-disable-next-line @next/next/no-img-element -- customer uploads from any media host */}
                            <img src={url} alt={`Photo ${i + 1} from ${r.author_name}`} loading="lazy" className="size-full object-cover" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <span className="font-medium text-ink">{r.author_name}</span> · {r.location}
                    {r.is_verified_buyer && (
                      <span className="inline-flex items-center gap-1 text-leaf">
                        <BadgeCheck className="size-4" /> Verified buyer
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
