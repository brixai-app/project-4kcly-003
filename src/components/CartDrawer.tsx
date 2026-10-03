import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import type { CartItem, LabelColorToken } from '@/types';

const labelColorMap: Record<LabelColorToken, string> = {
  sand: 'bg-amber-200 text-black',
  slate: 'bg-slate-300 text-black',
  forest: 'bg-emerald-700 text-emerald-50',
  mint: 'bg-emerald-300 text-black',
  ink: 'bg-zinc-900 text-emerald-50',
  amber: 'bg-amber-400 text-black',
};

function formatPrice(cents: number | undefined): string {
  const value = (cents ?? 0) / 100;
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
}

function CartItemRow({ item }: { item?: CartItem }) {
  const { updateItem, removeItem } = useCart();
  const safeItem = item ?? {
    id: 'placeholder',
    productId: '',
    productName: 'Product',
    productImageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    unitPriceCents: 0,
    quantity: 1,
    label: { text: 'Custom Label', colorToken: 'mint' },
  };

  const handleQuantityChange = (delta: number) => {
    const nextQty = (safeItem.quantity ?? 1) + delta;
    if (nextQty < 1) return;
    updateItem(safeItem.id, { quantity: nextQty });
  };

  const labelClasses = labelColorMap[safeItem.label?.colorToken ?? 'mint'] ?? labelColorMap.mint;

  return (
    <motion.div
      layout
      className="flex gap-4 rounded-2xl bg-[#14241e] p-3 border border-[#244337]"
    >
      <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-black/40">
        <img
          src={safeItem.productImageUrl ?? ''}
          crossOrigin="anonymous"
          alt={safeItem.productName ?? ''}
          className="h-full w-full object-cover"
        />
        <div className={cn('absolute bottom-1 left-1 right-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm', labelClasses)}>
          <span className="line-clamp-1">{safeItem.label?.text ?? ''}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[600] text-sm tracking-tight text-[#ecfdf5]">
              {safeItem.productName ?? ''}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#a7d7c4]">
              {safeItem.label?.colorToken ?? 'mint'} label · {(safeItem.quantity ?? 1) > 1 ? 'Multi-pack' : 'Single'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(safeItem.id)}
            className="rounded-md p-1 text-xs text-[#a7d7c4] hover:bg-[#244337] hover:text-[#ecfdf5] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-md border border-[#244337] bg-black/20 px-1.5 py-1">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="rounded-sm p-1 text-[#a7d7c4] hover:bg-[#244337] hover:text-[#ecfdf5] transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="mx-2 min-w-[1.5rem] text-center text-xs font-medium text-[#ecfdf5]">
              {safeItem.quantity ?? 1}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="rounded-sm p-1 text-[#a7d7c4] hover:bg-[#244337] hover:text-[#ecfdf5] transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="text-right text-sm font-semibold text-[#ecfdf5]">
            {formatPrice((safeItem.unitPriceCents ?? 0) * (safeItem.quantity ?? 1))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CartDrawer() {
  const { items, totals, freeShippingThresholdCents, isOpen, closeCart } = useCart();
  const navigate = useNavigate();

  const remainingForFree = Math.max((freeShippingThresholdCents ?? 0) - (totals?.subtotalCents ?? 0), 0);
  const progress =
    (totals?.subtotalCents ?? 0) >= (freeShippingThresholdCents ?? 0)
      ? 100
      : (((totals?.subtotalCents ?? 0) / (freeShippingThresholdCents || 1)) * 100);

  const handleCheckout = () => {
    navigate('/checkout');
    closeCart();
  };

  return (
    <Dialog.Root open={isOpen ?? false} onOpenChange={(open) => (!open ? closeCart() : undefined)}>
      <AnimatePresence>
        {isOpen ? (
          <>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#0b1411] shadow-xl border-l border-[#244337]"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              >
                <div className="flex items-center justify-between border-b border-[#244337] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#14241e]">
                      <ShoppingBag className="h-4 w-4 text-[#10b981]" />
                    </div>
                    <div>
                      <Dialog.Title className="font-display text-lg tracking-tight text-[#ecfdf5]">
                        Your Bottles
                      </Dialog.Title>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#a7d7c4]">
                        {totals?.itemCount ?? 0} item{(totals?.itemCount ?? 0) === 1 ? '' : 's'} curated
                      </p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      onClick={() => closeCart()}
                      className="rounded-md p-1.5 text-[#a7d7c4] hover:bg-[#14241e] hover:text-[#ecfdf5] transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="border-b border-[#244337] px-5 py-3">
                  <div className="flex items-center gap-2 text-xs text-[#a7d7c4]">
                    {remainingForFree <= 0 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-[#10b981]" />
                        <span className="uppercase tracking-[0.22em] text-[11px]">
                          You unlocked complimentary shipping
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-[#10b981]" />
                        <span className="uppercase tracking-[0.22em] text-[11px]">
                          {`Add ${formatPrice(remainingForFree)} for free shipping`}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#14241e]">
                    <div
                      className="h-full rounded-full bg-[#10b981]"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {items?.length ? (
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItemRow key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-[#a7d7c4]">
                      <ShoppingBag className="mb-3 h-8 w-8 text-[#244337]" />
                      <p className="font-display text-base text-[#ecfdf5]">
                        Your cart is quietly pristine.
                      </p>
                      <p className="mt-1 text-xs">
                        Explore Nishant Waters to compose your first custom-labeled set.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#244337] bg-[#0b1411] px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-[#a7d7c4]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#ecfdf5]">
                      {formatPrice(totals?.subtotalCents)}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={!items?.length}
                    onClick={() => handleCheckout()}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
                      items?.length
                        ? 'bg-[#10b981] text-black hover:bg-[#0ea371]'
                        : 'bg-[#14241e] text-[#244337] cursor-not-allowed'
                    )}
                  >
                    Proceed to checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-[11px] text-[#6ba58d]">
                    Duties included. Bottles ship in plastic-free, fully recyclable packaging.
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default CartDrawer;