import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Manage Products', icon: Package },
  { to: '/admin/orders', label: 'Manage Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
]

function Sidebar() {
  return (
    <aside className="rounded-[32px] border border-nvs-line bg-white p-5 shadow-soft">
      <div className="mb-5">
        <p className="eyebrow">Admin</p>
        <h2 className="mt-2 font-display text-4xl text-nvs-brown">NVS Panel</h2>
      </div>

      <div className="grid gap-2">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-nvs-purple text-white' : 'text-nvs-brown hover:bg-nvs-cream'
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
