import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id)
      if (existing) {
        // Cap at available stock
        const newQty = Math.min(existing.qty + 1, product.stock)
        return prev.map((i) => i._id === product._id ? { ...i, qty: newQty } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i._id !== productId))
  }

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i._id !== productId) return i
        // Cap at available stock
        return { ...i, qty: Math.min(qty, i.stock) }
      })
    )
  }

  // Update prices in cart from fresh server data
  const syncPrices = (freshProducts) => {
    setItems((prev) =>
      prev.map((item) => {
        const fresh = freshProducts.find((p) => p._id === item._id)
        if (!fresh) return item
        return { ...item, currentPrice: fresh.currentPrice, stock: fresh.stock, soldOut: fresh.soldOut }
      })
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.currentPrice * i.qty, 0)
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, updateQty, syncPrices, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
