import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Sparkles, Star, ChevronDown, ChevronUp } from 'lucide-react'
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

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
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
    <div className="flex flex-col items-center relative">
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

type Product = {
  id: string
  name: string
  image: string
  color: string
  colorName: string
  size: string
  price: number
  description: string
  rating: number
  reviews: number
  eco?: boolean
}

type ProductCardProps = {
  product: Product
  initialLabel?: string
  onAddToCart?: (product: Product, label: string, qty: number) => void
  onCustomize?: (product: Product) => void
}

function ProductCard({
  product,
  initialLabel = '',
  onAddToCart,
  onCustomize,
}: ProductCardProps) {
  const [label, setLabel] = useState(initialLabel)
  const [qty, setQty] = useState(1)
  const [openColor, setOpenColor] = useState(false)
  const [openSize, setOpenSize] = useState(false)
  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState(product.size)
  const [labelError, setLabelError] = useState('')
  const navigate = useNavigate()

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLabel(val)
    if (val.length > 24) setLabelError('Max 24 characters')
    else setLabelError('')
  }

  function handleAddToCart() {
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
    if (onAddToCart) {
      onAddToCart({ ...product, color, size }, label, qty)
    } else {
      const key = `${product.id}_${color}_${size}_${label.trim()}`
      let cart: { [key: string]: { qty: number; label: string } }
      try {
        const c = window.localStorage.getItem('nishantwaters_cart')
        cart = c ? JSON.parse(c) : {}
      } catch {
        cart = {}
      }
      const prev = cart[key]?.qty ?? 0
      const nextCart = {
        ...cart,
        [key]: { qty: prev + qty, label: label.trim() },
      }
      window.localStorage.setItem('nishantwaters_cart', JSON.stringify(nextCart))
      toast.success(
        <span>
          Added <b>{product.name}</b> ({size}ml, {BOTTLE_COLORS.find(c => c.value === color)?.name}) to cart!
        </span>
      )
    }
  }

  function handleCustomize() {
    if (onCustomize) {
      onCustomize({ ...product, color, size })
    } else {
      navigate(`/product/${product.id}?label=${encodeURIComponent(label)}&color=${encodeURIComponent(color)}&size=${encodeURIComponent(size)}`)
    }
  }

  return (
    <motion.div
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
        <BottlePreviewMini label={label} color={color} size={size} />
        <span className="text-sm text-cyan-700 font-semibold">
          {size}ml • {BOTTLE_COLORS.find(c => c.value === color)?.name}
        </span>
      </div>
      <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
        {product.name}
      </h3>
      <p className="text-slate-600 text-sm mb-3 flex-1">{product.description}</p>
      <div className="flex items-center gap-2 mb-3">
        <DropdownMenu.Root open={openColor} onOpenChange={setOpenColor}>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'inline-flex items-center px-3 py-1 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold text-xs',
                'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm',
                'focus:outline-none'
              )}
              aria-label="Select bottle color"
              type="button"
            >
              <span className="mr-2 flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full border border-cyan-200 mr-1"
                  style={{ background: color }}
                />
                {BOTTLE_COLORS.find(c => c.value === color)?.name}
              </span>
              {openColor ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            side="bottom"
            align="start"
            className="bg-white border border-cyan-100 rounded-xl shadow-lg py-2 min-w-[120px] z-50"
          >
            {BOTTLE_COLORS.map(c => (
              <DropdownMenu.Item
                key={c.value}
                onSelect={() => setColor(c.value)}
                className={cn(
                  'px-4 py-2 text-xs cursor-pointer hover:bg-cyan-50 rounded-lg flex items-center gap-2',
                  color === c.value && 'font-bold text-cyan-700'
                )}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full border border-cyan-200 mr-2"
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
                'inline-flex items-center px-3 py-1 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold text-xs',
                'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm',
                'focus:outline-none'
              )}
              aria-label="Select bottle size"
              type="button"
            >
              <span className="mr-2">
                {BOTTLE_SIZES.find(s => s.value === size)?.name}
              </span>
              {openSize ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            side="bottom"
            align="start"
            className="bg-white border border-cyan-100 rounded-xl shadow-lg py-2 min-w-[90px] z-50"
          >
            {BOTTLE_SIZES.map(s => (
              <DropdownMenu.Item
                key={s.value}
                onSelect={() => setSize(s.value)}
                className={cn(
                  'px-4 py-2 text-xs cursor-pointer hover:bg-cyan-50 rounded-lg',
                  size === s.value && 'font-bold text-cyan-700'
                )}
              >
                {s.name}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          maxLength={24}
          placeholder="Enter your label"
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm',
            'focus:border-cyan-500 transition-all duration-200 outline-none',
            labelError && 'border-red-400'
          )}
          aria-label="Bottle label"
        />
        {labelError && (
          <span className="text-xs text-red-500 mt-1 block">{labelError}</span>
        )}
      </div>
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
            onClick={handleAddToCart}
            aria-label="Add to cart"
            disabled={!label.trim() || !!labelError}
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
            onClick={handleCustomize}
            aria-label="Customize bottle"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Customize
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard