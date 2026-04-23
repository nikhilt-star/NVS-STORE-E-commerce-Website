import { Link, useLocation } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import { formatCurrency } from '../utils/formatCurrency'

function OrderSuccess() {
  const location = useLocation()
  const order = location.state?.order

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-16 md:py-20">
        <div className="mx-auto max-w-3xl rounded-[36px] border border-nvs-line bg-white p-10 text-center shadow-soft md:p-14">
          <p className="eyebrow">Success</p>
          <h1 className="mt-4 font-display text-[3.5rem] leading-[0.92] text-nvs-brown md:text-[5rem]">
            Your NVS order is confirmed.
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-base font-medium leading-8 text-nvs-brown/70">
            Everything is queued for dispatch. We kept this screen calm and clear so the post-order
            moment feels just as polished as the rest of the storefront.
          </p>

          {order ? (
            <div className="mt-8 rounded-[28px] bg-nvs-cream px-6 py-6 text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-nvs-brown/60">
                Order {order.id}
              </p>
              <p className="mt-3 font-display text-4xl text-nvs-brown">{formatCurrency(order.total)}</p>
              <p className="mt-3 text-sm font-semibold text-nvs-brown/70">{order.status}</p>
              <p className="mt-3 text-sm font-medium text-nvs-brown/60">{order.date}</p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button as={Link} to="/products">
              Continue Shopping
            </Button>
            <Button as={Link} to="/profile" variant="secondary">
              View Profile
            </Button>
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default OrderSuccess
