import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./state/authStore";
import { CartProvider } from "./state/cartStore";
import { OrderProvider } from "./state/orderStore";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import { AppRoutes } from "./router/routes";
import { PageTransition } from "./components/layout/PageTransition";

// NOTE: This app is fully frontend-only and relies on centralized mock data
// defined in src/mock.ts / src/mockData.ts for products, users, and orders.
// There is NO real backend or network I/O; all state is stored in-memory
// and persisted via localStorage for the mock auth and cart flows.

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-soft text-stone-900 flex flex-col">
      {/* Skip link for a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-cream focus:text-stone-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Header />
      <CartDrawer />

      <main
        id="main-content"
        className="flex-1 pt-16" // account for fixed header if any
        aria-label="Main content"
      >
        <PageTransition>
          <AppRoutes />
        </PageTransition>
      </main>

      <Footer />

      <Toaster
        position="bottom-center"
        theme="light"
        toastOptions={{
          duration: 3000,
          className:
            "rounded-xl bg-cream/95 text-stone-900 shadow-lg border border-sand-soft font-sans text-sm",
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  // Global font classes are attached via index.css with Playfair Display & Inter
  // Here we just ensure providers wrap the entire visual tree.
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AnimatePresence mode="wait">
                <AppShell />
              </AnimatePresence>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;