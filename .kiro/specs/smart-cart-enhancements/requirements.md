# Requirements Document

## Introduction

SmartCart is a React + Vite e-commerce single-page application. This document covers the full feature
set for the enhanced version: a premium Product Listing page, an interactive Cart page, a multi-rule
Checkout page with configurable custom discounts, and performance and UI-quality standards that apply
across the entire app.

---

## Glossary

- **App**: The SmartCart React SPA as a whole.
- **Product**: A catalogue item defined in `products.json` with fields `id`, `name`, `category`, `price`, `stock`, `emoji`, `description`.
- **ProductCard**: The card component that renders a single Product on the Products page.
- **Cart**: The in-memory collection of CartItems managed by `CartContext` via `useReducer`.
- **CartItem**: One entry in the Cart: a Product plus a chosen quantity.
- **CartContext**: The React Context + Reducer that owns Cart state and exposes mutation helpers.
- **Checkout**: The page where the user reviews the final bill, sees all applied discounts, and places the order.
- **DiscountCalculator**: The utility module (`discountCalculator.js`) that computes Rule 1, Rule 2, and the Custom Rule discount.
- **DiscountCustom**: The isolated utility module (`discountCustom.js`) that implements Options A–E and exposes the active rule via `CUSTOM_RULE`.
- **Rule 1**: Bulk product discount — 10% off a product's line total when `qty >= 3`.
- **Rule 2**: Cart-level discount — additional 5% off the post-Rule-1 total when the cart subtotal exceeds ₹5,000.
- **CustomRule**: The active custom discount option selected by the `CUSTOM_RULE` constant in `discountCustom.js`.
- **NavBar**: The sticky top navigation bar with links to Products, Cart (with item count badge), and Checkout.
- **Loader**: The full-page spinner shown as the Suspense fallback while lazy-loaded pages are loading.
- **Toast**: The transient notification shown at the bottom-right when a product is added to or rejected from the Cart.

---

## Requirements

---

### Requirement 1: Product Listing Page

**User Story:** As a shopper, I want to browse all available products with clear visual cues about stock and pricing, so that I can quickly decide what to add to my cart.

#### Acceptance Criteria

1. THE App SHALL display all products defined in `products.json` on the `/products` route using a responsive CSS grid that renders at least 3 columns on viewports ≥ 900 px, 2 columns on viewports 500–899 px, and 1 column on viewports < 500 px.
2. WHEN a product is rendered, THE ProductCard SHALL display: the product's emoji centred inside a styled container whose background is the gradient mapped to the product's `category` field (falling back to a neutral grey gradient for unmapped categories), the product name, description, price formatted as `₹N` using `en-IN` locale, a stock status badge, and an "Add to Cart" button.
3. IF a product's `stock` equals `0`, THEN THE ProductCard SHALL render the "Add to Cart" button in a disabled state (`disabled` attribute set) with the visible label "Out of Stock".
4. IF a product's `stock` is between 1 and 5 inclusive, THEN THE ProductCard SHALL show a stock badge with an orange/amber background and the text "Only N left" where N is the exact `stock` value.
5. IF a product's `stock` is greater than 5, THEN THE ProductCard SHALL show a stock badge with a green background and the text "In Stock".
6. WHEN a user's pointer enters a ProductCard whose `stock` is greater than 0, THE ProductCard SHALL transition (≥ 200 ms ease) to `transform: translateY(-4px)`, an elevated `box-shadow` value, and a `border-color` set to `var(--primary)`.
7. WHEN a user's pointer enters a ProductCard whose `stock` is greater than 0, THE ProductCard's emoji container SHALL transition (≥ 200 ms ease) to `transform: scale(1.12) rotate(6deg)`.
8. IF a product's `stock` equals 0, THEN THE ProductCard's image area SHALL render a semi-transparent dark overlay containing the text "Out of Stock", and THE ProductCard SHALL NOT apply the hover-lift (`translateY`) or border-highlight (`border-color: var(--primary)`) transitions on pointer-enter.
9. THE ProductCard SHALL display the product's `category` value as a text chip badge absolutely positioned in the top-left corner of the image area, with sufficient contrast against the gradient background.
10. WHEN a user types into the search input, THE Products page SHALL re-render the product grid showing only the products whose `name` field contains the typed string as a substring (comparison is case-insensitive), within 100 ms of the input change event.
11. WHEN a user selects a value from the category dropdown, THE Products page SHALL re-render the product grid showing only the products whose `category` field exactly matches the selected value; WHEN the selected value is `"All"`, all products SHALL be shown.
12. WHEN a user selects a sort option from the sort dropdown, THE Products page SHALL reorder the currently filtered list: `"price-asc"` sorts ascending by `price`, `"price-desc"` sorts descending by `price`, `"name-asc"` sorts ascending by `name` using locale-aware comparison.
13. WHEN the combined search and category filters produce zero matching products, THE Products page SHALL display an empty-state section containing an icon and a message (e.g. "No products match your search.") instead of the product grid; the grid SHALL NOT be rendered with zero children.

---

### Requirement 2: Cart Page

**User Story:** As a shopper, I want to manage the items in my cart with quantity controls and see a running order summary, so that I can adjust my order before checkout.

#### Acceptance Criteria

1. THE Cart page SHALL display each CartItem with: the product's emoji thumbnail, product name, a quantity stepper (decrease / count / increase), the unit price formatted as `₹N`, and the total line price (unit price × quantity) formatted as `₹N`.
2. IF a CartItem's quantity equals `MIN_QTY` (1), THEN THE CartItem's decrease button SHALL be rendered with the `disabled` attribute set and SHALL NOT trigger a quantity change when clicked.
3. IF a CartItem's quantity equals `MAX_QTY` (10), THEN THE CartItem's increase button SHALL be rendered with the `disabled` attribute set and SHALL NOT trigger a quantity change when clicked.
4. WHEN a user clicks the remove button on a CartItem, THE CartContext SHALL dispatch `REMOVE_ITEM` for that item's `id`, and the item SHALL no longer appear in the Cart list on the next render.
5. IF a CartItem's quantity is greater than or equal to 5, THEN THE CartItem SHALL render a badge with the text "🛒 Bulk Order" using a gold linear-gradient background (`#f59e0b → #b45309`), white (`#fff`) text, a `box-shadow` with an amber glow (`rgba(245,158,11,0.45)`), and a repeating CSS shimmer (`@keyframes`) sweep animation with a cycle duration of 2.4 s.
6. THE Cart page SHALL display an Order Summary panel containing: the raw subtotal, one row per applied Rule 1 product discount (when `itemDiscounts` is non-empty), a Rule 2 cart discount row (when `cartDiscountApplied` is `true`), a Custom Rule discount row (when `customDiscountAmount > 0`), and the final total; discount rows with an amount of 0 SHALL NOT be rendered.
7. IF `totalSaved` returned by `computeDiscounts` is greater than 0, THEN THE Cart page SHALL render a savings banner below the order summary rows containing the text "You save ₹N!" where N is `totalSaved` formatted with `formatINR`.
8. IF the Cart array is empty, THEN THE Cart page SHALL render an empty-state section containing an icon, a heading, a descriptive message, and a button with the label "Browse Products →" that navigates to `/products`; the cart items list and Order Summary panel SHALL NOT be rendered.
9. THE Cart page SHALL render a "Proceed to Checkout →" button that, when clicked by a user while the Cart is non-empty, navigates to `/checkout`.
10. THE Cart page SHALL render a "Clear Cart" button that, when clicked, dispatches `CLEAR_CART` to the CartContext, resulting in an empty Cart array and the empty-state view being displayed.

---

### Requirement 3: Checkout Page

**User Story:** As a shopper, I want to see a complete discount breakdown and the final payable amount before placing my order, so that I understand exactly what I'm paying.

#### Acceptance Criteria

1. THE Checkout page SHALL display each order item with: the product's emoji, name, the formula `₹price × qty = ₹lineTotal`, the original line total, and, when Rule 1 applies, the discounted line total.
2. IF a CartItem's `qty` is greater than or equal to 3, THEN THE Checkout page SHALL render a green "10% off" badge beside that item's name AND SHALL display the original line total with a CSS `text-decoration: line-through` strikethrough style.
3. IF any of the following is true — `itemDiscounts` is non-empty, `cartDiscountApplied` is `true`, or `customDiscountAmount > 0` — THEN THE Checkout page SHALL render a "Discounts Applied" section; WHEN that section is rendered, each applicable discount SHALL appear as one row containing a descriptive label and the saved amount formatted as `−₹N`.
4. IF `customDiscountAmount` equals 0 AND `customDiscountLabel` is a non-empty string, THEN THE Checkout page SHALL render the inactive rule's label in a muted style (reduced opacity or `color: var(--muted)`) with a `—` placeholder in the amount column to indicate the rule is configured but not currently active.
5. THE Checkout page SHALL always render an "Active Custom Rule" chip displaying the `customRuleName` value and the `CUSTOM_RULE` identifier (e.g. "Buy 2 Get 1 Free (OptionA)") with a background of `var(--primary-light)` and text colour of `var(--primary)`.
6. THE Checkout page's Bill Summary panel SHALL display rows in this order: Subtotal (always), Product Discount (IF `totalItemDiscount > 0`), After Product Discounts (IF `cartDiscountApplied`), Cart Discount 5% (IF `cartDiscountApplied`), Custom Discount (IF `customDiscountAmount > 0`), Total Savings (IF `totalSaved > 0`), and Final Amount Payable (always).
7. WHEN a user clicks "Place Order 🎉", THE Checkout page SHALL invoke `clearCart()` on the CartContext and SHALL transition to an order-confirmation view displaying a success icon, the text "Order Placed!", the final paid amount formatted as `₹N`, and — IF `totalSaved > 0` — the text "You saved ₹N on this order!"; the confirmation view SHALL also render a "Continue Shopping →" button that navigates to `/products`.
8. IF the Cart is empty AND the order has NOT been placed, THEN THE Checkout page SHALL render an empty-state section containing an icon, the heading "Nothing to checkout", a descriptive message, and a "Shop Now →" button that navigates to `/products`; the order items and Bill Summary panel SHALL NOT be rendered.

---

### Requirement 4: Custom Discount Module

**User Story:** As a developer, I want a configurable isolated discount module, so that I can switch between promotional rules by changing a single constant.

#### Acceptance Criteria

1. THE DiscountCustom module SHALL export a `CUSTOM_RULE` string constant whose value is one of `'OptionA'`, `'OptionB'`, `'OptionC'`, `'OptionD'`, or `'OptionE'`; changing this constant and reloading the app SHALL activate the corresponding rule across all discount computations.
2. THE DiscountCustom module SHALL export a `computeCustomDiscount(cart, cartTotal)` pure function that accepts the current cart array and a numeric cart total, and returns a plain object `{ label: string, amount: number }` where `amount` is a non-negative number representing the monetary discount and `label` is a human-readable description of the rule applied.
3. WHEN `CUSTOM_RULE` is `'OptionA'` (Buy 2 Get 1 Free) AND the cart is non-empty, THE function SHALL compute, for each product, `Math.floor(item.qty / 3) × item.price` free units and return the sum of these values as `amount`; WHEN the cart is empty, it SHALL return `{ label: '🎁 Buy 2 Get 1 Free', amount: 0 }`.
4. WHEN `CUSTOM_RULE` is `'OptionB'` (Cheapest Item 50% Off) AND the cart is non-empty, THE function SHALL identify the product with the lowest `price` value (using the first one found in case of a tie) and return `{ label: string, amount: cheapestProduct.price * 0.5 }`; WHEN the cart is empty, it SHALL return `{ label: '', amount: 0 }`.
5. WHEN `CUSTOM_RULE` is `'OptionC'` (Every 4th Item Free) AND `Math.floor(totalCartUnits / 4) > 0` where `totalCartUnits` is the sum of all `item.qty` values, THE function SHALL return `{ label: string, amount: freeUnits × cheapestUnitPrice }` where `cheapestUnitPrice` is `Math.min(...cart.map(i => i.price))`; WHEN `totalCartUnits < 4`, it SHALL return `{ label: '🎟️ Every 4th Item Free', amount: 0 }`.
6. WHEN `CUSTOM_RULE` is `'OptionD'` (Weekend 15% Discount) AND `new Date().getDay()` equals 0 (Sunday) or 6 (Saturday), THE function SHALL return `{ label: '📅 Weekend 15% Discount', amount: cartTotal * 0.15 }`; WHEN the day is 1–5 (weekday), it SHALL return `{ label: '📅 Weekend 15% Discount (weekdays only — active Sat/Sun)', amount: 0 }`.
7. WHEN `CUSTOM_RULE` is `'OptionE'` (Category Based Discount) AND the cart is non-empty, THE function SHALL compute per-product discounts using the rate map `{ Electronics: 0.08, Fashion: 0.12 }` with a default rate of `0.05` for all other categories, and return the sum of `item.price × item.qty × rate` as `amount`.
8. THE DiscountCalculator module (`discountCalculator.js`) SHALL import `computeCustomDiscount` and `CUSTOM_RULE_NAMES` from the DiscountCustom module, invoke `computeCustomDiscount(cart, afterCartDiscount)` after computing Rule 2, subtract the returned `amount` from the running total to produce `finalAmount`, and include `customDiscountAmount`, `customDiscountLabel`, and `customRuleName` in the returned object.
9. IF `CUSTOM_RULE` is set to any value not in the set `{'OptionA','OptionB','OptionC','OptionD','OptionE'}`, THEN `computeCustomDiscount` SHALL return `{ label: '', amount: 0 }` without throwing an error.

---

### Requirement 5: State Management

**User Story:** As a developer, I want all cart state centrally managed via Context API and useReducer, so that any component can read or mutate cart state without prop drilling.

#### Acceptance Criteria

1. THE CartContext SHALL store cart state as an array of CartItems, each object containing the full product fields (`id`, `name`, `price`, `stock`, `emoji`, `category`, `description`) plus a `qty` property representing the selected quantity.
2. WHEN `addToCart(product)` is called and the product's `id` already exists in the Cart with `qty === MAX_QTY` (10), THE `addToCart` function SHALL return `{ error: string }` and SHALL NOT dispatch any action to the reducer.
3. WHEN `addToCart(product)` is called and the product's `id` does not exist in the Cart, THE CartContext SHALL dispatch `ADD_ITEM`, resulting in a new CartItem with `qty: 1` appended to the cart array.
4. WHEN `addToCart(product)` is called and the product's `id` already exists in the Cart with `qty < MAX_QTY`, THE CartContext SHALL dispatch `ADD_ITEM`, incrementing that item's `qty` by 1.
5. WHEN `updateQty(id, delta)` is called with a `delta` that would result in `qty + delta < MIN_QTY` (1) or `qty + delta > MAX_QTY` (10), THE CartContext SHALL NOT dispatch any action and the cart array SHALL remain unchanged.
6. WHEN `removeItem(id)` is called, THE CartContext SHALL dispatch `REMOVE_ITEM`, and the resulting cart array SHALL not contain any item with the given `id`.
7. WHEN `clearCart()` is called, THE CartContext SHALL dispatch `CLEAR_CART`, and the resulting cart array SHALL be empty (`length === 0`).
8. THE CartContext SHALL expose a derived `totalItems` value computed as `cart.reduce((sum, i) => sum + i.qty, 0)`, memoised with `useMemo` so it recomputes only when the `cart` array reference changes.

---

### Requirement 6: Routing and Lazy Loading

**User Story:** As a developer, I want client-side routing with code splitting on heavy pages, so that the initial bundle is small and pages load efficiently.

#### Acceptance Criteria

1. THE `main.jsx` entry point SHALL wrap `<App>` in a `<BrowserRouter>` component so that all descendant components can use React Router hooks.
2. THE AppRoutes component SHALL define exactly three named routes: `/products` rendered by the Products component (imported eagerly), `/cart` rendered by a `React.lazy`-loaded Cart component, and `/checkout` rendered by a `React.lazy`-loaded Checkout component.
3. THE AppRoutes component SHALL include a catch-all route that redirects both the root path `/` and any unmatched path to `/products` using a `<Navigate replace>` element.
4. WHEN the browser navigates to `/cart` or `/checkout` and the lazy chunk has not yet been fetched, THE App SHALL render a `<Loader />` component as the Suspense fallback until the chunk is fully loaded.
5. THE NavBar SHALL render three `<NavLink>` elements for `/products`, `/cart`, and `/checkout`; each link SHALL apply a visually distinct active style (e.g. `background: var(--primary-light); color: var(--primary)`) when its `to` path matches the current URL pathname.
6. IF `totalItems` in the CartContext is greater than 0, THEN THE NavBar SHALL render a numeric badge element overlaid on the Cart link displaying the exact `totalItems` value; IF `totalItems` equals 0, the badge SHALL NOT be rendered.

---

### Requirement 7: Performance Optimisation

**User Story:** As a developer, I want targeted memoisation applied to expensive computations and frequently re-rendered components, so that the app remains responsive as cart size grows.

#### Acceptance Criteria

1. THE ProductCard component SHALL be exported as `React.memo(ProductCard)` so that React skips re-rendering the component when the `product` and `onAdd` props are referentially equal to their previous values.
2. THE CartItem component SHALL be exported as `React.memo(CartItem)` so that React skips re-rendering the component when the `item` prop is referentially equal to its previous value.
3. THE Products page SHALL compute the filtered and sorted product list using `useMemo` with a dependency array of `[search, category, sort]`, ensuring the sort and filter logic runs only when one of those three state values changes.
4. THE Products page SHALL define the `handleAdd` callback using `useCallback` with a dependency array of `[addToCart, showToast]` (or equivalent stable references), ensuring the callback reference is stable across renders when those dependencies have not changed.
5. THE CartContext SHALL derive `totalItems` using `useMemo` with a dependency array of `[cart]`, ensuring the reduce runs only when the cart array reference changes.

---

### Requirement 8: UI and Visual Standards

**User Story:** As a shopper, I want a premium, visually consistent interface with smooth interactions, so that the app feels polished and trustworthy.

#### Acceptance Criteria

1. THE App SHALL reference CSS custom properties defined in `index.css` (including `--primary`, `--primary-dark`, `--primary-light`, `--surface`, `--bg`, `--border`, `--muted`, `--text`, `--radius`, `--radius-lg`) for all colour and spacing decisions across all components and pages; hardcoded colour literals that duplicate these values SHALL NOT be introduced.
2. THE NavBar SHALL have `position: sticky; top: 0` with `z-index ≥ 100`, a `backdrop-filter: blur(...)` frosted-glass effect, and a `box-shadow` on its bottom edge visible against the page background.
3. WHEN a user's pointer enters a ProductCard whose `stock > 0`, the `transform` and `box-shadow` CSS properties SHALL transition with a duration of at least 200 ms and an `ease` (or equivalent) timing function.
4. THE product grid on `/products` SHALL be responsive: ≥ 3 columns on viewports ≥ 900 px; 2 columns on 500–899 px; 1 column on < 500 px; cart and checkout two-column layouts SHALL stack to a single column on viewports < 700 px.
5. THE Loader component SHALL display a spinner element that continuously rotates via a CSS `@keyframes` rule with a rotation of 360° over a fixed duration (e.g. 0.7 s linear infinite) while the Suspense fallback is active.
6. THE Toast notification SHALL enter with a slide-up CSS animation and SHALL automatically disappear after exactly 2400 ms from the time it is shown, without requiring user interaction.
7. THE Checkout Bill Summary panel SHALL render the final payable amount inside a container with a `background` of `linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)`, `color: #fff`, and `border-radius: var(--radius-lg)` for visual emphasis.
