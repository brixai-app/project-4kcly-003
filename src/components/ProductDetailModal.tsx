import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Circle as ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';

export interface ProductDetailModalProps {
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const volumeLabel = (variant?: ProductVariant | null) =>
  variant?.volumeMl ? `${variant.volumeMl} ml` : 'Select volume';

const finishLabel = (variant?: ProductVariant | null) =>
  variant?.finish ? `${variant.finish.charAt(0).toUpperCase()}${variant.finish.slice(1)}` : 'Finish';

export function ProductDetailModal({
  product = null,
  open = false,
  onOpenChange,
}: ProductDetailModalProps) {
  const { addToCart, openCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = useMemo(() => {
    if (!product) return [];
    const base = [product.heroImage, ...(product.images ?? [])];
    const map = new Map<string, typeof base[0]>();
    base.forEach(img => {
      if (img?.id && !map.has(img.id)) {
        map.set(img.id, img);
      }
    });
    return Array.from(map.values());
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    if (selectedVariantId) {
      return product.variants.find(v => v.id === selectedVariantId) ?? product.variants[0] ?? null;
    }
    return product.variants.find(v => v.isDefault) ?? product.variants[0] ?? null;
  }, [product, selectedVariantId]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant || selectedVariant.stock <= 0) return;
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      unitPriceAmount: selectedVariant.price.amount,
    });
    toast.success('Added to cart', {
      description: `${product.name} • ${volumeLabel(selectedVariant)} • ${finishLabel(
        selectedVariant,
      )}`,
    });
    openCart();
  };

  const disabled = !product || !selectedVariant || selectedVariant.stock <= 0;

  const handleQtyChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (selectedVariant?.stock) return Math.min(next, selectedVariant.stock);
      return next;
    });
  };

  const handleImageNav = (direction: 'prev' | 'next') => {
    if (!images.length) return;
    setActiveImageIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? images.length - 1 : prev - 1;
      }
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-[#F7F1E8] shadow-2xl border-l border-[#DED5C8] focus:outline-none"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.32 }}
              >
                <div className="flex h-full flex-col">
                  <header className="flex items-center justify-between border-b border-[#DED5C8] px-6 py-4">
                    <div className="flex flex-col">
                      <Dialog.Title className="text-lg font-semibold tracking-tight text-[#141310]">
                        {product?.name ?? 'Bottle detail'}
                      </Dialog.Title>
                      {product?.meta?.collection && (
                        <span className="text-xs uppercase tracking-[0.16em] text-[#5D584F]">
                          {product.meta.collection}
                        </span>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DED5C8] bg-white text-[#141310] hover:bg-[#F7F1E8] transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </header>

                  <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 overflow-hidden">
                    <div className="relative border-b lg:border-b-0 lg:border-r border-[#DED5C8] bg-[#F7F1E8]/60">
                      <div className="relative h-full w-full">
                        {images[activeImageIndex] && (
                          <motion.img
                            key={images[activeImageIndex]?.id}
                            src={images[activeImageIndex]?.url ?? ''}
                            alt={images[activeImageIndex]?.alt ?? product?.name ?? 'Bottle'}
                            crossOrigin="anonymous"
                            className="h-full w-full object-cover"
                            initial={{ opacity: 0.4, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                          />
                        )}
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleImageNav('prev')}
                              className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#141310] shadow hover:bg-white"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleImageNav('next')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#141310] shadow hover:bg-white"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                              {images.map((img, index) => (
                                <span
                                  key={img?.id ?? index}
                                  className={cn(
                                    'h-1.5 w-4 rounded-full bg-white/50',
                                    index === activeImageIndex && 'bg-[#0E4A3A]',
                                  )}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        {product?.meta?.badges && product.meta.badges.length > 0 && (
                          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                            {product.meta.badges.slice(0, 3).map(badge => (
                              <span
                                key={badge}
                                className="rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#141310]"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col bg-[#F7F1E8]/80">
                      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
                        {product && (
                          <>
                            <div>
                              <p className="text-sm text-[#5D584F]">
                                {product.shortDescription}
                              </p>
                              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                                {product.tags?.slice(0, 4).join(' • ')}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-end justify-between">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-serif text-2xl text-[#141310]">
                                    {selectedVariant
                                      ? new Intl.NumberFormat('en-IN', {
                                          style: 'currency',
                                          currency: selectedVariant.price.currency,
                                          maximumFractionDigits: 0,
                                        }).format(selectedVariant.price.amount)
                                      : '--'}
                                  </span>
                                  {selectedVariant?.price.compareAtAmount && (
                                    <span className="text-sm text-[#5D584F] line-through">
                                      {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: selectedVariant.price.currency,
                                        maximumFractionDigits: 0,
                                      }).format(selectedVariant.price.compareAtAmount)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-[#5D584F]">
                                  {selectedVariant?.stock
                                    ? `${selectedVariant.stock} bottles available`
                                    : 'Made to order'}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                                  Volume
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {product.variants.map(v => (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => setSelectedVariantId(v.id)}
                                      className={cn(
                                        'min-w-[72px] rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors',
                                        selectedVariant?.id === v.id
                                          ? 'border-[#0E4A3A] bg-[#0E4A3A] text-white'
                                          : 'border-[#DED5C8] bg-white text-[#141310] hover:border-[#0E4A3A]/70',
                                      )}
                                    >
                                      {v.volumeMl} ml
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#5D584F]">
                                  Finish
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {Array.from(
                                    new Set(product.variants.map(v => v.finish)),
                                  ).map(finish => (
                                    <button
                                      key={finish}
                                      type="button"
                                      onClick={() => {
                                        const candidate = product.variants.find(
                                          v => v.finish === finish,
                                        );
                                        if (candidate) setSelectedVariantId(candidate.id);
                                      }}
                                      className={cn(
                                        'rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors',
                                        selectedVariant?.finish === finish
                                          ? 'border-[#0E4A3A] bg-[#0E4A3A] text-white'
                                          : 'border-[#DED5C8] bg-white text-[#141310] hover:border-[#0E4A3A]/70',
                                      )}
                                    >
                                      {finish}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3 border-t border-[#DED5C8] pt-4">
                              <p className="text-sm text-[#141310]">
                                {product.description.slice(0, 260)}
                                {product.description.length > 260 ? '…' : ''}
                              </p>
                              {product.meta?.tastingNotes && (
                                <div className="flex flex-wrap gap-2">
                                  {product.meta.tastingNotes.slice(0, 4).map(note => (
                                    <span
                                      key={note}
                                      className="rounded-full bg-white px-3 py-1 text-xs text-[#5D584F]"
                                    >
                                      {note}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="border-t border-[#DED5C8] bg-[#F7F1E8]/95 px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center border border-[#DED5C8] rounded-full bg-white">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(-1)}
                              className="h-9 w-9 rounded-l-full text-[#141310] hover:bg-[#F7F1E8]"
                            >
                              -
                            </button>
                            <span className="min-w-[32px] text-center text-sm text-[#141310]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(1)}
                              className="h-9 w-9 rounded-r-full text-[#141310] hover:bg-[#F7F1E8]"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={disabled}
                            className={cn(
                              'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
                              disabled
                                ? 'bg-[#DED5C8] text-[#5D584F] cursor-not-allowed'
                                : 'bg-[#0E4A3A] text-white hover:bg-[#0B3E31]',
                            )}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            <span>{disabled ? 'Sold out' : 'Add to cart'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ProductDetailModal;