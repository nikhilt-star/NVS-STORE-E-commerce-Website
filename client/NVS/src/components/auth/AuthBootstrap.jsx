import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../common/Loader'
import { authService } from '../../services/authService'
import {
  clearAuth,
  setAuthenticated,
  setAuthLoading,
} from '../../features/auth/authSlice'

function AuthBootstrap({ children }) {
  const dispatch = useDispatch()
  const { hasInitialized } = useSelector((state) => state.auth)

  useEffect(() => {
    if (hasInitialized) {
      return undefined
    }

    let isMounted = true

    const restoreSession = async () => {
      dispatch(setAuthLoading())

      try {
        const response = await authService.getCurrentUser()

        if (isMounted) {
          dispatch(setAuthenticated(response.user))
        }
      } catch {
        if (isMounted) {
          dispatch(clearAuth())
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [dispatch, hasInitialized])

  if (!hasInitialized) {
    return <Loader label="Restoring your NVS session..." />
  }

  return children
}

export default AuthBootstrap
