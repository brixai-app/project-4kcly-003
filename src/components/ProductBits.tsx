import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, CustomLabel } from '@/mock';
import { MotionButton, Card, Badge, H2, cn } from './ui';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 18px 40px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-3xl bg-[#FAF9F6] shadow-md',
        'ring-1 ring-[#D9CBB6]/60',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse',
      )}
    >
      <div className="relative w-full md:w-1/2 overflow-hidden bg-[#D9CBB6]/40">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-64 w-full object-cover md:h-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
        <Badge className="absolute left-4 top-4 bg-[#0E4D5B] text-[#FAF9F6]">
          from ${product.basePrice.toFixed(2)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6 md:p-8">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold font-['Poppins'] text-[#0E4D5B]">
            {product.name}
          </h3>
          <p className="text-sm font-['Merriweather'] text-slate-700 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.availableColors.slice(0, 4).map(color => (
              <span
                key={color}
                className="h-6 w-6 rounded-full border border-black/5 shadow-sm"
                style={{ backgroundColor: color }}
                aria-label="Bottle color option"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-['Merriweather'] text-slate-800">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7A9E7E]">Hydrate in style</span>
          </div>
          <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
            <MotionButton
              variant="secondary"
              className="bg-[#FF6F61] text-[#FAF9F6] hover:bg-[#e76356] rounded-full px-5"
            >
              View details
            </MotionButton>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

interface ProductMasonryGridProps {
  products: Product[];
}

export const ProductMasonryGrid: React.FC<ProductMasonryGridProps> = ({ products }) => {
  return (
    <div className="space-y-10">
      {products.map((product, index) => {
        const rowBg = index % 2 === 0 ? 'bg-[#FAF9F6]' : 'bg-[#D9CBB6]/40';
        return (
          <section
            key={product.id}
            className={cn(
              'rounded-[2.25rem] px-4 py-6 md:px-6 md:py-8',
              rowBg,
            )}
          >
            <ProductCard product={product} index={index} />
          </section>
        );
      })}
    </div>
  );
};

interface FeaturedProductsGridProps {
  products: Product[];
}

export const FeaturedProductsGrid: React.FC<FeaturedProductsGridProps> = ({ products }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between">
        <H2 className="text-[#0E4D5B]">Featured bottles</H2>
        <span className="text-xs font-['Merriweather'] uppercase tracking-[0.2em] text-slate-500">
          Hand-picked bestsellers
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#FAF9F6]">
              <div className="relative h-44 overflow-hidden bg-[#D9CBB6]/40">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2">
                  <h3 className="font-['Poppins'] text-lg font-semibold text-[#0E4D5B]">
                    {product.name}
                  </h3>
                  <p className="line-clamp-2 text-sm font-['Merriweather'] text-slate-700">
                    {product.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-['Merriweather'] text-sm text-slate-900">
                    from ${product.basePrice.toFixed(2)}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <MotionButton
                      variant="primary"
                      className="rounded-full bg-[#0E4D5B] px-4 text-xs text-[#FAF9F6] hover:bg-[#0c404c]"
                    >
                      Customize
                    </MotionButton>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

interface ProductImagesCarouselProps {
  images: string[];
}

export const ProductImagesCarousel: React.FC<ProductImagesCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const goTo = (index: number) => {
    if (index < 0 || index >= images.length) return;
    setActiveIndex(index);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  return (
    <section aria-label="Product images" className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl bg-[#D9CBB6]/60">
        <img
          src={images[activeIndex]}
          alt={`Product view ${activeIndex + 1}`}
          className="h-80 w-full object-cover md:h-[26rem]"
        />
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF9F6]/90 text-[#0E4D5B] shadow-md disabled:opacity-40"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === images.length - 1}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF9F6]/90 text-[#0E4D5B] shadow-md disabled:opacity-40"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-1.5 pb-3">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                'h-1.5 w-4 rounded-full bg-black/10',
                idx === activeIndex && 'bg-[#FF6F61] w-6',
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto" aria-label="Select image variant">
        {images.map((src, idx) => (
          <button
            key={src + idx}
            type="button"
            onClick={() => goTo(idx)}
            className={cn(
              'h-16 w-16 min-w-[4rem] overflow-hidden rounded-2xl border-2 border-transparent',
              idx === activeIndex && 'border-[#0E4D5B]',
            )}
          >
            <img src={src} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
};

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold font-['Poppins'] text-[#0E4D5B] md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm font-['Merriweather'] text-slate-700 leading-relaxed">
          {product.description}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-2xl font-semibold font-['Merriweather'] text-[#0E4D5B]">
          ${product.basePrice.toFixed(2)}
        </span>
        <span className="text-xs font-['Merriweather'] uppercase tracking-[0.25em] text-[#7A9E7E]">
          Custom label included
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-['Merriweather'] uppercase tracking-[0.25em] text-slate-500">
          Bottle base hues
        </p>
        <div className="flex flex-wrap gap-2">
          {product.availableColors.map(color => (
            <span
              key={color}
              className="h-7 w-7 rounded-full border border-black/5 shadow-sm"
              style={{ backgroundColor: color }}
              aria-label="Bottle color option"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CustomizeLabelButtonProps {
  onClick: () => void;
}

export const CustomizeLabelButton: React.FC<CustomizeLabelButtonProps> = ({ onClick }) => {
  return (
    <MotionButton
      onClick={onClick}
      className="mt-6 w-full rounded-full bg-[#FF6F61] py-3 text-sm font-semibold font-['Poppins'] text-[#FAF9F6] shadow-md hover:bg-[#e76356]"
    >
      Customize your label
    </MotionButton>
  );
};

export type { Product, CustomLabel };