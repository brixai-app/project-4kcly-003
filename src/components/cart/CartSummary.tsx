import React from "react";
import { Price } from "../ui/Price";
import { MotionButton } from "../ui/MotionButton";
import { useCartStore } from "@/state/cartStore";
import { useNavigate } from "react-router-dom";
import { SHIPPING_RATE_FLAT, TAX_RATE } from "@/mock";

interface CartSummaryProps {
  onCheckoutClick?: () => void;
  compact?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckoutClick,
  compact,
}) => {
  const navigate = useNavigate();
  const { items } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = items.length > 0 ? SHIPPING_RATE_FLAT : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (onCheckoutClick) onCheckoutClick();
    navigate("/checkout");
  };

  return (
    <section
      aria-label="Cart summary"
      className={`rounded-xl border border-[rgba(160,82,45,0.18)] bg-[#FFF8F0]/90 p-4 shadow-sm backdrop-blur-sm ${
        compact ? "space-y-3" : "space-y-4"
      }`}
   >
      <div className="flex items-center justify-between text-sm text-[rgba(40,30,20,0.8)]">
        <span>Subtotal</span>
        <Price value={subtotal} />
      </div>
      <div className="flex items-center justify-between text-sm text-[rgba(40,30,20,0.8)]">
        <span>Estimated shipping</span>
        {shipping === 0 ? (
          <span className="text-xs uppercase tracking-wide text-[rgba(112,130,56,0.9)]">
            Free
          </span>
        ) : (
          <Price value={shipping} />
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-[rgba(40,30,20,0.8)]">
        <span>Estimated tax</span>
        <Price value={tax} />
      </div>
      <div className="h-px bg-gradient-to-r from-[rgba(160,82,45,0.15)] via-[rgba(112,130,56,0.2)] to-[rgba(64,224,208,0.25)]" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[rgba(40,30,20,0.94)]">
          Total
        </span>
        <span className="text-base font-semibold text-[rgba(40,30,20,0.98)]">
          <Price value={total} />
        </span>
      </div>
      <p className="text-[11px] leading-snug text-[rgba(40,30,20,0.6)]">
        Taxes and shipping are mock estimates for demo purposes. No real
        payment is processed.
      </p>
      <MotionButton
        type="button"
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full rounded-xl bg-[#FF6F61] px-4 py-3 text-sm font-medium text-[#FFF8F0] shadow-[0_10px_30px_rgba(255,111,97,0.35)] transition-colors duration-200 hover:bg-[#e66055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#40E0D0] focus-visible:ring-offset-[#FFF8F0] disabled:cursor-not-allowed disabled:bg-[rgba(160,82,45,0.35)] disabled:text-[rgba(255,248,240,0.8)] disabled:shadow-none"
        aria-label={items.length === 0 ? "Cart is empty" : "Proceed to checkout"}
      >
        {items.length === 0 ? "Cart is empty" : "Checkout"}
      </MotionButton>
    </section>
  );
};

export default CartSummary;