import { useEffect, useState } from 'react'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Loader from '../components/common/Loader'
import { useAuth } from '../hooks/useAuth'
import { orderService } from '../services/orderService'
import { getApiErrorMessage } from '../utils/apiError'
import { formatCurrency } from '../utils/formatCurrency'

function Profile() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        setErrorMessage('')
        const result = await orderService.getOrders()

        if (isMounted) {
          setOrders(result)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Profile</p>
            <h1 className="mt-4 section-title">{user?.name || 'NVS Customer'}</h1>
            <div className="mt-8 space-y-4 text-sm font-semibold text-nvs-brown/75">
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.phone}</p>
              <p>Address: {user?.address || 'No default address saved yet.'}</p>
              <p>Role: {user?.role}</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Orders</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-nvs-brown">
              Recent Orders
            </h2>

            {isLoading ? (
              <Loader label="Loading order history..." />
            ) : errorMessage ? (
              <div className="mt-8 rounded-[24px] bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            ) : !orders.length ? (
              <div className="mt-8 rounded-[24px] bg-nvs-cream px-5 py-5 text-sm font-medium text-nvs-brown/70">
                No orders yet. Your upcoming purchases will appear here.
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[26px] border border-nvs-line bg-nvs-cream px-5 py-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-3xl text-nvs-brown">{order.id}</p>
                      <span className="rounded-pill bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-nvs-purple">
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-nvs-brown/60">{order.date}</p>
                    <p className="mt-3 text-sm font-bold text-nvs-brown">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Profile
