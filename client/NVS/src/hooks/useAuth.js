import { useDispatch, useSelector } from 'react-redux'
import { logout, setCredentials } from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)

  return {
    ...auth,
    login: (payload) => dispatch(setCredentials(payload)),
    logout: () => dispatch(logout()),
  }
}
