import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import Loader from '../components/common/Loader'
import ProductCard from '../components/ui/ProductCard'
import { collectionTabs, mostLovedCategories } from '../data/mockData'
import { productService } from '../services/productService'
import { getApiErrorMessage } from '../utils/apiError'

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [categories, setCategories] = useState(
    mostLovedCategories.map((item) => item.label),
  )
  const [selectedCategory, setSelectedCategory] = useState('All')
  const activeTab = searchParams.get('tab') || 'bestsellers'

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const [productResults, categoryResults] = await Promise.all([
          productService.getProducts({ tab: activeTab }),
          productService.getCategories(),
        ])

        if (isMounted) {
          setProducts(productResults)
          setCategories(categoryResults.length ? categoryResults : mostLovedCategories.map((item) => item.label))
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [activeTab])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <p className="eyebrow">Collection</p>
        <h1 className="mt-4 section-title max-w-[780px]">
          The NVS catalogue keeps the same playful visual language from the design while expanding
          into a full shopping grid.
        </h1>
        <p className="mt-5 max-w-[620px] text-base font-medium leading-7 text-nvs-brown/70">
          Browse our featured product families, switch between curated tabs, and use category chips
          to narrow the products quickly.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {collectionTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`rounded-pill border px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'border-nvs-purple bg-nvs-purple text-white'
                  : 'border-nvs-line bg-white text-nvs-brown hover:bg-nvs-cream'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {['All', ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-pill px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? 'bg-nvs-brown text-white'
                  : 'bg-white text-nvs-brown hover:bg-nvs-beige'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <div className="mt-10 rounded-[28px] bg-red-50 px-6 py-5 text-sm font-medium text-red-600">
            {errorMessage}
          </div>
        ) : !filteredProducts.length ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-nvs-line bg-white px-6 py-10 text-center text-sm font-medium text-nvs-brown/70">
            No products matched this filter.
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </SectionReveal>
    </PageTransition>
  )
}

export default ProductList
