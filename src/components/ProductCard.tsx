import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export interface ProductCardProps {
  product?: Product;
  onCustomize?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  onCustomize,
  className = '',
}: ProductCardProps) {
  if (!product) {
    return null;
  }

  const handleCustomize = () => {
    onCustomize?.(product);
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[18px] border border-[#e6d8c8] bg-[#fff7ee] shadow-sm',
        'hover:shadow-xl transition-shadow duration-300',
        className
      )}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[3/4] w-full bg-[#f4e9dc]">
          <img
            src={product.imageUrl}
            crossOrigin="anonymous"
            alt={product.name}
            className={cn(
              'h-full w-full object-cover',
              'transition-transform duration-500 ease-out',
              'group-hover:scale-105'
            )}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1f2a]/35 via-transparent to-transparent opacity-0 
          group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-['Sora'] text-lg font-light tracking-tight text-[#0b1f2a]">
              {product.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#4b5a63]">
              {product.volumeMl} ml • {product.tags?.[0] ?? 'Signature'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-['Sora'] text-base font-semibold text-[#0b1f2a]">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 font-['Lora'] text-xs text-[#4b5a63]">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div
            className="h-6 w-6 rounded-full border border-[#e6d8c8]"
            style={{ backgroundColor: product.accentColor ?? '#004e89' }}
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-3 py-1.5',
              'border border-[#0b1f2a] bg-[#0b1f2a] text-xs font-semibold uppercase tracking-[0.24em]',
              'text-[#ffffff] shadow-sm',
              'hover:bg-[#004e89] hover:border-[#004e89]',
              'transition-colors duration-200'
            )}
            onClick={handleCustomize}
          >
            <span>Customize Label</span>
            <ArrowRight className="h-3 w-3" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;