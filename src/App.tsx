import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/AppLayout';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart, getCartSummary, useCartDrawerState } from '@/mock';

// NOTE: This application uses client-side mock data and localStorage persistence only.
// There is no real backend or payment processing.

const AppShell: React.FC = () => {
  const cart = useCart();
  const cartSummary = getCartSummary(cart.items);
  const cartDrawer = useCartDrawerState();

  return (
    <AppLayout
      cartCount={cartSummary.totalQuantity}
      onCartClick={() => cartDrawer.setOpen(true)}
    >
      <CartDrawer
        open={cartDrawer.open}
        onOpenChange={cartDrawer.setOpen}
        items={cart.items}
        subtotal={cartSummary.subtotal}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
      </Routes>
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        richColors
        duration={4000}
        toastOptions={{
          className:
            "font-['Merriweather'] text-sm bg-white/95 text-[#0E4D5B] shadow-lg border border-[#E5E7EB]",
        }}
      />
      <AppShell />
    </BrowserRouter>
  );
};

export default App;