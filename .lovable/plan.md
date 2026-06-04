
# Kings Pharmacy — Interactive Demo App

A fully responsive, mobile-first pharmacy e-commerce demo with 5 screens and realistic interactive flows (payment OTP, prescription upload, live order tracking). All data mocked in client state — no backend.

## Scope

- 5 routes: Home, Product Detail, Cart/Checkout, Order Tracking, Account
- Bottom tab nav on mobile; top nav on desktop
- Floating cart button + "Demo Mode" pill on all screens
- Brand colors wired as semantic tokens in `src/styles.css` (oklch)
- Inter font, uploaded logo used in header

## Routes (TanStack file-based)

```
src/routes/
  __root.tsx           shell + nav + cart drawer + demo badge
  index.tsx            home/storefront
  product.$id.tsx      product detail
  cart.tsx             multi-step checkout
  track.tsx            live order tracking
  account.tsx          profile + rewards + prescriptions
```

## Screen 1 — Home
Sticky header (logo, search, cart badge, avatar) · 3-slide hero carousel · scrollable category chips · 8 hardcoded products in a 2/4-col grid with stock-status badges and contextual CTAs (Add/Notify/Rx) · flash-sale promo banner.

## Screen 2 — Product Detail
Large emoji-on-color hero · description, dosage, manufacturer, expiry · qty stepper · Add to Cart · for Rx items: blue prescription banner + mock upload modal (camera/gallery → preview → progress bar → success) · drug-interaction warning · "You may also like" horizontal scroll.

## Screen 3 — Cart & Checkout (4 animated steps)
1. **Cart review** — items, subtotal, $2.50 delivery, total
2. **Delivery details** — name/phone/address/city/notes, ASAP vs scheduled slot picker
3. **Payment** — tappable method cards (EcoCash, OneMoney, InnBucks, Telecash, ZIPIT, Visa/MC, COD), each revealing its own form:
   - Mobile money/InnBucks: phone + PIN → OTP 6-digit entry → Verify & Pay
   - ZIPIT: bank dropdown + account → Confirm Transfer
   - Card: formatted card number (4-digit groups), expiry, CVV, name, billing → Pay Securely 🔒
   - COD: confirmation only
   - ZiG equivalent shown under USD for mobile-money methods
4. **Confirmation** — animated ✅, order ref `#KP-2026-00847`, summary, ETA, "Track My Order"

## Screen 4 — Live Order Tracking
Status banner · 6-step progress stepper (vertical mobile / horizontal desktop) · stylized SVG map with animated 🚗 traveling dashed route to 📍 · driver card (Tinashe M., 5★) · ETA · "Simulate Delivery Progress" button advances stepper + car · "Contact Driver" mock chat popup.

## Screen 5 — Account
Chipo Moyo avatar, member since 2024 · Kings Rewards loyalty card (1,240 pts, Gold) · sections: Orders (3 mock), Prescriptions (2 with status), Addresses, Payment Methods, Health Profile (Penicillin allergy, Metformin), Refill Reminders (toggles), Settings, Log Out.

## Cross-cutting

- **State**: Zustand store for cart, prescription upload, tracking step
- **Stock badges** with exact hex pills, Add-to-Cart disabled when out
- **Animations**: framer-motion for page fade/slide-up, step transitions, success checkmark, car motion
- **Logo**: uploaded webp registered via lovable-assets CDN pointer
- **Responsive**: mobile 375–430 bottom tabs, tablet 768 2-col, desktop 1280 top nav + 4-col

## Technical notes

- `src/styles.css` — add tokens: `--brand-navy`, `--brand-royal`, `--brand-success`, `--brand-amber`, `--brand-danger`, `--brand-rx`, plus map to `--color-*`
- Inter via Google Fonts `@import` in styles.css
- shadcn primitives used: button, input, dialog, drawer, tabs, badge, card, progress, switch, select, sheet
- No backend, no Cloud — purely client-mocked

Ready to build on approval.
