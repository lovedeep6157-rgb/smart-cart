import React from 'react'
import styles from './Loader.module.css'

export default function Loader({ message = 'Loading…' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.text}>{message}</p>
    </div>
  )
}
