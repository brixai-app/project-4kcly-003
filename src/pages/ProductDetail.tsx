import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, ArrowRight, Sparkles, Star, Plus, Minus } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Classic Crystal Bottle',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    color: '#e0f7fa',
    colorName: 'Crystal Clear',
    size: '500',
    price: 2.99,
    description: 'Elegant, crystal-clear bottle with your custom label. Perfect for events and branding.',
    rating: 4.9,
    reviews: 120,
    eco: false,
  },
  {
    id: '2',
    name: 'Aqua Blue Edition',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
    color: '#38bdf8',
    colorName: 'Aqua Blue',
    size: '750',
    price: 3.49,
    description: 'Vibrant aqua blue bottle, premium feel, and fully customizable label.',
    rating: 4.8,
    reviews: 98,
    eco: true,
  },
  {
    id: '3',
    name: 'Frost White Bottle',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    color: '#f8fafc',
    colorName: 'Frost White',
    size: '330',
    price: 2.49,
    description: 'Chic frost white bottle, compact and stylish for on-the-go branding.',
    rating: 4.7,
    reviews: 76,
    eco: false,
  },
  {
    id: '4',
    name: 'Eco Recycled Bottle',
    image: 'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=800&q=80',
    color: '#e0f7fa',
    colorName: 'Crystal Clear',
    size: '500',
    price: 3.19,
    description: 'Made from 100% recycled materials. Eco-friendly and fully customizable.',
    rating: 4.9,
    reviews: 134,
    eco: true,
  },
  {
    id: '5',
    name: 'Event Sparkle Bottle',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    color: '#38bdf8',
    colorName: 'Aqua Blue',
    size: '330',
    price: 2.89,
    description: 'Sparkling design for memorable events. Add your logo and shine.',
    rating: 4.8,
    reviews: 89,
    eco: false,
  },
  {
    id: '6',
    name: 'Premium Frost Edition',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    color: '#f8fafc',
    colorName: 'Frost White',
    size: '750',
    price: 3.59,
    description: 'Large, premium bottle in frost white. Maximum impact for your brand.',
    rating: 4.9,
    reviews: 101,
    eco: true,
  },
]

const BOTTLE_COLORS = [
  { name: 'Crystal Clear', value: '#e0f7fa' },
  { name: 'Aqua Blue', value: '#38bdf8' },
  { name: 'Frost White', value: '#f8fafc' },
]
const BOTTLE_SIZES = [
  { name: '330ml', value: '330' },
  { name: '500ml', value: '500' },
  { name: '750ml', value: '750' },
]

function getQueryParams(search: string) {
  const params = new URLSearchParams(search)
  return {
    label: params.get('label') ?? '',
    color: params.get('color') ?? '',
    size: params.get('size') ?? '',
  }
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function BottlePreview({
  label,
  color,
  size,
}: {
  label: string
  color: string
  size: string
}) {
  const bottleHeight = { '330': 120, '500': 150, '750': 180 }[size] ?? 150
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className={cn(
          'relative flex flex-col items-center justify-end',
          'w-24'
        )}
        style={{ height: bottleHeight + 30 }}
      >
        <svg
          width="96"
          height={bottleHeight + 30}
          viewBox={`0 0 96 ${bottleHeight + 30}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <rect
            x="24"
            y="20"
            width="48"
            height={bottleHeight}
            rx="24"
            fill={color}
            stroke="#bae6fd"
            strokeWidth="2"
          />
          <rect
            x="36"
            y="0"
            width="24"
            height="32"
            rx="8"
            fill="#e0e7ef"
            stroke="#bae6fd"
            strokeWidth="2"
          />
          <rect
            x="32"
            y={bottleHeight / 2}
            width="32"
            height="36"
            rx="8"
            fill="#fff"
            stroke="#bae6fd"
            strokeWidth="1"
          />
        </svg>
        <span
          className={cn(
            'absolute left-1/2 top-1/2 w-20 text-center text-xs font-bold tracking-tight',
            'text-cyan-700',
            'pointer-events-none select-none'
          )}
          style={{
            transform: `translate(-50%, -10%)`,
            color: '#0e7490',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          {label || 'Your Label'}
        </span>
      </div>
      <span className="mt-2 text-xs text-slate-500">{size} • {BOTTLE_COLORS.find(c => c.value === color)?.name}</span>
    </div>
  )
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const query = useMemo(() => getQueryParams(location.search), [location.search])

  const product = useMemo(
    () => MOCK_PRODUCTS.find(p => p.id === id) ?? MOCK_PRODUCTS[0],
    [id]
  )

  const [label, setLabel] = useState(query.label || '')
  const [color, setColor] = useState(query.color || product.color)
  const [size, setSize] = useState(query.size || product.size)
  const [qty, setQty] = useState(1)
  const [labelError, setLabelError] = useState('')
  const [cart, setCart] = useState<{ [key: string]: { qty: number; label: string } }>(() => {
    try {
      const c = window.localStorage.getItem('nishantwaters_cart')
      return c ? JSON.parse(c) : {}
    } catch {
      return {}
    }
  })
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    setColor(query.color || product.color)
    setSize(query.size || product.size)
    setLabel(query.label || '')
  }, [product, query.color, query.size, query.label])

  function updateCartStorage(next: typeof cart) {
    setCart(next)
    window.localStorage.setItem('nishantwaters_cart', JSON.stringify(next))
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLabel(val)
    if (val.length > 24) setLabelError('Max 24 characters')
    else setLabelError('')
  }

  function handleAddToCart(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) {
      setLabelError('Please enter a label')
      toast.error('Please enter a label for your bottle.')
      return
    }
    if (label.length > 24) {
      setLabelError('Max 24 characters')
      toast.error('Label must be 24 characters or less.')
      return
    }
    const key = `${product.id}_${color}_${size}_${label.trim()}`
    const prev = cart[key]?.qty ?? 0
    const nextCart = {
      ...cart,
      [key]: { qty: prev + qty, label: label.trim() },
    }
    updateCartStorage(nextCart)
    setShowDialog(true)
    toast.success(
      <span>
        Added <b>{product.name}</b> ({size}ml, {BOTTLE_COLORS.find(c => c.value === color)?.name}) to cart!
      </span>
    )
  }

  function handleGoToCart() {
    setShowDialog(false)
    navigate('/cart')
  }

  function handleBuyNow(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) {
      setLabelError('Please enter a label')
      toast.error('Please enter a label for your bottle.')
      return
    }
    if (label.length > 24) {
      setLabelError('Max 24 characters')
      toast.error('Label must be 24 characters or less.')
      return
    }
    const key = `${product.id}_${color}_${size}_${label.trim()}`
    const prev = cart[key]?.qty ?? 0
    const nextCart = {
      ...cart,
      [key]: { qty: prev + qty, label: label.trim() },
    }
    updateCartStorage(nextCart)
    navigate('/checkout')
  }

  const relatedProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      p =>
        p.id !== product.id &&
        (p.color === color || p.size === size || p.eco === product.eco)
    ).slice(0, 3)
  }, [product, color, size])

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative pt-20 pb-12 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-b border-sky-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={cn(
              'inline-flex items-center px-4 py-2 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold mb-6',
              'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm'
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-xs font-semibold mr-2">
                  {BOTTLE_COLORS.find(c => c.value === color)?.name}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/80 border border-cyan-100 text-cyan-700 text-xs font-semibold mr-2">
                  {size}ml
                </span>
                {product.eco && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-700 text-xs font-semibold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Eco
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tighter text-slate-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-cyan-500" />
                <span className="font-semibold text-cyan-700">{product.rating}</span>
                <span className="text-slate-500 text-sm">({product.reviews} reviews)</span>
              </div>
              <p className="text-slate-600 mb-6 max-w-md">{product.description}</p>
              <form
                onSubmit={handleAddToCart}
                className="w-full max-w-sm space-y-4"
                autoComplete="off"
              >
                <div>
                  <label
                    htmlFor="label"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Bottle Label
                  </label>
                  <input
                    id="label"
                    type="text"
                    maxLength={24}
                    value={label}
                    onChange={handleLabelChange}
                    placeholder="e.g. Nishant Waters"
                    className={cn(
                      'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                      'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                      labelError && 'border-red-400'
                    )}
                  />
                  {labelError && (
                    <span className="text-xs text-red-500 mt-1 block">{labelError}</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Bottle Color
                    </label>
                    <select
                      id="color"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:border-cyan-500 transition-all duration-200 outline-none"
                    >
                      {BOTTLE_COLORS.map(c => (
                        <option key={c.value} value={c.value}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Size
                    </label>
                    <select
                      id="size"
                      value={size}
                      onChange={e => setSize(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:border-cyan-500 transition-all duration-200 outline-none"
                    >
                      {BOTTLE_SIZES.map(s => (
                        <option key={s.value} value={s.value}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <div className="flex items-center border border-cyan-200 rounded-lg bg-white">
                    <button
                      type="button"
                      className="px-2 py-1 text-cyan-700 hover:bg-cyan-50 rounded-l-lg transition-all"
                      onClick={() => setQty(q => clamp(q - 1, 1, 99))}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={qty}
                      onChange={e => setQty(clamp(Number(e.target.value), 1, 99))}
                      className="w-10 text-center border-none outline-none bg-transparent font-semibold text-cyan-700"
                    />
                    <button
                      type="button"
                      className="px-2 py-1 text-cyan-700 hover:bg-cyan-50 rounded-r-lg transition-all"
                      onClick={() => setQty(q => clamp(q + 1, 1, 99))}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                      'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
                      'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                      'disabled:opacity-60 disabled:pointer-events-none'
                    )}
                    disabled={!label.trim() || !!labelError}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                      'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                      'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                    )}
                    onClick={handleBuyNow}
                    disabled={!label.trim() || !!labelError}
                  >
                    <Sparkles className="w-5 h-5" />
                    Buy Now
                  </button>
                </div>
              </form>
              <div className="mt-6 text-lg font-bold text-cyan-700">
                ${product.price.toFixed(2)} <span className="text-base font-normal text-slate-500">per bottle</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <div className="bg-gradient-to-br from-cyan-50 via-white to-sky-100 rounded-2xl border border-cyan-100 shadow-lg p-8">
                <BottlePreview label={label} color={color} size={size} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'bg-white rounded-2xl shadow-2xl border border-cyan-100 max-w-md w-full p-8'
            )}
          >
            <div className="flex flex-col items-center text-center">
              <ShoppingCart className="w-10 h-10 text-cyan-600 mb-2" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                Added to Cart!
              </h2>
              <p className="text-slate-600 mb-4">
                <b>{product.name}</b> ({size}ml, {BOTTLE_COLORS.find(c => c.value === color)?.name}) with label "<span className="text-cyan-700">{label}</span>" has been added to your cart.
              </p>
              <div className="flex gap-3 mt-2 w-full">
                <button
                  type="button"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                    'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                  onClick={handleGoToCart}
                >
                  Go to Cart
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                  onClick={() => setShowDialog(false)}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="py-20 px-6 bg-gradient-to-b from-white via-cyan-50 to-sky-50 border-t border-sky-100"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-slate-900 mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map(rp => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileHover={{
                  scale: 1.025,
                  y: -6,
                  boxShadow: '0 8px 32px 0 rgba(56,189,248,0.10)',
                }}
                className={cn(
                  'bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 rounded-2xl border border-sky-100',
                  'hover:shadow-lg transition-all duration-300 flex flex-col'
                )}
              >
                <div className="relative mb-4">
                  <img
                    src={rp.image}
                    alt={rp.name}
                    className="w-full h-40 object-cover rounded-xl border border-cyan-100"
                    crossOrigin="anonymous"
                    draggable={false}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1">
                    {rp.eco && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-700 text-xs font-semibold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Eco
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/80 border border-cyan-100 text-cyan-700 text-xs font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {rp.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-cyan-200"
                    style={{ background: rp.color }}
                  />
                  <span className="text-sm text-cyan-700 font-semibold">
                    {rp.size}ml • {rp.colorName}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-1">
                  {rp.name}
                </h3>
                <p className="text-slate-600 text-sm mb-3 flex-1">{rp.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-cyan-700">
                    ${rp.price.toFixed(2)}
                  </span>
                  <Link
                    to={`/product/${rp.id}`}
                    className={cn(
                      'inline-flex items-center px-4 py-2 rounded-xl font-semibold text-base',
                      'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
                      'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                    )}
                  >
                    View
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default ProductDetail