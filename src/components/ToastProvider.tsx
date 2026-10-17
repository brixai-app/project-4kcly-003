import React from 'react';
import { Toaster } from 'sonner';

/**
 * ToastProvider
 *
 * Global Sonner toast configuration for Nishant Waters.
 * This is a 100% frontend-only mock notification layer –
 * no backend calls are made; all toasts are purely client-side feedback.
 */

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          className:
            'w-full max-w-sm border border-[#e0d4c4] bg-[#f7efe6]/95 text-[#3a281f] shadow-lg shadow-black/5 backdrop-blur-sm font-sans',
          style: {
            // Fallback styles if Tailwind classes are not processed somewhere
            background: 'rgba(247, 239, 230, 0.95)',
            color: '#3a281f',
            borderColor: '#e0d4c4',
          },
          descriptionClassName: 'text-[13px] text-[#6b5140]',
          actionButtonStyle: {
            backgroundColor: '#b56a3c',
            color: '#fdf8f3',
          },
          cancelButtonStyle: {
            backgroundColor: 'transparent',
            color: '#6b5140',
            border: '1px solid #d8c6b3',
          },
        }}
        className={[
          'group pointer-events-auto flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-150',
          '[&_button]:transition-colors [&_button]:duration-150',
          'data-[type=success]:border-[#8b5f34] data-[type=success]:bg-[#f6ebe0] data-[type=success]:text-[#2f231b]',
          'data-[type=error]:border-[#b43d3d] data-[type=error]:bg-[#fdf2f2] data-[type=error]:text-[#3b1818]',
          'data-[type=warning]:border-[#c5862b] data-[type=warning]:bg-[#fff7e6] data-[type=warning]:text-[#3b2a14]',
          'data-[type=info]:border-[#7b6d5a] data-[type=info]:bg-[#f0ebe4] data-[type=info]:text-[#28211a]',
        ].join(' ')}
      />
    </>
  );
};

export default ToastProvider;