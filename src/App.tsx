import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import ShopPage from './pages/ShopPage';

function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0b1411] text-[#ecfdf5]">
      <main className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <section className="space-y-4">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-tight">
            About Nishant Waters
          </h1>
          <p className="text-[#a7d7c4] max-w-2xl">
            Nishant Waters crafts eco-forward, custom-labeled water bottles designed
            for elevated everyday rituals, intentional gifting, and considered events.
          </p>
        </section>
        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-[16px] border border-[#244337] bg-[#14241e] p-6 space-y-2">
            <h2 className="text-sm tracking-[0.3em] uppercase text-[#a7d7c4]">
              Materials
            </h2>
            <p className="text-sm">
              Glass, aluminum, and BPA-free formats with recycled and refillable
              options curated for low-impact hydration.
            </p>
          </div>
          <div className="rounded-[16px] border border-[#244337] bg-[#14241e] p-6 space-y-2">
            <h2 className="text-sm tracking-[0.3em] uppercase text-[#a7d7c4]">
              Custom Labels
            </h2>
            <p className="text-sm">
              Minimal typographic labels in sand, slate, forest, mint, ink, or amber
              palettes tailored to your moment.
            </p>
          </div>
          <div className="rounded-[16px] border border-[#244337] bg-[#14241e] p-6 space-y-2">
            <h2 className="text-sm tracking-[0.3em] uppercase text-[#a7d7c4]">
              Considered Shipping
            </h2>
            <p className="text-sm">
              Carbon-conscious logistics with a free-shipping threshold that rewards
              intentional, consolidated orders.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0b1411] text-[#ecfdf5]">
      <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <section className="space-y-4">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-tight">
            Contact
          </h1>
          <p className="text-[#a7d7c4] max-w-xl">
            For bespoke orders, event collaborations, or wholesale inquiries, share a
            few details and our studio will be in touch.
          </p>
        </section>
        <form className="space-y-6 rounded-[16px] border border-[#244337] bg-[#14241e] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs tracking-[0.3em] uppercase text-[#a7d7c4]">
                Name
              </label>
              <input
                className="w-full rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs tracking-[0.3em] uppercase text-[#a7d7c4]">
                Email
              </label>
              <input
                className="w-full rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs tracking-[0.3em] uppercase text-[#a7d7c4]">
              Message
            </label>
            <textarea
              className="min-h-[140px] w-full rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
              placeholder="Tell us about your project or event..."
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-[#10b981] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#0ea371]"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

function CheckoutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0b1411] text-[#ecfdf5]">
      <main className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <section className="space-y-4">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-tight">
            Checkout
          </h1>
          <p className="text-[#a7d7c4] max-w-xl">
            Enter shipping details and confirm your eco-forward bottle collection.
          </p>
        </section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="space-y-6 rounded-[16px] border border-[#244337] bg-[#14241e] p-6">
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#a7d7c4]">
              Shipping
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="Full name"
              />
              <input
                className="rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="Phone"
              />
            </div>
            <input
              className="w-full rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
              placeholder="Address"
            />
            <div className="grid gap-4 md:grid-cols-3">
              <input
                className="rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="City"
              />
              <input
                className="rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="State"
              />
              <input
                className="rounded-md border border-[#244337] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#10b981]"
                placeholder="Postal code"
              />
            </div>
          </div>
          <div className="space-y-4 rounded-[16px] border border-[#244337] bg-[#14241e] p-6">
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#a7d7c4]">
              Order Summary
            </h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#a7d7c4]">Subtotal</span>
              <span>—</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#a7d7c4]">Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div className="border-t border-[#244337] pt-4 mt-2 flex items-center justify-between text-sm">
              <span className="text-[#a7d7c4]">Total</span>
              <span>—</span>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-[#10b981] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#0ea371]"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0b1411] text-[#ecfdf5] flex items-center justify-center">
      <p className="text-[#a7d7c4] px-6 py-24">
        Product detail experience will appear here.
      </p>
    </div>
  );
}

function PageTransitionWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <motion.div
      className="min-h-[calc(100vh-80px)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#0b1411] text-[#ecfdf5]">
      <Header className="border-b border-[#244337]" />
      <AnimatePresence mode="wait">
        <PageTransitionWrapper key={location?.pathname ?? '/'}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </PageTransitionWrapper>
      </AnimatePresence>
      <CartDrawer />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: '#14241e',
            color: '#ecfdf5',
            borderRadius: 16,
            border: '1px solid #244337',
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
          },
        }}
      />
    </CartProvider>
  );
}

export default App;