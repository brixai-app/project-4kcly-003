import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '@/data/mockData';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart, openDesignStudio } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const product: Product | undefined = useMemo(
    () => products?.find(p => p.id === id || p.slug === id),
    [id]
  );

  const variant: ProductVariant | undefined = useMemo(() => {
    if (!product) return undefined;
    if (selectedVariantId) {
      return product.variants.find(v => v.id === selectedVariantId) ?? product.variants[0];
    }
    return product.variants.find(v => v.isDefault) ?? product.variants[0];
  }, [product, selectedVariantId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F7F1E8] flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 flex-1 flex flex-col">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-[#5D584F] hover:text-[#141310]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex-1 flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-light text-[#141310] tracking-tight">
                  Bottle not found.
                </h1>
                <p className="text-[#5D584F] text-base leading-relaxed">
                  The edition you’re looking for may have been decanted elsewhere. Explore our
                  current collection instead.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#0E4A3A] text-white text-xs tracking-[0.2em] uppercase"
                >
                  <span>Browse Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#DED5C8]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!variant) return;
    addToCart({
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      unitPriceAmount: variant.price.amount,
    });
    toast.success('Added to cart', {
      description: `${product.name} • ${variant.volumeMl}ml · ${variant.finish}`,
    });
    openCart();
  };

  const handleCustomize = () => {
    openDesignStudio();
    toast.message('Label Studio', {
      description: 'Design your custom label, then return here to add it to your order.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-10 flex-1 flex flex-col">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-[#5D584F] hover:text-[#141310]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to flow</span>
        </button>

        <div className="mt-6 lg:mt-10 grid grid-cols-12 gap-10 lg:gap-14 flex-1">
          <motion.div
            className="col-span-12 lg:col-span-7 flex flex-col gap-4"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#DED5C8]">
              <img
                src={product.heroImage.url}
                alt={product.heroImage.alt ?? product.name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover scale-100 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-6 bottom-6 flex justify-between items-end text-xs text-[#F7F1E8]">
                <div className="space-y-1">
                  <span className="inline-block px-2 py-1 rounded-md bg-black/40 backdrop-blur text-[10px] tracking-[0.2em] uppercase">
                    Nishant Waters
                  </span>
                  <p className="max-w-xs text-sm leading-relaxed text-[#F7F1E8]">
                    {product.shortDescription}
                  </p>
                </div>
                {product.meta?.collection && (
                  <div className="px-3 py-2 rounded-md bg-black/40 backdrop-blur text-right">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[#DED5C8]">
                      Collection
                    </p>
                    <p className="text-sm text-white">{product.meta.collection}</p>
                  </div>
                )}
              </div>
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.slice(1, 4).map(img => (
                  <div key={img.id} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#DED5C8]">
                    <img
                      src={img.url}
                      alt={img.alt ?? product.name}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="col-span-12 lg:col-span-5 flex flex-col justify-between gap-10"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.28em] uppercase text-[#5D584F]">
                  {product.meta?.sourceRegion ?? 'Curated Aquifers'}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#141310] tracking-tight">
                  {product.name}
                </h1>
              </div>
              <p className="text-sm md:text-base leading-relaxed text-[#5D584F]">
                {product.description}
              </p>

              <div className="pt-3 space-y-4 border-t border-[#DED5C8]">
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        'px-3 py-2 rounded-md border text-xs tracking-[0.16em] uppercase',
                        selectedVariantId
                          ? selectedVariantId === v.id
                            ? 'border-[#0E4A3A] bg-white text-[#141310]'
                            : 'border-[#DED5C8] bg-transparent text-[#5D584F]'
                          : v.isDefault
                          ? 'border-[#0E4A3A] bg-white text-[#141310]'
                          : 'border-[#DED5C8] bg-transparent text-[#5D584F]'
                      )}
                    >
                      {v.volumeMl}ml · {v.finish}
                    </button>
                  ))}
                </div>

                {variant && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs tracking-[0.22em] uppercase text-[#5D584F]">
                        Edition Price
                      </p>
                      <p className="text-xl font-semibold text-[#141310]">
                        {variant.price.currency === 'INR' ? '₹' : '$'}
                        {variant.price.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right text-xs text-[#5D584F]">
                      <p>{variant.stock > 8 ? 'In atelier' : `${variant.stock} bottles left`}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 rounded-md bg-[#0E4A3A] text-white text-xs tracking-[0.22em] uppercase"
                >
                  <span>Add to Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCustomize}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md border border-[#DED5C8] bg-white text-xs tracking-[0.22em] uppercase text-[#141310]"
                >
                  <Sparkles className="w-4 h-4 text-[#0E4A3A]" />
                  <span>Customize Label</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs text-[#5D584F] pt-3 border-t border-[#DED5C8]">
                <div>
                  <p className="tracking-[0.22em] uppercase mb-1">Minerality</p>
                  <p className="text-sm">
                    {product.meta?.mineralProfile ?? 'Soft, linen-clean finish with restrained salinity.'}
                  </p>
                </div>
                <div>
                  <p className="tracking-[0.22em] uppercase mb-1">pH</p>
                  <p className="text-sm">{product.meta?.phLevel ?? 7.4}</p>
                </div>
                <div>
                  <p className="tracking-[0.22em] uppercase mb-1">Notes</p>
                  <p className="text-sm">
                    {product.meta?.tastingNotes?.slice(0, 2).join(' • ') ?? 'Limestone · Alpine mist'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;