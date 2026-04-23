import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '../components/common/Loader'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute() {
  const location = useLocation()
  const { isAuthenticated, status, hasInitialized } = useAuth()

  if (!hasInitialized || status === 'loading') {
    return <Loader label="Checking your NVS session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default PrivateRoute
