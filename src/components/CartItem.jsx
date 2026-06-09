import React, { useCallback } from 'react'
import { useCart } from '../context/CartContext'
import Badge from './Badge'
import styles from './CartItem.module.css'

export default React.memo(function CartItem({ item }) {
  const { updateQty, removeItem, MAX_QTY, MIN_QTY } = useCart()
  const lineTotal = item.price * item.qty

  const handleIncrease = useCallback(() => updateQty(item.id, +1), [item.id, updateQty])
  const handleDecrease = useCallback(() => updateQty(item.id, -1), [item.id, updateQty])
  const handleRemove   = useCallback(() => removeItem(item.id), [item.id, removeItem])

  return (
    <div className={styles.item}>
      {/* Emoji thumbnail */}
      <div className={styles.thumb}>{item.emoji}</div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{item.name}</span>
          {item.qty >= 5 && (
            <Badge variant="bulk">🛒 Bulk Order</Badge>
          )}
        </div>
        <span className={styles.unitPrice}>
          ₹{item.price.toLocaleString('en-IN')} each
        </span>
      </div>

      {/* Quantity controls */}
      <div className={styles.qtyCtrl}>
        <button
          className={styles.qtyBtn}
          onClick={handleDecrease}
          disabled={item.qty <= MIN_QTY}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.qtyVal}>{item.qty}</span>
        <button
          className={styles.qtyBtn}
          onClick={handleIncrease}
          disabled={item.qty >= MAX_QTY}
          aria-label="Increase quantity"
        >
          ＋
        </button>
      </div>

      {/* Line total */}
      <div className={styles.total}>
        ₹{lineTotal.toLocaleString('en-IN')}
      </div>

      {/* Remove */}
      <button
        className={styles.removeBtn}
        onClick={handleRemove}
        aria-label={`Remove ${item.name}`}
        title="Remove item"
      >
        ✕
      </button>
    </div>
  )
})
