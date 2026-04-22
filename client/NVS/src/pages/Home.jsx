import { useEffect, useRef, useState } from 'react'
import anime from "animejs/lib/anime.es.js";
import {
  Cloud,
  CupSoda,
  Flower2,
  Gift,
  Grid2x2,
  Hand,
  Leaf,
  Milk,
  Pause,
  Play,
  ShieldCheck,
  Shirt,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  collectionTabs,
  mostLovedCategories,
  products,
  shopTags,
  tickerItems,
  valueProps,
  brandAssets,
} from '../data/mockData'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import PageTransition from '../components/common/PageTransition'
import SectionReveal from '../components/common/SectionReveal'
import ProductCard from '../components/ui/ProductCard'
import { productService } from '../services/productService'

const categoryIconMap = {
  Milk,
  Zap,
  CupSoda,
  ShieldCheck,
  Shirt,
  Gift,
}

const valueIconMap = {
  Leaf,
  Grid2X2: Grid2x2,
  ShieldCheck,
}

function Home() {
  const [activeTab, setActiveTab] = useState('bestsellers')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const heroContentRef = useRef(null)
  const heroButtonRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)
      const result = await productService.getProducts({ tab: activeTab })

      if (isMounted) {
        setFeaturedProducts(result.slice(0, 4))
        setIsLoading(false)
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [activeTab])

  useEffect(() => {
    const contentAnimation = anime({
      targets: heroContentRef.current,
      translateY: [0, -6, 0],
      duration: 4200,
      easing: 'easeInOutSine',
      loop: true,
    })

    const buttonAnimation = anime({
      targets: heroButtonRef.current,
      translateY: [0, -4, 0],
      duration: 2200,
      easing: 'easeInOutSine',
      loop: true,
      delay: 300,
    })

    return () => {
      contentAnimation.pause()
      buttonAnimation.pause()
    }
  }, [])

  const freshArrivals = products.filter((product) => product.freshArrival).slice(0, 3)

  return (
    <PageTransition>
      <section className="bg-nvs-cream">
        <div className="section-shell relative grid min-h-[560px] gap-16 py-14 md:min-h-[640px] md:py-16 lg:grid-cols-[500px_1fr] lg:py-20">
          <div ref={heroContentRef} className="relative z-10 max-w-[440px] self-center">
            <h1 className="font-playful text-[3.7rem] leading-[0.88] tracking-[-0.04em] text-nvs-purple sm:text-[4.8rem] lg:text-[5.8rem]">
              Play. Learn.
              <br />
              Grow.
            </h1>
            <p className="mt-5 max-w-[440px] text-[1rem] font-medium text-nvs-brown/70">
              Discover tailored results just for you in our quick 2-minute free quiz! Lorem
              ipsum dolor
            </p>
            <div className="mt-10" ref={heroButtonRef}>
              <Button as={Link} to="/products?tab=bestsellers" className="min-w-[190px]">
                Shop Bestsellers
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-x-[10%] top-[12%] h-[260px] rounded-full bg-white/35 blur-3xl" />
            <div className="absolute right-[8%] top-[22%] h-[240px] w-[240px] rounded-full border border-white/35" />
            <div className="absolute bottom-[18%] right-[20%] h-[140px] w-[140px] rounded-full bg-white/25 blur-xl" />

            <div className="absolute bottom-10 right-6 flex items-center gap-3 rounded-pill bg-[#f2d09a] px-4 py-3 text-nvs-brown shadow-sm">
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/60"
              >
                <Play size={14} />
              </button>
              <span className="h-0.5 w-8 rounded-full bg-nvs-brown/60" />
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/60"
              >
                <Pause size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-t border-nvs-brown/10 bg-nvs-beige py-4">
          <div className="nvs-marquee flex min-w-max items-center gap-10 whitespace-nowrap pr-10">
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-6 font-display text-[1.75rem] font-semibold text-nvs-brown"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ffbf2e] text-lg">
                  {index % 3 === 0 ? '✿' : index % 3 === 1 ? '☼' : '✦'}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionReveal className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-[2rem] leading-none text-black sm:text-[2.35rem] md:text-[2.75rem]">
            Designed for kiddos
          </h2>
          <div className="flex flex-wrap gap-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-slate-500 md:gap-7">
            {collectionTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-3 transition ${
                  activeTab === tab.id
                    ? 'border-nvs-purple text-nvs-brown'
                    : 'border-transparent hover:text-nvs-brown'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-6 h-[2px] bg-nvs-line">
          <div className="h-full w-[18%] bg-nvs-brown" />
        </div>
      </SectionReveal>

      <section className="bg-nvs-purple py-18 text-white md:py-24">
        <SectionReveal className="section-shell">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Our Values
            </p>
            <h2 className="mt-4 font-display text-[3rem] leading-[0.92] tracking-[-0.03em] md:text-[4.55rem]">
              We make baby products thats good for the You &amp; Your Kiddo.
            </h2>
            <p className="mx-auto mt-6 max-w-[720px] text-base font-medium leading-7 text-white/80">
              From our zero-waste manufacturing process to our use of recycled materials, every
              decision we make is focused on creating positive change for the next generation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-12">
            {valueProps.map((value) => {
              const Icon = valueIconMap[value.icon]

              return (
                <div key={value.id} className="rounded-[30px] border border-white/15 p-1">
                  <div className="rounded-[28px] border border-transparent px-6 py-8">
                    <Icon size={42} strokeWidth={1.5} className="text-white/90" />
                    <h3 className="mt-6 font-display text-[2.3rem] leading-none">{value.title}</h3>
                    <p className="mt-5 text-sm font-medium leading-7 text-white/78">{value.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionReveal>
      </section>

      <SectionReveal className="section-shell py-18 md:py-24">
        <div className="rounded-[34px] border border-nvs-line bg-white px-6 py-10 md:px-10 md:py-12">
          <p className="text-center text-sm font-semibold text-nvs-brown/60">Most Loved Categories</p>
          <h2 className="mx-auto mt-6 max-w-[980px] text-center font-display text-[3rem] leading-[0.9] tracking-[-0.03em] text-nvs-brown md:text-[4.65rem]">
            Nus Brings you the most usuable things for you baby trusted by 100&apos;s of Parents
          </h2>
          <div className="mt-8 flex justify-center">
            <Button as={Link} to="/products" className="bg-nvs-brown hover:bg-[#523c27]">
              Shop By Category
            </Button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {mostLovedCategories.map((category) => {
            const Icon = categoryIconMap[category.icon]

            return (
              <div
                key={category.id}
                className="rounded-[28px] border border-nvs-line bg-white px-4 py-8 text-center shadow-soft"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center text-nvs-brown">
                  <Icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-display text-[1.9rem] leading-none text-nvs-brown">
                  {category.label}
                </h3>
              </div>
            )
          })}
        </div>

        <div className="mt-18 grid gap-8 xl:grid-cols-[0.9fr_1fr_1fr_1fr]">
          <div className="rounded-[30px] bg-[#f3d9ad] px-10 py-12 text-nvs-brown">
            <h3 className="font-display text-[4.1rem] leading-[0.88] tracking-[-0.04em]">
              Fresh
              <br />
              Arrivals
            </h3>
            <p className="mt-5 max-w-[220px] text-base font-medium leading-7 text-nvs-brown/70">
              Look what everyone is saying and get yours day too! Lorem ipsum dolor sit, amet
              lorem ipsum
            </p>
            <Button as={Link} to="/products?tab=arrivals" variant="secondary" className="mt-10">
              Explore Now
            </Button>
          </div>

          {freshArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 h-[3px] bg-nvs-line">
          <div className="h-full w-[24%] bg-nvs-brown" />
        </div>
      </SectionReveal>

      <SectionReveal className="section-shell py-10 md:py-12">
        <div className="grid items-center gap-10 rounded-[34px] border border-nvs-line bg-white px-6 py-8 md:px-10 lg:grid-cols-[1fr_560px] lg:py-12">
          <div>
            <p className="text-[2rem] font-semibold text-nvs-brown md:text-[2.1rem]">Shop All</p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-display text-[2.8rem] leading-[1.08] tracking-[-0.03em] text-nvs-brown md:text-[4.25rem]">
              {shopTags.map((item, index) => (
                <span key={item.label}>
                  {item.label}
                  <sup className="ml-1 text-[0.36em] align-top">{item.count}</sup>
                  {index < shopTags.length - 1 ? ' /' : ''}
                </span>
              ))}
            </div>
          </div>

          <div className="justify-self-end overflow-hidden rounded-[22px]">
            <img
              src={brandAssets.shopAllKidsImage}
              alt="NVS kids products lifestyle"
              className="h-[360px] w-full rounded-[22px] object-cover md:h-[540px] lg:w-[560px]"
            />
          </div>
        </div>
      </SectionReveal>
    </PageTransition>
  )
}

export default Home
