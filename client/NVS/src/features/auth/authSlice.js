import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  status: 'loading',
  hasInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading'
    },
    setAuthenticated(state, action) {
      state.user = action.payload
      state.status = 'authenticated'
      state.hasInitialized = true
    },
    clearAuth(state) {
      state.user = null
      state.status = 'unauthenticated'
      state.hasInitialized = true
    },
  },
})

export const { setAuthLoading, setAuthenticated, clearAuth } = authSlice.actions
export default authSlice.reducer
