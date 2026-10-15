import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/types";
import { getProductById } from "@/mock"; // centralized mock data
import { cn } from "@/lib/utils";
import { useCartStore } from "@/state/cartStore";

export interface CartItemRowProps {
  item: CartItem;
  index: number;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, index }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const product = getProductById(item.productId);

  if (!product) return null;

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > 10) {
      toast.error("Quantity must be between 1 and 10");
      return;
    }
    updateQuantity(item.productId, item.selectedSize, item.selectedColor, value);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.selectedSize, item.selectedColor);
    toast.message("Item removed", {
      description: `${product.name} was removed from your cart (mock only).`,
    });
  };

  const colorChipStyle: React.CSSProperties = {
    backgroundColor: item.selectedColor,
  };

  const hasLabel = Boolean(item.customLabelDesign?.elements?.length);

  const linePrice = product.basePrice * item.quantity;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ delay: index * 0.03 }}
      className="flex gap-3 rounded-2xl border border-sand-200 bg-white/90 p-3 shadow-sm shadow-neutral-900/5"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-cream-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {hasLabel && (
          <span className="absolute inset-x-1 bottom-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cream-50">
            Custom label
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {product.name}
            </h3>
            <p className="mt-0.5 text-[11px] text-neutral-500 line-clamp-2">
              {product.description}
            </p>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            ₹{linePrice.toFixed(0)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600">
          <div className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5">
            <span className="font-medium text-neutral-700">
              {item.selectedSize}
            </span>
            <span className="text-neutral-400">•</span>
            <span className="flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-full border border-sand-300"
                style={colorChipStyle}
              />
              Color
            </span>
          </div>
          {hasLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-terracotta-50 px-2 py-0.5 text-terracotta-800">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
              Label saved
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-neutral-600" htmlFor={`qty-${item.productId}`}>
              Qty
            </label>
            <div className="inline-flex items-center rounded-lg border border-sand-300 bg-cream-50 px-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-neutral-700",
                  "hover:bg-sand-100 disabled:cursor-not-allowed disabled:text-neutral-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                )}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id={`qty-${item.productId}`}
                type="number"
                min={1}
                max={10}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                className="h-6 w-9 border-none bg-transparent text-center text-xs text-neutral-800 focus:outline-none"
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= 10}
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-neutral-700",
                  "hover:bg-sand-100 disabled:cursor-not-allowed disabled:text-neutral-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
                )}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1 rounded-lg bg-coral-50 px-2 py-1 text-[11px] font-medium text-coral-700 shadow-sm transition-colors hover:bg-coral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItemRow;