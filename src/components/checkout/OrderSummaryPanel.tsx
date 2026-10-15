import React from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/pricing";
import { Divider } from "@/components/ui/Divider";

export const OrderSummaryPanel: React.FC = () => {
  const { items, subtotal, totalQuantity } = useCartStore();

  return (
    <aside className="bg-white/90 backdrop-blur rounded-2xl border border-[#E0D9CC] p-5 shadow-sm flex flex-col gap-4">
      <div>
        <h2 className="font-playfair text-lg tracking-wide text-[#2B2B2B] mb-1">
          Order Summary
        </h2>
        <p className="text-xs text-[#5C5548] tracking-wide uppercase">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.selectedSize}-${item.selectedBottleColor}-${item.labelDesign.text}`}
            className="flex items-start justify-between gap-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2B2B2B] leading-snug">
                {item.productName}
              </p>
              <p className="text-xs text-[#5C5548] mt-0.5">
                {item.selectedSize} • {item.selectedBottleColor}
              </p>
              <p className="text-xs text-[#5C5548] mt-1 italic">
                “{item.labelDesign.text || "No label text"}”
              </p>
              <p className="text-[11px] text-[#8A8172] mt-0.5">
                {item.labelDesign.font} • {item.labelDesign.color} • {item.labelDesign.icon}
              </p>
              <p className="text-[11px] text-[#8A8172] mt-0.5">
                Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#2B2B2B]">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[#5C5548]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#5C5548]">
          <span>Shipping</span>
          <span className="uppercase tracking-wide text-[11px]">Complimentary</span>
        </div>
        <div className="flex justify-between text-[#2B2B2B] font-medium pt-1 border-t border-dashed border-[#E0D9CC] mt-1">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      <p className="text-[11px] text-[#8A8172] leading-relaxed">
        By placing your order, you confirm that your custom label text has been reviewed
        carefully. Orders are crafted on demand and cannot be modified once processing
        begins.
      </p>
    </aside>
  );
};

export default OrderSummaryPanel;