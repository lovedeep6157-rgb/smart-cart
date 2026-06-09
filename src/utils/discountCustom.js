/**
 * discountCustom.js
 * Configurable custom discount rules for SmartCart.
 *
 * Switch CUSTOM_RULE to any of the options below to activate that rule.
 *
 * OptionA – Buy 2 Get 1 Free
 * OptionB – Cheapest Item 50% Off
 * OptionC – Every 4th Item Free
 * OptionD – Weekend 15% Discount
 * OptionE – Category Based Discount (Electronics 8%, Fashion 12%)
 */

export const CUSTOM_RULE = 'OptionA'

// ─── Rule Implementations ───────────────────────────────────────────────────

/**
 * OptionA: Buy 2 Get 1 Free
 * For every 3 units of any single product, 1 unit is free.
 * Works per-product; discount = floor(qty / 3) × unit price.
 *
 * @param {Array} cart
 * @returns {{ label: string, amount: number }}
 */
function applyOptionA(cart) {
  let discountAmount = 0
  cart.forEach((item) => {
    const freeUnits = Math.floor(item.qty / 3)
    discountAmount += freeUnits * item.price
  })
  return {
    label: '🎁 Buy 2 Get 1 Free',
    amount: discountAmount,
  }
}

/**
 * OptionB: Cheapest Item 50% Off
 * The single cheapest item in the cart gets a 50% discount.
 *
 * @param {Array} cart
 * @returns {{ label: string, amount: number }}
 */
function applyOptionB(cart) {
  if (cart.length === 0) return { label: '', amount: 0 }
  const cheapest = cart.reduce((min, item) =>
    item.price < min.price ? item : min
  )
  return {
    label: `🏷️ Cheapest Item 50% Off (${cheapest.name.length > 28 ? cheapest.name.slice(0, 28) + '…' : cheapest.name})`,
    amount: cheapest.price * 0.5,
  }
}

/**
 * OptionC: Every 4th Item Free
 * Across the entire cart (flattened by unit), every 4th unit is free.
 * Free units are priced at the cheapest available unit price in the cart.
 *
 * @param {Array} cart
 * @returns {{ label: string, amount: number }}
 */
function applyOptionC(cart) {
  const totalUnits = cart.reduce((s, i) => s + i.qty, 0)
  const freeUnits = Math.floor(totalUnits / 4)
  if (freeUnits === 0) return { label: '🎟️ Every 4th Item Free', amount: 0 }

  // Cheapest unit price determines the free-unit value
  const cheapestPrice = Math.min(...cart.map((i) => i.price))
  const discountAmount = freeUnits * cheapestPrice

  return {
    label: `🎟️ Every 4th Item Free (${freeUnits} unit${freeUnits > 1 ? 's' : ''} free)`,
    amount: discountAmount,
  }
}

/**
 * OptionD: Weekend 15% Discount
 * Applies a flat 15% discount on the entire cart on Saturdays (6) and Sundays (0).
 * On weekdays, no discount is applied.
 *
 * @param {Array} cart
 * @param {number} cartTotal  Post-Rule-1-and-2 base to apply the % on
 * @returns {{ label: string, amount: number }}
 */
function applyOptionD(cart, cartTotal) {
  const day = new Date().getDay() // 0 = Sun, 6 = Sat
  const isWeekend = day === 0 || day === 6
  if (!isWeekend) {
    return {
      label: '📅 Weekend 15% Discount (weekdays only — active Sat/Sun)',
      amount: 0,
    }
  }
  return {
    label: '📅 Weekend 15% Discount',
    amount: cartTotal * 0.15,
  }
}

/**
 * OptionE: Category Based Discount
 * Electronics: 8% off; Fashion: 12% off; all other categories: 5% off.
 *
 * @param {Array} cart
 * @returns {{ label: string, amount: number }}
 */
function applyOptionE(cart) {
  const RATES = {
    Electronics: 0.08,
    Fashion: 0.12,
  }
  const DEFAULT_RATE = 0.05

  let discountAmount = 0
  cart.forEach((item) => {
    const rate = RATES[item.category] ?? DEFAULT_RATE
    discountAmount += item.price * item.qty * rate
  })

  return {
    label: '🏪 Category Discount (Electronics 8%, Fashion 12%, Others 5%)',
    amount: discountAmount,
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Compute the active custom discount based on CUSTOM_RULE.
 *
 * @param {Array}  cart       Array of cart items { id, name, price, qty, category, ... }
 * @param {number} cartTotal  Cart total after Rule 1 & Rule 2 (used for percentage-based rules)
 * @returns {{ label: string, amount: number }}
 */
export function computeCustomDiscount(cart, cartTotal = 0) {
  if (!cart || cart.length === 0) return { label: '', amount: 0 }

  switch (CUSTOM_RULE) {
    case 'OptionA': return applyOptionA(cart)
    case 'OptionB': return applyOptionB(cart)
    case 'OptionC': return applyOptionC(cart)
    case 'OptionD': return applyOptionD(cart, cartTotal)
    case 'OptionE': return applyOptionE(cart)
    default:        return { label: '', amount: 0 }
  }
}

/** Human-readable names for each option (useful for display) */
export const CUSTOM_RULE_NAMES = {
  OptionA: 'Buy 2 Get 1 Free',
  OptionB: 'Cheapest Item 50% Off',
  OptionC: 'Every 4th Item Free',
  OptionD: 'Weekend 15% Discount',
  OptionE: 'Category Based Discount',
}
