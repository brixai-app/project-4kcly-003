import React from "react";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { CartProvider } from "./store/cartStore";
import { OrderProvider } from "./store/orderStore";
import { UiStoreProvider } from "./store/uiStore";
import { MotionConfig } from "./components/ui/Motion";
import "./index.css";

const App: React.FC = () => {
  return (
    <React.StrictMode>
      {/* Global motion configuration for framer-motion wrappers */}
      <MotionConfig>
        {/* Global UI providers for cart, orders, and UI drawers. All data is stored in browser only. */}
        <UiStoreProvider>
          <CartProvider>
            <OrderProvider>
              {/* Router + layout tree */}
              <AppRoutes />
              {/* Sonner toast portal */}
              <Toaster
                position="top-center"
                richColors
                theme="light"
                toastOptions={{
                  style: {
                    background: "#FAF9F6",
                    color: "#2B2B2B",
                    borderRadius: 9999,
                    border: "1px solid #DDD6C5",
                    fontFamily:
                      "'Lora', ui-serif, Georgia, 'Times New Roman', serif",
                  },
                }}
              />
            </OrderProvider>
          </CartProvider>
        </UiStoreProvider>
      </MotionConfig>
    </React.StrictMode>
  );
};

export default App;