import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import { addToCart, getCartItemCount, type Product, type ProductVariant } from '@/mock';
import { toast } from 'sonner';

// Shared cart handler type used by low-level cart logic
export type AddToCartHandler = (
  productId: string,
  variantId: string,
  quantity?: number,
  designId?: string,
) => void;

// Simple handler used by list/grid cards that only know productId
export type SimpleAddToCartHandler = (productId: string) => void;

// Detailed handler payload used by product detail page
export type DetailedAddToCartPayload = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  designId?: string;
};

// Detailed handler used by product detail page that knows product, variant, etc.
export type DetailedAddToCartHandler = (
  payload: DetailedAddToCartPayload,
) => void;

export default function App() {
  // Core implementation that talks to the mock cart utilities
  const handleAddToCart: AddToCartHandler = (
    productId,
    variantId,
    quantity = 1,
    _designId,
  ) => {
    const item = addToCart(productId, variantId, quantity);
    if (item) {
      toast.success('Added to cart', {
        description: `You now have ${getCartItemCount()} item(s) in your cart.`,
      });
    } else {
      toast.error('Unable to add to cart', {
        description: 'That configuration is not available at the moment.',
      });
    }
  };

  // Adapter for components that only pass a productId
  const handleSimpleAddToCart: SimpleAddToCartHandler = (productId) => {
    // Use a default variant id when only productId is known.
    // The mock implementation is expected to resolve a sensible default.
    handleAddToCart(productId, 'default');
  };

  // Adapter for components that pass a rich payload
  const handleDetailedAddToCart: DetailedAddToCartHandler = ({
    product,
    variant,
    quantity,
    designId,
  }) => {
    handleAddToCart(product.id, variant.id, quantity, designId);
  };

  const handleOpenCart = () => {
    // In this mock-only app we do not have a dedicated cart drawer.
    // Redirect users to the checkout route instead.
    window.location.href = '/checkout';
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        {/* Global toast configuration is provided by ToastProvider; this is a safety fallback. */}
        <Header onOpenCart={handleOpenCart} />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/shop"
              element={<CatalogPage onAddToCart={handleSimpleAddToCart} />}
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetailPage onAddToCart={handleDetailedAddToCart} />
              }
            />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}