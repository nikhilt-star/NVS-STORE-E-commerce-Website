import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { mockOrders } from '../../data/mockData'
import { formatCurrency } from '../../utils/formatCurrency'

function ManageOrders() {
  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Orders</p>
            <h1 className="mt-4 section-title">Manage Orders</h1>
            <div className="mt-8 grid gap-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default ManageOrders
