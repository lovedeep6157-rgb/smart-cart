import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './NavBar.module.css'

export default function NavBar() {
  const { totalItems } = useCart()
  const navigate = useNavigate()

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand} onClick={() => navigate('/products')} role="link" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/products')}>
          <div className={styles.brandIcon} aria-hidden="true">🛍️</div>
          <span className={styles.brandText}>SmartCart</span>
        </div>

        {/* Nav tabs */}
        <div className={styles.tabs} role="menubar">
          <NavLink
            to="/products"
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            role="menuitem"
          >
            🏪 Products
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            role="menuitem"
            aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className={styles.badge} aria-hidden="true">{totalItems}</span>
            )}
          </NavLink>

          <NavLink
            to="/checkout"
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            role="menuitem"
          >
            ✅ Checkout
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}
            role="menuitem"
          >
            📬 Contact
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
