import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export interface LayoutProps {
  /**
   * Controls whether the cart drawer is open.
   * This state is owned by App.tsx so it can be
   * toggled from the Header and persisted across routes.
   */
  isCartOpen: boolean;
  /**
   * Called when the cart drawer should be opened,
   * typically from the Header cart button.
   */
  onOpenCart: () => void;
  /**
   * Called when the cart drawer should be closed,
   * typically from the CartDrawer itself.
   */
  onCloseCart: () => void;
}

/**
 * Layout
 *
 * Full-width shell that wraps all routed pages.
 * - Sticky, edge-to-edge Header
 * - Expansive main area that supports page transition animations
 * - Consistent inner content container (max-w-[1600px] mx-auto px-6 lg:px-12)
 * - Global CartDrawer slide-over mounted at this level
 *
 * NOTE: This app is **entirely frontend-only**. Any cart and order
 * behavior is mocked on the client (see src/mock.ts) with
 * localStorage persistence to simulate a backend.
 */
const Layout: React.FC<LayoutProps> = ({ isCartOpen, onOpenCart, onCloseCart }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-[rgba(247,241,232,0.98)] text-neutral-900 flex flex-col">
      {/* Sticky global header */}
      <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-[rgba(247,241,232,0.9)] border-b border-[rgba(148,92,50,0.18)]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <Header onOpenCart={onOpenCart} />
        </div>
      </header>

      {/* Main content area with animated route transitions */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="w-full"
          >
            {/*
              The Outlet lets each page choose its own full-bleed or
              constrained sections. Pages should use:
              - w-full for section wrappers (optionally with background color)
              - inner containers: max-w-[1600px] mx-auto px-6 lg:px-12
            */}
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global footer, also full-width with inner container */}
      <footer className="w-full border-t border-[rgba(148,92,50,0.18)] bg-[rgba(243,230,214,0.96)] mt-10">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
          <Footer />
        </div>
      </footer>

      {/* Cart drawer lives at layout level so it's accessible from any route */}
      <CartDrawer open={isCartOpen} onOpenChange={(open) => (open ? onOpenCart() : onCloseCart())} />
    </div>
  );
};

export default Layout;