import { createSlice } from '@reduxjs/toolkit'

const getStoredUser = () => {
  const rawValue = window.localStorage.getItem('nvs-user')
  return rawValue ? JSON.parse(rawValue) : null
}

const initialState = {
  user: getStoredUser(),
  token: window.localStorage.getItem('nvs-token'),
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      window.localStorage.setItem('nvs-user', JSON.stringify(action.payload.user))
      window.localStorage.setItem('nvs-token', action.payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      window.localStorage.removeItem('nvs-user')
      window.localStorage.removeItem('nvs-token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
