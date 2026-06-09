import React from 'react'
import styles from './Button.module.css'

/**
 * Reusable Button component
 * @param {'primary'|'ghost'|'danger'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} disabled
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
