# Kings Pharmacy — Retail UX Redesign Plan

A focused presentation-layer redesign. No business-logic changes: keeps existing stores (`useStore`, `useAuth`, `useBranch`, `rx`, `orders`), products, branches, payment methods, and routes. Only UI/layout is refactored.

## 1. Header (src/components/nav.tsx)

Replace single-row header with a two-row sticky header on desktop:

- **Row 1 (top bar):** Logo (left) · Large prominent search bar (center, flex-1) · Branch chip + Account menu + Cart button with badge (right).
- **Row 2 (secondary nav):** Horizontal category links (Pain Relief, Vitamins, Baby Care, OTC, Prescription, Devices, Cosmetics, Baby Care) + right-aligned utility links (Track Order, Branches, Prescriptions).
- **Promo strip:** Thin gradient bar above header ("Free delivery on orders over $30 in Bulawayo · Upload your Rx for instant quote").
- Mobile header keeps compact logo + search + cart, plus a horizontal scrollable category chip row.

## 2. Homepage (src/routes/index.tsx)

Replace existing layout with retail-style sections:

1. **Hero carousel** — 3 rotating slides (featured deals / health campaigns / Rx upload CTA) with auto-advance and dots.
2. **Category icons row** — 8 circular tiles with emoji + label, horizontally scrollable on mobile.
3. **Best Sellers carousel** — horizontal scroll, snap, arrow buttons on desktop.
4. **Deals of the Week** — same carousel pattern with "% off" ribbon.
5. **New Arrivals** — carousel.
6. **Trust band** — 4 icons (Licensed Pharmacy, Same-Day Delivery, Local Payments, Verified Rx).

A reusable `<ProductCarousel title items />` component is added.

## 3. Shop / PLP (src/routes/shop.tsx)

- **Left sidebar (desktop ≥md):** Sticky filter panel with Category (checkbox group), Price range (min/max), Brand (checkbox group), "In stock at my branch" toggle, Clear all.
- **Mobile:** Filter button opens a Sheet drawer with the same filters.
- **Top bar:** result count + sort dropdown (Popularity, Price ↑, Price ↓, Name).
- **Grid:** 2 cols on mobile, 3 on md, 4 on lg.
- **Pagination:** simple page numbers (12 per page).

## 4. Product Detail Page (src/routes/product.$id.tsx)

Restructure as two-column on desktop:

- **Left:** Large image with 3 thumbnail strip below (reuses the main image — gallery placeholder).
- **Right:** Brand · Name · Price · Branch stock badge ("In stock at Hillside · 12 left" with branch switcher) · Qty stepper · Add to Cart (or Upload Rx for Rx items) · Wishlist/Share icons.
- **Tabs:** Description · Usage Instructions · Reviews (static sample 3-review block).
- **Bottom:** "Related Products" horizontal carousel (same `<ProductCarousel />`).

## 5. Cart & Checkout

- **Slide-out cart drawer** (`src/components/cart-drawer.tsx`, new): controlled by a `useCartDrawer` zustand store. Cart button in header opens it. Lists items, qty edit, remove, subtotal, "Checkout" CTA → /cart. Mobile cart tab still routes to /cart full page.
- **Checkout (src/routes/cart.tsx):** Multi-step wizard with progress indicator:
  1. **Delivery & Branch** — name/phone/address + branch select.
  2. **Payment** — EcoCash / ZimSwitch (+bank) / Telecash / Cash on Delivery (existing options preserved).
  3. **Review** — order summary + Confirm button (existing place-order logic).
  - Stepper UI at top with checkmarks. Back/Next buttons.

## 6. Styling

- Tighten on existing tokens; primary medical blue stays `#1E5BC6`, navy `#1B3A6B`, success `#1A7A4A`.
- Cards: `rounded-2xl shadow-sm hover:shadow-md`.
- Sticky header already exists; keep + ensure backdrop-blur.

## Files

**Edited:**
- src/components/nav.tsx — two-row header + category nav + promo strip + mobile category scroller.
- src/routes/index.tsx — hero carousel, category tiles, multi-carousel sections, trust band.
- src/routes/shop.tsx — sidebar filters, sort, pagination.
- src/routes/product.$id.tsx — gallery + tabs + related carousel.
- src/routes/cart.tsx — multi-step checkout wizard.

**New:**
- src/components/product-carousel.tsx — horizontally scrollable product row with arrows.
- src/components/cart-drawer.tsx — slide-out cart using existing Sheet UI.
- src/lib/cart-drawer.ts — tiny zustand store for open state.

No data, auth, RLS, or backend changes.