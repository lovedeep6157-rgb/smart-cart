import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loader from '../components/Loader'

// Products page loads eagerly (landing page)
import Products from '../pages/Products'

// Cart, Checkout, and Contact use React.lazy for code splitting
const Cart     = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Contact  = lazy(() => import('../pages/Contact'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<Products />} />
      <Route
        path="/cart"
        element={
          <Suspense fallback={<Loader />}>
            <Cart />
          </Suspense>
        }
      />
      <Route
        path="/checkout"
        element={
          <Suspense fallback={<Loader />}>
            <Checkout />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<Loader />}>
            <Contact />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}
