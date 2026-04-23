import { useDispatch, useSelector } from 'react-redux'
import { authService } from '../services/authService'
import { clearAuth, setAuthenticated } from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)

  return {
    ...auth,
    isAuthenticated: Boolean(auth.user),
    login: (payload) => dispatch(setAuthenticated(payload.user)),
    logout: async () => {
      try {
        await authService.logout()
      } finally {
        dispatch(clearAuth())
      }
    },
  }
}
