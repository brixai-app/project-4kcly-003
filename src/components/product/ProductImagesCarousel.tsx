import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImagesCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

export const ProductImagesCarousel: React.FC<ProductImagesCarouselProps> = ({
  images,
  productName,
  className,
}) => {
  const validImages = useMemo(
    () => (images && images.length > 0 ? images : ["https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg"]),
    [images]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [validImages.length]);

  const goTo = useCallback(
    (next: number) => {
      if (validImages.length === 0) return;
      const normalized = ((next % validImages.length) + validImages.length) % validImages.length;
      setIndex(normalized);
    },
    [validImages.length]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <section
      aria-label={`${productName} imagery`}
      className={cn("flex flex-col gap-3", className)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[rgba(160,82,45,0.25)] bg-[#FFF8F0] shadow-md focus-within:ring-2 focus-within:ring-[rgba(64,224,208,0.7)] focus-within:ring-offset-2 focus-within:ring-offset-[#FFF8F0]"
      >
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-roledescription="carousel"
          aria-label={`${productName} image carousel`}
          aria-live="polite"
          className="relative h-80 w-full cursor-pointer outline-none sm:h-[420px]"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={validImages[index] + index}
              src={validImages[index]}
              alt={`${productName} view ${index + 1} of ${validImages.length}`}
              className="h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </AnimatePresence>

          {/* Controls */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-[rgba(255,248,240,0.95)] text-[rgba(87,65,47,0.9)] shadow-sm",
                  "hover:bg-[rgba(244,225,210,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,224,208,0.7)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
                )}
                aria-label="Previous image"
                onClick={() => goTo(index - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-[rgba(255,248,240,0.95)] text-[rgba(87,65,47,0.9)] shadow-sm",
                  "hover:bg-[rgba(244,225,210,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,224,208,0.7)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
                )}
                aria-label="Next image"
                onClick={() => goTo(index + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[rgba(0,0,0,0.28)] px-2.5 py-1 text-xs font-medium text-white">
                {index + 1} / {validImages.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex flex-wrap gap-2" aria-label="Select image variant">
          {validImages.map((src, i) => {
            const isActive = i === index;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "relative h-16 w-16 overflow-hidden rounded-xl border transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,224,208,0.7)] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFF8F0]",
                  isActive
                    ? "border-[rgba(160,82,45,0.9)] shadow-sm"
                    : "border-[rgba(160,82,45,0.25)] hover:border-[rgba(160,82,45,0.7)]"
                )}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={isActive}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                {isActive && (
                  <div className="pointer-events-none absolute inset-0 ring-2 ring-[rgba(64,224,208,0.9)] ring-offset-2 ring-offset-[#FFF8F0]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductImagesCarousel;