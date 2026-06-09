import React, { useState, useMemo, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { ToastProvider, useToast } from '../components/Toast'
import PRODUCTS from '../data/products.json'
import styles from './Products.module.css'

function ProductsInner() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const { addToCart } = useCart()
  const showToast = useToast()

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))]
  const inStockCount = PRODUCTS.filter((p) => p.stock > 0).length
  const categoryCount = new Set(PRODUCTS.map((p) => p.category)).size

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || p.category === category
      return matchSearch && matchCat
    })
    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'name-asc')   list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [search, category, sort])

  const handleAdd = useCallback((product) => {
    const result = addToCart(product)
    if (result?.error) {
      showToast(result.error, '⚠️')
    } else {
      showToast(`${product.name} added to cart`, '🛒')
    }
  }, [addToCart, showToast])

  return (
    <div className={styles.page}>
      {/* ── Hero banner ── */}
      <div className={styles.hero} role="banner">
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>✨ Premium Collection</div>
          <h1 className={styles.heroTitle}>Discover Your Next<br />Favourite Product</h1>
          <p className={styles.heroSub}>
            Curated selection of top-quality products across Electronics, Fitness, Fashion &amp; more.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{PRODUCTS.length}</span>
              <span className={styles.heroStatLabel}>Products</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{categoryCount}</span>
              <span className={styles.heroStatLabel}>Categories</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{inStockCount}</span>
              <span className={styles.heroStatLabel}>In Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section header ── */}
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.title}>All Products</h2>
          <p className={styles.sub}>{filtered.length} of {PRODUCTS.length} products</p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className={styles.filterBar} role="search">
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* ── Grid / Empty ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty} role="status">
          <span aria-hidden="true">😕</span>
          <p>No products match your search.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Products() {
  return (
    <ToastProvider>
      <ProductsInner />
    </ToastProvider>
  )
}
