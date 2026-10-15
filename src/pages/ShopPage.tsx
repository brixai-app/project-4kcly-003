import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { products } from "../mock";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductFilters } from "../components/product/ProductFilters";
import { QuickViewModal } from "../components/product/QuickViewModal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Product } from "../types";

export const ShopPage: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const allProducts = products;

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    if (selectedSize) {
      list = list.filter((p) => p.availableSizes.includes(selectedSize as any));
    }
    if (selectedColor) {
      list = list.filter((p) =>
        p.availableBottleColors.includes(selectedColor as any)
      );
    }
    if (priceRange) {
      list = list.filter(
        (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [allProducts, selectedSize, selectedColor, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] px-6 sm:px-10 lg:px-16 xl:px-24 py-14 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SectionHeading
          eyebrow="The Bottle Library"
          title="Find the silhouette that speaks your language"
          description="Filter by size, tone, and investment level to discover the vessel that will carry your custom label story." 
        />

        <div className="w-full md:w-auto md:min-w-[280px]">
          <ProductFilters
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
            onPriceRangeChange={setPriceRange}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-[#D5CEC2] rounded-3xl bg-white/40"
        >
          <p className="font-['Playfair_Display'] text-xl mb-2">
            No bottles match these filters.
          </p>
          <p className="text-sm text-[#5A5A5A] max-w-md mb-4">
            Try softening your selections—our collection is curated but versatile.
            All silhouettes remain fully customizable.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSize(null);
              setSelectedColor(null);
              setPriceRange(null);
              setSortBy("featured");
            }}
            className="text-xs tracking-[0.18em] uppercase rounded-full px-5 py-2 border border-[#004D40] text-[#004D40] hover:bg-[#E6F1EF]"
          >
            Reset filters
          </button>
        </motion.div>
      ) : (
        <ProductGallery
          products={filteredProducts}
          onQuickView={setQuickViewProduct}
          layout="asymmetric"
        />
      )}

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => {
          if (!open) setQuickViewProduct(null);
        }}
      />
    </div>
  );
};

export default ShopPage;