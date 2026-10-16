/**
 * Called by the Django API after catalogue data changes (backend core/storefront.py),
 * so admin edits and stock changes show at once instead of when the cache expires.
 * POST { "tags": ["products"] } with Authorization: Bearer <REVALIDATE_SECRET>.
 */
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

const TAGS = new Set(["products", "categories", "collections", "shipping"]);

function authorized(header: string | null) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !header) return false;
  const given = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  if (!authorized(request.headers.get("authorization"))) {
    return Response.json({ detail: "Not allowed." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((t): t is string => TAGS.has(t)) : [];
  if (tags.length === 0) {
    return Response.json({ detail: `Send "tags" from: ${[...TAGS].join(", ")}.` }, { status: 400 });
  }

  // Expire now rather than serve stale: a wrong price or stock count must not reach the next visitor.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
