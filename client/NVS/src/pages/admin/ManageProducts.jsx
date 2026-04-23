import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { adminService } from '../../services/adminService'
import { getApiErrorMessage } from '../../utils/apiError'
import { formatCurrency } from '../../utils/formatCurrency'

const initialForm = {
  name: '',
  shortDescription: '',
  description: '',
  brand: 'NVS',
  category: '',
  subcategory: '',
  sku: '',
  price: '',
  discountPrice: '',
  stock: '',
  featured: false,
  isPublished: true,
}

function ManageProducts() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      try {
        setErrorMessage('')
        const data = await adminService.getProducts()

        if (isMounted) {
          setProducts(data.products)
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        if (error.response?.status === 401) {
          await logout()
          navigate('/login', { replace: true })
          return
        }

        setErrorMessage(getApiErrorMessage(error))
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
  }, [logout, navigate])

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCreateProduct = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const response = await adminService.createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : '',
      })

      setProducts((current) => [response.product, ...current])
      setForm(initialForm)
    } catch (error) {
      if (error.response?.status === 401) {
        await logout()
        navigate('/login', { replace: true })
        return
      }

      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      setPendingDeleteId(productId)
      setErrorMessage('')
      await adminService.deleteProduct(productId)
      setProducts((current) => current.filter((product) => product.id !== productId))
    } catch (error) {
      if (error.response?.status === 401) {
        await logout()
        navigate('/login', { replace: true })
        return
      }

      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setPendingDeleteId('')
    }
  }

  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="grid gap-6">
            <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
              <p className="eyebrow">Inventory</p>
              <h1 className="mt-4 section-title">Manage Products</h1>
              {errorMessage ? (
                <div className="mt-8 rounded-[24px] bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                  {errorMessage}
                </div>
              ) : null}
              <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleCreateProduct}>
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                  name="name"
                  placeholder="Product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                  name="sku"
                  placeholder="SKU"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                  name="brand"
                  placeholder="Brand"
                  value={form.brand}
                  onChange={handleChange}
                />
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
                <input
                  className="rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none md:col-span-2"
                  name="shortDescription"
                  placeholder="Short description"
                  value={form.shortDescription}
                  onChange={handleChange}
                />
                <textarea
                  className="min-h-[140px] rounded-[18px] border border-nvs-line px-4 py-3 text-sm font-medium text-nvs-brown outline-none md:col-span-2"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-nvs-brown">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-nvs-brown">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={form.isPublished}
                      onChange={handleChange}
                    />
                    Published
                  </label>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Product...' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
              <p className="eyebrow">Catalog</p>
              <h2 className="mt-4 font-display text-5xl leading-none text-nvs-brown">
                Current Products
              </h2>
              {isLoading ? (
                <Loader label="Loading products..." />
              ) : !products.length ? (
                <div className="mt-8 rounded-[24px] bg-nvs-cream px-5 py-5 text-sm font-medium text-nvs-brown/70">
                  No products found in the database yet.
                </div>
              ) : (
                <div className="mt-8 grid gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="grid gap-4 rounded-[26px] border border-nvs-line p-4 md:grid-cols-[96px_1fr_auto]"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-24 rounded-[18px] object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-[18px] bg-nvs-cream text-xs font-semibold uppercase tracking-[0.2em] text-nvs-brown/50">
                          No Image
                        </div>
                      )}
                      <div>
                        <p className="font-display text-4xl leading-none text-nvs-brown">
                          {product.name}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-nvs-brown/60">
                          {product.category}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-nvs-brown/60">
                          SKU: {product.sku} | Stock: {product.stock}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between gap-3">
                        <div className="self-center text-right text-sm font-semibold text-nvs-brown">
                          {formatCurrency(product.price)}
                        </div>
                        <Button
                          variant="secondary"
                          disabled={pendingDeleteId === product.id}
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          {pendingDeleteId === product.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default ManageProducts
