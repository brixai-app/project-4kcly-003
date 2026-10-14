import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import CustomizeDrawer from './components/CustomizeDrawer';
import Home from './pages/Home';
import ShopPage from './pages/ShopPage';
import { Product } from './types';

export function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [search, setSearch] = useState('');

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCustomizeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4e9dc] text-[#0b1f2a] flex flex-col">
      <Header onSearchChange={setSearch} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.23, 0.92, 0.35, 1] }}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={<Home onSelectProduct={handleSelectProduct} />}
              />
              <Route
                path="/shop"
                element={<ShopPage onSelectProduct={handleSelectProduct} />}
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-[#e6d8c8] bg-[#fff7ee]">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs tracking-[0.2em] uppercase text-[#4b5a63]">
            Nishant Waters · Crafted Hydration
          </span>
          <span className="text-xs text-[#4b5a63]">
            © {new Date().getFullYear()} Nishant Waters. All rights reserved.
          </span>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <CustomizeDrawer
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        product={selectedProduct}
      />
      <Toaster position="top-center" />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </CartProvider>
  );
}

export default App;