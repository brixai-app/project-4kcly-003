import React from "react";
import { Toaster, toast } from "sonner";
import { BRANDY_PALETTE } from "@/mock";

// ---------------------------------------------
// NOTE: This file wires up Sonner toasts for a
// FRONTEND-ONLY MOCK APPLICATION. There is NO
// backend; all notifications reflect client-side
// mock state changes from src/mock.ts.
// ---------------------------------------------

export const showToastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

export const showToastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
  });
};

export const showToastInfo = (message: string, description?: string) => {
  toast(message, {
    description,
  });
};

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      duration={3800}
      toastOptions={{
        style: {
          // Warm, brandy-toned shell that still keeps text readable
          background: BRANDY_PALETTE.inkSoft,
          color: BRANDY_PALETTE.cream,
          borderRadius: 9999,
          border: `1px solid ${BRANDY_PALETTE.cocoa}`,
          boxShadow:
            "0 18px 45px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.25)",
        },
        className:
          "backdrop-blur-sm px-4 py-3 font-sans text-sm tracking-tight shadow-lg", // Tailwind-like utility classes for layout/typography
      }}
      visibleToasts={4}
      expand
      offset={24}
    />
  );
};

export default ToastProvider;