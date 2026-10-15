import React from "react";
import { Toaster } from "sonner";

/**
 * Global Sonner toaster configuration for Nishant Waters.
 * Mount this once in the root layout.
 */
export const ToastNotifications: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "#FFFBF5",
          color: "#2B2B2B",
          borderRadius: 999,
          border: "1px solid #E3DDD3",
          boxShadow:
            "0 18px 45px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.4) inset",
          paddingInline: 18,
          paddingBlock: 10,
          fontFamily: "Lora, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 14,
        },
        duration: 3500,
      }}
    />
  );
};

export default ToastNotifications;