import bottleImage from '../assets/design/product-bottle.jpg'
import mobileImage from '../assets/design/product-mobile.jpg'
import brushImage from '../assets/design/product-brush.jpg'
import bubbleImage from '../assets/design/product-bubble.jpg'
import freshBlueImage from '../assets/design/fresh-card-blue.jpg'
import freshBottleImage from '../assets/design/fresh-card-bottle.jpg'
import shopAllKidsImage from '../assets/design/shop-all-kids.jpg'
import brandLogo from '../assets/design/logo.png'

export const brandAssets = {
  brandLogo,
  shopAllKidsImage,
}

export const promoMessage =
  'Get ready for spring with our 10% discount - enter SPRINGNOW at checkout'

export const navLinks = [
  { label: 'Shop All', to: '/products' },
  { label: 'Collection', to: '/products?tab=arrivals' },
  { label: 'Bestseller', to: '/products?tab=bestsellers' },
  { label: 'About Us', to: '/profile' },
  { label: 'Contact Us', to: '/checkout' },
]

export const collectionTabs = [
  { id: 'bestsellers', label: 'Bestsellers' },
  { id: 'arrivals', label: 'New Arrivals' },
  { id: 'sale', label: 'On Sale' },
]

export const products = [
  {
    id: 'glass-bottle',
    name: 'Baby Feeding Glass Bottle',
    price: 25.9,
    originalPrice: 37,
    category: 'Feeding Bottles',
    featuredGroup: 'bestsellers',
    freshArrival: false,
    image: bottleImage,
    badge: null,
    rating: 4.8,
    reviewCount: 86,
    swatches: ['#4a8c5f', '#ba9a7b', '#5b4490', '#7f5a4a'],
    description:
      'Gentle glass feeding bottle with a wide neck, soft-touch finish, and easy-clean silhouette.',
  },
  {
    id: 'eye-catcher',
    name: 'Baby Hanging Eye Catcher',
    price: 25.9,
    originalPrice: 37,
    category: 'Gift Sets',
    featuredGroup: 'bestsellers',
    freshArrival: false,
    image: mobileImage,
    badge: null,
    rating: 4.7,
    reviewCount: 42,
    swatches: ['#4a8c5f', '#ba9a7b', '#5b4490', '#7f5a4a'],
    description:
      'Soft nursery hanging decor designed to calm, focus, and charm little eyes over the crib.',
  },
  {
    id: 'cleaner-brush',
    name: 'Baby Bottle Cleaner Brush Set',
    price: 25.9,
    originalPrice: 37,
    category: 'Sipper Bottles',
    featuredGroup: 'sale',
    freshArrival: true,
    image: brushImage,
    badge: 'Sale',
    rating: 4.9,
    reviewCount: 118,
    swatches: ['#4a8c5f', '#ba9a7b', '#5b4490', '#7f5a4a'],
    description:
      'Slim bottle-cleaner brush with flexible grip and gentle bristles for daily wash-downs.',
  },
  {
    id: 'bubble-bottles',
    name: 'Meadow Bubble Bottles',
    price: 25.9,
    originalPrice: 37,
    category: 'Laundry Bags',
    featuredGroup: 'arrivals',
    freshArrival: false,
    image: bubbleImage,
    badge: 'Trending Now',
    rating: 4.6,
    reviewCount: 33,
    swatches: ['#4a8c5f', '#ba9a7b', '#5b4490', '#7f5a4a'],
    description:
      'Playful bubble bottles in soft pastel tones for bath time, gifting, or nursery styling.',
  },
  {
    id: 'pony-play-set',
    name: 'Pony Play Set',
    price: 25,
    originalPrice: 45,
    category: 'Toys',
    featuredGroup: 'arrivals',
    freshArrival: true,
    image: freshBlueImage,
    badge: null,
    rating: 4.7,
    reviewCount: 64,
    swatches: ['#4a8c5f', '#ba9a7b', '#5b4490', '#7f5a4a'],
    description:
      'A colorful play-time duo that brings imagination, motion, and visual delight to every shelf.',
  },
  {
    id: 'fruit-sipper',
    name: 'Fruit Sipper Bottle',
    price: 25,
    originalPrice: 45,
    category: 'Sipper Bottles',
    featuredGroup: 'bestsellers',
    freshArrival: true,
    image: freshBottleImage,
    badge: null,
    rating: 4.8,
    reviewCount: 54,
    swatches: ['#4a8c5f', '#ba9a7b', '#5b4490', '#7f5a4a'],
    description:
      'An illustrated sipper made for little hands, everyday hydration, and smooth family routines.',
  },
]

export const mostLovedCategories = [
  { id: 'feeding-bottles', label: 'Feeding Bottles', icon: 'Milk' },
  { id: 'teethers', label: 'Teethers', icon: 'Zap' },
  { id: 'sipper-bottles', label: 'Sipper Bottles', icon: 'CupSoda' },
  { id: 'socks', label: 'Socks', icon: 'ShieldCheck' },
  { id: 'laundry-bags', label: 'Laundry Bags', icon: 'Shirt' },
  { id: 'gift-sets', label: 'Gift Sets', icon: 'Gift' },
]

export const valueProps = [
  {
    id: 'materials',
    title: 'Green Materials',
    body:
      'Advanced natural and recycled materials undergo rigorous development to create durable, sustainable garments that meet rigorous sustainability standards.',
    icon: 'Leaf',
  },
  {
    id: 'engineering',
    title: 'Detailed Engineering',
    body:
      'Our engineering team employs precision testing and innovative measurement techniques to ensure each component meets exacting technical specifications.',
    icon: 'Grid2X2',
  },
  {
    id: 'production',
    title: 'Sustainable Production',
    body:
      'Facilities use renewable energy systems and advanced water conservation, as well as closed-loop material recovery throughout production.',
    icon: 'ShieldCheck',
  },
]

export const shopTags = [
  { label: 'Kidswear', count: 71 },
  { label: 'Adultwear', count: 4 },
  { label: 'Books', count: 4 },
  { label: 'Maternity', count: 4 },
  { label: 'Gifts', count: 26 },
  { label: 'Toys', count: 15 },
  { label: 'Bundles', count: 6 },
  { label: 'Mealtime', count: 8 },
  { label: 'Accessories', count: 11 },
]

export const footerBenefits = [
  {
    id: 'play',
    title: 'Made for Play',
    body: 'Comfy clothes that are durable',
    icon: 'Hand',
  },
  {
    id: 'stretch',
    title: 'Soft & Stretchy',
    body: 'Easy and fun styles to wear',
    icon: 'Cloud',
  },
  {
    id: 'material',
    title: 'Sustainable Material',
    body: 'Natural and breathable fabrics',
    icon: 'Flower2',
  },
]

export const tickerItems = [
  'Inspired by Joy',
  'Inspired by Play',
  'Inspired by Curiosity',
]

export const mockUsers = {
  customer: {
    id: 'user-customer',
    name: 'NVS Parent',
    email: 'parent@nvskids.com',
    role: 'customer',
    phone: '+91 98765 43210',
    address: 'Calm Nest Apartments, Bengaluru',
  },
  admin: {
    id: 'user-admin',
    name: 'NVS Admin',
    email: 'admin@nvskids.com',
    role: 'admin',
    phone: '+91 99887 77665',
    address: 'NVS Studio, Mumbai',
  },
}

export const mockOrders = [
  {
    id: 'order-001',
    status: 'Packed',
    total: 51.8,
    items: [
      { productId: 'glass-bottle', quantity: 1 },
      { productId: 'cleaner-brush', quantity: 1 },
    ],
    date: '2026-04-18',
  },
  {
    id: 'order-002',
    status: 'Delivered',
    total: 25.9,
    items: [{ productId: 'bubble-bottles', quantity: 1 }],
    date: '2026-04-06',
  },
]
