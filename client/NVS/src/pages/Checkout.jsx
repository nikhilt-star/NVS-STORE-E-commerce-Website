import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { orderService } from '../services/orderService'
import { paymentService } from '../services/paymentService'
import { getApiErrorMessage } from '../utils/apiError'
import { formatCurrency } from '../utils/formatCurrency'
import { validators } from '../utils/validators'

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout.'))
    document.body.appendChild(script)
  })

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalAmount, clear } = useCart()
  const [form, setForm] = useState({
    fullName: user?.defaultAddress?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.defaultAddress?.phone || user?.phone || '',
    line1: user?.defaultAddress?.line1 || '',
    line2: user?.defaultAddress?.line2 || '',
    city: user?.defaultAddress?.city || '',
    state: user?.defaultAddress?.state || '',
    postalCode: user?.defaultAddress?.postalCode || '',
    country: user?.defaultAddress?.country || 'India',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const openRazorpayCheckout = async ({ key, currency, customer, order }) => {
    const { paymentOrder } = await paymentService.createPaymentIntent(order.dbId)

    return new Promise((resolve, reject) => {
      let isSettled = false

      const settle = (handler, value) => {
        if (isSettled) {
          return
        }

        isSettled = true
        handler(value)
      }

      const razorpay = new window.Razorpay({
        key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || currency,
        name: 'NVS Baby Products',
        description: `Payment for ${order.id}`,
        order_id: paymentOrder.id,
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          orderId: order.dbId,
          orderNumber: order.id,
        },
        modal: {
          ondismiss: () =>
            settle(
              reject,
              new Error(
                `Payment was cancelled. Your order ${order.id} is still pending and visible in your profile.`,
              ),
            ),
        },
        handler: async (response) => {
          try {
            const verification = await paymentService.verifyPayment({
              orderId: order.dbId,
              ...response,
            })

            clear()
            navigate('/order-success', { state: { order: verification.order } })
            settle(resolve, verification.order)
          } catch (error) {
            settle(reject, error)
          }
        },
      })

      razorpay.on('payment.failed', (response) => {
        settle(
          reject,
          new Error(
            response.error?.description ||
              `Payment failed. Your order ${order.id} is still pending payment.`,
          ),
        )
      })

      razorpay.open()
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      fullName: validators.required(form.fullName) ? '' : 'Name is required',
      email: validators.email(form.email) ? '' : 'Enter a valid email',
      line1: validators.required(form.line1) ? '' : 'Address line 1 is required',
      phone: validators.minLength(form.phone, 10) ? '' : 'Enter a valid phone number',
      city: validators.required(form.city) ? '' : 'City is required',
      state: validators.required(form.state) ? '' : 'State is required',
      postalCode: validators.required(form.postalCode) ? '' : 'Postal code is required',
      country: validators.required(form.country) ? '' : 'Country is required',
    }

    setErrors(nextErrors)

    if (!items.length) {
      setSubmitError('Your cart is empty. Add products before checkout.')
      return
    }

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const order = await orderService.createOrder({
        orderItems: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        shippingPrice: 0,
        taxPrice: 0,
        discountAmount: 0,
      })

      const paymentConfig = await paymentService.getPaymentConfig()

      if (!paymentConfig.key) {
        throw new Error('Razorpay key is missing on the backend.')
      }

      await loadRazorpayScript()
      await openRazorpayCheckout({
        key: paymentConfig.key,
        currency: paymentConfig.currency,
        customer: form,
        order,
      })
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
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
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
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
                label="Address Line 1"
                name="line1"
                value={form.line1}
                onChange={handleChange}
                error={errors.line1}
                placeholder="Street address"
              />
              <Input
                label="Address Line 2"
                name="line2"
                value={form.line2}
                onChange={handleChange}
                placeholder="Apartment, suite, landmark"
              />
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Bengaluru"
              />
              <Input
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                error={errors.state}
                placeholder="Karnataka"
              />
              <Input
                label="Postal Code"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                error={errors.postalCode}
                placeholder="560001"
              />
              <Input
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                error={errors.country}
                placeholder="India"
              />
            </div>

            {submitError ? (
              <p className="mt-6 rounded-[20px] bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {submitError}
              </p>
            ) : null}

            <Button type="submit" className="mt-8 min-w-[200px]" disabled={isSubmitting}>
              {isSubmitting ? 'Processing Payment...' : 'Place Order'}
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
