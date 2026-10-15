import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { formatPrice } from "@/theme/tokens";

interface ProductCardProps {
  product: Product;
  layoutVariant?: "default" | "tall" | "wide";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layoutVariant = "default",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const primaryImage = product.images?.[0];

  const heightClass =
    layoutVariant === "tall"
      ? "row-span-2 min-h-[320px]"
      : layoutVariant === "wide"
      ? "col-span-2 min-h-[260px]"
      : "min-h-[260px]";

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[rgba(160,82,45,0.22)] bg-[#FFF8F0] shadow-[0_12px_30px_rgba(67,40,28,0.08)]",
        "focus-within:ring-2 focus-within:ring-[#40E0D0]/60",
        heightClass
      )}
      role="button"
      tabIndex={0}
      aria-label={`${product.name} – view details`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F4E1D2]">
        {primaryImage ? (
          <motion.img
            src={primaryImage}
            alt={product.name}
            className="h-56 w-full object-cover transition-[filter] group-hover:brightness-105"
            initial={{ scale: 1.02 }}
            whileHover={{ scale: 1.07 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            loading="lazy"
          />
        ) : (
          <div className="flex h-56 w-full items-center justify-center text-sm text-[#7A5C49]">
            Preview coming soon
          </div>
        )}
        {product.customizableLabel && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#40E0D0] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#123B35] shadow-sm">
            Custom label
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-3">
        <div className="space-y-1">
          <h3 className="font-display text-base text-[#43281C]">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs text-[#7A5C49]">
            {product.description}
          </p>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#A0522D]">
              From
            </p>
            <p className="font-display text-lg text-[#43281C]">
              {formatPrice(product.basePrice)}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-[#A0522D] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FFF8F0] shadow-sm outline-none transition-[background-color,box-shadow,transform] hover:scale-[1.04] hover:bg-[#8E4828] hover:shadow-md active:scale-95 focus-visible:bg-[#8E4828] focus-visible:shadow-[0_0_0_2px_rgba(64,224,208,0.65)]"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Quick view
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;