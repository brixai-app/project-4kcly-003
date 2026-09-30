import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, ChevronDown, ChevronUp, Plus, Minus, Sparkles, Star } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

function getQueryParams(search: string) {
  const params = new URLSearchParams(search)
  return {
    label: params.get('label') ?? '',
    color: params.get('color') ?? '',
    size: params.get('size') ?? '',
  }
}

function BottlePreviewMini({
  label,
  color,
  size,
}: {
  label: string
  color: string
  size: string
}) {
  const bottleHeight = { '330': 40, '500': 50, '750': 60 }[size] ?? 50
  return (
    <div className="flex flex-col items-center">
      <svg
        width="32"
        height={bottleHeight + 10}
        viewBox={`0 0 32 ${bottleHeight + 10}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow"
      >
        <rect
          x="8"
          y="6"
          width="16"
          height={bottleHeight}
          rx="8"
          fill={color}
          stroke="#bae6fd"
          strokeWidth="1"
        />
        <rect
          x="12"
          y="0"
          width="8"
          height="10"
          rx="3"
          fill="#e0e7ef"
          stroke="#bae6fd"
          strokeWidth="1"
        />
        <rect
          x="11"
          y={bottleHeight / 2}
          width="10"
          height="12"
          rx="3"
          fill="#fff"
          stroke="#bae6fd"
          strokeWidth="0.5"
        />
      </svg>
      <span
        className="absolute left-1/2 top-1/2 w-7 text-[8px] font-bold tracking-tight text-cyan-700 pointer-events-none select-none"
        style={{
          transform: `translate(-50%, -80%)`,
          color: '#0e7490',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        {label || ''}
      </span>
    </div>
  )
}

function Shop() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialParams = getQueryParams(location.search)
  const [selectedColor, setSelectedColor] = useState(initialParams.color || '')
  const [selectedSize, setSelectedSize] = useState(initialParams.size || '')
  const [label, setLabel] = useState(initialParams.label || '')
  const [openColor, setOpenColor] = useState(false)
  const [openSize, setOpenSize] = useState(false)
  const [cart, setCart] = useState<{ [key: string]: { qty: number; label: string } }>(() => {
    try {
      const c = window.localStorage.getItem('nishantwaters_cart')
      return c ? JSON.parse(c) : {}
    } catch {
      return {}
    }
  })

  function updateCartStorage(next: typeof cart) {
    setCart(next)
    window.localStorage.setItem('nishantwaters_cart', JSON.stringify(next))
  }

  function handleAddToCart(product: typeof MOCK_PRODUCTS[0], labelText: string, qty: number) {
    if (!labelText.trim()) {
      toast.error('Please enter a label for your bottle.')
      return
    }
    if (labelText.length > 24) {
      toast.error('Label must be 24 characters or less.')
      return
    }
    const key = `${product.id}_${product.color}_${product.size}_${labelText.trim()}`
    const prev = cart[key]?.qty ?? 0
    const nextCart = {
      ...cart,
      [key]: { qty: prev + qty, label: labelText.trim() },
    }
    updateCartStorage(nextCart)
    toast.success(
      <span>
        Added <b>{product.name}</b> ({product.size}ml, {product.colorName}) to cart!
      </span>
    )
  }

  function handleCustomize(product: typeof MOCK_PRODUCTS[0]) {
    navigate(`/product/${product.id}?label=${encodeURIComponent(label)}&color=${encodeURIComponent(product.color)}&size=${encodeURIComponent(product.size)}`)
  }

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const colorMatch = selectedColor ? p.color === selectedColor : true
      const sizeMatch = selectedSize ? p.size === selectedSize : true
      return colorMatch && sizeMatch
    })
  }, [selectedColor, selectedSize])

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative pt-16 pb-8 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-b border-sky-100"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tighter text-slate-900 mb-2">
              Shop Custom Bottles
            </h1>
            <p className="text-lg text-slate-600 max-w-xl">
              Select your bottle color, size, and add your label. All bottles are premium, BPA-free, and ready for your brand.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
            <DropdownMenu.Root open={openColor} onOpenChange={setOpenColor}>
              <DropdownMenu.Trigger asChild>
                <button
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold',
                    'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm',
                    'focus:outline-none'
                  )}
                  aria-label="Select bottle color"
                  type="button"
                >
                  <span className="mr-2">
                    {selectedColor
                      ? BOTTLE_COLORS.find(c => c.value === selectedColor)?.name
                      : 'All Colors'}
                  </span>
                  {openColor ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                side="bottom"
                align="start"
                className="bg-white border border-cyan-100 rounded-xl shadow-lg py-2 min-w-[160px] z-50"
              >
                <DropdownMenu.Item
                  onSelect={() => setSelectedColor('')}
                  className={cn(
                    'px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 rounded-lg',
                    !selectedColor && 'font-bold text-cyan-700'
                  )}
                >
                  All Colors
                </DropdownMenu.Item>
                {BOTTLE_COLORS.map(c => (
                  <DropdownMenu.Item
                    key={c.value}
                    onSelect={() => setSelectedColor(c.value)}
                    className={cn(
                      'px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 rounded-lg flex items-center gap-2',
                      selectedColor === c.value && 'font-bold text-cyan-700'
                    )}
                  >
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-cyan-200 mr-2"
                      style={{ background: c.value }}
                    />
                    {c.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <DropdownMenu.Root open={openSize} onOpenChange={setOpenSize}>
              <DropdownMenu.Trigger asChild>
                <button
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold',
                    'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm',
                    'focus:outline-none'
                  )}
                  aria-label="Select bottle size"
                  type="button"
                >
                  <span className="mr-2">
                    {selectedSize
                      ? BOTTLE_SIZES.find(s => s.value === selectedSize)?.name
                      : 'All Sizes'}
                  </span>
                  {openSize ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                side="bottom"
                align="start"
                className="bg-white border border-cyan-100 rounded-xl shadow-lg py-2 min-w-[140px] z-50"
              >
                <DropdownMenu.Item
                  onSelect={() => setSelectedSize('')}
                  className={cn(
                    'px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 rounded-lg',
                    !selectedSize && 'font-bold text-cyan-700'
                  )}
                >
                  All Sizes
                </DropdownMenu.Item>
                {BOTTLE_SIZES.map(s => (
                  <DropdownMenu.Item
                    key={s.value}
                    onSelect={() => setSelectedSize(s.value)}
                    className={cn(
                      'px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 rounded-lg',
                      selectedSize === s.value && 'font-bold text-cyan-700'
                    )}
                  >
                    {s.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="py-16 px-6 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span className="text-lg font-semibold text-slate-900">
                {filteredProducts.length} bottle{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                maxLength={24}
                placeholder="Enter your label (for preview)"
                className={cn(
                  'px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-semibold',
                  'focus:border-cyan-500 transition-all duration-200 outline-none w-56'
                )}
                aria-label="Bottle label"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl border border-cyan-100"
                    crossOrigin="anonymous"
                    draggable={false}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1">
                    {product.eco && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-700 text-xs font-semibold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Eco
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/80 border border-cyan-100 text-cyan-700 text-xs font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <BottlePreviewMini
                    label={label}
                    color={product.color}
                    size={product.size}
                  />
                  <span className="text-sm text-cyan-700 font-semibold">
                    {product.size}ml • {product.colorName}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-slate-600 text-sm mb-3 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-cyan-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={cn(
                        'inline-flex items-center px-4 py-2 rounded-xl font-semibold text-base',
                        'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
                        'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                      )}
                      onClick={() => handleAddToCart(product, label, 1)}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'inline-flex items-center px-4 py-2 rounded-xl font-semibold text-base',
                        'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                      )}
                      onClick={() => handleCustomize(product)}
                      aria-label="Customize bottle"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Customize
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-cyan-700 mb-2">No bottles found</span>
              <span className="text-slate-500">Try adjusting your filters or label.</span>
              <button
                type="button"
                className={cn(
                  'mt-6 inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                  'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
                onClick={() => {
                  setSelectedColor('')
                  setSelectedSize('')
                  setLabel('')
                }}
              >
                Reset Filters
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  )
}

export default Shop