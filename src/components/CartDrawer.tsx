import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/shadcn";
import { Button } from "@/components/ui/shadcn/button";
import {
  Separator,
  Skeleton,
} from "@/components/ui/shadcn";

import {
  useCartSummary,
  updateCartItemQuantity,
  removeCartItem,
  BRANDY_PALETTE,
  getLabelColorById,
  formatMoney,
} from "@/mock";
import { showToastInfo, showToastSuccess } from "./ToastProvider";

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// NOTE: This component is fully frontend-only and relies on the
// mock state layer in src/mock.ts (no real backend or payments).

const itemVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 },
};

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const summary = useCartSummary();

  const hasItems = summary.items.length > 0;

  const handleQtyChange = (id: string, nextQty: number) => {
    updateCartItemQuantity(id, nextQty);
    showToastInfo("Cart updated", "Your selection has been gently adjusted.");
  };

  const handleRemove = (id: string) => {
    removeCartItem(id);
    showToastSuccess("Removed from cart", "That bottle has stepped off the tray.");
  };

  const handleCheckoutClick = () => {
    if (!hasItems) return;
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-md flex-col border-l border-[rgba(148,94,54,0.3)] bg-[radial-gradient(circle_at_top,_#f7f1e8,_#f3e6d6)] px-0 py-0 text-stone-900 data-[state=open]:shadow-[0_0_40px_rgba(42,25,16,0.35)]"
      >
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-['Playfair_Display'] text-xl tracking-wide text-[color:#{BRANDY_PALETTE.cocoa}]">
            Tray
          </SheetTitle>
          <SheetDescription className="text-sm text-stone-700">
            A quick view of the bottles you are assembling for this moment.
          </SheetDescription>
        </SheetHeader>

        <Separator className="mt-4 border-stone-200/70" />

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <AnimatePresence initial={false}>
            {hasItems ? (
              summary.items.map((item) => {
                const label = item.labelColor ?? getLabelColorById(item.labelColorId);
                const lineTotal = item.unitPrice * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="mb-4 rounded-xl border border-stone-200/80 bg-white/80 shadow-sm backdrop-blur-[1px] last:mb-0"
                  >
                    <div className="flex gap-3 p-3 sm:p-4">
                      {/* Image placeholder */}
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-b from-stone-100 to-stone-200">
                        <div className="pointer-events-none absolute inset-x-2 top-2 h-1/3 rounded-full bg-gradient-to-r from-[rgba(242,194,155,0.9)] to-[rgba(178,111,55,0.95)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-[90%] w-[55%] rounded-full border border-stone-300/80 bg-gradient-to-b from-white to-stone-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-stone-900">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-xs text-stone-600">
                              {item.product.capacityMl} ml · min {item.product.minOrderQty} pcs
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-stone-600">
                              <span
                                className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5"
                                aria-label={label ? `Label color ${label.name}` : "Label color"}
                              >
                                <span
                                  className="h-3 w-3 rounded-full border border-stone-300"
                                  style={{
                                    backgroundColor: label?.hex ?? BRANDY_PALETTE.amberLight,
                                  }}
                                />
                                <span>{label?.name ?? "Custom tone"}</span>
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-stone-400 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-700"
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-2 py-1 text-xs">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition-colors hover:bg-stone-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[2ch] text-center text-xs font-medium text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:#{BRANDY_PALETTE.amber}] text-white shadow-sm transition-colors hover:bg-[color:#{BRANDY_PALETTE.amberDeep}]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right text-xs sm:text-sm">
                            <p className="font-medium text-stone-900">
                              {formatMoney(lineTotal)}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {formatMoney(item.unitPrice)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center gap-4 text-center text-stone-600"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-500 shadow-inner">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    Your tray is quietly empty.
                  </p>
                  <p className="mt-1 text-xs text-stone-600">
                    Begin by choosing a bottle from the collection — we will hold everything here while you curate.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 border-stone-300 bg-white text-stone-900 hover:bg-stone-100"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/catalog");
                  }}
                >
                  Browse the collection
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary / Footer */}
        <div className="border-t border-stone-200/80 bg-gradient-to-t from-[rgba(228,204,179,0.85)] via-[rgba(247,241,232,0.95)] to-[rgba(247,241,232,1)] px-4 pb-4 pt-3 sm:px-6">
          <div className="flex items-center justify-between text-xs text-stone-700">
            <span>Subtotal</span>
            {hasItems ? (
              <span className="font-semibold text-stone-900">
                {formatMoney(summary.subtotal)}
              </span>
            ) : (
              <Skeleton className="h-4 w-16 rounded-full bg-stone-200" />
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-600">
            <span>Estimated shipping</span>
            <span>
              {summary.subtotal === 0
                ? "—"
                : summary.subtotal >= 250
                ? "Complimentary"
                : formatMoney(summary.shipping)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-stone-900">
            <span>Estimated total</span>
            <span>{hasItems ? formatMoney(summary.total) : "—"}</span>
          </div>

          <Button
            size="lg"
            disabled={!hasItems}
            onClick={handleCheckoutClick}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[color:#{BRANDY_PALETTE.amberDeep}] px-4 py-2 text-sm font-medium text-cream-50 shadow-[0_10px_25px_rgba(91,52,32,0.35)] transition-colors hover:bg-[color:#{BRANDY_PALETTE.sienna}] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-100"
          >
            <ShoppingBag className="h-4 w-4" />
            {hasItems ? "Proceed to checkout" : "Tray is empty"}
          </Button>

          <p className="mt-2 text-[11px] leading-relaxed text-stone-600">
            No payment is taken here — checkout is a gentle simulation powered entirely in your browser as part of the Nishant Waters mock experience.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;