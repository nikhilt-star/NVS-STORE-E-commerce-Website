import { Link } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Button from '../components/common/Button'
import CartItem from '../components/ui/CartItem'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'

function Cart() {
  const { items, totalAmount, changeQuantity, removeFromCart } = useCart()

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Cart</p>
          <h1 className="section-title max-w-[760px]">Your NVS cart keeps everything ready for a smooth checkout.</h1>
        </div>

        {items.length ? (
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-5">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onIncrease={() =>
                    changeQuantity({ productId: item.productId, quantity: item.quantity + 1 })
                  }
                  onDecrease={() =>
                    changeQuantity({ productId: item.productId, quantity: item.quantity - 1 })
                  }
                  onRemove={() => removeFromCart(item.productId)}
                />
              ))}
            </div>

            <aside className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
              <h2 className="font-display text-5xl leading-none text-nvs-brown">Summary</h2>
              <div className="mt-8 space-y-4 text-sm font-semibold text-nvs-brown/70">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-nvs-line pt-4 text-base text-nvs-brown">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              <Button as={Link} to="/checkout" className="mt-8 w-full">
                Proceed to Checkout
              </Button>
            </aside>
          </div>
        ) : (
          <div className="mt-10 rounded-[32px] border border-dashed border-nvs-line bg-white p-12 text-center">
            <h2 className="font-display text-5xl text-nvs-brown">Your cart is empty</h2>
            <p className="mt-4 text-base font-medium text-nvs-brown/70">
              Start with our most loved picks and come back here when you are ready.
            </p>
            <Button as={Link} to="/products" className="mt-8">
              Continue Shopping
            </Button>
          </div>
        )}
      </SectionReveal>
    </PageTransition>
  )
}

export default Cart
