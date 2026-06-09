import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

// ─── Actions ────────────────────────────────────────────────────────────────
const ADD_ITEM    = 'ADD_ITEM'
const UPDATE_QTY  = 'UPDATE_QTY'
const REMOVE_ITEM = 'REMOVE_ITEM'
const CLEAR_CART  = 'CLEAR_CART'

const MAX_QTY = 10
const MIN_QTY = 1

// ─── Reducer ────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM: {
      const existing = state.find((i) => i.id === action.product.id)
      if (existing) {
        if (existing.qty >= MAX_QTY) return state           // silently cap
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.product, qty: 1 }]
    }

    case UPDATE_QTY: {
      return state.map((i) => {
        if (i.id !== action.id) return i
        const newQty = i.qty + action.delta
        if (newQty < MIN_QTY) return i
        if (newQty > MAX_QTY) return i
        return { ...i, qty: newQty }
      })
    }

    case REMOVE_ITEM:
      return state.filter((i) => i.id !== action.id)

    case CLEAR_CART:
      return []

    default:
      return state
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])

  const addToCart = useCallback((product) => {
    const existing = cart.find((i) => i.id === product.id)
    if (existing && existing.qty >= MAX_QTY) {
      return { error: `Maximum ${MAX_QTY} units allowed per product` }
    }
    dispatch({ type: ADD_ITEM, product })
    return { success: true }
  }, [cart])

  const updateQty = useCallback((id, delta) => {
    const item = cart.find((i) => i.id === id)
    if (!item) return
    if (item.qty + delta > MAX_QTY) {
      return { error: `Maximum ${MAX_QTY} units allowed` }
    }
    if (item.qty + delta < MIN_QTY) return
    dispatch({ type: UPDATE_QTY, id, delta })
    return { success: true }
  }, [cart])

  const removeItem = useCallback((id) => {
    dispatch({ type: REMOVE_ITEM, id })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: CLEAR_CART })
  }, [])

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const totalUnique = cart.length

  const value = {
    cart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
    totalUnique,
    MAX_QTY,
    MIN_QTY,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
