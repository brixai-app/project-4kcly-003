import React from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { fadeInUpStagger } from "../ui/Motion";

interface ProductGalleryProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

/**
 * Asymmetric masonry-style gallery using CSS columns on large screens
 * and responsive grid on small/medium screens.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = ({
  products,
  onQuickView,
}) => {
  if (!products.length) {
    return (
      <div className="py-16 text-center text-sm text-neutral-500">
        No products match your filters.
      </div>
    );
  }

  return (
    <section aria-label="Product gallery" className="w-full">
      {/* Mobile / tablet: standard grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden"
        variants={fadeInUpStagger}
        initial="hidden"
        animate="visible"
     >
        {products.map((product) => (
          <motion.div key={product.id} variants={fadeInUpStagger.item}>
            <ProductCard product={product} onQuickView={onQuickView} />
          </motion.div>
        ))}
      </motion.div>

      {/* Desktop: masonry via columns */}
      <motion.div
        className="hidden lg:block"
        variants={fadeInUpStagger}
        initial="hidden"
        animate="visible"
      >
        <div
          className="columns-2 gap-6 xl:columns-3 [column-fill:_balance]
          "
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeInUpStagger.item}
              className={
                "mb-6 break-inside-avoid" +
                (index % 5 === 0
                  ? " lg:translate-y-4"
                  : index % 5 === 2
                  ? " lg:-translate-y-3"
                  : "")
              }
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProductGallery;