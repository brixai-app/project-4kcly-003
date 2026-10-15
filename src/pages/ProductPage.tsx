import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { products, labelDesignOptions, feedback } from "../mock";
import { Product } from "../types";
import { ProductImageCarousel } from "../components/product/ProductImageCarousel";
import { LabelDesignDrawer } from "../components/label/LabelDesignDrawer";
import { RatingStars } from "../components/feedback/RatingStars";
import { FeedbackList } from "../components/feedback/FeedbackList";
import { Button } from "../components/ui/Button";
import { useCartStore } from "../store/cartStore";
import { validateLabelText } from "../lib/validators";

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product: Product | undefined = useMemo(
    () => products.find((p) => p.id === id),
    [id]
  );

  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.availableSizes[0] ?? null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product?.availableBottleColors[0] ?? null
  );
  const [labelDesign, setLabelDesign] = useState({
    text: "",
    font: labelDesignOptions.fonts[0],
    color: labelDesignOptions.colors[0],
    icon: labelDesignOptions.icons[0],
  });
  const [labelDrawerOpen, setLabelDrawerOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF9F6] px-6">
        <div className="flex items-center gap-3 text-[#2B2B2B]">
          <AlertTriangle className="text-[#A89F91]" />
          <div>
            <p className="font-['Playfair_Display'] text-lg">Bottle not found</p>
            <p className="text-sm text-[#555]">
              The silhouette you&apos;re searching for has either sold out in this
              batch or never existed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const productFeedback = feedback.filter((f) => f.productId === product.id);

  const labelError = validateLabelText(labelDesign.text);
  const canAddToCart =
    !!selectedSize &&
    !!selectedColor &&
    !labelError &&
    !!labelDesign.text.trim() &&
    product.stockQuantity > 0;

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast.error("Complete your selections before adding to cart.");
      return;
    }

    addItem({
      product,
      selectedSize: selectedSize!,
      selectedBottleColor: selectedColor!,
      labelDesign,
      quantity: 1,
    });

    toast.success("Bottle added to your cart.");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B] px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10 lg:gap-16">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductImageCarousel product={product} />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <p className="tracking-[0.25em] text-xs uppercase text-[#A89F91]">
              Nishant Waters
            </p>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl">
              {product.name}
            </h1>
            <p className="font-['Bodoni_Moda'] text-lg text-[#004D40]">
              From ₹{product.basePrice.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-[#4A4A4A] max-w-xl mt-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6A6A6A]">
            <span>
              Stock: {product.stockQuantity > 0 ? "Available" : "Sold out"}
            </span>
            <span className="h-[1px] w-8 bg-[#D5CEC2]" aria-hidden="true" />
            <span>
              Ships in 3–5 business days • Custom label created in your browser
            </span>
          </div>

          {/* Size selector */}
          <div className="space-y-2">
            <p className="text-xs tracking-[0.22em] uppercase text-[#8C8377]">
              Choose size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    selectedSize === size
                      ? "bg-[#004D40] text-[#FAF9F6] border-[#004D40]"
                      : "border-[#D5CEC2] text-[#2B2B2B] hover:bg-[#F1EBE0]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className="space-y-2">
            <p className="text-xs tracking-[0.22em] uppercase text-[#8C8377]">
              Bottle color
            </p>
            <div className="flex flex-wrap gap-2">
              {product.availableBottleColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    selectedColor === color
                      ? "bg-[#004D40] text-[#FAF9F6] border-[#004D40]"
                      : "border-[#D5CEC2] text-[#2B2B2B] hover:bg-[#F1EBE0]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Label design summary */}
          <div className="space-y-2 border border-[#E0DAD0] bg-white/60 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-xs tracking-[0.18em] uppercase text-[#8C8377]">
                Label design
              </p>
              <button
                type="button"
                onClick={() => setLabelDrawerOpen(true)}
                className="text-xs rounded-full px-3 py-1 border border-[#004D40] text-[#004D40] hover:bg-[#E6F1EF]"
              >
                Edit label
              </button>
            </div>
            {labelDesign.text ? (
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-['Playfair_Display'] text-[#2B2B2B]">
                  {labelDesign.text}
                </p>
                <p className="text-xs text-[#6A6A6A]">
                  {labelDesign.font} • {labelDesign.icon.label} • {labelDesign.color}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#6A6A6A]">
                Add a short line of text, choose an icon, and preview live on the
                bottle before ordering.
              </p>
            )}
            {labelError && (
              <p className="mt-1 text-xs text-red-600">{labelError}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="bg-[#004D40] text-[#FAF9F6] hover:bg-[#026457] disabled:bg-[#8F9F9C] disabled:cursor-not-allowed rounded-full px-6 py-3 text-sm flex-1 sm:flex-none"
            >
              {product.stockQuantity > 0
                ? "Add to cart"
                : "Currently unavailable"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLabelDrawerOpen(true)}
              className="border border-[#A89F91]/60 text-[#004D40] hover:bg-[#F1EBE0] rounded-full px-6 py-3 text-sm"
            >
              Open label designer
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Feedback */}
      <section className="mt-16 border-t border-[#E0DAD0] pt-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="tracking-[0.2em] text-xs uppercase text-[#A89F91]">
              Impressions
            </p>
            <h2 className="font-['Playfair_Display'] text-2xl">
              How this bottle reads in the wild
            </h2>
          </div>
          {productFeedback.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
              <RatingStars
                rating={
                  productFeedback.reduce((sum, f) => sum + f.rating, 0) /
                  productFeedback.length
                }
              />
              <span>({productFeedback.length} reviews)</span>
            </div>
          )}
        </div>
        {productFeedback.length === 0 ? (
          <p className="text-sm text-[#6A6A6A]">
            This silhouette hasn&apos;t been reviewed yet. Be the first to debut it on
            your table, studio, or stage.
          </p>
        ) : (
          <FeedbackList feedback={productFeedback} />
        )}
      </section>

      <LabelDesignDrawer
        open={labelDrawerOpen}
        onOpenChange={setLabelDrawerOpen}
        labelDesign={labelDesign}
        onChange={setLabelDesign}
      />
    </div>
  );
};

export default ProductPage;