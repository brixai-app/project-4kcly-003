import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastNotifications } from "@/components/ui/ToastNotifications";
import CartDrawer from "@/components/cart/CartDrawer";
import LabelDesignDrawer from "@/components/label/LabelDesignDrawer";

/**
 * High-level application shell ensuring persistent header/footer, drawers and toasts.
 */
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8" id="main-content">
        <Outlet />
      </main>

      <Footer />

      {/* Global toast system using Sonner */}
      <ToastNotifications />

      {/* Persistent drawers mounted at root so they overlay all routes */}
      <CartDrawer />
      <LabelDesignDrawer />
    </div>
  );
};

export default AppLayout;