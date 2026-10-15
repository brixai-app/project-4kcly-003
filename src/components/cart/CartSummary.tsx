import React from "react";
import { motion } from "framer-motion";
import type { CartItem } from "@/types";
import { formatPrice, calculateCartSubtotal } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ items, onCheckout }) => {
  const subtotal = calculateCartSubtotal(items);
  const shippingEstimate = items.length > 0 ? 12 : 0; // flat mock shipping
  const total = subtotal + shippingEstimate;

  const disabled = items.length === 0;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-4 rounded-xl border border-[#A89F91]/50 bg-[#FAF9F6] p-4 shadow-sm"
      aria-label="Cart summary"
    >
      <div>
        <h2 className="text-xs font-semibold tracking-[0.18em] text-[#2B2B2B]/70 uppercase">
          Summary
        </h2>
        <p className="mt-1 text-[11px] text-[#2B2B2B]/75">
          All pricing is simulated with mock data for this preview experience.
        </p>
      </div>

      <dl className="space-y-2 text-xs text-[#2B2B2B]/80">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd className="font-medium text-[#2B2B2B]">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Estimated shipping</dt>
          <dd>
            {items.length > 0 ? (
              <span className="font-medium text-[#2B2B2B]">{formatPrice(shippingEstimate)}</span>
            ) : (
              <span className="text-[#2B2B2B]/60">—</span>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-[#A89F91]/60 pt-2 text-[13px]">
          <dt className="font-semibold tracking-wide text-[#2B2B2B]">Total</dt>
          <dd className="font-semibold text-[#2B2B2B]">{formatPrice(total)}</dd>
        </div>
      </dl>

      <div className="pt-1">
        <Button
          type="button"
          size="lg"
          className="w-full justify-center"
          disabled={disabled}
          onClick={onCheckout}
        >
          Proceed to checkout
        </Button>
        <p className="mt-2 text-[10px] leading-relaxed text-[#2B2B2B]/70">
          This is a client-side prototype: no real payment is processed, and orders are stored
          only in your browser for the duration of your session.
        </p>
      </div>
    </motion.aside>
  );
};

export default CartSummary;