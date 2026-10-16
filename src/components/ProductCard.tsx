import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/mock";

export type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.02, boxShadow: "0 18px 45px rgba(46, 29, 17, 0.18)" }}
      whileTap={{ scale: 0.97 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4D0B8] bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBA135] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF5E1]"
      aria-label={`${product.name} – from $${product.basePrice.toFixed(2)}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F7E7CF]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-[0.14em] text-[#333333] uppercase font-['Playfair_Display']">
            {product.name}
          </h3>
          <span className="text-xs font-medium text-[#A0522D]">
            from ${product.basePrice.toFixed(2)}
          </span>
        </div>

        <div className="mt-2 h-[1px] w-10 rounded-full bg-gradient-to-r from-[#CBA135]/90 to-transparent" />

        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#6A5649]">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#8A6C5A]">
          <span>{product.availableSizes.join(" • ")}</span>
          <span>{product.availableBottleColors.join(" • ")}</span>
        </div>
      </div>
    </motion.button>
  );
};

export default ProductCard;