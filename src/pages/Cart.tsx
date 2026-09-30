import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Plus, Minus, CreditCard, Truck, Sparkles, Star } from 'lucide-react'
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

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function parseCart(): { [key: string]: { qty: number; label: string } } {
  try {
    const c = window.localStorage.getItem('nishantwaters_cart')
    return c ? JSON.parse(c) : {}
  } catch {
    return {}
  }
}

function getProductFromCartKey(key: string) {
  // key: `${product.id}_${color}_${size}_${label.trim()}`
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

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<{ [key: string]: { qty: number; label: string } }>(parseCart)
  const [removingKey, setRemovingKey] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)

  function updateCartStorage(next: typeof cart) {
    setCart(next)
    window.localStorage.setItem('nishantwaters_cart', JSON.stringify(next))
  }

  function handleQtyChange(key: string, nextQty: number) {
    if (nextQty < 1 || nextQty > 99) return
    const nextCart = { ...cart, [key]: { ...cart[key], qty: nextQty } }
    updateCartStorage(nextCart)
  }

  function handleRemoveItem(key: string) {
    setRemovingKey(key)
    setTimeout(() => {
      const nextCart = { ...cart }
      delete nextCart[key]
      updateCartStorage(nextCart)
      setRemovingKey(null)
      toast.success('Item removed from cart.')
    }, 350)
  }

  function handleClearCart() {
    setShowClearDialog(false)
    updateCartStorage({})
    toast.success('Cart cleared.')
  }

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
            <ShoppingCart className="w-7 h-7 text-cyan-600" />
            <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tighter text-slate-900">
              Your Cart
            </h1>
          </div>
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="py-24 flex flex-col items-center justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
                alt="Empty cart"
                className="w-40 h-40 object-cover rounded-xl mb-8"
                crossOrigin="anonymous"
                draggable={false}
              />
              <span className="text-2xl font-bold text-cyan-700 mb-2">Your cart is empty</span>
              <span className="text-slate-500 mb-6">Add some custom bottles to get started!</span>
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
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="divide-y divide-cyan-100 bg-white rounded-2xl border border-sky-100 shadow-sm"
                >
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{
                        opacity: removingKey === item.key ? 0 : 1,
                        y: removingKey === item.key ? 30 : 0,
                        scale: removingKey === item.key ? 0.95 : 1,
                      }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className={cn(
                        'flex flex-col md:flex-row items-center gap-6 px-6 py-6',
                        idx === 0 ? '' : 'border-t border-cyan-100',
                        removingKey === item.key && 'opacity-60 pointer-events-none'
                      )}
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-28 h-28 object-cover rounded-xl border border-cyan-100"
                          crossOrigin="anonymous"
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1 w-full flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <BottlePreviewMini
                              label={item.label}
                              color={item.color}
                              size={item.size}
                            />
                            <span className="text-sm text-cyan-700 font-semibold">
                              {item.size}ml • {BOTTLE_COLORS.find(c => c.value === item.color)?.name}
                            </span>
                            {item.product.eco && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-700 text-xs font-semibold ml-2">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Eco
                              </span>
                            )}
                          </div>
                          <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            {item.product.name}
                          </h2>
                          <div className="text-xs text-slate-500 mt-1">
                            Label: <span className="font-semibold text-cyan-700">{item.label}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 min-w-[110px]">
                          <span className="text-sm text-slate-500 mb-1">Qty</span>
                          <div className="flex items-center border border-cyan-200 rounded-lg bg-white">
                            <button
                              type="button"
                              className="px-2 py-1 text-cyan-700 hover:bg-cyan-50 rounded-l-lg transition-all"
                              onClick={() => handleQtyChange(item.key, clamp(item.qty - 1, 1, 99))}
                              aria-label="Decrease quantity"
                              disabled={item.qty <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={item.qty}
                              onChange={e =>
                                handleQtyChange(item.key, clamp(Number(e.target.value), 1, 99))
                              }
                              className="w-10 text-center border-none outline-none bg-transparent font-semibold text-cyan-700"
                            />
                            <button
                              type="button"
                              className="px-2 py-1 text-cyan-700 hover:bg-cyan-50 rounded-r-lg transition-all"
                              onClick={() => handleQtyChange(item.key, clamp(item.qty + 1, 1, 99))}
                              aria-label="Increase quantity"
                              disabled={item.qty >= 99}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-[100px]">
                          <span className="text-lg font-bold text-cyan-700">
                            ${(item.product.price * item.qty).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            className={cn(
                              'inline-flex items-center px-3 py-1 rounded-lg border border-red-100 bg-white text-red-500 font-semibold text-sm hover:bg-red-50 hover:border-red-200 transition-all duration-200',
                              'disabled:opacity-60 disabled:pointer-events-none'
                            )}
                            onClick={() => handleRemoveItem(item.key)}
                            disabled={removingKey === item.key}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center px-4 py-2 rounded-xl font-semibold text-base',
                      'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                      'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                    )}
                    onClick={() => setShowClearDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </button>
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
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-cyan-700">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="text-slate-500">Calculated at checkout</span>
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
                <button
                  type="button"
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
                    'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
                    'mt-4'
                  )}
                  onClick={() => navigate('/checkout')}
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
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
              </motion.div>
            </div>
          )}
        </div>
      </motion.section>
      <Dialog.Root open={showClearDialog} onOpenChange={setShowClearDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
          <Dialog.Content
            className={cn(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'bg-white rounded-2xl shadow-2xl border border-cyan-100 max-w-md w-full p-8'
            )}
          >
            <div className="flex flex-col items-center text-center">
              <Trash2 className="w-10 h-10 text-red-500 mb-2" />
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                Clear Cart?
              </h2>
              <p className="text-slate-600 mb-4">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-2 w-full">
                <button
                  type="button"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-800 text-white shadow-sm',
                    'border border-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                  onClick={handleClearCart}
                >
                  Yes, Clear Cart
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                    'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                  )}
                  onClick={() => setShowClearDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default Cart