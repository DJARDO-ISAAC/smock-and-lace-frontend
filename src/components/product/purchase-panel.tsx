"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Bell, Check, Clock, MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { ProductDetail, Variant } from "@/lib/api/types";
import { apiFetch } from "@/lib/api/client";
import { siteConfig, whatsappLink } from "@/lib/config";
import { formatGHS } from "@/lib/money";
import { useDeliveryEstimates } from "@/components/shipping/delivery-estimates";
import { formatEta } from "@/lib/shipping";
import { addDays, cn, formatDateRange } from "@/lib/utils";
import { MAX_QUANTITY_PER_LINE } from "@/lib/cart/backend";
import { useCart } from "@/stores/cart";
import { useSaved } from "@/stores/saved";
import { toast } from "@/stores/toast";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { RatingSummary } from "@/components/ui/rating";
import { QuantityStepper } from "@/components/ui/quantity";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SizeGuideButton } from "./size-guide";
import { WishlistButton } from "./wishlist-button";

const MEASUREMENT_FIELDS = [
  { key: "chest", label: "Chest / bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "length", label: "Garment length" },
];

const stockOf = (v: Variant | undefined) => (v ? v.available_quantity : undefined);
const isAvailable = (v: Variant | undefined) => Boolean(v && v.is_active && (v.available_quantity === null || v.available_quantity > 0));

/** "6 yards" from a piece length; "6.5 yards" keeps the half. */
export function yardsText(length: number | null | undefined) {
  if (!length) return "";
  const n = Number(length);
  return `${Number.isInteger(n) ? n : n.toFixed(1)} yard${n === 1 ? "" : "s"}`;
}

/** "6-yard" for "a 6-yard piece". */
function pieceText(length: number | null | undefined) {
  if (!length) return "";
  const n = Number(length);
  return `${Number.isInteger(n) ? n : n.toFixed(1)}-yard`;
}

function StockStatus({ variant, product }: { variant: Variant | undefined; product: ProductDetail }) {
  const isCloth = product.kind === "cloth";
  if (product.is_made_to_order) {
    return (
      <p className="flex items-center gap-2 text-sm text-indigo">
        <Clock className="size-4" /> Made to order. {isCloth ? "Weaving" : "Sewing"} starts when you order.
      </p>
    );
  }
  if (!variant) return null;
  const qty = stockOf(variant);
  if (!isAvailable(variant)) {
    return (
      <p className="flex items-center gap-2 text-sm text-danger">
        <span className="size-2 rounded-full bg-danger" /> {isCloth ? "Sold out. Ask us about weaving more." : "Sold out in this size and colour"}
      </p>
    );
  }
  if (qty !== null && qty !== undefined && qty <= 2) {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-clay-deep">
        <span className="size-2 animate-pulse rounded-full bg-clay" />
        {isCloth ? `Only ${qty} piece${qty === 1 ? "" : "s"} left in this design.` : `Only ${qty} left. Handwoven pieces rarely restock quickly.`}
      </p>
    );
  }
  return (
    <p className="flex items-center gap-2 text-sm text-leaf">
      <span className="size-2 rounded-full bg-leaf" />
      {isCloth ? `In stock: ${qty} pieces, ready for pickup or delivery` : "In stock, ready to ship from Accra"}
    </p>
  );
}

function BackInStock({ variant, productName }: { variant: Variant; productName: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  if (state === "done") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-lg bg-leaf-soft px-4 py-3 text-sm text-leaf">
        <Check className="size-4" /> We&apos;ll email you when it&apos;s back.
      </p>
    );
  }
  return (
    <form
      className="rounded-xl border border-line bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("loading");
        try {
          if (siteConfig.dataSource === "api") await apiFetch("/stock-alerts/", { method: "POST", body: { email, variant_id: variant.id } });
          setState("done");
        } catch (err) {
          setState("idle");
          toast({ title: (err as Error).message, tone: "error" });
        }
      }}
    >
      <p className="flex items-center gap-2 text-sm font-medium">
        <Bell className="size-4" /> Get an alert when it&apos;s back
      </p>
      <div className="mt-3 flex gap-2">
        <label htmlFor="stock-alert-email" className="sr-only">
          Email for back-in-stock alert for {productName}
        </label>
        <input id="stock-alert-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="h-11 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm outline-none focus:border-indigo" />
        <Button type="submit" size="sm" className="h-11 rounded-lg" loading={state === "loading"}>
          Notify me
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted">
        Or{" "}
        <a href={whatsappLink(`Hello, please tell me when ${productName} (${variant.colour}, ${variant.size}) is back.`)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          ask on WhatsApp
        </a>{" "}
        if it can be woven to order.
      </p>
    </form>
  );
}

const noopSubscribe = () => () => {};

function DeliveryEstimate({ leadDays }: { leadDays: number }) {
  const estimates = useDeliveryEstimates();
  // Dates depend on "today", so they render on the client only; the server shows the generic line.
  const range = useSyncExternalStore(
    noopSubscribe,
    () => {
      const start = addDays(new Date(), leadDays + 1);
      return formatDateRange(start, addDays(start, 1));
    },
    () => null,
  );
  return (
    <div className="rounded-xl bg-cotton-deep/70 p-4 text-sm">
      <p className="flex items-center gap-2 font-medium">
        <Truck className="size-4" /> {range ? <>Get it in Accra {range}</> : "Delivery across Ghana & worldwide"}
      </p>
      {estimates.length > 0 && (
        <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {estimates.map((d) => (
            <div key={d.zone}>
              <dt className="text-muted">{d.zone}</dt>
              <dd className="mt-0.5 font-medium tabular-nums">{d.fee_from ? formatGHS(d.fee_from, { compact: true }) : "Free"}</dd>
              <dd className="text-muted">{formatEta(d)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function PurchasePanel({ product, colour, onColourChange }: { product: ProductDetail; colour: string; onColourChange: (c: string) => void }) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const addRecent = useSaved((s) => s.addRecent);
  const singleSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(singleSize ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  useEffect(() => addRecent(product.slug), [addRecent, product.slug]);

  // Sticky mobile buy bar appears once the main button scrolls out of view (FR-UI-1).
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantsForColour = useMemo(() => product.variants.filter((v) => v.colour === colour), [product.variants, colour]);
  const variant = size ? variantsForColour.find((v) => v.size === size) : undefined;
  const price = variant?.price ?? product.price;
  const compareAt = variant ? variant.compare_at_price : product.compare_at_price;
  const available = variant ? isAvailable(variant) : variantsForColour.some(isAvailable);
  const maxQty = Math.min(MAX_QUANTITY_PER_LINE, stockOf(variant) ?? MAX_QUANTITY_PER_LINE);
  const measured = product.is_made_to_order;
  const isCloth = product.kind === "cloth";
  const pieceLength = (variant ?? (singleSize ? variantsForColour[0] : undefined))?.length_yards ?? product.length_yards;

  // Keep the chosen quantity within what this size has in stock.
  const qty = Math.min(quantity, Math.max(1, maxQty));

  async function addToCart() {
    if (!variant) {
      setSizeError(true);
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setAdding(true);
    try {
      const filled = Object.fromEntries(Object.entries(measurements).filter(([, v]) => v.trim()));
      await add({
        variant_id: variant.id,
        quantity: qty,
        ...(measured ? { custom_measurements: Object.keys(filled).length ? filled : null, measurement_note: note } : {}),
      });
      openDrawer();
    } catch (error) {
      toast({ title: (error as Error).message || "Couldn't add to cart", tone: "error" });
    } finally {
      setAdding(false);
    }
  }

  const buttonLabel = !available ? "Sold out" : variant ? "Add to cart" : singleSize ? "Add to cart" : "Select a size";

  return (
    <div className="flex flex-col gap-7">
      <div>
        <Link href={`/shop/${product.category.slug}`} className="eyebrow text-clay hover:underline">
          {product.category.name}
        </Link>
        <h1 className="mt-3 text-[2rem] leading-[1.08] sm:text-[2.5rem]">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Price amount={price} compareAt={compareAt} size="lg" showSaving />
          {product.rating_count > 0 && (
            <a href="#reviews" className="hover:underline">
              <RatingSummary average={product.rating_average} count={product.rating_count} />
            </a>
          )}
        </div>
        <p className="mt-1 text-xs text-muted">
          {isCloth && pieceLength ? `Price per ${pieceText(pieceLength)} piece. ` : ""}Price in Ghana cedis. Delivery calculated at checkout.
        </p>
      </div>

      {isCloth && product.colours.length === 1 && (
        <p className="flex items-center gap-3 text-sm">
          <span className="size-6 rounded-full ring-1 ring-ink/15" style={{ background: product.colours[0].hex }} aria-hidden />
          <span>
            <span className="font-semibold">Colourway:</span> <span className="text-ink-soft">{product.colours[0].name}</span>
          </span>
        </p>
      )}

      {(product.colours.length > 1 || (!isCloth && product.colours.length > 0)) && (
        <fieldset>
          <legend className="mb-3 text-sm">
            <span className="font-semibold">Colour:</span> <span className="text-ink-soft">{colour}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5" role="radiogroup">
            {product.colours.map((c) => {
              const soldOut = !product.variants.filter((v) => v.colour === c.name).some(isAvailable);
              return (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={c.name === colour}
                  aria-label={`${c.name}${soldOut ? ", sold out" : ""}`}
                  title={c.name}
                  onClick={() => onColourChange(c.name)}
                  className={cn("relative grid size-11 place-items-center rounded-full ring-offset-2 ring-offset-cotton transition", c.name === colour ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40")}
                >
                  <span className="size-8 rounded-full ring-1 ring-ink/10" style={{ background: c.hex }} />
                  {soldOut && <span className="absolute h-px w-9 rotate-45 bg-ink/60" aria-hidden />}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {!singleSize && (
        <fieldset id="size-picker">
          <div className="mb-3 flex items-center justify-between">
            <legend className="text-sm">
              <span className="font-semibold">{isCloth ? "Piece length" : "Size"}{size ? ":" : ""}</span> <span className="text-ink-soft">{size}</span>
            </legend>
            {!isCloth && <SizeGuideButton category={product.category.slug} />}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={sizeError ? "size-error" : undefined}>
            {product.sizes.map((s) => {
              const v = variantsForColour.find((x) => x.size === s);
              const ok = isAvailable(v);
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={s === size}
                  aria-label={`${s}${ok ? "" : ", sold out"}`}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  className={cn(
                    "relative h-12 min-w-14 rounded-lg border px-4 text-sm font-medium transition-colors",
                    s === size ? "border-ink bg-ink text-cotton" : "border-line bg-white hover:border-ink",
                    !ok && s !== size && "text-muted line-through decoration-ink/30",
                    sizeError && !size && "border-danger/60",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {sizeError && (
            <p id="size-error" role="alert" className="mt-2 text-sm text-danger">
              {isCloth ? "Please choose a piece length." : "Please choose a size."}
            </p>
          )}
        </fieldset>
      )}

      <StockStatus variant={variant ?? (singleSize ? variantsForColour[0] : undefined)} product={product} />

      {measured && (
        <div className="rounded-xl border border-indigo/15 bg-indigo-soft/50 p-5">
          <p className="flex items-center gap-2 font-medium text-indigo">
            <Clock className="size-4" /> Ships in about {product.lead_time_days} days
          </p>
          <p className="mt-1 text-sm text-ink-soft">Cut to your measurements. Add them now, or leave them blank and we&apos;ll take them with you on WhatsApp.</p>
          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-indigo underline underline-offset-4 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Add my measurements (cm)</span>
              <span className="hidden group-open:inline">Hide measurements</span>
            </summary>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {MEASUREMENT_FIELDS.map((f) => (
                <label key={f.key} className="text-xs font-medium text-ink-soft">
                  {f.label}
                  <input
                    inputMode="decimal"
                    value={measurements[f.key] ?? ""}
                    onChange={(e) => setMeasurements((m) => ({ ...m, [f.key]: e.target.value.replace(/[^0-9.]/g, "") }))}
                    className="mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-indigo"
                    placeholder="cm"
                  />
                </label>
              ))}
            </div>
            <label className="mt-3 block text-xs font-medium text-ink-soft">
              Note for the tailor
              <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={2} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-indigo" placeholder="e.g. I prefer a longer sleeve" />
            </label>
          </details>
        </div>
      )}

      {isCloth && (
        <div className="rounded-xl border border-line bg-white/70 p-5 text-sm">
          <p className="font-medium text-ink">Sold by the piece{pieceLength ? `: 1 piece = ${yardsText(pieceLength)}` : ""}</p>
          <p className="mt-1 text-ink-soft">
            Not sure how much you need? Tell us the style you have in mind on{" "}
            <a
              href={whatsappLink(`Hello FuguTribe, how many pieces of ${product.name} do I need for my outfit?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline underline-offset-4"
            >
              WhatsApp
            </a>{" "}
            and we&apos;ll advise.
          </p>
          <p className="mt-3 text-ink-soft">
            Dressing a bridal party, family or team?{" "}
            <Link href="/custom-orders" className="font-medium text-ink underline underline-offset-4">
              Request a group or custom order
            </Link>
          </p>
        </div>
      )}

      <div ref={buyRef} className="flex flex-col gap-3">
        <div className="flex gap-3">
          {available && <QuantityStepper value={qty} onChange={setQuantity} max={Math.max(1, maxQty)} label={isCloth ? "Number of pieces" : "Quantity"} />}
          <Button size="lg" className="h-12 flex-1" onClick={addToCart} loading={adding} disabled={!available}>
            {buttonLabel}
            {variant && available && <span className="font-normal opacity-70">· {formatGHS(price * qty, { compact: true })}</span>}
          </Button>
        </div>
        {isCloth && available && pieceLength ? (
          <p className="text-sm text-muted" aria-live="polite">
            {qty} piece{qty === 1 ? "" : "s"} · {yardsText(Number(pieceLength) * qty)} in total
          </p>
        ) : null}
        <WishlistButton slug={product.slug} name={product.name} withLabel className="w-full" />
      </div>

      {variant && !isAvailable(variant) && <BackInStock variant={variant} productName={product.name} />}

      <DeliveryEstimate leadDays={product.lead_time_days ?? 1} />

      <ul className="grid grid-cols-1 gap-3 text-sm text-ink-soft sm:grid-cols-3 sm:gap-2">
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-4 shrink-0 text-leaf" /> Secure MoMo &amp; card
        </li>
        <li className="flex items-center gap-2">
          <RotateCcw className="size-4 shrink-0 text-leaf" />
          <Link href="/shipping-returns" className="hover:underline">
            {product.is_made_to_order ? "Fit adjustments" : isCloth ? "Returns on uncut cloth" : `${siteConfig.returnWindowDays}-day returns`}
          </Link>
        </li>
        <li>
          <a href={whatsappLink(`Hello, I have a question about ${product.name}: ${siteConfig.url}/products/${product.slug}`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
            <MessageCircle className="size-4 shrink-0 text-leaf" /> Ask a question
          </a>
        </li>
      </ul>

      {/* Sticky mobile add-to-cart bar */}
      <div className={cn("fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cotton/95 px-4 pt-3 pb-safe backdrop-blur-md transition-transform duration-300 lg:hidden", showBar ? "translate-y-0" : "translate-y-full")} aria-hidden={!showBar}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <p className="text-sm text-muted tabular-nums">
              {formatGHS(price, { compact: true })}
              {isCloth && pieceLength ? ` per ${pieceText(pieceLength)} piece` : size && ` · ${size}`}
            </p>
          </div>
          <a href={whatsappLink(`Hello, I'm interested in ${product.name}: ${siteConfig.url}/products/${product.slug}`)} target="_blank" rel="noopener noreferrer" tabIndex={showBar ? 0 : -1} className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-white text-[#1f7a4d]" aria-label="Ask on WhatsApp">
            <WhatsAppIcon className="size-5" />
          </a>
          <Button size="lg" className="h-12 shrink-0" onClick={addToCart} loading={adding} disabled={!available} tabIndex={showBar ? 0 : -1}>
            {available ? (variant ? "Add to cart" : "Choose size") : "Sold out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
