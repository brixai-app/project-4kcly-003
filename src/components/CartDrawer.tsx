import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface CartDrawerProps {
  className?: string;
}

export function CartDrawer({ className = '' }: CartDrawerProps) {
  const {
    state,
    isDrawerOpen,
    closeDrawer,
    subtotal,
    shipping,
    tax,
    grandTotal,
    itemCount,
    progressPercent,
    removeItem,
    updateQuantity,
    getCartItemProduct,
    setStatus,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!itemCount) {
      toast.info('Your cart is empty. Add a bottle to continue.');
      return;
    }
    setStatus('checking_out');
    toast.success('Cart locked in. Guiding you to the atelier checkout.', {
      description: 'A dedicated concierge flow will live at /checkout.',
    });
    navigate('/checkout');
    closeDrawer();
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      toast('Removed from cart', { description: 'The line item was cleared.' });
      return;
    }
    updateQuantity(id, quantity);
  };

  const progressLabel =
    progressPercent >= 100
      ? 'Complimentary shipping unlocked'
      : `Shipping progress: ${progressPercent.toFixed(0)}%`;

  return (
    <Dialog.Root open={isDrawerOpen} onOpenChange={(open) => (!open ? closeDrawer() : undefined)}>
      <Dialog.Portal>
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.aside
                  className={cn(
                    'fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#F9F6F2] shadow-xl border-l border-[#E7E1D8] flex flex-col',
                    className
                  )}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.32 }}
                >
                  <header className="px-6 pt-6 pb-4 border-b border-[#E7E1D8] flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#5F5A55]">
                        Cart
                      </p>
                      <Dialog.Title className="font-[Playfair_Display] text-2xl tracking-tight text-[#1F1F1F]">
                        Nishant Waters
                      </Dialog.Title>
                      <p className="text-xs text-[#5F5A55] mt-1">
                        {itemCount ? `${itemCount} item${itemCount > 1 ? 's' : ''} curated` : 'Your curation is waiting.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E1D8] bg-white text-[#1F1F1F] hover:bg-[#F3ECE2] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </header>

                  <div className="px-6 pt-4 pb-5 border-b border-[#E7E1D8]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#5F5A55]">
                        Shipping Threshold
                      </span>
                      <span className="text-xs text-[#1F1F1F]">{progressLabel}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E7E1D8] overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full bg-[#0B3D91] transition-all',
                          progressPercent >= 100 && 'bg-[#1F1F1F]'
                        )}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-[#5F5A55]">
                      Orders above ₹5,000 travel with complimentary curated shipping.
                    </p>
                  </div>

                  <section className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {state.items.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                        <div className="h-16 w-16 rounded-full border border-dashed border-[#E7E1D8] flex items-center justify-center">
                          <ShoppingBag className="h-7 w-7 text-[#5F5A55]" />
                        </div>
                        <p className="font-[Playfair_Display] text-lg text-[#1F1F1F]">
                          The cart is a blank canvas.
                        </p>
                        <p className="text-sm text-[#5F5A55] max-w-xs">
                          Begin with a single bottle—still, sparkling, or infused—and we will shape the rest.
                        </p>
                      </div>
                    )}

                    {state.items.map((item) => {
                      const product = getCartItemProduct(item);
                      if (!product) return null;
                      const image = product.images?.[0];
                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 border border-[#E7E1D8] rounded-2xl bg-white p-3"
                        >
                          <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-[#F3ECE2]">
                            {image?.url && (
                              <img
                                src={image.url}
                                alt={image.alt ?? product.name}
                                crossOrigin="anonymous"
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[#1F1F1F]">
                                {product.name}
                              </p>
                              <p className="text-xs text-[#5F5A55] mt-0.5">
                                {product.category} · {item.quantity} x
                              </p>
                              {item.customLabel?.name && (
                                <p className="text-[11px] text-[#5F5A55] mt-1">
                                  Label: {item.customLabel.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="inline-flex items-center rounded-full border border-[#E7E1D8] bg-[#F9F6F2]">
                                <button
                                  type="button"
                                  className="h-7 w-7 flex items-center justify-center text-xs text-[#1F1F1F]"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs text-[#1F1F1F]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="h-7 w-7 flex items-center justify-center text-xs text-[#1F1F1F]"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-[#1F1F1F]">
                                  ₹{item.lineTotal.toLocaleString('en-IN')}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, 0)}
                                  className="h-7 w-7 flex items-center justify-center rounded-full border border-[#E7E1D8] text-[#5F5A55] hover:bg-[#F3ECE2] transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </section>

                  <footer className="border-t border-[#E7E1D8] px-6 py-4 space-y-3 bg-[#F9F6F2]">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#5F5A55]">Merchandise</span>
                        <span className="text-[#1F1F1F]">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F5A55]">Shipping</span>
                        <span className="text-[#1F1F1F]">
                          {shipping === 0 ? 'Complimentary' : `₹${shipping.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F5A55]">Tax</span>
                        <span className="text-[#1F1F1F]">
                          ₹{tax.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-dashed border-[#E7E1D8] mt-1">
                        <span className="text-xs uppercase tracking-[0.2em] text-[#5F5A55]">
                          Estimated Total
                        </span>
                        <span className="font-semibold text-[#1F1F1F]">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className={cn(
                        'w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3D91] text-white text-sm font-semibold tracking-[0.16em] uppercase py-3',
                        'hover:bg-[#072E6D] transition-colors'
                      )}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="text-[11px] text-[#5F5A55] text-center">
                      No payment is processed in this demo. The flow at /checkout is a placeholder for your atelier.
                    </p>
                  </footer>
                </motion.aside>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;