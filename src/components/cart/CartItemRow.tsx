import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { CartItem, Product } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/pricing";
import { labelDesignOptions, products } from "@/mock";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onChangeQuantity, onRemove }) => {
  const product: Product | undefined = products.find((p) => p.id === item.productId);

  if (!product) return null;

  const maxQty = product.stockQuantity;
  const canDecrease = item.quantity > 1;
  const canIncrease = item.quantity < maxQty;

  const font = labelDesignOptions.fonts.find((f) => f.id === item.labelDesign.font);
  const color = labelDesignOptions.colors.find((c) => c.id === item.labelDesign.color);
  const icon = labelDesignOptions.icons.find((i) => i.id === item.labelDesign.icon);

  const image = product.images[0];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 border-b border-[#A89F91]/40 pb-4 pt-3 last:border-b-0 last:pb-0"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-[#A89F91]/40 bg-white">
        {image && (
          <img
            src={image.url}
            alt={image.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1 text-sm text-[#2B2B2B]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-[#2B2B2B]/70 uppercase">
              {product.name}
            </div>
            <div className="mt-1 text-[11px] text-[#2B2B2B]/80">
              {item.selectedSize} • {item.selectedBottleColor}
            </div>
            <div className="mt-1 text-[11px] text-[#2B2B2B]/70">
              <span className="font-semibold">Label:</span>{" "}
              <span className="italic">{item.labelDesign.text || "Untitled"}</span>
              {font && <span className="ml-1">· {font.label}</span>}
              {color && (
                <span className="ml-1 inline-flex items-center gap-1">
                  · {color.label}
                  <span
                    className="h-2 w-2 rounded-full border border-black/5"
                    style={{ backgroundColor: color.hex }}
                  />
                </span>
              )}
              {icon && <span className="ml-1">· {icon.label}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-transparent text-[#2B2B2B]/60 transition-colors hover:border-[#A89F91]/60 hover:text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]"
            aria-label={`Remove ${product.name} from cart`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-[#A89F91]/60 bg-white px-1.5 py-1 text-[11px] text-[#2B2B2B]/80">
            <span className="sr-only">Quantity</span>
            <button
              type="button"
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                canDecrease
                  ? "text-[#2B2B2B] hover:bg-[#FAF9F6]"
                  : "cursor-not-allowed text-[#A89F91]"
              )}
              disabled={!canDecrease}
              onClick={() => canDecrease && onChangeQuantity(item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="mx-2 min-w-[1.5rem] text-center text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              type="button"
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                canIncrease
                  ? "text-[#2B2B2B] hover:bg-[#FAF9F6]"
                  : "cursor-not-allowed text-[#A89F91]"
              )}
              disabled={!canIncrease}
              onClick={() => canIncrease && onChangeQuantity(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-right text-xs font-semibold tracking-wide text-[#2B2B2B]">
            <div>{formatPrice(item.price * item.quantity)}</div>
            {item.quantity > 1 && (
              <div className="text-[10px] text-[#2B2B2B]/70">
                {formatPrice(item.price)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItemRow;