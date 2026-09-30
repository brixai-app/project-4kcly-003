import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight, Check, Sparkles } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CONTACT_IMAGE =
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'

const COMPANY_CONTACT = {
  email: 'hello@nishantwaters.com',
  phone: '+1 555 123 4567',
  address: '123 Aqua Lane, Mumbai, India',
  mapUrl: 'https://maps.google.com/',
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhone(phone: string) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone)
}

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    if (!form.message.trim()) next.message = 'Message is required'
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
      setForm({ name: '', email: '', phone: '', message: '' })
      toast.success('Message sent successfully!')
    }, 1100)
  }

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative min-h-[60vh] flex items-center pt-24 pb-16 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-b border-sky-100"
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
              Contact <span className="bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">Nishant Waters</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-lg text-slate-600 max-w-lg"
            >
              Have a question, want a quote, or ready to make a splash? Our team is here to help. Fill out the form or reach us directly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-3 mt-6"
            >
              <div className="flex items-center gap-3 text-cyan-700">
                <Mail className="w-5 h-5" />
                <a
                  href={`mailto:${COMPANY_CONTACT.email}`}
                  className="hover:underline font-semibold"
                >
                  {COMPANY_CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-cyan-700">
                <Phone className="w-5 h-5" />
                <a
                  href={`tel:${COMPANY_CONTACT.phone.replace(/\s/g, '')}`}
                  className="hover:underline font-semibold"
                >
                  {COMPANY_CONTACT.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-cyan-700">
                <MapPin className="w-5 h-5" />
                <a
                  href={COMPANY_CONTACT.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-semibold"
                >
                  {COMPANY_CONTACT.address}
                </a>
              </div>
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
              src={CONTACT_IMAGE}
              alt="Contact Nishant Waters"
              className="object-cover w-full h-full rounded-xl"
              crossOrigin="anonymous"
              draggable={false}
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-24 px-6 bg-white border-t border-sky-100 relative overflow-hidden"
        style={{ minHeight: 520 }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter text-slate-900 mb-10 text-center">
            Send Us a Message
          </h2>
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-gradient-to-br from-sky-50 via-white to-cyan-50 rounded-2xl border border-sky-100 shadow-lg p-8 space-y-8"
            autoComplete="off"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                  Name
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
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleInput}
                  placeholder="How can we help you?"
                  rows={4}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-cyan-500',
                    'bg-slate-50 text-slate-900 font-semibold transition-all duration-200 outline-none resize-none',
                    errors.message && 'border-red-400'
                  )}
                  disabled={submitting}
                />
                {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message}</span>}
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
              <Sparkles className="w-5 h-5" />
              {submitting ? 'Sending...' : 'Send Message'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.form>
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
                Message Sent!
              </h2>
              <p className="text-slate-600 mb-4">
                Thank you for reaching out. Our team will get back to you as soon as possible.
              </p>
              <button
                type="button"
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                  'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
                onClick={() => setShowSuccess(false)}
              >
                <Sparkles className="w-5 h-5" />
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default Contact