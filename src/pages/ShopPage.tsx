import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, Sliders, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { products, volumeFacets, finishFacets, materialFacets, shopCopy } from '@/data/mockData';
import type { FilterQuery, Product, VolumeMl, BottleFinish } from '@/types';
import ProductDetailModal, { ProductDetailModalProps } from '@/components/ProductDetailModal';

interface FacetState {
  volumes: VolumeMl[];
  finishes: BottleFinish[];
  materials: string[];
  priceRange: [number, number];
}

interface SortOption {
  value: NonNullable<FilterQuery['sortBy']>;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'volume-asc', label: 'Volume: Low to High' },
  { value: 'volume-desc', label: 'Volume: High to Low' },
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function getPrimaryPrice(p: Product) {
  const variant = p.variants.find(v => v.isDefault) ?? p.variants[0];
  return variant?.price?.amount ?? 0;
}

function getPrimaryVolume(p: Product) {
  const variant = p.variants.find(v => v.isDefault) ?? p.variants[0];
  return variant?.volumeMl ?? 0;
}

export function ShopPage() {
  const navigate = useNavigate();
  const query = useQuery();

  const [searchTerm, setSearchTerm] = useState<string>(query.get('q') ?? '');
  const [facetState, setFacetState] = useState<FacetState>(() => ({
    volumes: [],
    finishes: [],
    materials: [],
    priceRange: [0, 0],
  }));
  const [sortBy, setSortBy] = useState<NonNullable<FilterQuery['sortBy']>>(
    (query.get('sortBy') as NonNullable<FilterQuery['sortBy']>) ?? 'featured',
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailModalProps['product']>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [minPrice, maxPrice] = useMemo(() => {
    if (!products?.length) return [0, 0];
    const amounts = products.map(getPrimaryPrice);
    return [Math.min(...amounts), Math.max(...amounts)];
  }, []);

  useEffect(() => {
    setFacetState(prev => ({
      ...prev,
      priceRange: prev.priceRange[1] === 0 ? [minPrice, maxPrice] : prev.priceRange,
    }));
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (sortBy && sortBy !== 'featured') params.set('sortBy', sortBy);
    const next = params.toString();
    navigate({ search: next ? `?${next}` : '' }, { replace: true });
  }, [searchTerm, sortBy, navigate]);

  const handleToggleFacet = (type: keyof FacetState, value: VolumeMl | BottleFinish | string) => {
    setFacetState(prev => {
      if (type === 'priceRange') return prev;
      const current = prev[type] as (VolumeMl | BottleFinish | string)[];
      const exists = current.includes(value);
      const nextValues = exists ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: nextValues } as FacetState;
    });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    setFacetState(prev => {
      const next: [number, number] = [...prev.priceRange] as [number, number];
      next[index] = Number.isNaN(value) ? prev.priceRange[index] : value;
      return { ...prev, priceRange: next };
    });
  };

  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    const [min, max] = facetState.priceRange;
    let list = [...products];

    if (searchLower) {
      list = list.filter(p => {
        const inName = p.name.toLowerCase().includes(searchLower);
        const inDesc = p.shortDescription.toLowerCase().includes(searchLower);
        const inTags = p.tags?.some(t => t.toLowerCase().includes(searchLower));
        return inName || inDesc || inTags;
      });
    }

    if (facetState.volumes.length) {
      list = list.filter(p => {
        const vols = p.variants?.map(v => v.volumeMl) ?? [];
        return vols.some(v => facetState.volumes.includes(v));
      });
    }

    if (facetState.finishes.length) {
      list = list.filter(p => {
        const fins = p.variants?.map(v => v.finish) ?? [];
        return fins.some(f => facetState.finishes.includes(f));
      });
    }

    if (facetState.materials.length) {
      list = list.filter(p => {
        const tags = p.tags ?? [];
        return facetState.materials.some(mat =>
          tags.some(tag => tag.toLowerCase().includes((mat as string).toLowerCase())),
        );
      });
    }

    list = list.filter(p => {
      const price = getPrimaryPrice(p);
      if (min && price < min) return false;
      if (max && price > max) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'featured') {
        const ai = a.sortIndex ?? 0;
        const bi = b.sortIndex ?? 0;
        return ai - bi;
      }
      if (sortBy === 'price-asc' || sortBy === 'price-desc') {
        const av = getPrimaryPrice(a);
        const bv = getPrimaryPrice(b);
        return sortBy === 'price-asc' ? av - bv : bv - av;
      }
      if (sortBy === 'volume-asc' || sortBy === 'volume-desc') {
        const av = getPrimaryVolume(a);
        const bv = getPrimaryVolume(b);
        return sortBy === 'volume-asc' ? av - bv : bv - av;
      }
      if (sortBy === 'newest') {
        const ai = a.sortIndex ?? 0;
        const bi = b.sortIndex ?? 0;
        return bi - ai;
      }
      return 0;
    });

    return list;
  }, [searchTerm, facetState, sortBy]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const copy = shopCopy ?? {};

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#141310]">
      <main className="w-full px-6 lg:px-12 pt-28 pb-16">
        <section className="w-full max-w-7xl mx-auto mb-10 lg:mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <motion.div
              className="lg:col-span-7 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-[0.25em] uppercase text-[#5D584F]">
                {copy?.eyebrow ?? 'Nishant Waters / Shop'}
              </p>
              <h1 className="font-[Playfair Display] text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
                {copy?.headline ?? 'Curated bottles for every table narrative.'}
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-[#5D584F]">
                {copy?.subcopy ??
                  'Browse meticulously balanced silhouettes, finishes, and label-ready surfaces designed for events, ateliers, and cinematic dinner stories.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5D584F]">
                <span className="inline-flex items-center gap-2 rounded-md border border-[#DED5C8] bg-white/70 px-3 py-1.5">
                  <span className="h-1.5 w-5 bg-[#0E4A3A]" />
                  Editorial-first catalog
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-[#DED5C8] bg-white/70 px-3 py-1.5">
                  <ArrowRight className="w-3 h-3" />
                  Asymmetric masonry merchandising
                </span>
              </div>
            </motion.div>
            <motion.div
              className="lg:col-span-5 flex flex-col gap-3 lg:items-end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="flex w-full lg:w-auto gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D584F]" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search silhouettes, finishes, rituals…"
                    className="w-full rounded-[16px] border border-[#DED5C8] bg-white/80 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-[#B0A79B] focus:border-[#0E4A3A] focus:ring-1 focus:ring-[#0E4A3A]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(prev => !prev)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-[16px] border border-[#DED5C8] bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em]',
                    'hover:bg-[#0E4A3A] hover:text-white transition-colors',
                  )}
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
              </div>
              <div className="flex w-full lg:w-auto items-center justify-between gap-4">
                <p className="text-xs text-[#5D584F]">
                  Showing {filteredProducts.length} of {products.length} bottles
                </p>
                <div className="inline-flex items-center gap-2 rounded-[16px] border border-[#DED5C8] bg-white/80 px-3 py-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#5D584F]" />
                  <select
                    value={sortBy}
                    onChange={e =>
                      setSortBy(
                        (e.target.value as NonNullable<FilterQuery['sortBy']>) ?? 'featured',
                      )
                    }
                    className="bg-transparent text-xs font-medium tracking-[0.16em] uppercase text-[#141310] outline-none"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <AnimatePresence initial={false}>
            {isFilterOpen && (
              <motion.aside
                className="lg:col-span-3 space-y-8 rounded-[20px] border border-[#DED5C8] bg-white/70 p-5 lg:p-6 backdrop-blur"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs tracking-[0.18em] uppercase text-[#5D584F]">Refine</p>
                  <button
                    type="button"
                    className="text-xs underline text-[#5D584F]"
                    onClick={() =>
                      setFacetState({
                        volumes: [],
                        finishes: [],
                        materials: [],
                        priceRange: [minPrice, maxPrice],
                      })
                    }
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Volume
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {volumeFacets.map(vol => (
                      <button
                        key={vol}
                        type="button"
                        onClick={() => handleToggleFacet('volumes', vol)}
                        className={cn(
                          'px-3 py-1.5 rounded-md border text-xs',
                          facetState.volumes.includes(vol)
                            ? 'border-[#0E4A3A] bg-[#0E4A3A] text-white'
                            : 'border-[#DED5C8] bg-white/70 text-[#141310] hover:border-[#0E4A3A]',
                        )}
                      >
                        {vol} ml
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Finish
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {finishFacets.map(finish => (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => handleToggleFacet('finishes', finish)}
                        className={cn(
                          'px-3 py-1.5 rounded-md border text-xs capitalize',
                          facetState.finishes.includes(finish)
                            ? 'border-[#0E4A3A] bg-[#0E4A3A] text-white'
                            : 'border-[#DED5C8] bg-white/70 text-[#141310] hover:border-[#0E4A3A]',
                        )}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Material Language
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {materialFacets.map(mat => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => handleToggleFacet('materials', mat)}
                        className={cn(
                          'px-3 py-1.5 rounded-md border text-xs',
                          facetState.materials.includes(mat)
                            ? 'border-[#0E4A3A] bg-[#0E4A3A] text-white'
                            : 'border-[#DED5C8] bg-white/70 text-[#141310] hover:border-[#0E4A3A]',
                        )}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5D584F]">
                    Price Band (₹)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <span className="block text-[10px] text-[#5D584F]">Min</span>
                      <input
                        type="number"
                        value={facetState.priceRange[0]}
                        onChange={e => handlePriceChange(0, Number(e.target.value))}
                        className="w-full rounded-md border border-[#DED5C8] bg-white/80 px-2.5 py-1.5 text-xs outline-none focus:border-[#0E4A3A] focus:ring-1 focus:ring-[#0E4A3A]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block text-[10px] text-[#5D584F]">Max</span>
                      <input
                        type="number"
                        value={facetState.priceRange[1]}
                        onChange={e => handlePriceChange(1, Number(e.target.value))}
                        className="w-full rounded-md border border-[#DED5C8] bg-white/80 px-2.5 py-1.5 text-xs outline-none focus:border-[#0E4A3A] focus:ring-1 focus:ring-[#0E4A3A]"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5D584F]">
                    Current band: ₹{facetState.priceRange[0]} – ₹{facetState.priceRange[1]}
                  </p>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <section
            className={cn(
              'lg:col-span-9',
              !isFilterOpen && 'lg:col-span-12',
              'space-y-6',
            )}
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 auto-rows-auto"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.06,
                  },
                },
              }}
            >
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  className={cn(
                    'group relative cursor-pointer rounded-[20px] border border-[#DED5C8] bg-white/80 overflow-hidden flex flex-col',
                    index % 5 === 0 && 'sm:row-span-2',
                    index % 7 === 0 && 'lg:row-span-2',
                  )}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0 },
                  }}
                  onClick={() => handleOpenProduct(product)}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.heroImage.url}
                        alt={product.heroImage.alt ?? product.name}
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {product.meta?.isLimited && (
                      <span className="absolute left-4 top-4 rounded-md bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                        Limited Run
                      </span>
                    )}
                    {product.meta?.isNew && !product.meta?.isLimited && (
                      <span className="absolute left-4 top-4 rounded-md bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#141310]">
                        New
                      </span>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 border border-white/30" />
                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase">
                          {product.meta?.collection ?? product.category}
                        </p>
                        <h3 className="mt-1 font-[Playfair Display] text-lg leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          ₹{getPrimaryPrice(product).toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-white/75">
                          {getPrimaryVolume(product)} ml
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between px-4 py-4 sm:px-4 sm:py-4 lg:px-5 lg:py-5 gap-4">
                    <p className="text-xs text-[#5D584F] line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(product.meta?.badges ?? []).slice(0, 2).map(badge => (
                          <span
                            key={badge}
                            className="rounded-md border border-[#DED5C8] bg-[#F7F1E8] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#5D584F]"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-[999px] border border-[#0E4A3A] bg-[#0E4A3A] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white group-hover:bg-[#0B3E31]"
                      >
                        Quick view
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
              {!filteredProducts.length && (
                <div className="col-span-full rounded-[20px] border border-dashed border-[#DED5C8] bg-white/60 px-6 py-10 text-center">
                  <p className="text-sm text-[#5D584F]">
                    No bottles match this composition yet. Adjust your filters to widen the
                    palette.
                  </p>
                </div>
              )}
            </motion.div>
          </section>
        </section>
      </main>

      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={open => {
          setIsModalOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      />
    </div>
  );
}

export default ShopPage;