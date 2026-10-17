import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Droplet } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn";

import { ProductSKU, LabelColorOption, addToCart, formatMoney } from "@/mock";
import { showToastSuccess, showToastError } from "./ToastProvider";

export interface ProductCardProps {
  product: ProductSKU;
  /**
   * Optional: preselected label color id to highlight or use for quick add.
   * If not provided, the product's first label color will be used.
   */
  defaultLabelColorId?: string;
  /** When true, shows a compact layout suited for dense grids. */
  compact?: boolean;
}

const imageVariants = {
  initial: { scale: 1.02, opacity: 0.85 },
  hover: { scale: 1.06, opacity: 1 },
};

const cardVariants = {
  initial: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    y: -4,
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.18)",
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
};

const swatchRingClass =
  "relative flex h-6 w-6 items-center justify-center rounded-full border border-black/5 dark:border-white/10";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  defaultLabelColorId,
  compact,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [activeColorId, setActiveColorId] = React.useState<string | undefined>(
    defaultLabelColorId ?? product.labelColors[0]?.id,
  );
  const [isAdding, setIsAdding] = React.useState(false);

  const activeColor: LabelColorOption | undefined = React.useMemo(() => {
    return (
      product.labelColors.find((c) => c.id === activeColorId) ||
      product.labelColors[0]
    );
  }, [product.labelColors, activeColorId]);

  const handleQuickAdd = () => {
    if (!activeColor) {
      showToastError("Choose a label tone", "Select a label color before adding.");
      return;
    }
    setIsAdding(true);
    try {
      const item = addToCart({
        productId: product.id,
        labelColorId: activeColor.id,
        quantity: 1,
      });
      if (!item) {
        showToastError("Could not add to cart", "Please try again.");
        return;
      }
      showToastSuccess("Added to cart", `${product.name} · ${activeColor.name}`);
    } finally {
      setTimeout(() => setIsAdding(false), 350);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate={hovered ? "hover" : "initial"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="h-full"
    >
      <Card
        className="flex h-full flex-col overflow-hidden border border-black/5 bg-[rgba(247,241,232,0.96)]/90 shadow-sm backdrop-blur-sm transition-colors duration-200 dark:border-white/10 dark:bg-[rgba(32,23,18,0.98)]"
      >
        <CardHeader className="space-y-2 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f2c29b] via-[#f7f1e8] to-[#f3e6d6] dark:from-[#5b3420] dark:via-[#2b211a] dark:to-[#5b3420]">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <motion.img
                src={product.imageUrl}
                loading="lazy"
                decoding="async"
                alt={product.name}
                className="h-full w-full object-cover"
                variants={imageVariants}
                initial="initial"
                animate={hovered ? "hover" : "initial"}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />

              {/* Label band overlay to hint customization */}
              {activeColor && (
                <div className="pointer-events-none absolute inset-x-6 bottom-7 flex items-center justify-between">
                  <div
                    className="h-8 flex-1 rounded-full border border-black/10/40 shadow-sm dark:border-white/10"
                    style={{
                      backgroundColor: activeColor.hex,
                    }}
                  />
                  <div className="ml-3 flex items-center rounded-full bg-black/65 px-3 py-1 text-xs font-medium tracking-wide text-[#f7f1e8] shadow-sm backdrop-blur-sm dark:bg-white/80 dark:text-[#2b211a]">
                    <Droplet className="mr-1.5 h-3.5 w-3.5" />
                    {activeColor.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between gap-3 pt-3">
            <div className="space-y-1">
              <CardTitle className="font-['Playfair_Display'] text-lg tracking-tight text-[#2b211a] dark:text-[#f7f1e8]">
                {product.name}
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-[0.16em] text-[#5b3420]/80 dark:text-[#f3e6d6]/70">
                {product.capacityMl} ml · Min. {product.minOrderQty} units
              </CardDescription>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-medium text-[#914b1a] dark:text-[#f2c29b]">
                {formatMoney(product.price)}
              </p>
              <p className="text-[11px] text-[#5b3420]/70 dark:text-[#f3e6d6]/60">
                per bottle
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pb-3 text-sm text-[#2b211a]/80 dark:text-[#f7f1e8]/80">
          <p className="line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Label color swatches */}
          {product.labelColors.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#5b3420]/70 dark:text-[#f3e6d6]/60">
                Label palette
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.labelColors.map((color) => {
                  const isActive = activeColor?.id === color.id;
                  return (
                    <Tooltip key={color.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setActiveColorId(color.id)}
                          aria-label={`Use ${color.name} label`}
                          className={`${swatchRingClass} transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d28c45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8] dark:focus-visible:ring-[#f2c29b] dark:focus-visible:ring-offset-[#2b211a] ${
                            isActive
                              ? "ring-2 ring-[#d28c45] ring-offset-2 ring-offset-[#f7f1e8] dark:ring-[#f2c29b] dark:ring-offset-[#2b211a]"
                              : ""
                          }`}
                        >
                          <span
                            className="inline-block h-4 w-4 rounded-full border border-black/10 shadow-sm dark:border-black/40"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#2b211a] text-[#f7f1e8]">
                        <p className="text-xs">{color.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t border-black/5 bg-[#f7f1e8]/80 px-5 py-4 dark:border-white/10 dark:bg-[#241a15]">
          <Button
            variant="outline"
            asChild
            className="group border-[#d28c45]/60 bg-white/70 text-[#5b3420] shadow-none transition-colors duration-200 hover:border-[#b46a2b] hover:bg-[#f3e6d6] hover:text-[#2b211a] dark:border-[#f2c29b]/50 dark:bg-transparent dark:text-[#f7f1e8] dark:hover:border-[#f2c29b] dark:hover:bg-[#5b3420]/60"
          >
            <Link to={`/product/${product.slug}`} aria-label={`Customize ${product.name}`}>
              <span className="flex items-center text-xs font-medium uppercase tracking-[0.16em]">
                <span className="mr-1.5 inline-block h-[1px] w-3 bg-[#d28c45] transition-all duration-200 group-hover:w-4 group-hover:bg-[#b46a2b] dark:bg-[#f2c29b]" />
                Customize
              </span>
            </Link>
          </Button>

          <Button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="inline-flex items-center justify-center rounded-full bg-[#b46a2b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f7f1e8] shadow-md transition-[background-color,box-shadow] duration-200 hover:bg-[#914b1a] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-[#d28c45]/70 dark:bg-[#f2c29b] dark:text-[#2b211a] dark:hover:bg-[#f7f1e8]"
          >
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
            {isAdding ? "Adding" : compact ? "Quick add" : "Add to cart"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;