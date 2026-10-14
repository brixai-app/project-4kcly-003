import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface CartDrawerProps {
  triggerClassName?: string;
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(0)}`;
  }
}

export function CartDrawer({ triggerClassName = '' }: CartDrawerProps) {
  const {
    items,
    totals,
    isCartOpen,
    openCart,
    closeCart,
    updateQty,
    removeItem,
  } = useCart();
  const navigate = useNavigate();

  const itemCount = items?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0;
  const currency = totals?.currency ?? 'INR';
  const subtotal = totals?.subtotal ?? 0;
  const shippingThreshold = 5000;
  const progress = Math.min(1, subtotal / shippingThreshold);
  const remaining = Math.max(0, shippingThreshold - subtotal);

  const handleCheckout = () => {
    if (!items?.length) {
      toast.error('Your cart is empty');
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  const handleIncrease = (id: string, current: number) => {
    updateQty(id, current + 1);
  };

  const handleDecrease = (id: string, current: number) => {
    if (current <= 1) {
      removeItem(id);
      toast.success('Item removed from cart');
    } else {
      updateQty(id, current - 1);
    }
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          onClick={openCart}
          className={cn(
            'relative inline-flex items-center gap-2 rounded-md border border-[#DED5C8] bg-white px-3 py-2 text-sm font-medium text-[#141310] hover:bg-[#F7F1E8]/80 transition-colors',
            triggerClassName
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="uppercase tracking-[0.18em] text-xs">Cart</span>
          {itemCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#0E4A3A] px-1 text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
        <AnimatePresence>
          {isCartOpen && (
            <Dialog.Content asChild forceMount>
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.32 }}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#F7F1E8] shadow-2xl"
              >
                <header className="flex items-center justify-between border-b border-[#DED5C8] px-6 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#5D584F]">
                      Nishant Waters
                    </p>
                    <h2 className="font-serif text-xl text-[#141310]">Cart Atelier</h2>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DED5C8] bg-white text-[#5D584F] hover:bg-[#E6DDD0] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </header>

                <div className="border-b border-[#DED5C8] px-6 py-3">
                  <div className="flex items-center justify-between text-xs text-[#5D584F]">
                    <span className="uppercase tracking-[0.18em]">Subtotal</span>
                    <span className="font-semibold text-[#141310]">
                      {formatCurrency(subtotal, currency)}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#DED5C8]/60">
                    <div
                      className="h-full rounded-full bg-[#0E4A3A]"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#5D584F]">
                    {progress >= 1
                      ? 'Complimentary shipping unlocked for this order.'
                      : `Add ${formatCurrency(remaining, currency)} to unlock complimentary shipping.`}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {items?.length ? (
                    items.map((item) => (
                      <div
                        key={item?.id}
                        className="flex gap-3 rounded-2xl border border-[#DED5C8] bg-white p-3"
                      >
                        <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-[#F7F1E8]">
                          <div className="absolute inset-1 rounded-lg border border-[#DED5C8]/60" />
                          <div className="absolute inset-y-2 left-5 w-3 rounded-full bg-gradient-to-b from-[#D4E4DD] via-white to-[#C5D7CF]" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-serif text-sm text-[#141310] leading-snug">
                                {item?.personalizationSummary ?? 'Custom-labeled bottle'}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#5D584F] mt-0.5">
                                Qty · {item?.quantity ?? 0}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                removeItem(item?.id ?? '');
                                toast.success('Item removed from cart');
                              }}
                              className="text-[#5D584F]/60 hover:text-[#141310]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-[#141310]">
                            {formatCurrency(
                              (item?.unitPrice?.amount ?? 0) * (item?.quantity ?? 0),
                              item?.unitPrice?.currency ?? currency
                            )}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <div className="inline-flex items-center rounded-full border border-[#DED5C8] bg-[#F7F1E8] px-1">
                              <button
                                type="button"
                                onClick={() => handleDecrease(item?.id ?? '', item?.quantity ?? 0)}
                                className="inline-flex h-6 w-6 items-center justify-center text-xs text-[#141310]"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-[2rem] text-center text-xs font-medium text-[#141310]">
                                {item?.quantity ?? 0}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleIncrease(item?.id ?? '', item?.quantity ?? 0)}
                                className="inline-flex h-6 w-6 items-center justify-center text-xs text-[#141310]"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            {item?.labelDesignId && (
                              <span className="rounded-full border border-[#DED5C8] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#5D584F]">
                                Custom Label
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[#DED5C8]">
                        <ShoppingBag className="h-5 w-5 text-[#5D584F]" />
                      </div>
                      <p className="font-serif text-lg text-[#141310]">The cart is quietly empty.</p>
                      <p className="mt-1 text-sm text-[#5D584F] max-w-xs">
                        Begin with a single bottle and build your own water story.
                      </p>
                    </div>
                  )}
                </div>

                <footer className="border-t border-[#DED5C8] bg-[#F7F1E8] px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5D584F]">Subtotal</span>
                    <span className="font-semibold text-[#141310]">
                      {formatCurrency(subtotal, currency)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex w-full items-center justify-between rounded-xl bg-[#0E4A3A] px-4 py-3 text-sm font-medium text-white hover:bg-[#0B3E31] transition-colors"
                  >
                    <span className="uppercase tracking-[0.2em] text-[11px]">
                      Proceed to checkout
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-[11px] text-[#5D584F]">
                    Duties & taxes calculated at checkout. Complimentary water atelier support for
                    every order.
                  </p>
                </footer>
              </motion.aside>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;