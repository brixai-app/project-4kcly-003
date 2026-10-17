import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
} from "@/components/ui/shadcn";
import { Button, Input, Separator } from "@/components/ui/shadcn";
import type { CartItem, ID, Product } from "@/mock";
import { formatCurrency } from "@/mock";
import { toast } from "sonner";

// NOTE: This component is 100% frontend-only. All data comes from the mocked
// state layer in src/mock.ts and is persisted to localStorage there. No
// backend calls are made anywhere in this file.

export interface CartTotals {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

export interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  productsById: Record<ID, Product>;
  totals: CartTotals;
  onOpenChange: (open: boolean) => void;
  onUpdateQty: (itemId: ID, qty: number) => void;
  onRemove: (itemId: ID) => void;
}

const MotionDiv = motion.div;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  productsById,
  totals,
  onOpenChange,
  onUpdateQty,
  onRemove,
}) => {
  const handleQtyChange = (item: CartItem, nextQty: number) => {
    const safeQty = Number.isNaN(nextQty) ? item.quantity : Math.max(0, Math.min(999, nextQty));
    if (safeQty === item.quantity) return;

    onUpdateQty(item.id, safeQty);

    const product = productsById[item.productId];
    toast(
      safeQty === 0 ? "Item removed" : "Quantity updated",
      {
        description:
          (product?.name ?? "Bottle") +
          (safeQty === 0
            ? " was removed from your cart."
            : ` set to ${safeQty} in your cart.`),
      },
    );
  };

  const handleRemove = (item: CartItem) => {
    onRemove(item.id);
    const product = productsById[item.productId];
    toast("Removed from cart", {
      description: product?.name ?? "Bottle removed.",
    });
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* We use Sheet purely as a controlled focus-trapped drawer; trigger is handled elsewhere */}
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-md flex-col border-l border-[#d1b59a]/60 bg-[#faf3eb] px-0 py-0 text-[#2b211a] data-[state=open]:shadow-[0_0_60px_rgba(34,22,12,0.45)] dark:border-[#3b2619] dark:bg-[#120c08] dark:text-[#f6e9dd]"
      >
        <SheetHeader className="flex w-full flex-none flex-row items-center justify-between gap-3 border-b border-[#e1c9af] bg-[#f5e5d6] px-6 py-4 text-left dark:border-[#3b2619] dark:bg-[#1b120c]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#b56a3c]/10 text-[#b56a3c] dark:bg-[#b56a3c]/20">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5a3a22] dark:text-[#f0d1aa]">
                Cart
              </p>
              <p className="text-xs text-[#7a5a3b] dark:text-[#c8aa88]">
                {itemCount === 0
                  ? "Your table is still clear."
                  : `${itemCount} ${itemCount === 1 ? "bottle" : "bottles"} in your selection.`}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full border border-transparent text-[#7a5a3b] transition-colors hover:border-[#d1b59a] hover:bg-[#f9ede0] hover:text-[#3f2a23] focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5e5d6] dark:text-[#f0d1aa] dark:hover:border-[#f0d1aa]/40 dark:hover:bg-[#24150d] dark:hover:text-[#f6e9dd]"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <AnimatePresence initial={false}>
            {itemCount === 0 ? (
              <MotionDiv
                key="empty-cart"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#d1b59a]/70 bg-[#f7ebde] dark:border-[#70462a] dark:bg-[#1a100a]">
                  <ShoppingBag className="h-7 w-7 text-[#b56a3c] dark:text-[#f0d1aa]" aria-hidden="true" />
                </div>
                <h2 className="mb-2 font-serif text-xl tracking-[0.12em] text-[#3f2a23] dark:text-[#f6e9dd]">
                  Your tray is waiting
                </h2>
                <p className="mb-6 max-w-xs text-sm text-[#7a5a3b] dark:text-[#c8aa88]">
                  Add a bottle or two to see how your custom labels collect here before checkout.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-[#b56a3c] px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#fdf7f0] shadow-sm transition-colors hover:bg-[#a05d33] focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf3eb] dark:bg-[#c16a32] dark:hover:bg-[#a65429] dark:focus-visible:ring-offset-[#120c08]"
                >
                  <Link to="/shop" onClick={() => onOpenChange(false)}>
                    Browse collection
                  </Link>
                </Button>
              </MotionDiv>
            ) : (
              <MotionDiv
                key="cart-items"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 pb-6 [scrollbar-color:#d1b59a_transparent] [scrollbar-width:thin]">
                  {items.map((item) => {
                    const product = productsById[item.productId];
                    const variant = product?.variants.find((v) => v.id === item.variantId);
                    const lineLabel = variant
                      ? `${variant.sizeMl}ml • ${variant.capColor} • ${variant.labelFinish}`
                      : "Custom variant";

                    const designLabel = item.designSnapshot
                      ? item.designSnapshot.text.value || "Custom label"
                      : undefined;

                    return (
                      <MotionDiv
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="group rounded-2xl border border-[#e1c9af] bg-[#fdf6ee]/90 p-4 shadow-[0_10px_30px_rgba(69,44,26,0.08)] backdrop-blur-sm transition-colors hover:border-[#d1b59a] dark:border-[#3b2619] dark:bg-[#18100b]/95 dark:hover:border-[#f0d1aa]/40"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-[#f4e2cd] to-[#e3c3a1] shadow-sm dark:from-[#3b2619] dark:to-[#1b120c]">
                            <div className="relative h-12 w-6 overflow-hidden rounded-full bg-[#fefaf4] shadow-inner dark:bg-[#130c08]">
                              <div
                                className="absolute inset-x-[10%] bottom-[10%] h-[42%] rounded-[10px] shadow-sm"
                                style={{
                                  background:
                                    item.designSnapshot
                                      ? item.designSnapshot.textColorHex
                                      : product?.baseColor ?? "#b56a3c",
                                  opacity: 0.85,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium tracking-[0.12em] text-[#3f2a23] dark:text-[#f6e9dd]">
                                  {product?.name ?? "Bottle"}
                                </p>
                                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-[#7a5a3b] dark:text-[#c8aa88]">
                                  {lineLabel}
                                </p>
                                {designLabel && (
                                  <p className="mt-1 line-clamp-2 text-[11px] italic text-[#8b6745] dark:text-[#e3c3a1]">
                                    “{designLabel}”
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-transparent text-[#a0744f] opacity-80 transition-colors hover:border-[#e1c9af] hover:bg-[#f7ebde] hover:text-[#3f2a23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf6ee] dark:text-[#f0d1aa]/80 dark:hover:border-[#f0d1aa]/40 dark:hover:bg-[#24150d] dark:hover:text-[#f6e9dd] dark:focus-visible:ring-offset-[#18100b]"
                                aria-label="Remove item from cart"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-end justify-between gap-3">
                              <div className="inline-flex items-center rounded-full border border-[#e3c3a1] bg-[#f9efe3] px-1.5 py-1 text-[11px] text-[#7a5a3b] shadow-sm dark:border-[#4b2f1e] dark:bg-[#22130c] dark:text-[#e3c3a1]">
                                <span className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#b56a3c]/15 text-[10px] text-[#b56a3c] dark:bg-[#b56a3c]/25 dark:text-[#f0d1aa]">
                                  <ShoppingBag className="h-3 w-3" aria-hidden="true" />
                                </span>
                                {item.quantity} {item.quantity === 1 ? "unit" : "units"}
                              </div>

                              <p className="text-sm font-semibold tracking-[0.14em] text-[#3f2a23] dark:text-[#f6e9dd]">
                                {formatCurrency(item.linePriceCents)}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-4 border-t border-dashed border-[#e1c9af] pt-3 text-xs dark:border-[#3b2619]">
                              <div className="inline-flex items-center gap-1 rounded-full bg-[#f7ebde] px-1.5 py-1 text-[11px] text-[#7a5a3b] dark:bg-[#1b120c] dark:text-[#c8aa88]">
                                <span className="px-1 text-[10px] uppercase tracking-[0.18em]">Qty</span>
                                <div className="inline-flex items-center rounded-full border border-[#e1c9af] bg-white/90 shadow-sm dark:border-[#4b2f1e] dark:bg-[#120c08]">
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, item.quantity - 1)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-l-full text-[#7a5a3b] transition-colors hover:bg-[#f5e5d6] hover:text-[#3f2a23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-1 focus-visible:ring-offset-[#f7ebde] dark:text-[#e3c3a1] dark:hover:bg-[#24150d] dark:hover:text-[#f6e9dd] dark:focus-visible:ring-offset-[#1b120c]"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-3 w-3" aria-hidden="true" />
                                  </button>
                                  <Input
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={999}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      handleQtyChange(item, Number.isNaN(val) ? item.quantity : val);
                                    }}
                                    className="h-7 w-12 border-x border-[#e1c9af] bg-transparent px-1 text-center text-[11px] text-[#3f2a23] focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-[#4b2f1e] dark:text-[#f6e9dd]"
                                    aria-label="Quantity"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, item.quantity + 1)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-r-full text-[#7a5a3b] transition-colors hover:bg-[#f5e5d6] hover:text-[#3f2a23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-1 focus-visible:ring-offset-[#f7ebde] dark:text-[#e3c3a1] dark:hover:bg-[#24150d] dark:hover:text-[#f6e9dd] dark:focus-visible:ring-offset-[#1b120c]"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3 w-3" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-[#a0744f] opacity-80 transition-colors hover:bg-[#f7ebde] hover:text-[#3f2a23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf6ee] dark:text-[#f0d1aa]/80 dark:hover:bg-[#24150d] dark:hover:text-[#f6e9dd] dark:focus-visible:ring-offset-[#18100b]"
                              >
                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                                <span className="uppercase tracking-[0.16em]">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </MotionDiv>
                    );
                  })}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        <SheetFooter className="flex w-full flex-col gap-3 border-t border-[#e1c9af] bg-gradient-to-t from-[#f0dfcf] to-[#f7ebde] px-6 pb-5 pt-3 text-xs dark:border-[#3b2619] dark:from-[#1b120c] dark:to-[#24150d]">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#7a5a3b] dark:text-[#c8aa88]">
              <span className="uppercase tracking-[0.18em]">Subtotal</span>
              <span className="font-medium text-[#3f2a23] dark:text-[#f6e9dd]">
                {formatCurrency(totals.subtotalCents)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#7a5a3b] dark:text-[#c8aa88]">
              <span className="uppercase tracking-[0.18em]">Shipping</span>
              <span className="text-[#3f2a23] dark:text-[#f3decb]">
                {totals.shippingCents === 0 ? "Calculated at checkout" : formatCurrency(totals.shippingCents)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#7a5a3b] dark:text-[#c8aa88]">
              <span className="uppercase tracking-[0.18em]">Estimated tax</span>
              <span className="text-[#3f2a23] dark:text-[#f3decb]">
                {formatCurrency(totals.taxCents)}
              </span>
            </div>
            <Separator className="my-1 bg-[#e1c9af] dark:bg-[#3b2619]" />
            <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-[#3f2a23] dark:text-[#f6e9dd]">
              <span className="uppercase">Estimated total</span>
              <span className="text-sm">{formatCurrency(totals.totalCents)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              asChild
              disabled={itemCount === 0}
              className="h-10 w-full rounded-full bg-[#b56a3c] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#fdf7f0] shadow-[0_16px_40px_rgba(69,44,26,0.38)] transition-colors hover:bg-[#a05d33] focus-visible:ring-2 focus-visible:ring-[#b56a3c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0dfcf] disabled:cursor-not-allowed disabled:bg-[#d1b59a] disabled:text-[#fdf7f0]/70 dark:bg-[#c16a32] dark:hover:bg-[#a65429] dark:focus-visible:ring-offset-[#1b120c] dark:disabled:bg-[#5a3a22] dark:disabled:text-[#f0d1aa]/70"
            >
              <Link to="/checkout" onClick={() => onOpenChange(false)} aria-disabled={itemCount === 0}>
                Proceed to checkout
              </Link>
            </Button>
            <p className="text-[10px] leading-relaxed text-[#8b6745] dark:text-[#d7bb9a]">
              This checkout is a fully client-side mock. Your selections, label designs, and orders live only in
              your browser via localStorage—no data leaves your device.
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;