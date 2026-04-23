import { Heart, ShoppingBag } from 'lucide-react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '../../features/wishlist/wishlistSlice'
import { formatCurrency } from '../../utils/formatCurrency'
import Badge from '../common/Badge'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist.items)
  const isWishlisted = wishlist.includes(product.id)

  return (
    <Motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group h-full w-full"
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="relative overflow-hidden rounded-[12px]">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full rounded-[12px] object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          {product.badge ? (
            <Badge className="absolute left-3 top-3 bg-white text-[0.58rem] text-nvs-purple">
              {product.badge}
            </Badge>
          ) : null}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              dispatch(toggleWishlist(product.id))
            }}
            className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-nvs-brown shadow-sm"
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={isWishlisted ? '#f14f45' : 'transparent'} strokeWidth={1.8} />
          </button>
          {product.id === 'cleaner-brush' ? (
            <span className="absolute bottom-3 left-14 inline-flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-nvs-brown shadow-sm">
              <ShoppingBag size={12} />
              Shop the look
            </span>
          ) : null}
        </div>

        <div className="mt-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            {product.swatches.map((swatch) => (
              <span
                key={`${product.id}-${swatch}`}
                className="h-4 w-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
          <div className="border-t border-nvs-line pt-3">
            <h3 className="font-display text-[1.45rem] leading-[1.02] text-nvs-brown md:text-[1.7rem]">
              {product.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-[0.92rem] font-semibold">
              <span className="text-nvs-brown">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price ? (
                <span className="text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </Motion.article>
  )
}

export default ProductCard
