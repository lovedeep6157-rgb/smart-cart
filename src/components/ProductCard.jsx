import React, { useCallback } from 'react'
import { useCart } from '../context/CartContext'
import Button from './Button'
import styles from './ProductCard.module.css'

function StockBadge({ stock }) {
  if (stock === 0)
    return <span className={`${styles.stockBadge} ${styles.out}`}>Out of Stock</span>
  if (stock <= 5)
    return <span className={`${styles.stockBadge} ${styles.low}`}>Only {stock} left</span>
  return <span className={`${styles.stockBadge} ${styles.ok}`}>In Stock</span>
}

// Map category to a subtle gradient background for the image placeholder
const CATEGORY_GRADIENTS = {
  Electronics: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
  Kitchen:     'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
  Fitness:     'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
  Books:       'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
  Home:        'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
  Fashion:     'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'

export default React.memo(function ProductCard({ product, onAdd }) {
  const { addToCart, cart } = useCart()
  const inCart = cart.find((i) => i.id === product.id)
  const isOutOfStock = product.stock === 0

  const handleAdd = useCallback(() => {
    if (onAdd) {
      onAdd(product)
    } else {
      addToCart(product)
    }
  }, [onAdd, addToCart, product])

  const bg = CATEGORY_GRADIENTS[product.category] ?? DEFAULT_GRADIENT

  return (
    <div className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`}>
      {/* Image / Emoji Placeholder */}
      <div className={styles.imgWrapper} style={{ background: bg }}>
        <div className={styles.emojiContainer}>
          <span className={styles.emoji} role="img" aria-label={product.name}>
            {product.emoji}
          </span>
        </div>
        {isOutOfStock && (
          <div className={styles.outOfStockOverlay}>
            <span className={styles.outOfStockText}>Out of Stock</span>
          </div>
        )}
        <span className={styles.categoryChip}>{product.category}</span>
      </div>

      {/* Card Body */}
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={isOutOfStock ? styles.disabledBtn : styles.addBtn}
          >
            {isOutOfStock
              ? 'Out of Stock'
              : inCart
              ? `In Cart (${inCart.qty}) ＋`
              : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
})
