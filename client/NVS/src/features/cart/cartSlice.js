import { createSlice } from '@reduxjs/toolkit'

const getStoredCart = () => {
  const rawValue = window.localStorage.getItem('nvs-cart')
  return rawValue ? JSON.parse(rawValue) : []
}

const persistCart = (items) => {
  window.localStorage.setItem('nvs-cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getStoredCart(),
  },
  reducers: {
    addItem(state, action) {
      const existingItem = state.items.find((item) => item.productId === action.payload.productId)

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          productId: action.payload.productId,
          quantity: action.payload.quantity || 1,
          product: action.payload.product,
        })
      }

      persistCart(state.items)
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.productId !== action.payload)
      persistCart(state.items)
    },
    updateQuantity(state, action) {
      const item = state.items.find((entry) => entry.productId === action.payload.productId)

      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }

      persistCart(state.items)
    },
    clearCart(state) {
      state.items = []
      persistCart(state.items)
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
