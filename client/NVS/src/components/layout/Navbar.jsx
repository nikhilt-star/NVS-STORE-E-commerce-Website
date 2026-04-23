import { useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { brandAssets, navLinks, promoMessage } from '../../data/mockData'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import Button from '../common/Button'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-nvs-line/70 bg-white">
      <div className="bg-nvs-purple px-4 py-2 text-center text-[0.78rem] font-medium text-white">
        <div className="section-shell flex items-center justify-center gap-4">
          <span className="hidden text-lg md:inline">&#8249;</span>
          <span>{promoMessage}</span>
          <span className="hidden text-lg md:inline">&#8250;</span>
        </div>
      </div>

      <div className="section-shell flex items-center justify-between gap-6 py-4">
        <Link to="/" className="shrink-0">
          <img
            src={brandAssets.brandLogo}
            alt="NVS Kids"
            className="h-[62px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-10 text-[0.95rem] font-semibold text-nvs-brown/90 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-nvs-purple ${isActive ? 'text-nvs-purple' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link to="/products" className="text-nvs-brown/75 transition hover:text-nvs-purple">
            <Search size={20} />
          </Link>
          <Link to="/profile" className="text-nvs-brown/75 transition hover:text-nvs-purple">
            <User size={20} />
          </Link>
          <Link to="/cart" className="relative text-nvs-brown/75 transition hover:text-nvs-purple">
            <ShoppingBag size={20} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-nvs-rose" />
            {totalItems ? (
              <span className="absolute -right-3 -top-4 text-[10px] font-bold text-nvs-brown">
                {totalItems}
              </span>
            ) : null}
          </Link>
          <Link to="/products" className="text-nvs-brown/75 transition hover:text-nvs-purple">
            <Heart size={20} />
          </Link>
          {user ? (
            <Button variant="ghost" className="px-0 py-0 text-sm" onClick={handleLogout}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          ) : null}
          <Button as={Link} to="/checkout" variant="accent" className="min-w-[138px]">
            Buy Now
          </Button>
        </div>

        <button
          type="button"
          className="rounded-full border border-nvs-line p-3 text-nvs-brown lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="section-shell grid gap-4 border-t border-nvs-line py-5 lg:hidden">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="text-sm font-semibold text-nvs-brown"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-4 pt-2 text-nvs-brown">
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              <User size={18} />
            </Link>
            <Link to="/products" onClick={() => setIsOpen(false)}>
              <Search size={18} />
            </Link>
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              <ShoppingBag size={18} />
            </Link>
          </div>
          <Button as={Link} to="/checkout" variant="accent" onClick={() => setIsOpen(false)}>
            Buy Now
          </Button>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
