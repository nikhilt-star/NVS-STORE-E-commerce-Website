import AuthBootstrap from './components/auth/AuthBootstrap'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthBootstrap>
      <AppRoutes />
    </AuthBootstrap>
  )
}

export default App
