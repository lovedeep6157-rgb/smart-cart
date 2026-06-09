import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { computeDiscounts, formatINR } from '../utils/discountCalculator'
import { CUSTOM_RULE } from '../utils/discountCustom'
import styles from './Checkout.module.css'

// Checkout page is lazy-loaded — must be default export
export default function Checkout() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(false)

  const {
    subtotal,
    itemDiscounts,
    totalItemDiscount,
    afterItemDiscount,
    cartDiscount,
    cartDiscountApplied,
    customDiscountAmount,
    customDiscountLabel,
    customRuleName,
    finalAmount,
    totalSaved,
  } = computeDiscounts(cart)

  // ── Empty cart (and not just placed) ────────────────────────────────────
  if (cart.length === 0 && !placed) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.empty}>
          <span>🛒</span>
          <h2>Nothing to checkout</h2>
          <p>Your cart is empty. Add items before checking out.</p>
          <Button onClick={() => navigate('/products')}>Shop Now →</Button>
        </div>
      </div>
    )
  }

  // ── Order Placed Confirmation ────────────────────────────────────────────
  if (placed) {
    return (
      <div className={styles.page}>
        <div className={styles.confirmation}>
          <div className={styles.confIcon}>🎉</div>
          <h2>Order Placed!</h2>
          <p className={styles.confSub}>
            Your order worth {formatINR(finalAmount)} has been confirmed.
          </p>
          {totalSaved > 0 && (
            <p className={styles.confSaved}>
              You saved {formatINR(totalSaved)} on this order!
            </p>
          )}
          <Button
            onClick={() => {
              setPlaced(false)
              navigate('/products')
            }}
            size="lg"
          >
            Continue Shopping →
          </Button>
        </div>
      </div>
    )
  }

  const hasAnyDiscount =
    itemDiscounts.length > 0 || cartDiscountApplied || customDiscountAmount > 0

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>
      <p className={styles.sub}>Review your order and confirm</p>

      <div className={styles.layout}>
        {/* Left column */}
        <div>
          {/* Order Items */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Order Items</h3>
            {cart.map((item) => {
              const lineTotal = item.price * item.qty
              const disc = item.qty >= 3 ? lineTotal * 0.1 : 0
              return (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemEmoji}>{item.emoji}</div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemMeta}>
                      {formatINR(item.price)} × {item.qty} = {formatINR(lineTotal)}
                    </span>
                  </div>
                  {disc > 0 && <Badge variant="success">10% off</Badge>}
                  <div className={styles.itemTotal}>
                    {disc > 0 && (
                      <span className={styles.origPrice}>{formatINR(lineTotal)}</span>
                    )}
                    <span
                      className={styles.discPrice}
                      style={{ color: disc > 0 ? 'var(--success)' : 'inherit' }}
                    >
                      {formatINR(lineTotal - disc)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Applied Discounts */}
          {hasAnyDiscount && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Discounts Applied</h3>

              {itemDiscounts.map((d, i) => (
                <div key={i} className={styles.discRow}>
                  <span className={styles.discLabel}>
                    📦 {d.label} —{' '}
                    {d.name.length > 35 ? d.name.slice(0, 35) + '…' : d.name}
                  </span>
                  <span className={styles.discAmount}>−{formatINR(d.amount)}</span>
                </div>
              ))}

              {cartDiscountApplied && (
                <div className={styles.discRow}>
                  <span className={styles.discLabel}>
                    🛒 Cart total over ₹5,000 — extra 5% off
                  </span>
                  <span className={styles.discAmount}>−{formatINR(cartDiscount)}</span>
                </div>
              )}

              {customDiscountAmount > 0 && (
                <div className={`${styles.discRow} ${styles.customDiscRow}`}>
                  <span className={styles.discLabel}>
                    {customDiscountLabel || `✨ ${customRuleName}`}
                  </span>
                  <span className={styles.discAmount}>
                    −{formatINR(customDiscountAmount)}
                  </span>
                </div>
              )}

              {/* Show active rule even when amount is 0 (e.g. OptionD on weekday) */}
              {customDiscountAmount === 0 && customDiscountLabel && (
                <div className={`${styles.discRow} ${styles.inactiveDiscRow}`}>
                  <span className={styles.discLabelMuted}>{customDiscountLabel}</span>
                  <span className={styles.discAmountMuted}>—</span>
                </div>
              )}
            </div>
          )}

          {/* Active custom rule chip */}
          <div className={styles.ruleChip}>
            <span className={styles.ruleChipLabel}>Active Custom Rule</span>
            <span className={styles.ruleChipValue}>{customRuleName} ({CUSTOM_RULE})</span>
          </div>
        </div>

        {/* Right column: Bill summary */}
        <div>
          <div className={styles.billCard}>
            <h3 className={styles.sectionTitle}>Discount Summary</h3>

            <div className={styles.billRow}>
              <span className={styles.billLabel}>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            {itemDiscounts.length > 0 && (
              <div className={styles.billRow}>
                <span className={styles.billLabel}>Product Discount</span>
                <span className={styles.green}>−{formatINR(totalItemDiscount)}</span>
              </div>
            )}

            {cartDiscountApplied && (
              <>
                <div className={styles.billRow}>
                  <span className={styles.billLabel}>After Product Discounts</span>
                  <span>{formatINR(afterItemDiscount)}</span>
                </div>
                <div className={styles.billRow}>
                  <span className={styles.billLabel}>Cart Discount (5%)</span>
                  <span className={styles.green}>−{formatINR(cartDiscount)}</span>
                </div>
              </>
            )}

            {customDiscountAmount > 0 && (
              <div className={styles.billRow}>
                <span className={styles.billLabel}>Custom Discount</span>
                <span className={styles.customGreen}>−{formatINR(customDiscountAmount)}</span>
              </div>
            )}

            {totalSaved > 0 && (
              <div className={styles.billRow}>
                <span className={styles.billLabel}>Total Savings</span>
                <span className={styles.green} style={{ fontWeight: 700 }}>
                  −{formatINR(totalSaved)}
                </span>
              </div>
            )}

            <div className={`${styles.billRow} ${styles.finalBillRow}`}>
              <span>Final Amount</span>
              <span style={{ color: 'var(--primary)' }}>{formatINR(finalAmount)}</span>
            </div>

            {/* Final amount box */}
            <div className={styles.finalBox}>
              <p className={styles.finalLabel}>Final Payable Amount</p>
              <p className={styles.finalAmount}>{formatINR(finalAmount)}</p>
              {totalSaved > 0 && (
                <p className={styles.finalSaved}>
                  🎉 You saved {formatINR(totalSaved)}!
                </p>
              )}
            </div>

            <Button
              fullWidth
              size="md"
              onClick={() => {
                clearCart()
                setPlaced(true)
              }}
              className={styles.placeBtn}
            >
              Place Order 🎉
            </Button>

            <Button
              fullWidth
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              style={{ marginTop: 8 }}
            >
              ← Back to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
