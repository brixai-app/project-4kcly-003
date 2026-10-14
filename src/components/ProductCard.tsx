import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export interface ProductCardProps {
  product?: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
}

function getDefaultVariant(product: Product): ProductVariant | undefined {
  const variant =
    product.variants.find(v => v.id === product.defaultVariantId) ??
    product.variants[0];
  return variant;
}

export function ProductCard({
  product,
  onQuickView,
  className,
}: ProductCardProps) {
  const { addItem, openDrawer } = useCart();

  if (!product) {
    return (
      <div className="aspect-[3/4] w-full rounded-2xl border border-[#E7E1D8] bg-[#F9F6F2] animate-pulse" />
    );
  }

  const primaryImage = product.images[0];

  const handleAddToCart = () => {
    const variant = getDefaultVariant(product);
    if (!variant) return;
    addItem(product, variant, 1);
    toast.success('Added to cart', {
      description: `${product.name} · ${variant.sizeMl}ml · ${variant.finish}`,
    });
    openDrawer();
  };

  const handleQuickView = () => {
    if (!onQuickView) return;
    onQuickView(product);
  };

  const defaultVariant = getDefaultVariant(product);
  const price = defaultVariant?.price ?? 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group flex flex-col rounded-2xl border border-[#E7E1D8] bg-white overflow-hidden cursor-pointer',
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F6F2]">
        {primaryImage ? (
          <motion.img
            src={primaryImage.url}
            alt={primaryImage.alt}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            whileHover={{ scale: 1.03 }}
          />
        ) : (
          <div className="h-full w-full bg-[#F9F6F2]" />
        )}
        {product.isLimited && (
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-[#E7E1D8]/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5F5A55] backdrop-blur-sm">
            Limited
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            className="pointer-events-auto inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0B3D91] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#072E6D]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Quick Add</span>
          </button>
          <button
            type="button"
            onClick={handleQuickView}
            className="pointer-events-auto inline-flex items-center justify-center rounded-lg bg-white/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1F1F1F] backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-[450] text-[15px] tracking-tight text-[#1F1F1F]">
              {product.name}
            </h3>
            {product.tagline && (
              <p className="mt-0.5 line-clamp-1 text-[12px] text-[#5F5A55]">
                {product.tagline}
              </p>
            )}
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5F5A55]">
              {product.category} • {defaultVariant?.sizeMl ?? ''}ml •{' '}
              {defaultVariant?.finish ?? ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[#1F1F1F]">
              ₹{price.toLocaleString('en-IN')}
            </p>
            {defaultVariant?.compareAtPrice &&
              defaultVariant.compareAtPrice > price && (
                <p className="text-[11px] text-[#5F5A55] line-through">
                  ₹{defaultVariant.compareAtPrice.toLocaleString('en-IN')}
                </p>
              )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;