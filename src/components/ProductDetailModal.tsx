import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Product, ProductVariant, BottleSizeMl } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface ProductDetailModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product;
}

const sizeOrder: BottleSizeMl[] = [250, 500, 750, 1000];

export function ProductDetailModal({
  open = false,
  onOpenChange,
  product,
}: ProductDetailModalProps) {
  const { addItem, openDrawer } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.find(v => v.id === product?.defaultVariantId) ?? null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeFinish, setActiveFinish] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    const baseVariant =
      product.variants.find(v => v.id === product.defaultVariantId) ??
      product.variants[0] ??
      null;
    setSelectedVariant(baseVariant);
    setQuantity(1);
    setActiveFinish(baseVariant?.finish ?? null);
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant || selectedVariant.stock <= 0) return;
    addItem(product, selectedVariant, quantity);
    toast.success('Added to cart', {
      description: `${product.name} • ${selectedVariant.sizeMl}ml • ${selectedVariant.finish}`,
    });
    openDrawer();
    onOpenChange?.(false);
  };

  const handleSizeChange = (size: BottleSizeMl) => {
    if (!product) return;
    const variantForSize =
      product.variants.find(
        v => v.sizeMl === size && (!activeFinish || v.finish === activeFinish)
      ) ??
      product.variants.find(v => v.sizeMl === size) ??
      null;
    setSelectedVariant(variantForSize);
    if (variantForSize?.finish) setActiveFinish(variantForSize.finish);
  };

  const handleFinishChange = (finish: string) => {
    if (!product) return;
    setActiveFinish(finish);
    if (!selectedVariant) return;
    const variantForFinish =
      product.variants.find(
        v => v.finish === finish && v.sizeMl === selectedVariant.sizeMl
      ) ?? product.variants.find(v => v.finish === finish) ?? null;
    setSelectedVariant(variantForFinish);
  };

  const sortedVariants =
    product?.variants
      ?.slice()
      ?.sort((a, b) => sizeOrder.indexOf(a.sizeMl) - sizeOrder.indexOf(b.sizeMl)) ?? [];

  const uniqueSizes = Array.from(new Set(sortedVariants.map(v => v.sizeMl)));
  const uniqueFinishes = Array.from(new Set(sortedVariants.map(v => v.finish)));

  const mainImage = product?.images?.[0];

  const price = selectedVariant?.price ?? 0;
  const compareAt = selectedVariant?.compareAtPrice;
  const inStock = (selectedVariant?.stock ?? 0) > 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open ? (
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {open ? (
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="relative w-full max-w-5xl rounded-2xl border border-[#E7E1D8] bg-[#F9F6F2] shadow-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onOpenChange?.(false)}
                    className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E1D8] bg-white/80 text-[#5F5A55] hover:bg-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-full bg-[#F3ECE4]">
                      {mainImage ? (
                        <img
                          src={mainImage.url}
                          alt={mainImage.alt}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#5F5A55]">
                          No image
                        </div>
                      )}
                      {product?.isLimited ? (
                        <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#0B3D91] uppercase">
                          Limited Release
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-5 p-6 md:p-8 bg-white">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.25em] text-[#5F5A55] uppercase">
                          Nishant Waters • {product?.category ?? 'Collection'}
                        </p>
                        <Dialog.Title className="text-2xl md:text-3xl font-light tracking-tight text-[#1F1F1F]">
                          {product?.name ?? 'Selected Water'}
                        </Dialog.Title>
                        {product?.tagline ? (
                          <Dialog.Description className="text-sm text-[#5F5A55]">
                            {product.tagline}
                          </Dialog.Description>
                        ) : null}
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-semibold text-[#1F1F1F]">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          {compareAt && compareAt > price ? (
                            <span className="text-xs text-[#5F5A55] line-through">
                              ₹{compareAt.toLocaleString('en-IN')}
                            </span>
                          ) : null}
                        </div>
                        <span
                          className={cn(
                            'text-xs font-medium tracking-[0.18em] uppercase',
                            inStock ? 'text-emerald-700' : 'text-[#5F5A55]'
                          )}
                        >
                          {inStock ? 'In Stock' : 'Waitlist'}
                        </span>
                      </div>
                      {product?.description ? (
                        <p className="text-sm leading-relaxed text-[#5F5A55] line-clamp-4">
                          {product.description}
                        </p>
                      ) : null}
                      <div className="grid grid-cols-1 gap-4 text-xs text-[#5F5A55]">
                        <div className="flex items-center gap-3">
                          <span className="w-20 font-semibold tracking-[0.18em] uppercase">
                            Profile
                          </span>
                          <span className="text-[13px]">
                            {product?.meta?.hydrationProfile ?? 'Balanced'} hydration
                          </span>
                        </div>
                        {product?.meta?.originRegion ? (
                          <div className="flex items-center gap-3">
                            <span className="w-20 font-semibold tracking-[0.18em] uppercase">
                              Origin
                            </span>
                            <span className="text-[13px]">
                              {product.meta.originRegion}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-4">
                        {uniqueSizes.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#5F5A55] uppercase">
                              Size
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {uniqueSizes.map(size => {
                                const isActive = selectedVariant?.sizeMl === size;
                                return (
                                  <button
                                    type="button"
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    className={cn(
                                      'inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                                      isActive
                                        ? 'border-[#0B3D91] bg-[#0B3D91] text-white'
                                        : 'border-[#E7E1D8] bg-white text-[#1F1F1F] hover:border-[#0B3D91]'
                                    )}
                                  >
                                    {size}ml
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                        {uniqueFinishes.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#5F5A55] uppercase">
                              Finish
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {uniqueFinishes.map(finish => {
                                const isActive = activeFinish === finish;
                                return (
                                  <button
                                    type="button"
                                    key={finish}
                                    onClick={() => handleFinishChange(finish)}
                                    className={cn(
                                      'inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                                      isActive
                                        ? 'border-[#0B3D91] bg-[#0B3D91] text-white'
                                        : 'border-[#E7E1D8] bg-white text-[#1F1F1F] hover:border-[#0B3D91]'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'h-2 w-2 rounded-full border border-black/10',
                                        finish === 'Matte' && 'bg-neutral-300',
                                        finish === 'Gloss' && 'bg-neutral-100',
                                        finish === 'Frosted' && 'bg-slate-200'
                                      )}
                                    />
                                    {finish}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-col gap-3 border-t border-[#E7E1D8] pt-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="inline-flex items-center rounded-full border border-[#E7E1D8] bg-[#F9F6F2] px-2 py-1 text-[11px] text-[#5F5A55]">
                            <Check className="mr-1 h-3 w-3 text-emerald-600" />
                            Includes custom label engraving
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] tracking-[0.22em] text-[#5F5A55] uppercase">
                              Qty
                            </span>
                            <div className="flex items-center rounded-full border border-[#E7E1D8] bg-white px-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(prev => (prev > 1 ? prev - 1 : 1))
                                }
                                className="flex h-7 w-7 items-center justify-center text-[#5F5A55] hover:text-[#1F1F1F]"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-medium text-[#1F1F1F]">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(prev =>
                                    prev < (selectedVariant?.stock ?? 99)
                                      ? prev + 1
                                      : prev
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center text-[#5F5A55] hover:text-[#1F1F1F]"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          disabled={!inStock || !selectedVariant}
                          className={cn(
                            'inline-flex items-center justify-center rounded-xl px-4 py-3 text-xs font-semibold tracking-[0.22em] uppercase transition-colors',
                            inStock && selectedVariant
                              ? 'bg-[#0B3D91] text-white hover:bg-[#072E6D]'
                              : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                          )}
                        >
                          {inStock ? 'Add to Cart' : 'Join Waitlist'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;