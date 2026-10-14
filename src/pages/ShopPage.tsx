import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sliders } from 'lucide-react';
import { products as allProducts, collectionTags } from '@/data/mockData';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import CustomizeDrawer from '@/components/CustomizeDrawer';

export interface ShopPageProps {
  onSelectProduct?: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc';

export function ShopPage({ onSelectProduct }: ShopPageProps) {
  const [sort, setSort] = useState<SortOption>('featured');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [customizeOpen, setCustomizeOpen] = useState<boolean>(false);

  const sortedProducts = useMemo(() => {
    let filtered = [...(allProducts ?? [])];
    if (tagFilter !== 'All') {
      filtered = filtered.filter(p => p?.tags?.includes(tagFilter));
    }
    if (sort === 'price-asc') {
      filtered.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
    } else {
      filtered.sort((a, b) => Number((b?.featured ?? false)) - Number((a?.featured ?? false)));
    }
    return filtered;
  }, [sort, tagFilter]);

  const handleCustomize = (product: Product) => {
    setSelectedProduct(product);
    setCustomizeOpen(true);
    onSelectProduct?.(product);
  };

  const sections = useMemo(() => {
    const mid = Math.ceil(sortedProducts.length / 2);
    return [sortedProducts.slice(0, mid), sortedProducts.slice(mid)];
  }, [sortedProducts]);

  return (
    <div className="min-h-screen bg-[#f4e9dc]">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-16">
        <div className="flex flex-col gap-6 border-b border-[#e6d8c8] pb-6">
          <div className="flex flex-col gap-2">
            <motion.h1
              className="font-[Sora] text-3xl md:text-4xl tracking-tight text-[#0b1f2a]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              Bottles for every ritual.
            </motion.h1>
            <p className="max-w-xl font-[Lora] text-sm text-[#4b5a63]">
              Curated silhouettes and finishes for desks, retreats, and dinner tables.
              Customize labels on any bottle in a single glide.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[Sora] text-xs uppercase tracking-[0.2em] text-[#4b5a63]">
                Filter
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-[#e6d8c8] bg-[#fff7ee] px-3 py-1.5 text-xs font-[Sora] uppercase tracking-[0.16em] text-[#0b1f2a]"
              >
                <Sliders className="h-3 w-3" />
                <span>Collection</span>
              </button>
              <div className="flex flex-wrap gap-1.5">
                {['All', ...(collectionTags ?? [])].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTagFilter(tag)}
                    className={cn(
                      'rounded-md border px-3 py-1 text-xs font-[Sora] tracking-[0.16em]',
                      tagFilter === tag
                        ? 'border-[#004e89] bg-[#004e89] text-[#ffffff]'
                        : 'border-[#e6d8c8] bg-[#fff7ee] text-[#4b5a63]'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="font-[Sora] text-xs uppercase tracking-[0.2em] text-[#4b5a63]">
                Sort by
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="appearance-none rounded-md border border-[#e6d8c8] bg-[#fff7ee] px-3 py-2 pr-8 text-xs font-[Sora] tracking-[0.16em] text-[#0b1f2a]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price · Low to High</option>
                  <option value="price-desc">Price · High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#4b5a63]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-12">
          {sections.map((group, idx) => (
            <section
              key={idx}
              className={cn(
                'rounded-[18px] px-4 py-6 md:px-6 md:py-8',
                idx % 2 === 0 ? 'bg-[#fff7ee]' : 'bg-[#fdf3e4]'
              )}
            >
              <div className="grid gap-6 md:grid-cols-3">
                {group.map(product => (
                  <motion.div
                    key={product?.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ProductCard
                      product={product}
                      onCustomize={handleCustomize}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <CustomizeDrawer
        open={customizeOpen}
        onOpenChange={setCustomizeOpen}
        product={selectedProduct}
      />
    </div>
  );
}

export default ShopPage;