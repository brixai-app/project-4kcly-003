import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#F7F1E8] text-[#141310] flex flex-col">
          <Header className="border-b border-[#DED5C8] bg-[#F7F1E8]/90 backdrop-blur-sm sticky top-0 z-40" />
          <CartDrawer />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <footer className="border-t border-[#DED5C8] bg-[#F7F1E8]">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
              <div className="md:col-span-2 space-y-4">
                <div className="text-xs tracking-[0.35em] uppercase text-[#5D584F]">
                  Nishant Waters
                </div>
                <p className="text-base leading-relaxed text-[#3b3832] max-w-xl">
                  Custom-labeled waters for ateliers, galleries, and private tables. Crafted with
                  precision, designed for presence.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold tracking-[0.22em] uppercase text-[#5D584F]">
                  Atelier
                </h4>
                <p className="text-sm text-[#3b3832]">
                  By-appointment tastings and label consultations in our Mumbai studio. Evenings and
                  weekends by request.
                </p>
                <p className="text-xs text-[#5D584F]">
                  Studio District, Mumbai<br />
                  +91 (0)22 0000 0000
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-semibold tracking-[0.22em] uppercase text-[#5D584F]">
                  Correspondence
                </h4>
                <p className="text-sm text-[#3b3832]">
                  For collaborations, private labels, and events, write to{' '}
                  <span className="underline decoration-[#0E4A3A]/60 underline-offset-2">
                    studio@nishantwaters.com
                  </span>
                </p>
                <p className="text-xs text-[#5D584F]">
                  © {new Date().getFullYear()} Nishant Waters. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: 16,
              background: '#141310',
              color: '#F7F1E8',
              border: '1px solid #3a362e',
            },
          }}
        />
      </CartProvider>
    </HashRouter>
  );
}

export default App;