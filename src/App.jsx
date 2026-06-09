import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import AppRoutes from './routes/AppRoutes'
import NavBar from './components/NavBar'
import Loader from './components/Loader'

export default function App() {
  return (
    <CartProvider>
      <NavBar />
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </CartProvider>
  )
}
