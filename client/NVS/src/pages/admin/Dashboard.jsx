import { Package, ShoppingCart, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { adminService } from '../../services/adminService'
import { getApiErrorMessage } from '../../utils/apiError'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [stats, setStats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadStats = async () => {
      try {
        setErrorMessage('')
        const data = await adminService.getDashboardStats()

        if (!isMounted) {
          return
        }

        setStats([
          { label: 'Products', value: data.totalProducts || 0, icon: Package },
          { label: 'Orders', value: data.totalOrders || 0, icon: ShoppingCart },
          { label: 'Users', value: data.totalUsers || 0, icon: Users },
        ])
      } catch (error) {
        if (!isMounted) {
          return
        }

        if (error.response?.status === 401) {
          await logout()
          navigate('/login', { replace: true })
          return
        }

        setErrorMessage(getApiErrorMessage(error))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      isMounted = false
    }
  }, [logout, navigate])

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="grid gap-6">
            <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
              <p className="eyebrow">Overview</p>
              <h1 className="mt-4 section-title">A clean admin dashboard for managing the storefront.</h1>
            </div>
            {isLoading ? (
              <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
                <Loader label="Loading admin overview..." />
              </div>
            ) : errorMessage ? (
              <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm font-medium text-red-600 shadow-soft">
                {errorMessage}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon

                  return (
                    <div
                      key={stat.label}
                      className="rounded-[30px] border border-nvs-line bg-white p-6 shadow-soft"
                    >
                      <Icon size={28} className="text-nvs-purple" />
                      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-nvs-brown/60">
                        {stat.label}
                      </p>
                      <p className="mt-3 font-display text-6xl leading-none text-nvs-brown">
                        {stat.value}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Dashboard
