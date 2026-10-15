import React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductMasonryGalleryProps {
  products: Product[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
};

export const ProductMasonryGallery: React.FC<ProductMasonryGalleryProps> = ({
  products,
}) => {
  // Create a light asymmetric pattern by tagging some indices as tall/wide
  const getVariantForIndex = (index: number): "default" | "tall" | "wide" => {
    if (index % 7 === 0) return "tall";
    if (index % 5 === 0) return "wide";
    return "default";
  };

  return (
    <section
      aria-label="Featured bottles"
      className="relative mx-auto mt-10 max-w-6xl px-4 sm:px-6"
    >
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl text-[#43281C] sm:text-3xl">
            Featured silhouettes
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[#7A5C49]">
            Sculptural forms, subtle labels. Each collection is printed in
            small runs, so what you see here might not return.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-[#A0522D]">
          Curated edit · Limited availability
        </p>
      </div>

      <motion.div
        className="grid auto-rows-[minmax(220px,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        {products.map((product, index) => (
          <motion.div key={product.id} variants={itemVariants} layout>
            <ProductCard
              product={product}
              layoutVariant={getVariantForIndex(index)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProductMasonryGallery;