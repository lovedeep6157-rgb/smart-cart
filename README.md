# SmartCart – E-Commerce React Application

## Project Overview

SmartCart is a fully functional e-commerce application built with React.js as part of the Final Internship Assignment. Users can browse products, add them to a cart, manage quantities, and complete checkout with automatic discount calculations.

---

## Tech Stack

- **React 18** – UI library
- **React Router DOM v6** – client-side routing
- **Context API + useReducer** – global state management
- **CSS Modules** – scoped, component-level styling
- **Vite** – build tool & dev server
- **React.lazy + Suspense** – code splitting for Cart and Checkout pages

---

## Folder Structure

```
src/
├── assets/
├── components/
│   ├── Badge.jsx / Badge.module.css
│   ├── Button.jsx / Button.module.css
│   ├── CartItem.jsx / CartItem.module.css
│   ├── Loader.jsx / Loader.module.css
│   ├── NavBar.jsx / NavBar.module.css
│   ├── ProductCard.jsx / ProductCard.module.css
│   └── Toast.jsx / Toast.module.css
├── context/
│   └── CartContext.jsx
├── data/
│   └── products.json
├── pages/
│   ├── Products.jsx / Products.module.css
│   ├── Cart.jsx / Cart.module.css
│   └── Checkout.jsx / Checkout.module.css
├── routes/
│   └── AppRoutes.jsx
├── utils/
│   └── discountCalculator.js
├── App.jsx
├── index.css
└── main.jsx
```

---

## Features Implemented

### Core Features
- **Product Listing Page** — 12 products with search, category filter, and sort
- **Stock validation** — out-of-stock products show "Unavailable" and cannot be added
- **Cart Page** — add, increase/decrease quantity (1–10), remove items
- **Bulk Purchase badge** — shown when item quantity reaches 5 or more
- **Checkout Page** — full order summary with applied discounts and final payable amount

### Discount Rules
- **Rule 1:** 3+ units of the same product → 10% discount on that product's subtotal
- **Rule 2:** Cart total > ₹5,000 → extra 5% on post-Rule-1 total
- All discounts are clearly displayed on the Checkout page

### Bonus Features
- **Search products** — live search filter
- **Category filter** — filter by product category
- **Sort products** — sort by price (asc/desc) or name
- **Toast notifications** — feedback for add/remove actions
- **React.lazy + Suspense** — Cart and Checkout pages are code-split

### Technical
- **React Router DOM** — `/products`, `/cart`, `/checkout` routes
- **Context API + useReducer** — cart state management
- **CSS Modules** — no global class conflicts
- **Reusable components** — Button, Badge, Loader, CartItem, ProductCard, NavBar, Toast

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Assumptions Made

1. Products are loaded from a local JSON file (`src/data/products.json`).
2. The "Individual Discount Rule" was not assigned — the standard Rule 1 and Rule 2 are implemented.
3. Discount Rule 2 applies on the post-Rule-1 amount (not the raw subtotal).
4. Cart data is stored in memory (React state) and resets on page refresh.
5. Product images are represented by emoji for simplicity.

---

## Challenges Faced

- Ensuring discount calculations are accurate and clearly displayed on checkout.
- Managing Suspense boundaries correctly for lazy-loaded routes.
- Keeping CSS Modules scoped while maintaining a consistent design system.

---

## Known Issues

- Cart does not persist after page refresh (no localStorage used).
- No backend — all data is static from `products.json`.

---

## Future Improvements

- Persistent cart using `localStorage` or IndexedDB
- Backend API integration (Node.js/Express or Firebase)
- User authentication and order history
- Dark mode toggle
- Wishlist feature
- Product detail modal/page
- Proper image hosting instead of emoji placeholders
