import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItem, computeCartSubtotal, findProductById } from "@/mock";
import { toast } from "sonner";

export type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = computeCartSubtotal(items);

  const handleRemove = (id: string) => {
    onRemoveItem(id);
    toast.success("Item removed from cart", {
      description: "You can continue refining your label before checking out.",
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#E4D0B8] bg-[#FFF5E1] shadow-xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              >
                <header className="flex items-center justify-between border-b border-[#E4D0B8] px-5 py-4">
                  <Dialog.Title className="text-sm font-semibold tracking-[0.18em] text-[#333333] uppercase">
                    Cart
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-[#F4E1C0] text-[#4b3b32] shadow-sm transition-colors duration-150 hover:bg-[#E6D1B2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
                      aria-label="Close cart"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </header>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {items.length === 0 ? (
                    <p className="mt-4 text-sm text-[#6A5649]">
                      Your cart is quiet. Start by layering a label that feels like your evening.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {items.map((item) => {
                        const product = findProductById(item.productId);
                        // support both imageUrl and images[0]
                        const img = (product as any)?.images?.[0] ?? product?.imageUrl;
                        return (
                          <li
                            key={item.id}
                            className="flex gap-3 rounded-lg border border-[#E4D0B8] bg-white p-3"
                          >
                            {img && (
                              <div className="h-20 w-16 overflow-hidden rounded-md bg-[#F7E7CF]">
                                <img
                                  src={img}
                                  alt={product?.name ?? "Bottle"}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex flex-1 flex-col text-xs">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-[13px] font-medium text-[#333333]">
                                    {product?.name ?? "Custom Bottle"}
                                  </p>
                                  <p className="mt-0.5 text-[11px] text-[#7A6558]">
                                    {item.selectedSize} 
                                    {item.selectedSize && item.selectedBottleColor && " • "}
                                    {item.selectedBottleColor}
                                  </p>
                                  {item.customLabel && (
                                    <p className="mt-0.5 text-[11px] text-[#7A6558]">
                                      Label: {item.customLabel.customText ?? "Custom"}
                                    </p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(item.id)}
                                  className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border border-transparent bg-[#F4E1C0] text-[#4b3b32] shadow-sm transition-colors duration-150 hover:bg-[#E6D1B2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <div className="inline-flex items-center rounded-full border border-[#E4D0B8] bg-[#FFF8ED] px-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                                    }
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#4b3b32] transition-colors duration-150 hover:bg-[#E6D1B2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFF5E1]"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-2 text-[11px] tracking-wide text-[#4b3b32]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#4b3b32] transition-colors duration-150 hover:bg-[#E6D1B2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFF5E1]"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <p className="text-[13px] font-medium text-[#333333]">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="border-t border-[#E4D0B8] bg-[#FFF1DC] px-5 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6A5649]">Subtotal</span>
                    <span className="text-base font-semibold text-[#333333]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#8A6C5A]">
                    Taxes are estimated at checkout. All orders are mocked locally — no real
                    payments are processed.
                  </p>
                  <Dialog.Close asChild>
                    <Link
                      to="/checkout"
                      className={`mt-3 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1] ${
                        items.length === 0
                          ? "cursor-not-allowed bg-[#E1CBB1] text-[#9A7E67]"
                          : "bg-[#A0522D] text-[#FFF5E1] hover:bg-[#8D4322]"
                      }`}
                      aria-disabled={items.length === 0}
                      onClick={(e) => {
                        if (items.length === 0) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Proceed to checkout
                    </Link>
                  </Dialog.Close>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default CartDrawer;