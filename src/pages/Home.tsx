import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Sparkles, Truck, Star, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
const FEATURE_IMAGES = [
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509228468518-c5eeecbff44a?auto=format&fit=crop&w=800&q=80',
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

function Home() {
  const [label, setLabel] = useState('')
  const [color, setColor] = useState(BOTTLE_COLORS[0].value)
  const [size, setSize] = useState(BOTTLE_SIZES[1].value)
  const [labelError, setLabelError] = useState('')
  const navigate = useNavigate()

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLabel(val)
    if (val.length > 24) setLabelError('Max 24 characters')
    else setLabelError('')
  }

  function handleStartCustomize(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) {
      setLabelError('Please enter a label')
      return
    }
    if (label.length > 24) {
      setLabelError('Max 24 characters')
      return
    }
    navigate(
      `/shop?label=${encodeURIComponent(label)}&color=${encodeURIComponent(
        color
      )}&size=${encodeURIComponent(size)}`
    )
  }

  return (
    <div>
      
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative min-h-[90vh] flex items-center pt-24 pb-16 bg-gradient-to-br from-sky-50 via-cyan-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="text-5xl md:text-6xl font-serif font-extrabold tracking-tighter text-slate-900 leading-tight"
            >
              Elevate Your Brand <br />
              <span className="bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">
                with Custom Water Bottles
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-lg text-slate-600 max-w-lg"
            >
              Premium, crystal-clear water bottles with your own label. Perfect for events, offices, and unforgettable first impressions. Fast production, vibrant printing, and eco-friendly options.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <Link
                to="/shop"
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-gradient-to-b from-sky-600 to-cyan-700 hover:from-sky-500 hover:to-cyan-800 text-white shadow-sm',
                  'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Bottles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href="#customize"
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                  'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Customizer
              </a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="aspect-video bg-white rounded-2xl border border-slate-100 shadow-xl p-4 flex items-center justify-center"
          >
            <img
              src={HERO_IMAGE}
              alt="Premium custom water bottles"
              className="object-cover w-full h-full rounded-xl"
              crossOrigin="anonymous"
              draggable={false}
            />
          </motion.div>
        </div>
      </motion.section>

      
      <motion.section
        id="customize"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-20 px-6 bg-white border-t border-sky-100"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="flex flex-col items-center md:items-start"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter text-slate-900 mb-3">
              Try the Bottle Customizer
            </h2>
            <p className="text-slate-600 mb-6 max-w-md">
              Instantly preview your label and bottle color. Choose your size, add your brand, and see it live.
            </p>
            <form
              onSubmit={handleStartCustomize}
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
              <button
                type="submit"
                className={cn(
                  'w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
                  'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                  'disabled:opacity-60 disabled:pointer-events-none'
                )}
                disabled={!label.trim() || !!labelError}
              >
                <Sparkles className="w-5 h-5" />
                Preview & Shop
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <div className="bg-gradient-to-br from-cyan-50 via-white to-sky-100 rounded-2xl border border-cyan-100 shadow-lg p-8">
              <BottlePreview label={label} color={color} size={size} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-24 px-6 bg-gradient-to-b from-white via-cyan-50 to-sky-50 border-t border-sky-100"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter text-slate-900 mb-10 text-center">
            Why Choose Nishant Waters?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.03, y: -4, boxShadow: '0 8px 32px 0 rgba(56,189,248,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-sky-50 p-8 rounded-2xl border border-sky-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-cyan-600" />
                <span className="text-lg font-semibold text-slate-900">Premium Quality</span>
              </div>
              <img
                src={FEATURE_IMAGES[0]}
                alt="Premium bottle"
                className="w-full h-32 object-cover rounded-xl mb-4"
                crossOrigin="anonymous"
                draggable={false}
              />
              <p className="text-slate-600">
                Crystal-clear, BPA-free bottles with vibrant, full-color labels. Impress at every touchpoint.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -4, boxShadow: '0 8px 32px 0 rgba(56,189,248,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-white p-8 rounded-2xl border border-sky-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-cyan-600" />
                <span className="text-lg font-semibold text-slate-900">Fast, Reliable Delivery</span>
              </div>
              <img
                src={FEATURE_IMAGES[1]}
                alt="Fast delivery"
                className="w-full h-32 object-cover rounded-xl mb-4"
                crossOrigin="anonymous"
                draggable={false}
              />
              <p className="text-slate-600">
                Lightning-fast production and shipping. Track your order every step of the way.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -4, boxShadow: '0 8px 32px 0 rgba(56,189,248,0.08)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-sky-50 p-8 rounded-2xl border border-sky-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-cyan-600" />
                <span className="text-lg font-semibold text-slate-900">Eco-Friendly Options</span>
              </div>
              <img
                src={FEATURE_IMAGES[2]}
                alt="Eco-friendly"
                className="w-full h-32 object-cover rounded-xl mb-4"
                crossOrigin="anonymous"
                draggable={false}
              />
              <p className="text-slate-600">
                Choose recycled bottles and biodegradable labels. Make a splash, sustainably.
              </p>
            </motion.div>
          </div>
          <div className="flex justify-center mt-12">
            <Link
              to="/about"
              className={cn(
                'inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
                'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
              )}
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home