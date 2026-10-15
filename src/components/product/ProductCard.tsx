import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Product } from "@/types";
import { formatPriceFromCents } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const MotionDiv = motion.div;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.images?.[0];

  const basePrice = product.basePrice ?? 0;

  return (
    <MotionDiv
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DDD5C7]/80 bg-white shadow-sm shadow-[#C8C0B3]/40"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden"
        aria-label={`View details for ${product.name}`}
      >
        <div className="aspect-[4/5] w-full overflow-hidden bg-[#F2EEE6]">
          {primaryImage ? (
            <motion.img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#6B6256]">
              Image coming soon
            </div>
          )}
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0",
            "transition-opacity duration-200 group-hover:opacity-100"
          )}
          aria-hidden="true"
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between text-xs text-[#FAF9F6] opacity-0",
            "transition-opacity duration-200 group-hover:opacity-100"
          )}
        >
          <span className="font-['Bodoni_Moda'] tracking-[0.18em] uppercase">
            Quick view
          </span>
          <Eye className="h-4 w-4" aria-hidden="true" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
        <div className="space-y-1">
          <h3 className="font-['Playfair_Display'] text-base text-[#2B2B2B]">
            <Link
              to={`/product/${product.id}`}
              className="transition-colors duration-200 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {product.name}
            </Link>
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-[#6B6256]">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <div className="font-['Bodoni_Moda'] text-[11px] uppercase tracking-[0.2em] text-[#6B6256]">
              From
            </div>
            <div className="text-sm font-semibold text-[#2B2B2B]">
              {formatPriceFromCents(basePrice)}
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center rounded-full border border-[#004D40]/30 bg-[#004D40] px-3 py-1.5 text-xs font-medium text-[#FAF9F6] shadow-sm shadow-[#004D40]/30 transition-colors duration-200 hover:bg-[#02675A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Design yours
          </Link>
        </div>
      </div>
    </MotionDiv>
  );
};

export default ProductCard;