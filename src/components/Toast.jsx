import React, { createContext, useContext, useState, useCallback } from 'react'
import styles from './Toast.module.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, icon = '✓') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, icon }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2400)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={styles.container}>
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast}>
            <span className={styles.icon}>{t.icon}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
