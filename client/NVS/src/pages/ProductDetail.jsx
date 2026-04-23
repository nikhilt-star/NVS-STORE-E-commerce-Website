import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import ProductCard from '../components/ui/ProductCard'
import StarRating from '../components/ui/StarRating'
import { addItem } from '../features/cart/cartSlice'
import { toggleWishlist } from '../features/wishlist/wishlistSlice'
import { productService } from '../services/productService'
import { getApiErrorMessage } from '../utils/apiError'
import { formatCurrency } from '../utils/formatCurrency'

function ProductDetail() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const wishlist = useSelector((state) => state.wishlist.items)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const result = await productService.getProductById(productId)

        if (!isMounted) {
          return
        }

        setProduct(result)

        const related = await productService.getProducts({
          category: result.category,
          limit: 4,
          sort: '-createdAt',
        })

        if (isMounted) {
          setRelatedProducts(related.filter((item) => item.id !== result.id).slice(0, 3))
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error))
          setProduct(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [productId])

  if (isLoading) {
    return (
      <PageTransition className="section-shell py-16">
        <Loader />
      </PageTransition>
    )
  }

  if (!product) {
    return (
      <PageTransition className="section-shell py-16">
        <div className="rounded-[32px] border border-nvs-line bg-white p-10 text-center">
          <h1 className="font-display text-5xl text-nvs-brown">
            {errorMessage || 'Product not found'}
          </h1>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[32px] border border-nvs-line bg-white p-4 shadow-soft">
            <img
              src={product.image}
              alt={product.name}
              className="h-[420px] w-full rounded-[24px] object-cover md:h-[680px]"
            />
          </div>

          <div className="self-center rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft md:p-10">
            <p className="eyebrow">{product.category}</p>
            <h1 className="mt-4 font-display text-[3.2rem] leading-[0.92] tracking-[-0.03em] text-nvs-brown md:text-[4.6rem]">
              {product.name}
            </h1>
            <div className="mt-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-2xl font-extrabold text-nvs-brown">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price ? (
                <span className="text-lg font-semibold text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              ) : null}
            </div>
            <p className="mt-6 text-base font-medium leading-8 text-nvs-brown/70">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {product.swatches.map((swatch) => (
                <span
                  key={`${product.id}-${swatch}`}
                  className="h-8 w-8 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                className="min-w-[180px]"
                onClick={() => dispatch(addItem({ productId: product.id, product, quantity: 1 }))}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => dispatch(toggleWishlist(product.id))}
              >
                <Heart
                  size={18}
                  fill={wishlist.includes(product.id) ? '#f14f45' : 'transparent'}
                  strokeWidth={1.8}
                />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="eyebrow">You may also like</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default ProductDetail
