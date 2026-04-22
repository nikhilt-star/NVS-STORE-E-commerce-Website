import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { orderService } from '../services/orderService'
import { formatCurrency } from '../utils/formatCurrency'
import { validators } from '../utils/validators'

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalAmount, clear } = useCart()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: user?.phone || '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      name: validators.required(form.name) ? '' : 'Name is required',
      email: validators.email(form.email) ? '' : 'Enter a valid email',
      address: validators.required(form.address) ? '' : 'Address is required',
      phone: validators.minLength(form.phone, 10) ? '' : 'Enter a valid phone number',
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)
    const order = await orderService.createOrder({
      customer: form,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    })
    clear()
    navigate('/order-success', { state: { order } })
  }

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft md:p-10"
          >
            <p className="eyebrow">Checkout</p>
            <h1 className="mt-4 section-title">A soft, simple checkout experience for your order.</h1>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="NVS Parent"
              />
              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="parent@nvskids.com"
              />
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+91 98765 43210"
              />
              <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Street, city, state"
              />
            </div>

            <Button type="submit" className="mt-8 min-w-[200px]" disabled={isSubmitting}>
              {isSubmitting ? 'Placing order...' : 'Place Order'}
            </Button>
          </form>

          <aside className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <h2 className="font-display text-5xl leading-none text-nvs-brown">Order Summary</h2>
            <div className="mt-8 grid gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-[24px] bg-nvs-cream px-4 py-4"
                >
                  <div>
                    <p className="font-display text-3xl leading-none text-nvs-brown">
                      {item.product.name}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-nvs-brown/60">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-nvs-brown">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-nvs-line pt-6 text-sm font-semibold text-nvs-brown">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </aside>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Checkout
