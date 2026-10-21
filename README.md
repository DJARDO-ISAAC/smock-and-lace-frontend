# FuguTribe storefront

Next.js storefront for FuguTribe, a fugu shop at Oyarifa Crossing, Accra: handwoven fugu cloth sold by the piece, ready-made smocks and batakari, and custom orders for individuals, groups and companies. It talks only to the Django API in `../smock-and-lace-backend` (SRS sections 3 and 9).

**Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, Zustand, React Hook Form and Zod.

## Getting started

```bash
cp .env.example .env.local   # then edit
npm install
npm run dev                  # http://localhost:3000
```

Run the Django API on `http://localhost:8000` for sign-in, the account area and (in `api` mode) the cart.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Django API base, including `/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, the sitemap and Open Graph |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` (default) or `api`; see below |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Shop WhatsApp number, digits only, e.g. `233200000000` |

### Data source

The backend does not have catalogue, shipping, checkout or order endpoints yet, so the storefront can run in two modes:

- **`mock`**: uses a built-in sample catalogue (`src/lib/catalog/mock-data.ts`), a cart kept in the browser, and a simulated checkout that stores orders in `localStorage`. Use it for design review and UAT before the backend is ready.
- **`api`**: everything goes through the Django API.

Sign-in, registration, the profile, addresses and measurements always use the API.

## API contract

Response types are in `src/lib/api/types.ts`. Money is always in integer pesewas.

| Endpoint | Backend status | Used by |
| --- | --- | --- |
| `POST /auth/register/`, `/auth/login/`, `/auth/refresh/`, `/auth/logout/` | ✅ exists | auth store |
| `GET/PATCH /me/`, CRUD `/me/addresses/`, `/me/measurements/` | ✅ exists | account area, checkout prefill |
| `GET/DELETE /cart/`, `POST /cart/items/`, `PATCH/DELETE /cart/items/{id}/` | ✅ exists | cart (api mode) |
| `POST/DELETE /cart/discount/` | ⏳ to build | discount code field |
| `GET /categories/`, `/collections/` | ✅ exists | navigation, listings |
| `GET /products/?category=&collection=&q=&size=&colour=&origin=&min_price=&max_price=&in_stock=&made_to_order=&ordering=&page=&page_size=&slug=` | ✅ exists | listings, search, wishlist |
| `GET /products/{slug}/` (with `variants`, `images`, `reviews`, story fields) | ✅ exists | product page |
| `GET /products/facets/?category=&collection=` | ✅ exists | filter options |
| `GET /shipping/quote/?country=&region=` | ✅ exists | checkout delivery options |
| `POST /checkout/`, `POST /payments/initialize/`, `GET /payments/verify/`, `POST /payments/webhook/` | ✅ exists | checkout, payment, confirmation |
| `GET /orders/`, `/orders/{number}/` (guests add `?key=`) | ✅ exists | confirmation, order history |
| `GET /orders/{number}/invoice/`, `POST /orders/{number}/return-request/` | ⏳ to build | invoice download, returns |
| `POST /auth/password-reset/` | ⏳ to build | forgot password |
| `POST /custom-requests/` | ✅ exists | custom and group order form |
| `POST /newsletter/`, `/stock-alerts/` | ⏳ to build | newsletter, back-in-stock alerts |

The access token is kept in memory only. The refresh token stays in the API's httpOnly cookie (`sl_refresh`), and the session is restored on load via `/auth/refresh/`. Guest carts send their token in the `X-Cart-Token` header, which is kept in the first-party cookie `sl_cart`. Cross-site deployments need `REFRESH_COOKIE_SAMESITE=None` and HTTPS on the API.

## Structure

```
src/
  app/
    (shop)/          storefront pages with the shared header and footer
    checkout/        focused checkout layout, no site navigation
  components/
    ui/              design-system primitives (Button, Dialog, form fields, Price…)
    layout/          header, footer, search, WhatsApp button
    product/         cards, gallery, purchase panel, story block, reviews
    shop/            listing, filters, sorting, pagination
    cart/ checkout/ account/ auth/ home/ content/
  lib/               API client, catalogue reads, cart backends, checkout, shipping, money
  stores/            Zustand stores (auth, cart, saved items, toasts)
```

Design tokens (colours, fonts, motion) live in `src/app/globals.css` under `@theme`.

## Cloth and garments

Products have a `kind`:

- **cloth**: sold by the piece. Each variant has a `length_yards` (e.g. 6) and the price is per piece; the cart and orders show the total yards. Staff set length and price per design in the admin.
- **garment**: ready-made in sizes, optionally made to measure.

## Placeholder content to replace before launch

- **Product photos:** cards and galleries draw generated strip-cloth artwork (`ProductArt`) whenever an image has no `url`, in both modes (`src/lib/catalog/art.ts`). Photos uploaded in the Django admin replace it automatically.
- **Sample catalogue:** the 13 cloth designs use FuguTribe's own TikTok photos (`public/demo`) at GH₵ 500 per 6-yard piece (from the shop's post; vintage designs at GH₵ 550 are a guess). The garments are placeholders drawn as artwork. Load the same catalogue into Django with `python manage.py seed_catalogue`.
- **Contact details:** phone, email, address and TikTok are in `src/lib/config.ts`. Opening hours aren't shown yet.
- **Policies:** the privacy policy and terms of sale are drafts and need legal review (Act 843).
- **Delivery fees and zones:** sample values are in `src/lib/shipping.ts` until the shipping app exists.
- **Mock discount codes:** `AKWAABA10` and `FUGUWED15`, in mock mode only.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build (also type-checks)
npm run lint    # ESLint
```
