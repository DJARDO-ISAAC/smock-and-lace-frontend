"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Camera, Star, X } from "lucide-react";
import type { ReviewStatus } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, Input, Textarea } from "@/components/ui/form";
import { useAuth } from "@/stores/auth";

const MAX_PHOTOS = 4;
const MAX_PHOTO_MB = 5;
const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-8 text-center text-muted sm:p-10">
      {children}
    </div>
  );
}

/** Review box on product pages: the form for customers who received the piece, otherwise why they can't review yet. */
export function ReviewForm({ slug }: { slug: string }) {
  const status = useAuth((s) => s.status);
  const authFetch = useAuth((s) => s.authFetch);
  const [state, setState] = useState<ReviewStatus | null>(null);
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    if (siteConfig.dataSource !== "api" || status !== "authenticated") return;
    let live = true;
    authFetch<ReviewStatus>(
      `/products/${encodeURIComponent(slug)}/review-status/`,
    )
      .then((s) => live && setState(s))
      .catch(() => live && setState(null));
    return () => {
      live = false;
    };
  }, [slug, status, authFetch]);

  if (siteConfig.dataSource !== "api")
    return (
      <Panel>Bought this piece? Your review will help others choose.</Panel>
    );
  if (status === "unknown") return <Panel>&nbsp;</Panel>;
  if (status === "anonymous") {
    return (
      <Panel>
        <p>Bought this piece? Your review will help others choose.</p>
        <Link
          href={`/login?next=${encodeURIComponent(`/products/${slug}#reviews`)}`}
          className="mt-3 inline-block font-medium text-ink underline underline-offset-4"
        >
          Sign in to write a review
        </Link>
      </Panel>
    );
  }
  if (!state) return <Panel>&nbsp;</Panel>;
  if (state.reason === "already_reviewed") {
    return (
      <Panel>
        {state.review?.is_approved
          ? "Thank you for reviewing this piece."
          : "Thank you! Your review is with our team for a quick check, and will appear here soon."}
      </Panel>
    );
  }
  if (!state.can_review)
    return (
      <Panel>
        Reviews open once your order with this piece has been delivered.
      </Panel>
    );
  if (!writing) {
    return (
      <Panel>
        <p>You&apos;ve received this piece. How did you find it?</p>
        <Button className="mt-4" onClick={() => setWriting(true)}>
          Write a review
        </Button>
      </Panel>
    );
  }
  return (
    <Composer
      slug={slug}
      onDone={setState}
      onCancel={() => setWriting(false)}
    />
  );
}

function Composer({
  slug,
  onDone,
  onCancel,
}: {
  slug: string;
  onDone: (s: ReviewStatus) => void;
  onCancel: () => void;
}) {
  const authFetch = useAuth((s) => s.authFetch);
  const id = useId();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // Each photo keeps a local preview URL, released when it is removed or the form goes away.
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const previewUrls = useRef(new Set<string>());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const addPhotos = (files: FileList | null) => {
    const picked = Array.from(files ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    const tooBig = picked.find((f) => f.size > MAX_PHOTO_MB * 1024 * 1024);
    setErrors((e) => ({
      ...e,
      photos: tooBig ? `${tooBig.name} is larger than ${MAX_PHOTO_MB} MB.` : "",
    }));
    const room = MAX_PHOTOS - photos.length;
    const added = picked
      .filter((f) => f.size <= MAX_PHOTO_MB * 1024 * 1024)
      .slice(0, Math.max(room, 0))
      .map((file) => {
        const url = URL.createObjectURL(file);
        previewUrls.current.add(url);
        return { file, url };
      });
    setPhotos([...photos, ...added]);
  };

  const removePhoto = (index: number) => {
    const { url } = photos[index];
    URL.revokeObjectURL(url);
    previewUrls.current.delete(url);
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const problems: Record<string, string> = {};
    if (!rating) problems.rating = "Choose a star rating.";
    if (body.trim().length < 10)
      problems.body = "Tell us a little more (at least 10 characters).";
    setErrors(problems);
    if (Object.keys(problems).length) return;

    const form = new FormData();
    form.append("rating", String(rating));
    form.append("title", title.trim());
    form.append("body", body.trim());
    photos.forEach((p) => form.append("photos", p.file));
    setSending(true);
    try {
      onDone(
        await authFetch<ReviewStatus>(
          `/products/${encodeURIComponent(slug)}/reviews/`,
          { method: "POST", body: form },
        ),
      );
    } catch (error) {
      const e = error instanceof ApiError ? error : null;
      setErrors({
        form: e?.message ?? "Something went wrong. Please try again.",
        body: e?.fieldError("body") ?? "",
        photos: e?.fieldError("photos") ?? "",
      });
    } finally {
      setSending(false);
    }
  };

  const shown = hover || rating;
  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-line bg-white/70 p-6 sm:p-8"
      noValidate
    >
      <div>
        <h3 className="font-display text-2xl">Write a review</h3>
        <p className="mt-1 text-sm text-muted">
          Our team checks every review before it appears.
        </p>
      </div>
      {errors.form && <FormAlert>{errors.form}</FormAlert>}

      <fieldset>
        <legend className="text-sm font-medium text-ink">Your rating</legend>
        <div
          className="mt-2 flex items-center gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer"
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name={`${id}-rating`}
                value={n}
                checked={rating === n}
                onChange={() => (setRating(n), setErrors((e) => ({ ...e, rating: "" })))}
                className="peer sr-only"
              />
              <span className="sr-only">{`${n} star${n === 1 ? "" : "s"}, ${RATING_WORDS[n]}`}</span>
              <Star
                aria-hidden
                className={cn(
                  "size-8 rounded-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-indigo",
                  n <= shown ? "fill-kola text-kola" : "text-line",
                )}
              />
            </label>
          ))}
          <span className="ml-3 text-sm text-muted">{RATING_WORDS[shown]}</span>
        </div>
        {errors.rating && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <Field label="Title" htmlFor={`${id}-title`} optional>
        <Input
          id={`${id}-title`}
          value={title}
          maxLength={150}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Perfect for our wedding"
        />
      </Field>

      <Field
        label="Your review"
        htmlFor={`${id}-body`}
        error={errors.body}
        hint="How was the cloth, the colours, the fit? What did you wear it for?"
      >
        <Textarea
          id={`${id}-body`}
          value={body}
          maxLength={2000}
          rows={5}
          aria-invalid={!!errors.body || undefined}
          onChange={(e) => (setBody(e.target.value), e.target.value.trim().length >= 10 && setErrors((er) => ({ ...er, body: "" })))}
        />
      </Field>

      <Field
        label="Photos"
        htmlFor={`${id}-photos`}
        optional
        error={errors.photos}
        hint={`Up to ${MAX_PHOTOS} photos, ${MAX_PHOTO_MB} MB each.`}
      >
        <div className="flex flex-wrap gap-3">
          {photos.map(({ url }, i) => (
            <div
              key={url}
              className="relative size-20 overflow-hidden rounded-lg ring-1 ring-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file not yet uploaded */}
              <img
                src={url}
                alt={`Photo ${i + 1}`}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-ink/70 text-cotton"
                aria-label={`Remove photo ${i + 1}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label
              htmlFor={`${id}-photos`}
              className="grid size-20 cursor-pointer place-items-center rounded-lg border border-dashed border-ink/25 text-muted hover:border-ink hover:text-ink"
            >
              <Camera className="size-5" />
              <span className="sr-only">Add photos</span>
              <input
                id={`${id}-photos`}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => (
                  addPhotos(e.target.files),
                  (e.target.value = "")
                )}
              />
            </label>
          )}
        </div>
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={sending}>
          Send review
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={sending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
