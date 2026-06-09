import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ToastProvider } from '../components/Toast'
import CartItem from '../components/CartItem'
import Button from '../components/Button'
import { computeDiscounts, formatINR } from '../utils/discountCalculator'
import styles from './Cart.module.css'

function CartInner() {
  const { cart, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const {
    subtotal,
    itemDiscounts,
    cartDiscount,
    cartDiscountApplied,
    customDiscountAmount,
    customDiscountLabel,
    customRuleName,
    finalAmount,
    totalSaved,
  } = computeDiscounts(cart)

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Browse our products and add something you like.</p>
          <Button onClick={() => navigate('/products')} size="md">
            Browse Products →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.sub}>
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className={styles.layout}>
        {/* Cart Items */}
        <div className={styles.itemsCard}>
          <div className={styles.cardHeader}>
            <span>Cart Items</span>
            <span className={styles.cartCount}>{totalItems} items</span>
          </div>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>

          <div className={styles.summaryRow}>
            <span className={styles.label}>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>

          {itemDiscounts.map((d, i) => (
            <div key={i} className={styles.summaryRow}>
              <span className={styles.label} style={{ fontSize: 12 }}>
                Product discounts
              </span>
              <span className={styles.discountVal}>−{formatINR(d.amount)}</span>
            </div>
          ))}

          {cartDiscountApplied && (
            <div className={styles.summaryRow}>
              <span className={styles.label} style={{ fontSize: 12 }}>
                Cart discount (5%)
              </span>
              <span className={styles.discountVal}>−{formatINR(cartDiscount)}</span>
            </div>
          )}

          {customDiscountAmount > 0 && (
            <div className={styles.summaryRow}>
              <span className={styles.label} style={{ fontSize: 12 }}>
                {customRuleName}
              </span>
              <span className={styles.discountValCustom}>
                −{formatINR(customDiscountAmount)}
              </span>
            </div>
          )}

          <div className={`${styles.summaryRow} ${styles.finalRow}`}>
            <span>Total</span>
            <span style={{ color: totalSaved > 0 ? 'var(--success)' : 'inherit' }}>
              {formatINR(finalAmount)}
            </span>
          </div>

          {totalSaved > 0 && (
            <div className={styles.savingsBanner}>
              🎉 You save {formatINR(totalSaved)}!
            </div>
          )}

          <Button
            fullWidth
            size="md"
            onClick={() => navigate('/checkout')}
            className={styles.checkoutBtn}
          >
            Proceed to Checkout →
          </Button>

          <Button
            fullWidth
            variant="ghost"
            size="sm"
            onClick={() => navigate('/products')}
            style={{ marginTop: 8 }}
          >
            ← Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

// Cart page is lazy-loaded — must be a default export
export default function Cart() {
  return (
    <ToastProvider>
      <CartInner />
    </ToastProvider>
  )
}
