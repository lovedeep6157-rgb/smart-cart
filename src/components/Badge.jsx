import React from 'react'
import styles from './Badge.module.css'

/**
 * Badge component
 * @param {'success'|'warning'|'danger'|'info'|'bulk'} variant
 */
export default function Badge({ children, variant = 'info' }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  )
}
