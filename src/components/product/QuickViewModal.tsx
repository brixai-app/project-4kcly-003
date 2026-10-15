import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Product } from "@/types";
import { Button } from "../ui/Button";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { useCartStore } from "@/store/cartStore";
import { validateLabelText } from "@/lib/validators";
import { toast } from "sonner";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const addItem = useCartStore((s) => s.addItem);

  const [size, setSize] = React.useState<string | null>(null);
  const [color, setColor] = React.useState<string | null>(null);
  const [labelText, setLabelText] = React.useState("");
  const [labelError, setLabelError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !product) return;
    setSize(product.availableSizes[0] ?? null);
    setColor(product.availableBottleColors[0] ?? null);
    setLabelText("");
    setLabelError(null);
  }, [open, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    const error = validateLabelText(labelText);
    if (error) {
      setLabelError(error.message);
      toast.error("Please fix label text before adding to cart.");
      return;
    }

    if (!size || !color) {
      toast.error("Please select a size and bottle color.");
      return;
    }

    addItem({
      productId: product.id,
      selectedSize: size,
      selectedBottleColor: color,
      quantity: 1,
      labelDesign: {
        text: labelText || "Nishant Waters",
        font: "Playfair Display",
        color: "#004D40",
        icon: "water droplet",
      },
      price: product.basePrice,
    });

    toast.success("Added to cart (mock). No real order placed.");
    onOpenChange(false);
  };

  const onLabelChange = (value: string) => {
    setLabelText(value);
    const result = validateLabelText(value);
    setLabelError(result ? result.message : null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content asChild>
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-6 left-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 overflow-hidden rounded-3xl bg-[#FAF9F6] shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/60"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="grid h-full grid-cols-1 gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
              <div className="flex flex-col gap-3 border-r border-neutral-200/70 pr-0 md:pr-4">
                <ProductImageCarousel images={product.images} />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="font-['Playfair Display'] text-lg font-semibold tracking-wide text-[#2B2B2B]">
                      {product.name}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.18em] text-[#A89F91]">
                      Quick view · From ${product.basePrice.toFixed(2)}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/70 bg-white text-neutral-500 shadow-sm transition-colors hover:border-[#004D40]/60 hover:text-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/60"
                      aria-label="Close quick view"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <p className="text-xs leading-relaxed text-neutral-700">
                  {product.description}
                </p>

                {/* Size */}
                <div className="mt-1">
                  <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-700">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={
                          "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/60 " +
                          (size === s
                            ? "border-[#004D40] bg-[#004D40] text-white"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-[#004D40]/60")
                        }
                        aria-pressed={size === s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="mt-1">
                  <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-700">
                    Bottle color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.availableBottleColors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={
                          "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/60 " +
                          (color === c
                            ? "border-[#004D40] bg-[#004D40] text-white"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-[#004D40]/60")
                        }
                        aria-pressed={color === c}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Label text */}
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="quick-label-text"
                      className="text-xs font-semibold tracking-wide text-neutral-700"
                    >
                      Label text
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      {labelText.length}/30
                    </span>
                  </div>
                  <input
                    id="quick-label-text"
                    type="text"
                    value={labelText}
                    onChange={(e) => onLabelChange(e.target.value)}
                    placeholder="eg. Nishant Signature Series"
                    className="mt-1 w-full rounded-full border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-800 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#004D40] focus:ring-2 focus:ring-[#004D40]/30"
                  />
                  {labelError && (
                    <p className="mt-1 text-[11px] text-[#b45309]">{labelError}</p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="text-sm">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#A89F91]">
                      From
                    </p>
                    <p className="font-['Playfair Display'] text-lg font-semibold text-[#2B2B2B]">
                      ${product.basePrice.toFixed(2)}
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 bg-[#004D40] text-sm font-medium text-white hover:bg-[#005f52]"
                    onClick={handleAddToCart}
                  >
                    Add to cart (mock)
                  </Button>
                </div>

                <p className="mt-1 text-[10px] text-neutral-500">
                  This is a visual quick view with mock cart. No payment or real
                  order is processed.
                </p>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default QuickViewModal;