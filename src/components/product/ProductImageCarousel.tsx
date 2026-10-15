import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types";

interface ProductImageCarouselProps {
  images: ProductImage[];
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
}) => {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  const count = images.length || 1;

  const showPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + count) % count);
  };

  const showNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % count);
  };

  const goTo = (idx: number) => {
    if (idx === index) return;
    setDirection(idx > index ? 1 : -1);
    setIndex(idx);
  };

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const current = images[index] ?? images[0];

  return (
    <section
      aria-label="Product images"
      className="flex flex-col gap-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-[#FAF9F6] shadow-sm">
        <button
          type="button"
          onClick={showPrev}
          aria-label="Previous image"
          className="group absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-[#004D40] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/60"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={showNext}
          aria-label="Next image"
          className="group absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-[#004D40] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/60"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="aspect-[4/5] w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={current?.url}
              src={current?.url}
              alt={current?.alt ?? "Product image"}
              className="h-full w-full object-cover"
              custom={direction}
              initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Select image">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-[#FAF9F6] transition-colors",
                i === index
                  ? "border-[#004D40] shadow-sm"
                  : "border-neutral-200/70 hover:border-[#004D40]/60"
              )}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            >
              <img
                src={img.url}
                alt={img.alt ?? `Product thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductImageCarousel;