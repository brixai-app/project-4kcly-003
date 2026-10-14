import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Sliders, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  bottleFinishes,
  bottleSizes,
  categories,
  filterAndSortProducts,
  products,
} from '@/data/mockData';
import type {
  BottleFinish,
  BottleSizeMl,
  Product,
  ProductCategory,
  ProductFilters,
  SortOption,
} from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';

export interface ShopPageProps {
  className?: string;
}

function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setParams = (next: Record<string, string | string[] | undefined>) => {
    const newParams = new URLSearchParams(location.search);
    Object.keys(next).forEach(key => {
      const value = next[key];
      newParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v) newParams.append(key, v);
        });
      } else if (typeof value === 'string' && value.length > 0) {
        newParams.set(key, value);
      }
    });
    navigate({ search: newParams.toString() }, { replace: true });
  };

  return { params, setParams };
}

function parseFiltersFromParams(params: URLSearchParams): ProductFilters {
  const searchQuery = params.get('q') ?? undefined;
  const sortBy = (params.get('sortBy') as SortOption) ?? 'featured';

  const categoriesParam = params.getAll('category') ?? [];
  const sizesParam = params.getAll('size') ?? [];
  const finishesParam = params.getAll('finish') ?? [];

  const categoriesCast = categoriesParam.filter(Boolean) as ProductCategory[];
  const sizesCast = sizesParam
    .map(v => Number(v))
    .filter(v => !!v) as BottleSizeMl[];
  const finishesCast = finishesParam.filter(Boolean) as BottleFinish[];

  return {
    searchQuery,
    categories: categoriesCast.length ? categoriesCast : undefined,
    sizes: sizesCast.length ? sizesCast : undefined,
    finishes: finishesCast.length ? finishesCast : undefined,
    sortBy,
  };
}

function sortOptions(): { value: SortOption; label: string }[] {
  return [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];
}

export function ShopPage({ className = '' }: ShopPageProps) {
  const { params, setParams } = useQueryParams();
  const [filters, setFilters] = useState<ProductFilters>(() => parseFiltersFromParams(params));
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    setFilters(prev => {
      const next = parseFiltersFromParams(params);
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
  }, [params]);

  const handleUpdateFilters = (partial: Partial<ProductFilters>) => {
    setFilters(prev => {
      const next: ProductFilters = { ...prev, ...partial };
      setParams({
        q: next.searchQuery ?? '',
        sortBy: next.sortBy ?? 'featured',
        category: next.categories ?? [],
        size: (next.sizes ?? []).map(size => String(size)),
        finish: next.finishes ?? [],
      });
      return next;
    });
  };

  const handleToggleCategory = (category: ProductCategory) => {
    handleUpdateFilters({
      categories: (filters.categories ?? []).includes(category)
        ? (filters.categories ?? []).filter(c => c !== category)
        : [...(filters.categories ?? []), category],
    });
  };

  const handleToggleSize = (size: BottleSizeMl) => {
    handleUpdateFilters({
      sizes: (filters.sizes ?? []).includes(size)
        ? (filters.sizes ?? []).filter(s => s !== size)
        : [...(filters.sizes ?? []), size],
    });
  };

  const handleToggleFinish = (finish: BottleFinish) => {
    handleUpdateFilters({
      finishes: (filters.finishes ?? []).includes(finish)
        ? (filters.finishes ?? []).filter(f => f !== finish)
        : [...(filters.finishes ?? []), finish],
    });
  };

  const handleSearchChange = (value: string) => {
    handleUpdateFilters({ searchQuery: value || undefined });
  };

  const handleSortChange = (value: string) => {
    handleUpdateFilters({ sortBy: (value as SortOption) || 'featured' });
  };

  const filteredProducts = useMemo(
    () => filterAndSortProducts(filters),
    [filters]
  );

  const activeFiltersCount =
    (filters.categories?.length ?? 0) +
    (filters.sizes?.length ?? 0) +
    (filters.finishes?.length ?? 0) +
    (filters.searchQuery ? 1 : 0);

  const heroImage = products[0]?.images?.[0]?.url
    ?? 'https://images.unsplash.com/photo-1619202439135-d0dca5625dd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bWluaW1hbGlzdCUyMGdsYXNzJTIwYm90dGxlJTIwbGFiZWwlMjBtb2NrdXAlMjBvbiUyMHN0b25lfGVufDB8MHx8fDE3OTIwMTMxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className={cn('min-h-screen bg-[#F9F6F2] text-[#1F1F1F]', className)}>
      <main className="w-full">
        <section className="w-full border-b border-[#E7E1D8] bg-[#F9F6F2]">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16 grid grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <motion.div
              className="col-span-12 md:col-span-6 flex flex-col justify-between space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 border border-[#E7E1D8] bg-white/70 backdrop-blur-sm px-3 py-1 rounded-md text-xs tracking-[0.2em] uppercase text-[#5F5A55]">
                  <span className="h-px w-6 bg-[#C9B9A6]" />
                  <span>Collection Atelier</span>
                </div>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight"
                  style={{ fontFamily: 'Playfair Display, ui-serif' }}
                >
                  Curated waters for
                  <br className="hidden md:block" /> precise stories.
                </h1>
                <p
                  className="text-sm md:text-base text-[#5F5A55] max-w-xl leading-relaxed"
                  style={{ fontFamily: 'Lora, ui-serif' }}
                >
                  Browse still, sparkling, and infused profiles, then tailor the vessel to your
                  table with custom labels, finishes, and formats. Every bottle is treated as an
                  object of design.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs md:text-sm">
                <div className="border border-[#E7E1D8] bg-white/70 rounded-xl px-4 py-3 flex flex-col justify-between">
                  <span className="text-[0.7rem] tracking-[0.25em] uppercase text-[#5F5A55]">
                    Palette
                  </span>
                  <span className="mt-2 font-medium">Warm ivory canvas</span>
                </div>
                <div className="border border-[#E7E1D8] bg-white/70 rounded-xl px-4 py-3 flex flex-col justify-between">
                  <span className="text-[0.7rem] tracking-[0.25em] uppercase text-[#5F5A55]">
                    Bottles
                  </span>
                  <span className="mt-2 font-medium">
                    {products?.length ?? 0} editorial profiles
                  </span>
                </div>
                <div className="border border-[#E7E1D8] bg-white/70 rounded-xl px-4 py-3 flex flex-col justify-between">
                  <span className="text-[0.7rem] tracking-[0.25em] uppercase text-[#5F5A55]">
                    Filters
                  </span>
                  <span className="mt-2 font-medium">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'Refine by ritual'}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-12 md:col-span-6 relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="relative h-full min-h-[260px] md:min-h-[320px] lg:min-h-[380px]">
                <div className="absolute inset-0 rounded-[20px] overflow-hidden">
                  <img
                    src={heroImage}
                    crossOrigin="anonymous"
                    alt="Editorial water bottle curation"
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
                <div className="absolute bottom-5 left-5 right-5 md:left-6 md:right-6 flex items-center justify-between gap-4">
                  <div className="bg-white/80 backdrop-blur-md border border-[#E7E1D8] rounded-[16px] px-4 py-3 flex items-center justify-between w-full">
                    <div>
                      <p className="text-[0.7rem] tracking-[0.24em] uppercase text-[#5F5A55]">
                        Shop the Collection
                      </p>
                      <p
                        className="text-sm md:text-base font-medium"
                        style={{ fontFamily: 'Lora, ui-serif' }}
                      >
                        Filter by ritual, origin, or finish below.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0B3D91] text-white text-xs tracking-[0.18em] uppercase"
                    >
                      <span>Explore Grid</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full border-b border-[#E7E1D8] bg-[#F9F6F2]">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-7 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F5A55]" />
                  <input
                    type="text"
                    value={filters.searchQuery ?? ''}
                    onChange={e => handleSearchChange(e.target.value)}
                    placeholder="Search by name, origin, or label mood..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#E7E1D8] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/60"
                    style={{ fontFamily: 'Lora, ui-serif' }}
                  />
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-[0.7rem] tracking-[0.22em] uppercase text-[#5F5A55]">
                    Showing
                  </span>
                  <span className="text-sm font-medium">
                    {filteredProducts.length} of {products.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center justify-between lg:justify-end">
                <div className="inline-flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#5F5A55]" />
                  <span className="text-[0.7rem] tracking-[0.24em] uppercase text-[#5F5A55]">
                    Filters
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {categories?.map(category => {
                    const active = (filters.categories ?? []).includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleToggleCategory(category)}
                        className={cn(
                          'px-3 py-1 text-[0.7rem] tracking-[0.2em] uppercase rounded-md border transition-colors',
                          active
                            ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                            : 'bg-white text-[#5F5A55] border-[#E7E1D8] hover:border-[#0B3D91]/50'
                        )}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#5F5A55]" />
                  <select
                    value={filters.sortBy ?? 'featured'}
                    onChange={e => handleSortChange(e.target.value)}
                    className="text-xs md:text-sm border border-[#E7E1D8] bg-white rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0B3D91]/60"
                    style={{ fontFamily: 'Lora, ui-serif' }}
                  >
                    {sortOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1 border-t border-dashed border-[#E7E1D8] mt-3">
                <div className="flex items-center gap-1.5 text-[0.7rem] text-[#5F5A55] uppercase tracking-[0.22em]">
                  <span>Refine by</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bottleSizes.map(size => {
                    const active = (filters.sizes ?? []).includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={cn(
                          'px-2.5 py-1 text-[0.68rem] tracking-[0.18em] uppercase rounded-md border',
                          active
                            ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                            : 'bg-white text-[#5F5A55] border-[#E7E1D8] hover:border-[#0B3D91]/50'
                        )}
                      >
                        {size} ml
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {bottleFinishes.map(finish => {
                    const active = (filters.finishes ?? []).includes(finish);
                    return (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => handleToggleFinish(finish)}
                        className={cn(
                          'px-2.5 py-1 text-[0.68rem] tracking-[0.18em] uppercase rounded-md border',
                          active
                            ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                            : 'bg-white text-[#5F5A55] border-[#E7E1D8] hover:border-[#0B3D91]/50'
                        )}
                      >
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-[#F9F6F2] pb-16 lg:pb-24">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 lg:pt-10">
            {filteredProducts.length === 0 ? (
              <div className="border border-[#E7E1D8] rounded-[18px] bg-white/80 px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p
                    className="text-lg md:text-xl font-light mb-2"
                    style={{ fontFamily: 'Playfair Display, ui-serif' }}
                  >
                    Nothing matched this particular ritual.
                  </p>
                  <p
                    className="text-sm text-[#5F5A55]"
                    style={{ fontFamily: 'Lora, ui-serif' }}
                  >
                    Try easing a filter, or search by fewer words. Mineral, sparkling, and still
                    profiles each reveal different silhouettes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateFilters({
                      searchQuery: undefined,
                      categories: undefined,
                      sizes: undefined,
                      finishes: undefined,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#0B3D91] text-[#0B3D91] text-xs tracking-[0.22em] uppercase"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.03 }}
                    className={cn(
                      index % 7 === 0 ? 'sm:col-span-2 lg:col-span-2 xl:col-span-2' : '',
                      index % 5 === 0 ? 'lg:translate-y-4' : '',
                      'flex'
                    )}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={handleQuickView}
                      className="w-full"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ProductDetailModal
        open={isDetailOpen}
        onOpenChange={open => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedProduct(undefined);
          }
        }}
        product={selectedProduct}
      />
    </div>
  );
}

export default ShopPage;