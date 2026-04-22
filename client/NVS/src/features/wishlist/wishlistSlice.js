import { createSlice } from '@reduxjs/toolkit'

const getStoredWishlist = () => {
  const rawValue = window.localStorage.getItem('nvs-wishlist')
  return rawValue ? JSON.parse(rawValue) : []
}

const persistWishlist = (items) => {
  window.localStorage.setItem('nvs-wishlist', JSON.stringify(items))
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: getStoredWishlist(),
  },
  reducers: {
    toggleWishlist(state, action) {
      if (state.items.includes(action.payload)) {
        state.items = state.items.filter((item) => item !== action.payload)
      } else {
        state.items.push(action.payload)
      }

      persistWishlist(state.items)
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
