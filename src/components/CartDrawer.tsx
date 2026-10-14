import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FREE_SHIPPING_THRESHOLD = 1200;

function getLabelPreview(label?: CartItem['customLabel']) {
  if (!label) return 'Standard label';
  const fontClass =
    label.font === 'serif'
      ? 'font-serif'
      : label.font === 'script'
      ? 'font-[cursive]'
      : 'font-sans';
  return { text: label.text || 'Custom label', color: label.color || '#0b1f2a', fontClass };
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function CartDrawer({ open = false, onOpenChange }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    onOpenChange?.(false);
    navigate('/checkout');
  };

  const handleQtyChange = (item: CartItem, delta: number) => {
    const next = item.quantity + delta;
    if (next < 1 || next > 10) return;
    updateQuantity(item.id, next);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#fff7ee] shadow-2xl border-l border-[#e6d8c8] flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                  <header className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#e6d8c8]">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#004e89]" />
                      <Dialog.Title className="font-[Sora] text-lg tracking-tight text-[#0b1f2a]">
                        Your bottles
                      </Dialog.Title>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#f4e9dc] text-[#4b5a63]">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-[#f4e9dc] text-[#4b5a63] transition"
                        aria-label="Close cart"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </header>

                  <section className="px-6 py-3 border-b border-[#e6d8c8] bg-[#f4e9dc]/60">
                    <div className="flex items-center justify-between text-xs font-[Sora] text-[#4b5a63] mb-2">
                      <span className="uppercase tracking-[0.18em]">
                        Shipping
                      </span>
                      <span className="font-medium">
                        {remaining === 0
                          ? 'You unlocked complimentary shipping'
                          : `${formatCurrency(remaining)} away from free shipping`}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#e6d8c8] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#004e89]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </section>

                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.length === 0 && (
                      <div className="h-full flex flex-col justify-center items-center text-center text-[#4b5a63]">
                        <p className="font-[Sora] text-sm uppercase tracking-[0.18em]">
                          Cart is quietly empty
                        </p>
                        <p className="mt-2 text-xs font-[Lora] max-w-xs">
                          Add a custom-labeled bottle to see your design take shape here.
                        </p>
                      </div>
                    )}
                    <AnimatePresence initial={false}>
                      {items.map(item => {
                        const label = getLabelPreview(item.customLabel);
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="flex gap-3 rounded-2xl border border-[#e6d8c8] bg-white/80 p-3"
                          >
                            <div className="relative w-20 aspect-[3/4] overflow-hidden rounded-xl bg-[#f4e9dc]">
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                crossOrigin="anonymous"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-x-1 bottom-1 h-7 rounded-md bg-white/80 flex items-center justify-center">
                                <span
                                  className={cn(
                                    'text-[10px] truncate mx-1',
                                    label.fontClass
                                  )}
                                  style={{ color: label.color }}
                                >
                                  {label.text}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                              <div className="flex justify-between gap-2">
                                <div>
                                  <h3 className="font-[Sora] text-sm text-[#0b1f2a]">
                                    {item.productName}
                                  </h3>
                                  <p className="text-[11px] text-[#4b5a63] mt-0.5">
                                    {item.customLabel?.text
                                      ? 'Custom label'
                                      : 'Classic Nishant Waters'}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(item.id)}
                                  className="p-1 text-[#4b5a63] hover:text-[#0b1f2a]"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="mt-auto flex items-end justify-between pt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, -1)}
                                    className="h-7 w-7 flex items-center justify-center rounded-md border border-[#e6d8c8] text-xs hover:bg-[#f4e9dc]"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-[Sora] text-[#0b1f2a] w-5 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, 1)}
                                    className="h-7 w-7 flex items-center justify-center rounded-md border border-[#e6d8c8] text-xs hover:bg-[#f4e9dc]"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-[Sora] text-[#0b1f2a]">
                                    {formatCurrency(item.unitPrice * item.quantity)}
                                  </p>
                                  <p className="text-[11px] text-[#4b5a63]">
                                    {formatCurrency(item.unitPrice)} ea
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <footer className="border-t border-[#e6d8c8] px-6 py-4 bg-[#fff7ee]">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-[Sora] text-[#4b5a63]">Subtotal</span>
                      <span className="font-[Sora] text-[#0b1f2a]">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4b5a63] mb-3">
                      Taxes and shipping calculated at checkout.
                    </p>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={items.length === 0}
                      className={cn(
                        'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-[Sora] tracking-[0.22em] uppercase transition',
                        items.length === 0
                          ? 'bg-[#e6d8c8] text-[#9da7ae] cursor-not-allowed'
                          : 'bg-[#004e89] text-white hover:bg-[#003b67]'
                      )}
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </footer>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;