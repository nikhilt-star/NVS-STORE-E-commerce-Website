import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="grid gap-4 rounded-[30px] border border-nvs-line bg-white p-4 shadow-soft sm:grid-cols-[140px_1fr_auto] sm:items-center">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="h-32 w-full rounded-[24px] object-cover sm:w-36"
      />

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-nvs-brown/50">
          {item.product.category}
        </p>
        <h3 className="mt-2 font-display text-4xl leading-none text-nvs-brown">
          {item.product.name}
        </h3>
        <p className="mt-3 text-sm text-slate-500">{item.product.description}</p>
      </div>

      <div className="flex flex-col gap-4 sm:items-end">
        <p className="text-lg font-bold text-nvs-brown">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
        <div className="flex items-center gap-2 rounded-pill border border-nvs-line px-2 py-2">
          <button
            type="button"
            className="rounded-full p-2 text-nvs-brown transition hover:bg-nvs-cream"
            onClick={onDecrease}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            className="rounded-full p-2 text-nvs-brown transition hover:bg-nvs-cream"
            onClick={onIncrease}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-500"
          onClick={onRemove}
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem
