import React from "react";
import { useCartStore } from "@/state/cartStore";
import { Price } from "../ui/Price";
import { SHIPPING_RATE_FLAT, TAX_RATE } from "@/mock";

interface OrderSummaryPanelProps {
  showBreakdown?: boolean;
}

export const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  showBreakdown = true,
}) => {
  const { items } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = items.length > 0 ? SHIPPING_RATE_FLAT : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <aside
      aria-label="Order summary"
      className="rounded-2xl border border-[rgba(160,82,45,0.16)] bg-[rgba(255,248,240,0.9)] p-4 shadow-[0_18px_40px_rgba(40,30,20,0.12)] backdrop-blur-sm"
    >
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="font-heading text-base font-semibold tracking-wide text-[rgba(40,30,20,0.95)]">
          Your order
        </h2>
        <span className="text-xs uppercase tracking-[0.2em] text-[rgba(112,130,56,0.9)]">
          Nishant Waters
        </span>
      </header>

      <ul className="mb-4 max-h-56 space-y-3 overflow-y-auto pr-1" aria-label="Order items">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-xl bg-[rgba(244,225,210,0.8)] p-3 text-xs text-[rgba(40,30,20,0.9)]"
          >
            <div
              className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-lg border border-[rgba(160,82,45,0.25)] bg-[#FFF8F0] shadow-sm"
              style={{ background: item.selectedColor || "#FFF8F0" }}
              aria-hidden="true"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium leading-snug">
                    {item.productName}
                  </p>
                  <p className="text-[11px] text-[rgba(40,30,20,0.7)]">
                    {item.selectedSize}
                    {item.selectedColor && (
                      <>
                        {" "}
                        · Custom hue
                      </>
                    )}
                    {item.customLabelDesign && (
                      <>
                        {" "}
                        · Personalized label
                      </>
                    )}
                  </p>
                </div>
                <Price value={item.lineTotal} className="text-xs font-semibold" />
              </div>
              <p className="text-[11px] text-[rgba(40,30,20,0.65)]">
                Qty {item.quantity}
              </p>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-xl bg-[rgba(244,225,210,0.7)] p-3 text-xs text-[rgba(40,30,20,0.7)]">
            Your cart is empty. Add a custom bottle to see it here.
          </li>
        )}
      </ul>

      {showBreakdown && (
        <div className="space-y-2 border-t border-[rgba(160,82,45,0.16)] pt-3 text-sm">
          <div className="flex items-center justify-between text-[rgba(40,30,20,0.82)]">
            <span>Subtotal</span>
            <Price value={subtotal} />
          </div>
          <div className="flex items-center justify-between text-[rgba(40,30,20,0.82)]">
            <span>Shipping</span>
            {shipping === 0 ? (
              <span className="text-[11px] uppercase tracking-wide text-[rgba(112,130,56,0.9)]">
                Free
              </span>
            ) : (
              <Price value={shipping} />
            )}
          </div>
          <div className="flex items-center justify-between text-[rgba(40,30,20,0.82)]">
            <span>Estimated tax</span>
            <Price value={tax} />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-[rgba(160,82,45,0.2)] pt-3">
        <span className="text-sm font-medium text-[rgba(40,30,20,0.96)]">
          Total due today
        </span>
        <span className="text-base font-semibold text-[rgba(40,30,20,0.98)]">
          <Price value={total} />
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-[rgba(40,30,20,0.6)]">
        This is a fully mocked checkout experience using local browser data.
        No card will be charged, and all amounts are sample values only.
      </p>
    </aside>
  );
};

export default OrderSummaryPanel;