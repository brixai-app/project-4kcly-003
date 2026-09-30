import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { toast } from 'sonner'
import { ShoppingCart, Sparkles, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react'
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

type CustomizationFormProps = {
  initialLabel?: string
  initialColor?: string
  initialSize?: string
  initialQty?: number
  onSubmit?: (data: { label: string; color: string; size: string; qty: number }) => void
  showPreview?: boolean
  submitLabel?: string
  loading?: boolean
}

function CustomizationForm({
  initialLabel = '',
  initialColor = BOTTLE_COLORS[0].value,
  initialSize = BOTTLE_SIZES[1].value,
  initialQty = 1,
  onSubmit,
  showPreview = true,
  submitLabel = 'Add to Cart',
  loading = false,
}: CustomizationFormProps) {
  const [label, setLabel] = useState(initialLabel)
  const [color, setColor] = useState(initialColor)
  const [size, setSize] = useState(initialSize)
  const [qty, setQty] = useState(initialQty)
  const [labelError, setLabelError] = useState('')
  const [openColor, setOpenColor] = useState(false)
  const [openSize, setOpenSize] = useState(false)

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLabel(val)
    if (val.length > 24) setLabelError('Max 24 characters')
    else setLabelError('')
  }

  function handleSubmit(e: React.FormEvent) {
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
    if (onSubmit) {
      onSubmit({ label: label.trim(), color, size, qty })
    } else {
      const key = `custom_${color}_${size}_${label.trim()}`
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
          Added <b>Custom Bottle</b> ({size}ml, {BOTTLE_COLORS.find(c => c.value === color)?.name}) to cart!
        </span>
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full max-w-md space-y-6 flex flex-col md:flex-row md:items-start md:space-y-0 md:gap-8',
        showPreview ? '' : 'max-w-sm'
      )}
      autoComplete="off"
    >
      <div className="flex-1 space-y-4">
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
            disabled={loading}
          />
          {labelError && (
            <span className="text-xs text-red-500 mt-1 block">{labelError}</span>
          )}
        </div>
        <div className="flex gap-4">
          <DropdownMenu.Root open={openColor} onOpenChange={setOpenColor}>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className={cn(
                  'flex-1 inline-flex items-center px-4 py-2 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold',
                  'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm',
                  'focus:outline-none'
                )}
                aria-label="Select bottle color"
                disabled={loading}
              >
                <span className="mr-2 flex items-center">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-cyan-200 mr-1"
                    style={{ background: color }}
                  />
                  {BOTTLE_COLORS.find(c => c.value === color)?.name}
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
              className="bg-white border border-cyan-100 rounded-xl shadow-lg py-2 min-w-[140px] z-50"
            >
              {BOTTLE_COLORS.map(c => (
                <DropdownMenu.Item
                  key={c.value}
                  onSelect={() => setColor(c.value)}
                  className={cn(
                    'px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 rounded-lg flex items-center gap-2',
                    color === c.value && 'font-bold text-cyan-700'
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
                type="button"
                className={cn(
                  'flex-1 inline-flex items-center px-4 py-2 rounded-lg border border-cyan-200 bg-white text-cyan-700 font-semibold',
                  'hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm',
                  'focus:outline-none'
                )}
                aria-label="Select bottle size"
                disabled={loading}
              >
                <span className="mr-2">
                  {BOTTLE_SIZES.find(s => s.value === size)?.name}
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
              className="bg-white border border-cyan-100 rounded-xl shadow-lg py-2 min-w-[100px] z-50"
            >
              {BOTTLE_SIZES.map(s => (
                <DropdownMenu.Item
                  key={s.value}
                  onSelect={() => setSize(s.value)}
                  className={cn(
                    'px-4 py-2 text-sm cursor-pointer hover:bg-cyan-50 rounded-lg',
                    size === s.value && 'font-bold text-cyan-700'
                  )}
                >
                  {s.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-slate-700">
            Quantity
          </label>
          <div className="flex items-center border border-cyan-200 rounded-lg bg-white">
            <button
              type="button"
              className="px-2 py-1 text-cyan-700 hover:bg-cyan-50 rounded-l-lg transition-all"
              onClick={() => setQty(q => clamp(q - 1, 1, 99))}
              aria-label="Decrease quantity"
              disabled={qty <= 1 || loading}
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
              disabled={loading}
            />
            <button
              type="button"
              className="px-2 py-1 text-cyan-700 hover:bg-cyan-50 rounded-r-lg transition-all"
              onClick={() => setQty(q => clamp(q + 1, 1, 99))}
              aria-label="Increase quantity"
              disabled={qty >= 99 || loading}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className={cn(
            'w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
            'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
            'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
            'disabled:opacity-60 disabled:pointer-events-none'
          )}
          disabled={!label.trim() || !!labelError || loading}
        >
          <ShoppingCart className="w-5 h-5" />
          {loading ? 'Processing...' : submitLabel}
        </button>
      </div>
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="flex items-center justify-center mt-6 md:mt-0"
        >
          <div className="bg-gradient-to-br from-cyan-50 via-white to-sky-100 rounded-2xl border border-cyan-100 shadow-lg p-8">
            <BottlePreview label={label} color={color} size={size} />
          </div>
        </motion.div>
      )}
    </form>
  )
}

export default CustomizationForm