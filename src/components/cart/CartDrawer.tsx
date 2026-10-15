import React, { useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
  } = useUIStore();
  const { items, clearCart } = useCartStore();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const hasItems = items.length > 0;

  useEffect(() => {
    if (isCartOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleClearCart = () => {
    if (!hasItems) return;
    clearCart();
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <AnimatePresence>
        {isCartOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FAF9F6] shadow-2xl border-l border-[#E0D9CC] flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                aria-label="Shopping cart"
              >
                <header className="flex items-center justify-between px-6 py-4 border-b border-[#E0D9CC] bg-white/70 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#004D40]" aria-hidden="true" />
                    <Dialog.Title className="font-playfair text-lg tracking-wide text-[#2B2B2B]">
                      Your Cart
                    </Dialog.Title>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasItems && (
                      <button
                        type="button"
                        onClick={handleClearCart}
                        className="inline-flex items-center gap-1 text-xs tracking-wide text-[#A89F91] hover:text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6] rounded-full px-2 py-1 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        Clear
                      </button>
                    )}
                    <Dialog.Close asChild>
                      <button
                        ref={closeButtonRef}
                        type="button"
                        className="rounded-full p-1.5 text-[#A89F91] hover:text-[#2B2B2B] hover:bg-[#F3EFE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6] transition-colors"
                        aria-label="Close cart"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                </header>

                <section
                  className={cn(
                    "flex-1 overflow-y-auto px-6 py-4 space-y-4", 
                    !hasItems && "flex flex-col items-center justify-center text-center"
                  )}
                >
                  {hasItems ? (
                    items.map((item) => (
                      <CartItemRow key={`${item.productId}-${item.selectedSize}-${item.selectedBottleColor}-${item.labelDesign.text}`} item={item} />
                    ))
                  ) : (
                    <div className="max-w-xs mx-auto">
                      <p className="font-playfair text-lg text-[#2B2B2B] mb-2">
                        Your cart feels a little thirsty.
                      </p>
                      <p className="text-sm text-[#5C5548] mb-4">
                        Explore our bespoke bottles and design a label that speaks your language.
                      </p>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          closeCart();
                          navigate("/shop");
                        }}
                      >
                        Browse the collection
                      </Button>
                    </div>
                  )}
                </section>

                <footer className="border-t border-[#E0D9CC] bg-white/80 backdrop-blur px-6 py-4">
                  <CartSummary>
                    <div className="mt-4 flex flex-col gap-3">
                      <Button
                        variant="primary"
                        className="w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCheckout}
                        disabled={!hasItems}
                      >
                        Proceed to checkout
                      </Button>
                      <button
                        type="button"
                        onClick={closeCart}
                        className="w-full text-sm tracking-wide text-[#2B2B2B] underline underline-offset-4 decoration-[#A89F91] hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6] rounded-md py-1"
                      >
                        Continue shopping
                      </button>
                    </div>
                  </CartSummary>
                </footer>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default CartDrawer;