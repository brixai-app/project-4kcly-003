import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export interface ProductCardProps {
  product?: Product;
  showQuickAdd?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  showQuickAdd = true,
  className = '',
}: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const handleViewDetails = () => {
    if (!product?.slug) return;
    navigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!product) return;
    const defaultVariant = product.variants?.find((v) => v?.inStock) ?? product.variants?.[0];
    addItem(product, {
      labelText: product.name ?? 'Nishant Waters',
      labelColorToken: 'mint',
      quantity: 1,
      selectedVariantId: defaultVariant?.id,
    });
    toast.success('Added to cart', {
      description: `${product.name ?? 'Bottle'} added with default label.`,
    });
    openCart();
  };

  if (!product) return null;

  const primaryTag = product.tags?.[0];

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[16px] bg-[#14241e] border border-[#244337]/60',
        'shadow-[0_18px_45px_rgba(0,0,0,0.55)]',
        className
      )}
      onClick={handleViewDetails}
    >
      <div className="relative overflow-hidden">
        {primaryTag ? (
          <div className="pointer-events-none absolute left-4 top-4 z-10">
            <span className="inline-flex bg-[#0b1411]/80 border border-[#244337]/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#a7d7c4] rounded-sm backdrop-blur">
              {primaryTag}
            </span>
          </div>
        ) : null}
        <div className="aspect-[3/4] w-full overflow-hidden">
          <img
            src={product.imageUrl ?? 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'}
            crossOrigin="anonymous"
            alt={product.name ?? 'Water bottle'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        {product.secondaryImageUrl ? (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <img
              src={product.secondaryImageUrl ?? ''}
              crossOrigin="anonymous"
              alt={`${product.name ?? 'Water bottle'} alternate view`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b1411] via-[#0b1411]/60 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-3">
        <div className="space-y-1">
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#a7d7c4]">
            {product.category ?? 'Still'}
          </p>
          <h3 className="font-['Playfair_Display'] text-lg leading-tight text-[#ecfdf5]">
            {product.name ?? 'Signature Glass Bottle'}
          </h3>
          <p className="text-xs text-[#a7d7c4] line-clamp-2">
            {product.description ?? 'Custom-labeled, small-batch mineral water in hand-finished glass.'}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#ecfdf5]">
              ₹{((product.basePriceCents ?? 25000) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-[#a7d7c4]">
              Includes custom label
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <motion.button
              type="button"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1 rounded-md bg-[#10b981] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-black"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </motion.button>
            {showQuickAdd ? (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-1 rounded-sm border border-[#244337] bg-[#0b1411]/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ecfdf5] opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
              >
                <ShoppingBag className="h-3 w-3" />
                <span>Add</span>
              </motion.button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;