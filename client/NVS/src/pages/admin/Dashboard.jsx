import { Package, ShoppingCart, Users } from 'lucide-react'
import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { mockOrders, mockUsers, products } from '../../data/mockData'

const stats = [
  { label: 'Products', value: products.length, icon: Package },
  { label: 'Orders', value: mockOrders.length, icon: ShoppingCart },
  { label: 'Users', value: Object.keys(mockUsers).length, icon: Users },
]

function Dashboard() {
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
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Dashboard
