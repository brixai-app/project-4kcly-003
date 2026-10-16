import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CartItem,
  cartClearAndNotify,
  cartRemoveAndNotify,
  cartUpdateQtyAndNotify,
  calculateCartTotals,
  formatCurrency,
  getProductById,
} from '@/mock';
import { MotionButton } from './ui';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    // lazy load latest cart when opened to keep in sync
    const stored = JSON.parse(localStorage.getItem('nishant_waters_cart_v1') || '[]');
    setItems(stored);
  }, [open]);

  const handleQtyChange = (item: CartItem, delta: number) => {
    const nextQty = item.quantity + delta;
    const updated = cartUpdateQtyAndNotify(item.id, nextQty);
    setItems(updated);
    toast.success('Updated quantity');
  };

  const handleRemove = (itemId: string) => {
    const updated = cartRemoveAndNotify(itemId);
    setItems(updated);
    toast.success('Removed from cart');
  };

  const { subtotal } = calculateCartTotals(items);

  const handleCheckout = () => {
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }
    onOpenChange(false);
    navigate('/checkout');
  };

  const handleClear = () => {
    cartClearAndNotify();
    setItems([]);
    toast.success('Cart cleared');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#FAF9F6] shadow-2xl data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut">
          <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-4">
            <Dialog.Title className="text-base font-semibold text-slate-900 font-['Poppins']">
              Your cart
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close cart"
                className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E4D5B]/70"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {!items.length && (
              <p className="text-sm text-slate-500 font-['Merriweather']">
                Your cart is feeling a little parched. Start by customizing a bottle.
              </p>
            )}

            {items.map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              const label = item.customLabel;
              const priceEach = formatCurrency(
                // simple mock price uses helper indirectly through totals; we replicate:
                product.basePrice + 4 + (label.logoImage ? 2 : 0),
              );

              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-white"
                >
                  <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 font-['Poppins']">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 font-['Merriweather']">
                            "{label.text}" · {label.font}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          aria-label="Remove item"
                          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-['Merriweather']"
                          aria-label={`Label color ${label.backgroundColor}`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-slate-300"
                            style={{ backgroundColor: label.backgroundColor }}
                          />
                          Label tone
                        </span>
                        {label.logoImage && <span>Logo added</span>}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-['Merriweather'] text-slate-600">
                        <span className="font-semibold text-slate-900">{priceEach}</span>
                        <span className="text-slate-400">each</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs">
                          <button
                            onClick={() => handleQtyChange(item, -1)}
                            disabled={item.quantity <= 1}
                            className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="mx-2 min-w-[1.5rem] text-center font-['Merriweather']">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item, 1)}
                            disabled={item.quantity >= 10}
                            className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200/70 px-6 py-4">
            <div className="flex items-center justify-between text-sm font-['Merriweather']">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <MotionButton
                variant="ghost"
                className="flex-1 rounded-2xl border border-slate-200 bg-white/80 text-xs font-['Merriweather']"
                onClick={handleClear}
                disabled={!items.length}
              >
                Clear
              </MotionButton>
              <MotionButton
                className="flex-1 rounded-2xl text-xs font-['Merriweather']"
                onClick={handleCheckout}
                disabled={!items.length}
              >
                Checkout
              </MotionButton>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-['Merriweather']">
              This is a mock, client-only checkout. No real payment is processed.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};