import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function getCartCount() {
  try {
    const c = window.localStorage.getItem('nishantwaters_cart')
    if (!c) return 0
    const obj = JSON.parse(c)
    return Object.values(obj).reduce((sum: number, v: any) => sum + (v?.qty ?? 0), 0)
  } catch {
    return 0
  }
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(getCartCount())
  const location = useLocation()
  const navigate = useNavigate()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleStorage() {
      setCartCount(getCartCount())
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 1200)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setCartCount(getCartCount())
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    function handleClick(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Nishant Waters Home"
        >
          <span className="inline-block w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-400 to-cyan-600 flex items-center justify-center shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <ellipse cx="12" cy="12" rx="10" ry="10" fill="#38bdf8" />
              <path d="M12 4c2.5 3.5 6 7.5 6 11a6 6 0 11-12 0c0-3.5 3.5-7.5 6-11z" fill="#e0f7fa" />
              <ellipse cx="12" cy="15" rx="3.5" ry="2" fill="#bae6fd" />
            </svg>
          </span>
          <span className="text-lg md:text-xl font-serif font-extrabold tracking-tighter text-slate-900 group-hover:text-cyan-700 transition-colors">
            Nishant Waters
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'transition-colors hover:text-cyan-700 px-2 py-1 rounded-lg',
                location.pathname === link.to && 'text-cyan-700 font-semibold bg-cyan-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className={cn(
              'ml-2 inline-flex items-center px-5 py-2 rounded-xl font-semibold text-base',
              'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
              'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 relative'
            )}
            onClick={() => navigate('/shop')}
          >
            Shop Now
          </button>
          <button
            type="button"
            className={cn(
              'ml-2 relative inline-flex items-center px-3 py-2 rounded-xl font-semibold text-base',
              'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
              'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
            )}
            aria-label="View cart"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'relative inline-flex items-center px-3 py-2 rounded-xl font-semibold text-base',
              'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
              'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
            )}
            aria-label="View cart"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className={cn(
              'ml-1 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-lg"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-semibold transition-colors',
                    location.pathname === link.to
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-700 hover:bg-cyan-50 hover:text-cyan-700'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className={cn(
                  'mt-2 w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-base',
                  'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 text-white shadow-sm',
                  'border border-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
                onClick={() => {
                  setMobileOpen(false)
                  navigate('/shop')
                }}
              >
                Shop Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header