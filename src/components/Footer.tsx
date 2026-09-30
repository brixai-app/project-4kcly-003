import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const COMPANY_CONTACT = {
  email: 'hello@nishantwaters.com',
  phone: '+1 555 123 4567',
  address: '123 Aqua Lane, Mumbai, India',
  mapUrl: 'https://maps.google.com/',
}

const SOCIALS = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    url: 'https://linkedin.com/',
  },
  {
    icon: Twitter,
    label: 'Twitter',
    url: 'https://twitter.com/',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    url: 'https://instagram.com/',
  },
]

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-cyan-50 to-sky-50 border-t border-sky-100 pt-12 pb-6 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-cyan-100">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Nishant Waters Home"
            >
              <span className="inline-block w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-400 to-cyan-600 flex items-center justify-center shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <ellipse cx="12" cy="12" rx="10" ry="10" fill="#38bdf8" />
                  <path d="M12 4c2.5 3.5 6 7.5 6 11a6 6 0 11-12 0c0-3.5 3.5-7.5 6-11z" fill="#e0f7fa" />
                  <ellipse cx="12" cy="15" rx="3.5" ry="2" fill="#bae6fd" />
                </svg>
              </span>
              <span className="text-xl font-serif font-extrabold tracking-tighter text-slate-900 group-hover:text-cyan-700 transition-colors">
                Nishant Waters
              </span>
            </Link>
            <p className="text-slate-600 text-sm max-w-xs mt-2">
              Premium custom labeled water bottles for brands, events, and unforgettable impressions. Make a splash, sustainably.
            </p>
            <div className="flex gap-3 mt-2">
              {SOCIALS.map(soc => (
                <a
                  key={soc.label}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 text-cyan-700 hover:text-cyan-900 transition-all"
                >
                  <soc.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 mb-3">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-600 hover:text-cyan-700 transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-cyan-700">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${COMPANY_CONTACT.email}`}
                  className="hover:underline font-medium"
                >
                  {COMPANY_CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-cyan-700">
                <Phone className="w-4 h-4" />
                <a
                  href={`tel:${COMPANY_CONTACT.phone.replace(/\s/g, '')}`}
                  className="hover:underline font-medium"
                >
                  {COMPANY_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-cyan-700">
                <MapPin className="w-4 h-4" />
                <a
                  href={COMPANY_CONTACT.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium"
                >
                  {COMPANY_CONTACT.address}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 mb-3">Newsletter</h3>
            <NewsletterSignup />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} Nishant Waters. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a
              href="https://nishantwaters.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-700 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://nishantwaters.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-700 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function NewsletterSignup() {
  const [email, setEmail] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    setError('')
    setSuccess(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError('Enter a valid email')
      setSuccess(false)
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSuccess(true)
      setError('')
      setEmail('')
      setSubmitting(false)
    }, 900)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Your email"
          className={cn(
            'flex-1 px-4 py-2 rounded-l-lg border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm outline-none transition-all duration-200',
            error && 'border-red-400'
          )}
          disabled={submitting || success}
          autoComplete="email"
          aria-label="Newsletter email"
        />
        <button
          type="submit"
          className={cn(
            'px-4 py-2 rounded-r-lg font-semibold text-sm',
            'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
            'border border-cyan-700/20 border-l-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
            'disabled:opacity-60 disabled:pointer-events-none'
          )}
          disabled={submitting || success}
        >
          {success ? '✓' : 'Subscribe'}
        </button>
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      {success && (
        <span className="text-xs text-cyan-700 mt-1">
          Thank you for subscribing!
        </span>
      )}
    </form>
  )
}

export default Footer