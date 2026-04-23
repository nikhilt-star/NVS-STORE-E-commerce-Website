import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { adminService } from '../../services/adminService'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatCurrency } from '../../utils/formatCurrency'

const orderStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']

function ManageOrders() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [pendingOrderId, setPendingOrderId] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        setErrorMessage('')
        const data = await adminService.getOrders()

        if (isMounted) {
          setOrders(data.orders)
        }
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

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [logout, navigate])

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setPendingOrderId(orderId)
      setErrorMessage('')
      const response = await adminService.updateOrderStatus(orderId, orderStatus)

      setOrders((current) =>
        current.map((order) => (order.dbId === orderId ? response.order : order)),
      )
    } catch (error) {
      if (error.response?.status === 401) {
        await logout()
        navigate('/login', { replace: true })
        return
      }

      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setPendingOrderId('')
    }
  }

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Orders</p>
            <h1 className="mt-4 section-title">Manage Orders</h1>
            {errorMessage ? (
              <div className="mt-8 rounded-[24px] bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <Loader label="Loading orders..." />
            ) : !orders.length ? (
              <div className="mt-8 rounded-[24px] bg-nvs-cream px-5 py-5 text-sm font-medium text-nvs-brown/70">
                No orders found in the database yet.
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {orders.map((order) => (
                  <div
                    key={order.dbId}
                    className="rounded-[26px] border border-nvs-line bg-nvs-cream px-5 py-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-display text-4xl leading-none text-nvs-brown">{order.id}</p>
                      <span className="rounded-pill bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-nvs-purple">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-nvs-brown/70">
                      <span>{order.date}</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                    <div className="mt-5">
                      <label className="text-xs font-semibold uppercase tracking-[0.24em] text-nvs-brown/60">
                        Update Status
                      </label>
                      <select
                        className="mt-2 w-full rounded-[18px] border border-nvs-line bg-white px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                        value={order.status}
                        disabled={pendingOrderId === order.dbId}
                        onChange={(event) => handleStatusChange(order.dbId, event.target.value)}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
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

export default ManageOrders
