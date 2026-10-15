import React from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = "No bottles match your filters just yet.",
}) => {
  if (!products.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-[12px] border border-dashed border-[rgba(160,82,45,0.35)] bg-[#FFF8F0] px-6 py-10 text-center text-sm text-[#7A5C49]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants} layout>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;