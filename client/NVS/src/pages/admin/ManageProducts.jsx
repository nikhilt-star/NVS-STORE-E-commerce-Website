import PageTransition from '../../components/common/PageTransition'
import SectionReveal from '../../components/common/SectionReveal'
import Sidebar from '../../components/layout/Sidebar'
import { products } from '../../data/mockData'
import { formatCurrency } from '../../utils/formatCurrency'

function ManageProducts() {
  return (
    <PageTransition className="bg-nvs-cream/35">
      <SectionReveal className="section-shell py-14 md:py-18">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <Sidebar />
          <div className="rounded-[32px] border border-nvs-line bg-white p-8 shadow-soft">
            <p className="eyebrow">Inventory</p>
            <h1 className="mt-4 section-title">Manage Products</h1>
            <div className="mt-8 grid gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="grid gap-4 rounded-[26px] border border-nvs-line p-4 md:grid-cols-[96px_1fr_auto]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 rounded-[18px] object-cover"
                  />
                  <div>
                    <p className="font-display text-4xl leading-none text-nvs-brown">
                      {product.name}
                    </p>
                    <p className="mt-3 text-sm font-semibold text-nvs-brown/60">
                      {product.category}
                    </p>
                  </div>
                  <div className="self-center text-right text-sm font-semibold text-nvs-brown">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default ManageProducts
