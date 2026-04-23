import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from '../components/common/Loader'
import { useAuth } from '../hooks/useAuth'

function AdminRoute() {
  const location = useLocation()
  const { user, status, hasInitialized } = useAuth()

  if (!hasInitialized || status === 'loading') {
    return <Loader label="Checking admin access..." />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/profile" replace />
  }

  return <Outlet />
}

export default AdminRoute
