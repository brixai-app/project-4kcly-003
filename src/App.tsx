import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import {
  CartItem,
  loadCartFromStorage,
  saveCartToStorage,
  products,
  updateCartItemQuantity,
  removeCartItem,
} from "@/mock";

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from mock/localStorage once
  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored && Array.isArray(stored)) {
      setCart(stored);
    }
  }, []);

  // Persist cart via mock helper
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.productId === item.productId &&
          ci.selectedSize === item.selectedSize &&
          ci.selectedBottleColor === item.selectedBottleColor &&
          ci.customLabel?.templateId === item.customLabel?.templateId &&
          ci.customLabel?.customText === item.customLabel?.customText &&
          ci.customLabel?.textColor === item.customLabel?.textColor &&
          ci.customLabel?.font === item.customLabel?.font
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart((prev) => updateCartItemQuantity(prev, id, quantity));
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => removeCartItem(prev, id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#FFF5E1] text-[#333333]">
        <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage products={products} onAddToCart={handleAddToCart} />
                }
              />
              <Route path="/shop" element={<ShopPage products={products} />} />
              <Route
                path="/product/:id"
                element={
                  <ProductDetailPage
                    products={products}
                    onAddToCart={handleAddToCart}
                  />
                }
              />
              <Route
                path="/checkout"
                element={<CheckoutPage cart={cart} onClearCart={handleClearCart} />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />

        <CartDrawer
          open={isCartOpen}
          onOpenChange={setIsCartOpen}
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        {/* Global Sonner toaster for toasts across the app */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1F130C",
              color: "#FFF5E1",
              borderRadius: 9999,
              border: "1px solid #CBA135",
              boxShadow: "0 18px 45px rgba(12,7,3,0.6)",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;