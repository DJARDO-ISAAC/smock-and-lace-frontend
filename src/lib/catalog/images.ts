import type { ProductDetail, ProductImage } from "@/lib/api/types";

/** Colour an image belongs to: via its variant, or the first colour for product-level images. */
function colourOf(product: ProductDetail, image: ProductImage) {
  if (image.variant_id === null) return product.variants[0]?.colour ?? null;
  return product.variants.find((v) => v.id === image.variant_id)?.colour ?? null;
}

/** Gallery images for the selected colour, falling back to every image when none are tagged. */
export function imagesForColour(product: ProductDetail, colour: string | null): ProductImage[] {
  if (!colour) return product.images;
  const matching = product.images.filter((i) => colourOf(product, i) === colour);
  return matching.length ? matching : product.images;
}

export function imageForColour(product: ProductDetail, colour: string | null): ProductImage | undefined {
  const list = imagesForColour(product, colour);
  return list.find((i) => i.art?.view !== "detail") ?? list[0];
}
