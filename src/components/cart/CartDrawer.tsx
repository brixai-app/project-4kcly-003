import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/state/cartStore";
import CartItemRow from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { Container } from "../layout/Container";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { items } = useCartStore();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-[rgba(12,8,4,0.32)] backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                role="dialog"
                aria-label="Shopping cart"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#FFF8F0] shadow-[0_0_40px_rgba(40,30,20,0.35)]"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              >
                <header className="flex items-center justify-between border-b border-[rgba(160,82,45,0.16)] bg-[rgba(244,225,210,0.9)] px-4 py-3 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A0522D] text-[#FFF8F0] shadow-sm">
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <Dialog.Title className="text-sm font-semibold tracking-wide text-[rgba(40,30,20,0.95)]">
                        Your cart
                      </Dialog.Title>
                      <Dialog.Description className="text-xs text-[rgba(40,30,20,0.65)]">
                        {items.length === 0
                          ? "You haven't added any bottles yet."
                          : `${items.length} item${items.length > 1 ? "s" : ""} in cart`}
                      </Dialog.Description>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(160,82,45,0.25)] bg-[#FFF8F0] text-[rgba(40,30,20,0.75)] shadow-sm transition-colors duration-150 hover:bg-[rgba(244,225,210,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40E0D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0]"
                      aria-label="Close cart"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <Container className="space-y-4">
                    {items.length === 0 ? (
                      <div className="mt-8 flex flex-col items-start gap-3 rounded-xl bg-[rgba(244,225,210,0.7)] p-4 text-[rgba(40,30,20,0.85)]">
                        <p className="font-medium">Your bottle awaits.</p>
                        <p className="text-sm text-[rgba(40,30,20,0.7)]">
                          Browse the collection and craft a label that feels like
                          you. This is a fully mocked cart for demo purposes—no
                          real purchases are made.
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-3" aria-label="Cart items list">
                        {items.map((item) => (
                          <li key={item.id}>
                            <CartItemRow item={item} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Container>
                </div>

                <footer className="border-t border-[rgba(160,82,45,0.18)] bg-[rgba(255,248,240,0.96)] p-4">
                  <CartSummary compact onCheckoutClick={() => onOpenChange(false)} />
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