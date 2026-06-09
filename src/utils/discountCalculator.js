/**
 * discountCalculator.js
 * Centralised discount logic for the SmartCart application.
 *
 * Rule 1 – Bulk discount:
 *   If a customer buys 3 or more units of the same product,
 *   apply a 10% discount to that product's subtotal.
 *
 * Rule 2 – Cart-level discount:
 *   If the cart subtotal (before any discount) exceeds ₹5000,
 *   apply an additional 5% discount on the post-Rule-1 total.
 *
 * Custom Rule – Configurable via discountCustom.js (OptionA–E).
 */

import { computeCustomDiscount, CUSTOM_RULE, CUSTOM_RULE_NAMES } from './discountCustom.js'

/**
 * @param {Array} cart  Array of cart items { id, name, price, qty, ... }
 * @returns {Object}    Breakdown with all amounts and applied discounts
 */
export function computeDiscounts(cart) {
  let subtotal = 0
  const itemDiscounts = []

  cart.forEach((item) => {
    const lineTotal = item.price * item.qty
    subtotal += lineTotal

    // Rule 1: 3+ units of same product → 10% off that line
    if (item.qty >= 3) {
      const discountAmount = lineTotal * 0.1
      itemDiscounts.push({
        productId: item.id,
        name: item.name,
        label: `Bulk discount – 10% off (qty ≥ 3)`,
        amount: discountAmount,
      })
    }
  })

  const totalItemDiscount = itemDiscounts.reduce((sum, d) => sum + d.amount, 0)
  const afterItemDiscount = subtotal - totalItemDiscount

  // Rule 2: Cart total > ₹5000 → extra 5% on post-Rule-1 total
  let cartDiscount = 0
  let cartDiscountApplied = false
  if (subtotal > 5000) {
    cartDiscount = afterItemDiscount * 0.05
    cartDiscountApplied = true
  }

  const afterCartDiscount = afterItemDiscount - cartDiscount

  // Custom Rule
  const customDiscount = computeCustomDiscount(cart, afterCartDiscount)
  const customDiscountAmount = customDiscount.amount ?? 0
  const customDiscountLabel = customDiscount.label ?? ''

  const finalAmount = Math.max(0, afterCartDiscount - customDiscountAmount)
  const totalSaved = subtotal - finalAmount

  return {
    subtotal,               // raw total, no discounts
    itemDiscounts,          // array of per-product discount objects
    totalItemDiscount,      // sum of all product-level discounts
    afterItemDiscount,      // subtotal after product discounts
    cartDiscount,           // Rule 2 discount amount
    cartDiscountApplied,
    customDiscountAmount,   // custom rule discount amount
    customDiscountLabel,    // human-readable label for custom rule
    customRuleName: CUSTOM_RULE_NAMES[CUSTOM_RULE] ?? CUSTOM_RULE,
    finalAmount,            // amount user pays
    totalSaved,             // total amount saved
  }
}

/** Helper: format a number as Indian Rupees */
export function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}
