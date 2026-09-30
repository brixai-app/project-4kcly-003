import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, ArrowLeft, ArrowRight, Truck, Sparkles, Star, ShoppingCart, Check } from 'lucide-react'
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

function parseCart(): { [key: string]: { qty: number; label: string } } {
  try {
    const c = window.localStorage.getItem('nishantwaters_cart')
    return c ? JSON.parse(c) : {}
  } catch {
    return {}
  }
}

function getProductFromCartKey(key: string) {
  const [id, color, size, ...labelArr] = key.split('_')
  const label = labelArr.join('_')
  const product = MOCK_PRODUCTS.find(
    p => p.id === id && p.color === color && p.size === size
  )
  return { product, label, color, size }
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

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone)
}

function validatePostal(postal: string) {
  return /^[A-Za-z0-9\s\-]{3,12}$/.test(postal)
}

function Checkout() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<{ [key: string]: { qty: number; label: string } }>(parseCart)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([key, value]) => {
        const { product, label, color, size } = getProductFromCartKey(key)
        return product
          ? {
              key,
              product,
              label,
              color,
              size,
              qty: value.qty,
            }
          : null
      })
      .filter(Boolean) as Array<{
        key: string
        product: typeof MOCK_PRODUCTS[0]
        label: string
        color: string
        size: string
        qty: number
      }>
  }, [cart])

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.qty,
        0
      ),
    [cartItems]
  )

  const ecoCount = useMemo(
    () => cartItems.filter(item => item.product.eco).length,
    [cartItems]
  )

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal: '',
    country: '',
    card: '',
    expiry: '',
    cvc: '',
  })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  useEffect(() => {
    if (showSuccess) {
      window.localStorage.removeItem('nishantwaters_cart')
      setCart({})
    }
  }, [showSuccess])

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(errs => ({ ...errs, [name]: '' }))
  }

  function validateForm() {
    const next: { [k: string]: string } = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!validateEmail(form.email)) next.email = 'Invalid email'
    if (!form.phone.trim()) next.phone = 'Phone is required'
    else if (!validatePhone(form.phone)) next.phone = 'Invalid phone'
    if (!form.address.trim()) next.address = 'Address is required'
    if (!form.city.trim()) next.city = 'City is required'
    if (!form.postal.trim()) next.postal = 'Postal code is required'
    else if (!validatePostal(form.postal)) next.postal = 'Invalid postal code'
    if (!form.country.trim()) next.country = 'Country is required'
    if (!form.card.trim()) next.card = 'Card number is required'
    else if (!/^\d{12,19}$/.test(form.card.replace(/\s/g, ''))) next.card = 'Invalid card number'
    if (!form.expiry.trim()) next.expiry = 'Expiry is required'
    else if (!/^(0[1-9]|1[0-2])\/\d{2,4}$/.test(form.expiry)) next.expiry = 'Invalid expiry (MM/YY)'
    if (!form.cvc.trim()) next.cvc = 'CVC is required'
    else if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = 'Invalid CVC'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setShowSuccess(true)
      setSubmitting(false)
      toast.success('Order placed successfully!')
    }, 1200)
  }

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-24 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-white min-h-[60vh]"
      >
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
          alt="Empty cart"
          className="w-40 h-40 object-cover rounded-xl mb-8"
          crossOrigin="anonymous"
          draggable={false}
        />
        <span className="text-2xl font-bold text-cyan-700 mb-2">Your cart is empty</span>
        <span className="text-slate-500 mb-6">Add some custom bottles to checkout!</span>
        <Link
          to="/shop"
          className={cn(
            'inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
            'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
            'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>
      </motion.section>
    )
  }

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative pt-20 pb-10 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-b border-sky-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-7 h-7 text-cyan-600" />
            <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tighter text-slate-900">
              Checkout
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-white rounded-2xl border border-sky-100 shadow-sm p-8 space-y-8"
                autoComplete="off"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleInput}
                        placeholder="Your Name"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.name && 'border-red-400'
                        )}
                        autoComplete="name"
                        disabled={submitting}
                      />
                      {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInput}
                        placeholder="you@email.com"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.email && 'border-red-400'
                        )}
                        autoComplete="email"
                        disabled={submitting}
                      />
                      {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleInput}
                        placeholder="+1 555 123 4567"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.phone && 'border-red-400'
                        )}
                        autoComplete="tel"
                        disabled={submitting}
                      />
                      {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="country">
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        value={form.country}
                        onChange={handleInput}
                        placeholder="Country"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.country && 'border-red-400'
                        )}
                        autoComplete="country"
                        disabled={submitting}
                      />
                      {errors.country && <span className="text-xs text-red-500 mt-1 block">{errors.country}</span>}
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="address">
                        Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleInput}
                        placeholder="Street address"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.address && 'border-red-400'
                        )}
                        autoComplete="address"
                        disabled={submitting}
                      />
                      {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="city">
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleInput}
                        placeholder="City"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.city && 'border-red-400'
                        )}
                        autoComplete="address-level2"
                        disabled={submitting}
                      />
                      {errors.city && <span className="text-xs text-red-500 mt-1 block">{errors.city}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="postal">
                        Postal Code
                      </label>
                      <input
                        id="postal"
                        name="postal"
                        type="text"
                        value={form.postal}
                        onChange={handleInput}
                        placeholder="Postal code"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.postal && 'border-red-400'
                        )}
                        autoComplete="postal-code"
                        disabled={submitting}
                      />
                      {errors.postal && <span className="text-xs text-red-500 mt-1 block">{errors.postal}</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">
                    Payment Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="card">
                        Card Number
                      </label>
                      <input
                        id="card"
                        name="card"
                        type="text"
                        inputMode="numeric"
                        value={form.card}
                        onChange={handleInput}
                        placeholder="1234 5678 9012 3456"
                        className={cn(
                          'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                          'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                          errors.card && 'border-red-400'
                        )}
                        autoComplete="cc-number"
                        disabled={submitting}
                        maxLength={19}
                      />
                      {errors.card && <span className="text-xs text-red-500 mt-1 block">{errors.card}</span>}
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="expiry">
                          Expiry (MM/YY)
                        </label>
                        <input
                          id="expiry"
                          name="expiry"
                          type="text"
                          value={form.expiry}
                          onChange={handleInput}
                          placeholder="MM/YY"
                          className={cn(
                            'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                            'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                            errors.expiry && 'border-red-400'
                          )}
                          autoComplete="cc-exp"
                          disabled={submitting}
                          maxLength={7}
                        />
                        {errors.expiry && <span className="text-xs text-red-500 mt-1 block">{errors.expiry}</span>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="cvc">
                          CVC
                        </label>
                        <input
                          id="cvc"
                          name="cvc"
                          type="text"
                          inputMode="numeric"
                          value={form.cvc}
                          onChange={handleInput}
                          placeholder="CVC"
                          className={cn(
                            'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                            'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none',
                            errors.cvc && 'border-red-400'
                          )}
                          autoComplete="cc-csc"
                          disabled={submitting}
                          maxLength={4}
                        />
                        {errors.cvc && <span className="text-xs text-red-500 mt-1 block">{errors.cvc}</span>}
                      </div>
                    </div>
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
                  disabled={submitting}
                >
                  <CreditCard className="w-5 h-5" />
                  {submitting ? 'Processing...' : 'Place Order'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Truck className="w-4 h-4 text-cyan-500" />
                  Fast, tracked delivery on all orders
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Star className="w-4 h-4 text-cyan-500" />
                  100% satisfaction guarantee
                </div>
              </motion.form>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="bg-gradient-to-br from-white via-cyan-50 to-sky-50 border border-sky-100 rounded-2xl shadow-lg p-8 flex flex-col gap-6 sticky top-28"
            >
              <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-2">
                Order Summary
              </h2>
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.key} className="flex items-center gap-3 py-2 border-b border-cyan-100 last:border-b-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-cyan-100"
                      crossOrigin="anonymous"
                      draggable={false}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <BottlePreviewMini label={item.label} color={item.color} size={item.size} />
                        <span className="text-xs text-cyan-700 font-semibold">
                          {item.size}ml • {BOTTLE_COLORS.find(c => c.value === item.color)?.name}
                        </span>
                        {item.product.eco && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-700 text-[10px] font-semibold ml-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Eco
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-900 font-bold">{item.product.name}</div>
                      <div className="text-[10px] text-slate-500">
                        Label: <span className="font-semibold text-cyan-700">{item.label}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">x{item.qty}</span>
                    <span className="text-xs font-bold text-cyan-700">
                      ${(item.product.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-cyan-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-slate-500">Calculated at delivery</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Eco Bottles</span>
                  <span className="text-cyan-700 font-semibold">{ecoCount}</span>
                </div>
                <div className="flex items-center justify-between border-t border-cyan-100 pt-3 mt-3">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-cyan-700 text-lg">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/cart"
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-xl font-semibold text-base',
                    'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Edit Cart
                </Link>
                <Link
                  to="/shop"
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-xl font-semibold text-base',
                    'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                    'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Dialog.Root open={showSuccess} onOpenChange={setShowSuccess}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'bg-white rounded-2xl shadow-2xl border border-cyan-100 max-w-md w-full p-8'
            )}
          >
            <div className="flex flex-col items-center text-center">
              <Check className="w-12 h-12 text-cyan-600 mb-2" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-slate-600 mb-4">
                Thank you for your order. Your custom bottles are being prepared and will be shipped soon.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                    'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                  onClick={() => {
                    setShowSuccess(false)
                    navigate('/shop')
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  Shop Again
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                  onClick={() => {
                    setShowSuccess(false)
                    navigate('/')
                  }}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default Checkout