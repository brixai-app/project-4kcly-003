import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@/components/ui/shadcn";

import { Product, ProductVariant } from "@/mock";
import { formatCurrency } from "@/mock";

export interface ProductCardProps {
  product: Product;
  /**
   * Optional variant to highlight (e.g. default variant). If not provided,
   * the first variant will be used for price display and add-to-cart.
   */
  primaryVariant?: ProductVariant;
  /**
   * Callback invoked when the user presses the primary CTA.
   * Parent is responsible for calling mock.addToCart and showing Sonner toast.
   */
  onAddToCart: (productId: string, variantId: string) => void;
  /**
   * Optional callback when user clicks anywhere on the card body to view details.
   * If not provided, the card will navigate to `/product/${product.slug}`.
   */
  onOpenDetail?: (productId: string) => void;
  /**
   * Used by masonry layouts to slightly vary height / emphasis.
   */
  layoutVariant?: "tall" | "wide" | "standard";
}

const hoverVariants = {
  rest: {
    y: 0,
    boxShadow: "0 10px 30px rgba(15, 10, 6, 0.08)",
  },
  hover: {
    y: -6,
    boxShadow: "0 18px 45px rgba(15, 10, 6, 0.18)",
  },
};

const imageParallaxVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.04, y: -4 },
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  primaryVariant,
  onAddToCart,
  onOpenDetail,
  layoutVariant = "standard",
}) => {
  const navigate = useNavigate();

  const variant = primaryVariant ?? product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!variant) return;
    onAddToCart(product.id, variant.id);
  };

  const handleOpenDetail = () => {
    if (onOpenDetail) {
      onOpenDetail(product.id);
    } else {
      navigate(`/product/${product.slug}`);
    }
  };

  const heightClass =
    layoutVariant === "tall"
      ? "min-h-[420px]"
      : layoutVariant === "wide"
      ? "min-h-[360px]"
      : "min-h-[380px]";

  const backgroundTint = product.baseColor || "#B56A3C";

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={hoverVariants}
      className="w-full transition-shadow duration-200"
    >
      <Card
        role="article"
        aria-label={product.name}
        className={`group relative flex h-full flex-col overflow-hidden border border-[#e2d3c4]/70 bg-[#f7efe6]/90 text-[#2b211a] shadow-sm backdrop-blur-sm ${heightClass}`}
        style={{
          // subtle left border accent using base color
          boxShadow:
            "inset 3px 0 0 0 rgba(181, 106, 60, 0.4), 0 10px 30px rgba(15, 10, 6, 0.06)",
        }}
        onClick={handleOpenDetail}
      >
        <CardHeader className="relative flex flex-col gap-3 p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-xl bg-[#e8dbcd]">
            <motion.div
              variants={imageParallaxVariants}
              className="relative h-56 w-full overflow-hidden sm:h-64"
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 10% 0, rgba(255, 255, 255, 0.55), transparent 55%), radial-gradient(circle at 90% 100%, rgba(61, 40, 30, 0.35), transparent 60%)",
                }}
              />
              <img
                src={product.heroImage}
                alt={product.name}
                className="relative z-[1] h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            </motion.div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 bottom-2 flex justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-[#5c4635]/80"
            >
              <span>{variant?.sizeMl ? `${variant.sizeMl}ml` : "Custom"}</span>
              {variant && (
                <span>
                  {variant.capColor} 
                  <span className="mx-1 text-[#b56a3c]">·</span>
                  {variant.labelFinish} label
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <CardTitle className="font-serif text-lg font-semibold tracking-tight text-[#241810] sm:text-xl">
              {product.name}
            </CardTitle>
            <CardDescription className="text-[13px] leading-relaxed text-[#6b5645] sm:text-sm">
              {product.shortDescription}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-between gap-3 px-4 pb-3 pt-0 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            {product.tags.slice(0, 3).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="border-[#d0b399] bg-[#f6ece1] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#7a5a3e]"
              >
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge
                variant="outline"
                className="border-transparent bg-[#e4d2c0]/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#7a5a3e]"
              >
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {variant && (
                <span className="font-sans text-base font-semibold text-[#2b211a] sm:text-lg">
                  {formatCurrency(variant.priceCents)}
                </span>
              )}
              {variant && (
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#85614a]">
                  per bottle • {variant.labelFinish} finish
                </span>
              )}
            </div>

            <div className="flex flex-col items-end text-[11px] text-[#8b6b52]">
              <span className="uppercase tracking-[0.18em]">Label tones</span>
              <div className="mt-1 flex items-center gap-1.5">
                {product.labelPaletteIds.slice(0, 4).map(id => (
                  <span
                    key={id}
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full border border-[#f8efe5] shadow-[0_0_0_1px_rgba(80,54,36,0.22)]"
                    style={{
                      backgroundColor:
                        id === "amber-velvet"
                          ? "#B56A3C"
                          : id === "smoked-ivory"
                          ? "#E3D5C6"
                          : id === "midnight-caramel"
                          ? "#3F2A23"
                          : id === "linen-foam"
                          ? "#F4E9DD"
                          : id === "burnt-citrus"
                          ? "#C16A32"
                          : id === "soft-cacao"
                          ? "#8D5A3A"
                          : backgroundTint,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t border-[#dec7b1]/80 bg-[#f3e5d3]/70 px-4 py-3.5 sm:px-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-transparent bg-transparent px-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7b5f46] underline-offset-4 hover:bg-transparent hover:text-[#503423] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6854e]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3e5d3]"
          >
            Details
          </Button>

          <motion.div
            whileTap={{ scale: 0.96, y: 1 }}
            className="shrink-0"
          >
            <Button
              type="button"
              size="sm"
              onClick={handleAddToCart}
              disabled={!variant}
              className="inline-flex items-center gap-2 rounded-full border border-[#b56a3c] bg-[#b56a3c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f8efe5] shadow-[0_8px_20px_rgba(58,32,16,0.35)] transition-colors duration-200 hover:border-[#8f5027] hover:bg-[#8f5027] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d3b8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3e5d3] disabled:cursor-not-allowed disabled:border-[#d6b59a] disabled:bg-[#d6b59a] disabled:text-[#f7efe6]"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add to cart</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;