import React, { createContext, useState, useEffect, useContext } from 'react'
import AuthContext from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product === product._id)
      if (idx > -1) {
        const next = [...prev]
        next[idx].quantity += qty
        return next
      }
      return [...prev, { product: product._id, name: product.name, price: product.price, image: product.image, quantity: qty }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setItems(prev => prev.map(i => i.product === productId ? { ...i, quantity } : i))
  }

  const removeItem = (productId) => setItems(prev => prev.filter(i => i.product !== productId))

  const clear = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
