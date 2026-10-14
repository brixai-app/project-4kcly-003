import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';

export interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children = null }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#1F1F1F] flex flex-col">
      <Header className="border-b border-[#E7E1D8]" />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="w-full border-t border-[#E7E1D8] bg-white">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2 space-y-3">
            <div className="text-xs tracking-[0.2em] uppercase text-[#5F5A55]">
              Nishant Waters
            </div>
            <p className="font-serif text-base text-[#1F1F1F]">
              Curated custom-labeled water for interiors, tablescapes, and rituals that demand quiet precision.
            </p>
            <p className="text-xs text-[#5F5A55]">
              © {new Date().getFullYear()} Nishant Waters. All rights reserved.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#5F5A55]">
              Studio
            </h4>
            <p className="text-sm text-[#1F1F1F]">
              By appointment only<br />
              Mumbai / Goa
            </p>
            <p className="text-xs text-[#5F5A55]">
              Bespoke hospitality and gifting programs on request.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[#5F5A55]">
              Contact
            </h4>
            <p className="text-sm text-[#1F1F1F]">
              concierge@nishantwaters.com
            </p>
            <p className="text-xs text-[#5F5A55]">
              Mon–Sat, 10:00–19:00 IST
            </p>
          </div>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}

export interface AppProps {
  initialRoute?: string;
}

export function App({ initialRoute }: AppProps) {
  const RouterComponent = HashRouter;

  return (
    <CartProvider>
      <RouterComponent>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
          </Routes>
        </Layout>
      </RouterComponent>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            borderRadius: 16,
            background: '#FFFFFF',
            border: '1px solid #E7E1D8',
            color: '#1F1F1F',
            fontFamily: 'Lora, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        }}
      />
    </CartProvider>
  );
}

export default App;