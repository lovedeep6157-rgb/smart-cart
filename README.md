# 🛍️ SmartCart — Premium E-Commerce SPA

A modern, production-ready e-commerce single-page application built with **React 18**, **Vite**, and **React Router v6**. SmartCart features a full product catalogue, interactive cart management, a multi-rule discount engine with five configurable custom discount strategies, and a premium redesigned UI/UX with glassmorphism, smooth animations, and full mobile responsiveness.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

> Requires **Node.js 18+**.

---

## 📋 Project Overview

SmartCart simulates a real-world e-commerce shopping experience entirely in the browser — no backend or database required. Products are loaded from a static `products.json` file, cart state is managed in memory via React Context + `useReducer`, and three discount rules (including five switchable custom promotions) are computed in isolated utility modules.

The UI was designed to match premium e-commerce platforms, featuring an indigo design system, hero banner, glassmorphism navbar, animated product cards, and a full checkout flow with a detailed discount summary.

**Tech Stack:**

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router DOM v6 |
| State management | Context API + `useReducer` |
| Styling | CSS Modules |
| Typography | Inter (Google Fonts) |
| Data | Static JSON |

---

## ✅ Features Implemented

### 🏪 Product Listing Page (`/products`)
- Displays all 12 products from `products.json` in a responsive CSS grid (3 → 2 → 1 column breakpoints)
- **Hero banner** with gradient background, grid pattern overlay, and live product stats (total, categories, in-stock count)
- **Filter bar** — search by name (case-insensitive), filter by category, sort by price (asc/desc) or name (A→Z)
- Per-product **emoji image area** with category-specific gradient backgrounds
- **Stock badges** — green "In Stock", amber "Only N left" (stock ≤ 5), grey "Out of Stock"
- **Out-of-stock overlay** with blur + disabled button (labelled "Out of Stock")
- **Category chip** badge in the top-left of each card image area
- Hover animations — card lifts 4 px, emoji container scales and rotates, indigo border highlight
- Empty-state message when search/filter produces no results
- Toast notifications on add-to-cart (success) or add-to-cart rejection (max qty reached)

### 🛒 Cart Page (`/cart`)
- Displays all cart items with emoji thumbnail, product name, unit price, quantity stepper, and line total
- **Increase / Decrease quantity** — capped at `MIN_QTY = 1` and `MAX_QTY = 10` with disabled button states
- **Remove item** button (per item) and **Clear Cart** button (all items)
- **Bulk Order badge** — shown when item quantity ≥ 5; gold gradient, shimmer sweep animation
- **Order Summary panel** — subtotal, product discounts (Rule 1), cart discount (Rule 2), custom discount, and final total; only non-zero discount rows are rendered
- **Savings banner** — "🎉 You save ₹N!" shown when any discount applies
- Empty-state view with navigation back to products
- Sticky order summary on desktop

### 💳 Checkout Page (`/checkout`)
- **Order Items** section — emoji, name, price × qty formula, original and discounted line totals
- Green "10% off" badge and strikethrough price when Rule 1 applies (qty ≥ 3)
- **Discounts Applied** section — lists each Rule 1 product discount, Rule 2 cart discount, and active custom discount with labels and amounts
- Inactive custom rule shown in muted italic style (e.g. OptionD on weekdays)
- **Active Custom Rule chip** always visible — shows rule name and option identifier
- **Discount Summary (Bill)** panel — Subtotal → Product Discount → Cart Discount → Custom Discount → Total Savings → Final Amount Payable
- **Final amount gradient box** — indigo gradient with shine effect and total savings pill
- **Place Order** button triggers order confirmation with bounce animation
- Order confirmation screen with savings callout and "Continue Shopping" button
- Empty-state when cart is empty

### 🔖 Discount Engine
**Rule 1 — Bulk Product Discount:**
- If quantity of any single product ≥ 3, apply **10% off** that product's line total

**Rule 2 — Cart-Level Discount:**
- If cart subtotal (pre-discount) exceeds ₹5,000, apply an additional **5% off** the post-Rule-1 total

**Custom Discount (configurable via `CUSTOM_RULE` constant in `src/utils/discountCustom.js`):**

| Option | Rule |
|---|---|
| `OptionA` | Buy 2 Get 1 Free — `floor(qty/3) × unitPrice` per product |
| `OptionB` | Cheapest Item 50% Off |
| `OptionC` | Every 4th Item Free (valued at cheapest unit price) |
| `OptionD` | Weekend 15% Discount (active Sat/Sun only; shows inactive label on weekdays) |
| `OptionE` | Category-Based — Electronics 8%, Fashion 12%, Others 5% |

To switch rules, change the single line in `src/utils/discountCustom.js`:
```js
export const CUSTOM_RULE = 'OptionA' // change to OptionB, OptionC, etc.
```

### ⚙️ State Management
- Global cart state via **React Context API** + `useReducer`
- Actions: `ADD_ITEM`, `UPDATE_QTY`, `REMOVE_ITEM`, `CLEAR_CART`
- Exposed helpers: `addToCart()`, `updateQty()`, `removeItem()`, `clearCart()`
- `totalItems` derived with `useMemo`; returns error object when MAX_QTY is exceeded

### 🗺️ Routing & Code Splitting
- `react-router-dom` v6 with `BrowserRouter` in `main.jsx`
- `/products` — eagerly loaded (landing page)
- `/cart` — `React.lazy()` with `<Suspense>` fallback
- `/checkout` — `React.lazy()` with `<Suspense>` fallback
- Root `/` and all unknown routes redirect to `/products`

### ⚡ Performance Optimisations
- `React.memo` on `ProductCard` and `CartItem`
- `useMemo` for product filter/sort computation and `totalItems` derivation
- `useCallback` for `handleAdd`, `updateQty`, `removeItem`, `clearCart` handlers
- Code splitting on Cart and Checkout pages reduces initial bundle

### 🎨 UI / UX Design
- **Design system** — CSS custom properties for colour, spacing, shadow, radius, and transition
- **Indigo palette** (`#4f46e5`) with gradient surfaces and glow shadows
- **Inter** typeface (Google Fonts) for clean modern typography
- **Glassmorphism navbar** — `backdrop-filter: blur(20px)`, frosted glass with drop shadow
- **Hero section** — full-width gradient banner with stats and decorative grid/orb overlays
- **Smooth transitions** — card hover lift, emoji spring rotation, button press scale, badge pop
- **Dual-ring loader** with counter-rotating animation
- **Slide-up toast** with dark glass background, auto-dismisses after 2400 ms
- **Bulk Order badge** — gold gradient with repeating shimmer sweep
- **Order confirmation** — bounce-in animation on the success icon
- Fully responsive at 320 px → 1400 px+; grid and layout collapse gracefully on mobile

---

## 🧩 Assumptions Made

1. **No backend / persistence** — All data is in-memory. Refreshing the page resets the cart. This was intentional as the project scope is a front-end SPA.
2. **Products are static** — The catalogue is defined in `src/data/products.json`. Product images are represented by emoji characters; no external image CDN is required.
3. **Indian Rupee (₹) formatting** — All prices use the `en-IN` locale with `toLocaleString`, which may render differently in browsers that don't support the locale (fallback is plain number formatting).
4. **Rule 2 threshold** — The 5% cart discount is applied when the raw subtotal (before any discounts) exceeds ₹5,000, not the discounted total.
5. **OptionD (Weekend Discount)** — "Weekend" is determined by `new Date().getDay()` in the user's local timezone (0 = Sunday, 6 = Saturday). A user in a different timezone from the server (if one existed) would see different behaviour — acceptable for a client-side app.
6. **OptionA (Buy 2 Get 1 Free)** — Calculated per-product, not across the entire cart. Buying 2 units of Product A and 1 of Product B does not trigger the offer.
7. **Max quantity cap** — The `MAX_QTY = 10` limit is a UX guardrail, not a stock check against the `stock` field. A product showing "Only 3 left" can still be added up to 10 times.
8. **No authentication / payments** — "Place Order" simulates order placement by clearing the cart and showing a confirmation screen. No payment gateway or order storage is implemented.

---

## 🧱 Challenges Faced

1. **Discount stacking order** — Deciding whether Rule 2 should apply before or after Rule 1, and where the custom rule should sit in the chain, required careful thought. The final order is: Rule 1 (per-product) → Rule 2 (cart-level, on post-Rule-1 total) → Custom Rule (on post-Rule-2 total), which matches standard e-commerce discount stacking.

2. **Custom Rule isolation** — Keeping the five custom discount strategies genuinely isolated (no cross-contamination of logic) while sharing a common function signature (`{ label, amount }`) needed a clean module boundary. The switch-based dispatch in `discountCustom.js` solved this without over-engineering.

3. **React.memo with Context** — `ProductCard` and `CartItem` are wrapped in `React.memo`, but they consume `useCart()` internally. Since the cart array reference changes on every dispatch, `React.memo` does not prevent re-renders triggered by context updates. The `onAdd` prop pattern (passing a stable `useCallback` reference from the parent) was used to avoid unnecessary renders of cards whose product data hasn't changed.

4. **CSS Modules with dynamic gradient `style` prop** — The category-specific gradient backgrounds in `ProductCard` are applied as inline `style={{ background: bg }}` because CSS Modules don't support runtime-computed values. This means the gradient cannot use `var(--primary)` tokens — hardcoded colour stops were used instead for each category.

5. **Sticky summary panels on mobile** — The Cart and Checkout sticky right-column panels need `position: sticky; top: 82px` on desktop but must fall back to `position: static` on mobile to avoid obscuring content. Managing this cleanly with a single media-query override (rather than JavaScript) required careful z-index and layout planning.

6. **Accessible NavBar keyboard navigation** — The brand logo uses a `div` with an `onClick` handler. To maintain keyboard accessibility (Tab + Enter), explicit `tabIndex={0}` and `onKeyDown` handlers had to be added, since native `<button>` semantics weren't used to preserve the visual design.

---

## 🐛 Known Issues

1. **Cart state lost on refresh** — There is no `localStorage` persistence. Adding items and refreshing the browser empties the cart. This is by design for the current scope but is a UX gap.

2. **Stock not decremented** — Adding a product to the cart does not reduce its `stock` value. Products showing "Only 3 left" can be added beyond 3 units (up to `MAX_QTY = 10`).

3. **OptionD (Weekend Discount) uses client clock** — The weekend check relies on `new Date().getDay()` in the user's browser. This can be spoofed and is not consistent with server time.

4. **No form validation at checkout** — The checkout page has no address, name, or payment fields. "Place Order" immediately clears the cart without collecting any user details.

5. **Emoji rendering varies by OS** — The product emoji icons render differently across Windows, macOS, iOS, and Android. Layout may shift slightly on platforms with very different emoji glyph sizes (notably older Android versions).

6. **Google Fonts dependency** — The Inter font is loaded from Google Fonts CDN. In offline environments or networks that block `fonts.googleapis.com`, the app will fall back to `system-ui` (still looks fine, but not pixel-identical).

7. **`React.memo` partial effectiveness** — As noted in Challenges, `ProductCard` wrapped in `React.memo` will still re-render when the cart context updates, because `useCart()` is called inside the component. A more complete solution would lift cart state access to the parent.

---

## 🔮 Future Improvements

1. **`localStorage` cart persistence** — Persist the cart to `localStorage` so items survive page refreshes. A custom `useLocalStorage` hook or `useEffect` sync on every cart dispatch would handle this.

2. **Product detail page** — Add a `/products/:id` route with a full-page product view, multiple image slots, and a detailed description section.

3. **User authentication** — Add a sign-in / sign-up flow (e.g. with Firebase Auth or a mock JWT system) to associate orders with users and enable a saved-items (wishlist) feature.

4. **Backend & order history** — Connect to a REST or GraphQL API to persist orders, decrement stock on purchase, and show an order history page.

5. **Real stock enforcement** — Prevent adding more units than available `stock`, with an optimistic UI update that re-validates against the backend.

6. **Skeleton loading screens** — Replace the spinner Loader with per-card skeleton placeholders (CSS animated shimmer) for a more polished perceived-performance experience on slow connections.

7. **Unit & integration tests** — Add a Vitest + React Testing Library test suite covering the cart reducer, all five discount rules, and critical user flows (add to cart, checkout, place order).

8. **Discount code / coupon input** — Allow users to enter a promo code at checkout that maps to one of the custom discount options, rather than requiring a code change to switch rules.

9. **Internationalisation (i18n)** — Extend the currency formatter to support multiple locales and currencies using the `Intl.NumberFormat` API, and extract all UI strings into a translation layer.

10. **PWA / offline support** — Add a service worker and `manifest.json` to make SmartCart installable as a Progressive Web App with offline product browsing.

---

## 📁 Project Structure

```
smart-cart/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Entry point — BrowserRouter + App
    ├── App.jsx               # CartProvider + NavBar + Suspense
    ├── index.css             # Global design tokens (CSS custom properties)
    ├── components/
    │   ├── NavBar.jsx / .module.css
    │   ├── ProductCard.jsx / .module.css
    │   ├── CartItem.jsx / .module.css
    │   ├── Button.jsx / .module.css
    │   ├── Badge.jsx / .module.css
    │   ├── Toast.jsx / .module.css
    │   └── Loader.jsx / .module.css
    ├── context/
    │   └── CartContext.jsx   # useReducer cart state + helpers
    ├── data/
    │   └── products.json     # Static product catalogue (12 items)
    ├── pages/
    │   ├── Products.jsx / .module.css   # /products
    │   ├── Cart.jsx / .module.css       # /cart  (lazy)
    │   └── Checkout.jsx / .module.css  # /checkout (lazy)
    ├── routes/
    │   └── AppRoutes.jsx     # Route definitions
    └── utils/
        ├── discountCalculator.js   # Rule 1, Rule 2, custom rule orchestration
        └── discountCustom.js       # OptionA–E implementations + CUSTOM_RULE config
```

---

## 📄 License

MIT — free to use for learning and portfolio purposes.
