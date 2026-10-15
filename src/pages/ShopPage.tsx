import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Sliders, Search, ChevronDown, ChevronUp, ArrowRight, Tag, Sparkles, Package, Gauge, Layers, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Product,
  ProductCategory,
  ProductSortKey,
  ProductFilterState,
  ProductSortState,
  HydrationProfile,
  BottleMaterial,
  BottleSizeCode,
  FlavorProfile,
  ProductBadge,
  ID,
} from '@/types';
import mockData, { products as mockProducts } from '@/data/mockData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export interface FilterPillProps {
  label?: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterPill({
  label = '',
  active = false,
  onClick,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium tracking-[0.16em] uppercase transition-colors',
        active
          ? 'bg-[#007a8a] text-white border-[#007a8a]'
          : 'bg-[#fff7ee] text-[#6b625a] border-[#e7d6c6] hover:bg-[#f5e9dc]'
      )}
    >
      <span>{label}</span>
      {active && <Check className="w-3 h-3" />}
    </button>
  );
}

export interface FilterSectionProps {
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export function FilterSection({
  title = '',
  icon,
  children = null,
  defaultOpen = true,
}: FilterSectionProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div className="border-b border-[#e7d6c6] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-3"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6b625a]">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#6b625a]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6b625a]" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pb-3 space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface ShopFilterBarProps {
  filterState: ProductFilterState;
  sortState: ProductSortState;
  searchInput: string;
  onChangeSearchInput: (value: string) => void;
  onChangeFilter: (next: Partial<ProductFilterState>) => void;
  onResetFilters: () => void;
  onChangeSort: (next: ProductSortState) => void;
  resultCount: number;
}

export function ShopFilterBar({
  filterState,
  sortState,
  searchInput,
  onChangeSearchInput,
  onChangeFilter,
  onResetFilters,
  onChangeSort,
  resultCount,
}: ShopFilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const categoryDefs = mockData?.categories ?? [];

  const categoryOptions: { value: ProductCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All occasions' },
    ...categoryDefs.map((cat) => ({
      value: cat.slug as ProductCategory,
      label: cat.name,
    })),
  ];

  const sortOptions: { value: ProductSortKey; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name A–Z' },
    { value: 'name-desc', label: 'Name Z–A' },
    { value: 'created-desc', label: 'Newest' },
    { value: 'popularity-desc', label: 'Most popular' },
  ];

  const hydrationOptions: HydrationProfile[] = [
    'still',
    'sparkling',
    'mineral',
    'alkaline',
    'vitamin',
  ];

  const materialOptions: BottleMaterial[] = [
    'glass',
    'aluminium',
    'stainless',
    'rPET',
  ];

  const badgeOptions: ProductBadge[] = [
    'new',
    'bestseller',
    'limited',
    'online-exclusive',
  ];

  const sizeOptions: BottleSizeCode[] = [
    '250ml',
    '330ml',
    '500ml',
    '750ml',
    '1L',
  ];

  const flavorOptions: FlavorProfile[] = [
    'pure',
    'citrus',
    'botanical',
    'berry',
    'tropical',
    'herbal',
  ];

  const hasActiveFilters =
    filterState.category !== 'all' ||
    filterState.collection !== 'all' ||
    filterState.hydrationProfiles.length > 0 ||
    filterState.bottleMaterials.length > 0 ||
    filterState.bottleSizes.length > 0 ||
    filterState.flavorProfiles.length > 0 ||
    filterState.priceRange.min != null ||
    filterState.priceRange.max != null ||
    filterState.onlyCustomizable ||
    filterState.onlyInStock ||
    filterState.badges.length > 0;

  const handleToggleArrayFilter = <T,>(
    key: keyof ProductFilterState,
    value: T
  ) => {
    const current = (filterState[key] as T[]) ?? [];
    const exists = current.includes(value);
    const next = exists
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChangeFilter({ [key]: next } as Partial<ProductFilterState>);
  };

  const priceRangeMin = filterState.priceRange.min ?? '';
  const priceRangeMax = filterState.priceRange.max ?? '';

  const handlePriceChange = (type: 'min' | 'max', raw: string) => {
    const numeric = raw.replace(/[^\d]/g, '');
    const value = numeric === '' ? undefined : Number(numeric);
    onChangeFilter({
      priceRange: {
        ...filterState.priceRange,
        [type]: value,
      },
    });
  };

  const desktopFilterSidebar = (
    <div className="hidden xl:flex xl:flex-col xl:w-72 shrink-0 bg-[#fff7ee] border border-[#e7d6c6] rounded-[18px] p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#6b625a]" />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6b625a]">
            Refine
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-medium text-[#6b625a] underline-offset-2 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <FilterSection
        title="Occasion"
        icon={<Tag className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen
      >
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map((option) => (
            <FilterPill
              key={option.value}
              label={option.label}
              active={filterState.category === option.value}
              onClick={() =>
                onChangeFilter({
                  category: option.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Hydration mood"
        icon={<Gauge className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen
      >
        <div className="flex flex-wrap gap-1.5">
          {hydrationOptions.map((profile) => (
            <FilterPill
              key={profile}
              label={profile}
              active={filterState.hydrationProfiles.includes(profile)}
              onClick={() =>
                handleToggleArrayFilter<HydrationProfile>(
                  'hydrationProfiles',
                  profile
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Bottle material"
        icon={<Layers className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen
      >
        <div className="flex flex-wrap gap-1.5">
          {materialOptions.map((material) => (
            <FilterPill
              key={material}
              label={material}
              active={filterState.bottleMaterials.includes(material)}
              onClick={() =>
                handleToggleArrayFilter<BottleMaterial>(
                  'bottleMaterials',
                  material
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Volume"
        icon={<Package className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen
      >
        <div className="flex flex-wrap gap-1.5">
          {sizeOptions.map((size) => (
            <FilterPill
              key={size}
              label={size}
              active={filterState.bottleSizes.includes(size)}
              onClick={() =>
                handleToggleArrayFilter<BottleSizeCode>('bottleSizes', size)
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Flavor expressions"
        icon={<Sparkles className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen={false}
      >
        <div className="flex flex-wrap gap-1.5">
          {flavorOptions.map((flavor) => (
            <FilterPill
              key={flavor}
              label={flavor}
              active={filterState.flavorProfiles.includes(flavor)}
              onClick={() =>
                handleToggleArrayFilter<FlavorProfile>(
                  'flavorProfiles',
                  flavor
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price per bottle"
        icon={<Filter className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#6b625a]">Min (₹)</span>
            <input
              type="text"
              inputMode="numeric"
              value={priceRangeMin}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full rounded-md border border-[#e7d6c6] bg-white px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007a8a]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#6b625a]">Max (₹)</span>
            <input
              type="text"
              inputMode="numeric"
              value={priceRangeMax}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full rounded-md border border-[#e7d6c6] bg-white px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#007a8a]"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection
        title="Edition notes"
        icon={<Tag className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen={false}
      >
        <div className="flex flex-wrap gap-1.5">
          {badgeOptions.map((badge) => (
            <FilterPill
              key={badge}
              label={badge}
              active={filterState.badges.includes(badge)}
              onClick={() =>
                handleToggleArrayFilter<ProductBadge>('badges', badge)
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Custom label"
        icon={<Sparkles className="w-4 h-4 text-[#6b625a]" />}
        defaultOpen
      >
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs text-[#6b625a]">
              Only bottles that support full label customization
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeFilter({
                  onlyCustomizable: !filterState.onlyCustomizable,
                })
              }
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors',
                filterState.onlyCustomizable
                  ? 'bg-[#007a8a]'
                  : 'bg-[#e7d6c6]'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                  filterState.onlyCustomizable
                    ? 'translate-x-4'
                    : 'translate-x-0.5'
                )}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs text-[#6b625a]">
              Show only designs currently in production
            </span>
            <button
              type="button"
              onClick={() =>
                onChangeFilter({
                  onlyInStock: !filterState.onlyInStock,
                })
              }
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors',
                filterState.onlyInStock ? 'bg-[#007a8a]' : 'bg-[#e7d6c6]'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                  filterState.onlyInStock ? 'translate-x-4' : 'translate-x-0.5'
                )}
              />
            </button>
          </label>
        </div>
      </FilterSection>
    </div>
  );

  const mobileFilterSheet = (
    <AnimatePresence>
      {showMobileFilters && (
        <motion.div
          className="fixed inset-0 z-40 flex xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            onClick={() => setShowMobileFilters(false)}
            className="flex-1 bg-black/20"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="w-full max-w-md h-full bg-[#fff7ee] border-l border-[#e7d6c6] shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7d6c6]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#6b625a]" />
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6b625a]">
                  Filters
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-full hover:bg-[#f5e9dc]"
              >
                <X className="w-4 h-4 text-[#6b625a]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
              {desktopFilterSidebar}
            </div>
            <div className="border-t border-[#e7d6c6] px-4 py-3 flex items-center justify-between gap-3 bg-[#f5e9dc]">
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-medium text-[#6b625a] underline-offset-2 hover:underline"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#007a8a] text-white text-xs font-semibold tracking-[0.16em] uppercase"
              >
                <span>View {resultCount} results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <section className="w-full border-b border-[#e7d6c6] bg-[#f5e9dc]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-6 overflow-x-auto no-scrollbar">
              <h1 className="text-[13px] sm:text-sm font-semibold tracking-[0.28em] uppercase text-[#6b625a] whitespace-nowrap">
                Curated water library
              </h1>
              <p className="hidden md:block text-[11px] text-[#6b625a] max-w-md">
                Browse signature bottles designed to disappear into the table
                setting – until your label catches the light.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#6b625a]">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#fff7ee] border border-[#e7d6c6]">
                <Sparkles className="w-3 h-3 text-[#007a8a]" />
                <span>
                  {resultCount} {resultCount === 1 ? 'style' : 'styles'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6b625a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => onChangeSearchInput(e.target.value)}
                placeholder="Search by occasion, flavor mood, or bottle silhouette…"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-[#e7d6c6] bg-[#fff7ee] text-sm text-[#333333] placeholder:text-[#b0a79f] focus:outline-none focus:ring-1 focus:ring-[#007a8a]"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1 border border-[#e7d6c6] rounded-md bg-[#fff7ee] px-2 py-1.5">
                <span className="text-[11px] text-[#6b625a] mr-1">
                  Sort by
                </span>
                <select
                  value={sortState.key}
                  onChange={(e) =>
                    onChangeSort({
                      ...sortState,
                      key: e.target.value as ProductSortKey,
                    })
                  }
                  className="bg-transparent border-none text-[11px] text-[#333333] focus:outline-none pr-4"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChangeSort({
                    ...sortState,
                    ascending: !sortState.ascending,
                  })
                }
                className="hidden sm:inline-flex items-center justify-center px-2 py-1.5 rounded-md border border-[#e7d6c6] bg-[#fff7ee] text-[11px] text-[#6b625a]"
              >
                {sortState.ascending ? 'Asc' : 'Desc'}
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="xl:hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[#e7d6c6] bg-[#fff7ee] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#333333]"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
        {mobileFilterSheet}
      </section>
      <div className="hidden xl:block">{desktopFilterSidebar}</div>
    </>
  );
}

export interface ShopIntroBannerProps {
  resultCount?: number;
}

export function ShopIntroBanner({ resultCount = 0 }: ShopIntroBannerProps) {
  return (
    <section className="w-full bg-[#f5e9dc] border-b border-[#e7d6c6]">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 py-8 lg:py-10 grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 md:col-span-7 lg:col-span-7 space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#6b625a]">
            Shop collection
          </p>
          <h1 className="font-[DM_Sans] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-tight text-[#333333]">
            Bottles that behave like tableware,
            <span className="block md:inline"> labels that behave like couture.</span>
          </h1>
          <p className="text-sm md:text-base text-[#6b625a] max-w-xl">
            Explore the Nishant Waters library of custom-labeled hydration:
            still or sparkling, glass or aluminium, all engineered to disappear
            into the mise en scène until your story comes into focus.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[999px] bg-[#fff7ee] border border-[#e7d6c6]">
              <span className="w-2 h-2 rounded-full bg-[#007a8a]" />
              <span className="text-[11px] font-medium text-[#6b625a]">
                {resultCount} {resultCount === 1 ? 'label-ready bottle' : 'label-ready bottles'}
              </span>
            </div>
            <div className="inline-flex flex-wrap items-center gap-2 text-[11px] text-[#6b625a]">
              <span>Low minimums from 24 bottles</span>
              <span className="w-1 h-1 rounded-full bg-[#c8b5a3]" />
              <span>Lead times from 5 working days</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5 lg:col-span-5">
          <div className="relative w-full h-full min-h-[220px] rounded-[18px] bg-[#fff7ee] border border-[#e7d6c6] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8d2FybSUyMGJlaWdlJTIwcGFwZXIlMjB0ZXh0dXJlJTIwYmFja2dyb3VuZCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfDB8fHwxNzkyMDcxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
              alt="Nishant Waters editorial bottle stack"
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5e9dc]/85 via-[#0c1a1f]/20 to-[#0c1a1f]/60" />
            <div className="relative h-full w-full flex flex-col justify-between p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/80 backdrop-blur border border-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007a8a]" />
                  <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#333333]">
                    Label-ready
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0b1720]/70 backdrop-blur border border-white/10">
                  <span className="text-[10px] text-white/70">
                    Drag your design on bottle in the studio.
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-white/80 max-w-[260px]">
                  Every bottle in this library has been tuned for legible label
                  placement, flattering light, and effortless stacking for
                  service.
                </p>
                <div className="inline-flex items-center gap-3 px-3 py-2 rounded-md bg-white/90 backdrop-blur border border-white/70">
                  <div className="h-9 w-9 rounded-full bg-[#007a8a]/10 border border-[#007a8a]/40 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-[#007a8a]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-[#333333]">
                      Atelier-grade print
                    </p>
                    <p className="text-[10px] text-[#6b625a]">
                      High-fidelity offset & foil on moisture-safe stock.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export interface ProductGridProps {
  products?: Product[];
  onOpenProduct?: (productId: ID) => void;
  onNavigateToProduct?: (slug: string) => void;
}

export function ProductGrid({
  products = [],
  onOpenProduct,
  onNavigateToProduct,
}: ProductGridProps) {
  if (!products?.length) {
    return (
      <section className="w-full py-16 border-t border-[#e7d6c6] bg-[#fff7ee]">
        <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-[#6b625a]">
              No bottles match this curation
            </p>
            <h2 className="text-2xl md:text-3xl font-[DM_Sans] text-[#333333] leading-tight">
              Try softening your filters – or start from a blank bottle and let
              the label do the talking.
            </h2>
            <p className="text-sm text-[#6b625a] max-w-xl">
              You might be combining an ultra-specific volume, flavor mood, and
              badge. Try clearing one or two filters, or begin with our
              Signature Still bottles and apply your own visual language in the
              Design Studio.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="inline-flex flex-col gap-1.5 px-3 py-2 rounded-md bg-[#f5e9dc] border border-[#e7d6c6]">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6b625a]">
                  Quick nudges
                </span>
                <ul className="text-xs text-[#6b625a] list-disc list-inside space-y-1">
                  <li>Remove the flavor filter to see all hydration moods.</li>
                  <li>Start with glass only, then layer on finishes.</li>
                  <li>Look for “Signature” if you need fast lead times.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="md:w-64 flex flex-col gap-4">
            <div className="relative h-40 rounded-[18px] bg-[#f5e9dc] border border-[#e7d6c6] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1706790608211-4c03fd4f4d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8d2FybSUyMGJlaWdlJTIwcGFwZXIlMjB0ZXh0dXJlJTIwYmFja2dyb3VuZCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfDB8fHwxNzkyMDcxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                alt="Warm paper texture"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5e9dc]/90 to-[#0b1720]/60" />
              <div className="relative h-full w-full flex flex-col justify-between p-3">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 backdrop-blur border border-white/20 self-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff775b]" />
                  <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white">
                    Tip
                  </span>
                </div>
                <p className="text-xs text-white/85">
                  The Design Studio can adapt any bottle to your palette. Start
                  simple; let typography and label shape carry the story.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#007a8a] text-white text-xs font-semibold tracking-[0.18em] uppercase"
            >
              Reset filters
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f5e9dc]">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.div
                key={product?.id ?? `${index}`}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{
                  duration: 0.26,
                  delay: Math.min(index * 0.03, 0.18),
                  ease: 'easeOut',
                }}
              >
                <ProductCard
                  product={product}
                  index={index}
                  highlightVariant="default"
                  showCollectionTag
                  showHydrationMeta
                  showMinimums
                  onNavigateToProduct={onNavigateToProduct}
                  onOpenDesign={(productId) => onOpenProduct?.(productId)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function ShopPage() {
  const navigate = useNavigate();
  const { formatMoney, showToast } = useCart();
  const allProducts: Product[] = mockProducts ?? [];

  const [filterState, setFilterState] = useState<ProductFilterState>(
    mockData?.defaultFilterState ?? {
      searchQuery: '',
      category: 'all',
      collection: 'all',
      hydrationProfiles: [],
      bottleMaterials: [],
      bottleSizes: [],
      flavorProfiles: [],
      priceRange: {},
      onlyCustomizable: false,
      onlyInStock: true,
      badges: [],
    }
  );

  const [sortState, setSortState] = useState<ProductSortState>(
    mockData?.defaultSortState ?? {
      key: 'featured',
      ascending: true,
    }
  );

  const [searchInput, setSearchInput] = useState<string>(
    filterState.searchQuery
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(
    filterState.searchQuery
  );
  const [activeProductId, setActiveProductId] = useState<ID | undefined>(
    undefined
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 260);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: debouncedSearch,
    }));
  }, [debouncedSearch]);

  const handleChangeFilter = (next: Partial<ProductFilterState>) => {
    setFilterState((prev) => ({
      ...prev,
      ...next,
    }));
  };

  const handleResetFilters = () => {
    const base = mockData?.defaultFilterState ?? {
      searchQuery: '',
      category: 'all',
      collection: 'all',
      hydrationProfiles: [],
      bottleMaterials: [],
      bottleSizes: [],
      flavorProfiles: [],
      priceRange: {},
      onlyCustomizable: false,
      onlyInStock: true,
      badges: [],
    };
    setFilterState(base);
    setSearchInput(base.searchQuery);
    setDebouncedSearch(base.searchQuery);
  };

  const handleChangeSort = (next: ProductSortState) => {
    setSortState(next);
  };

  const filteredProducts = useMemo(() => {
    let current = [...allProducts];

    const query = filterState.searchQuery.toLowerCase();

    if (query) {
      current = current.filter((product) => {
        const haystack = [
          product.name,
          product.subtitle,
          product.description,
          product.category,
          product.collection,
          product.hydrationProfile,
          ...product.flavors.map((f) => f.profile),
          ...product.meta.tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (filterState.category !== 'all') {
      current = current.filter(
        (product) => product.category === filterState.category
      );
    }

    if (filterState.collection !== 'all') {
      current = current.filter(
        (product) => product.collection === filterState.collection
      );
    }

    if (filterState.hydrationProfiles.length > 0) {
      current = current.filter((product) =>
        filterState.hydrationProfiles.includes(product.hydrationProfile)
      );
    }

    if (filterState.bottleMaterials.length > 0) {
      current = current.filter((product) =>
        filterState.bottleMaterials.includes(product.materialInfo.material)
      );
    }

    if (filterState.bottleSizes.length > 0) {
      current = current.filter((product) =>
        product.sizeVariants.some((variant) =>
          filterState.bottleSizes.includes(variant.code)
        )
      );
    }

    if (filterState.flavorProfiles.length > 0) {
      current = current.filter((product) =>
        product.flavors.some((flavor) =>
          filterState.flavorProfiles.includes(flavor.profile)
        )
      );
    }

    if (filterState.priceRange.min != null) {
      current = current.filter(
        (product) => product.startingAtPrice.amount >= filterState.priceRange.min!
      );
    }

    if (filterState.priceRange.max != null) {
      current = current.filter(
        (product) => product.startingAtPrice.amount <= filterState.priceRange.max!
      );
    }

    if (filterState.onlyCustomizable) {
      current = current.filter(
        (product) => product.designCapability.canCustomizeLabel
      );
    }

    if (filterState.onlyInStock) {
      current = current.filter((product) => product.status === 'active');
    }

    if (filterState.badges.length > 0) {
      current = current.filter((product) =>
        product.badges.some((badge) => filterState.badges.includes(badge))
      );
    }

    const sortKey = sortState.key;

    current.sort((a, b) => {
      const direction = sortState.ascending ? 1 : -1;

      if (sortKey === 'price-asc' || sortKey === 'price-desc') {
        const diff = a.startingAtPrice.amount - b.startingAtPrice.amount;
        return sortKey === 'price-asc' ? diff * direction : -diff * direction;
      }

      if (sortKey === 'name-asc' || sortKey === 'name-desc') {
        const diff = a.name.localeCompare(b.name);
        return sortKey === 'name-asc' ? diff * direction : -diff * direction;
      }

      if (sortKey === 'created-desc') {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return (bDate - aDate) * direction;
      }

      if (sortKey === 'popularity-desc') {
        const aScore = a.rating.average * a.rating.count;
        const bScore = b.rating.average * b.rating.count;
        return (bScore - aScore) * direction;
      }

      return 0;
    });

    return current;
  }, [allProducts, filterState, sortState]);

  const handleOpenProduct = (productId: ID) => {
    setActiveProductId(productId);
    setIsProductModalOpen(true);
  };

  const handleNavigateToProduct = (slug: string) => {
    navigate(`/product/${slug}`);
  };

  const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    window.setTimeout(() => {
      setActiveProductId(undefined);
    }, 220);
  };

  useEffect(() => {
    if (filteredProducts.length === 0 && filterState.searchQuery) {
      showToast({
        title: 'We softened the water a little',
        description:
          'No exact matches for that search. Try a broader phrase like “sparkling” or “atelier”.',
        intent: 'info',
      });
    }
  }, [filteredProducts.length, filterState.searchQuery, showToast]);

  const resultCount = filteredProducts.length;

  return (
    <div className="min-h-screen bg-[#f5e9dc] flex flex-col">
      <Header className="border-b border-[#e7d6c6]" />
      <main className="flex-1 flex flex-col bg-[#f5e9dc]">
        <ShopIntroBanner resultCount={resultCount} />
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 py-6 lg:py-8 grid grid-cols-12 gap-6 lg:gap-8">
          <aside className="col-span-12 xl:col-span-3 hidden xl:block">
            <ShopFilterBar
              filterState={filterState}
              sortState={sortState}
              searchInput={searchInput}
              onChangeSearchInput={setSearchInput}
              onChangeFilter={handleChangeFilter}
              onResetFilters={handleResetFilters}
              onChangeSort={handleChangeSort}
              resultCount={resultCount}
            />
          </aside>
          <div className="col-span-12 xl:col-span-9">
            <div className="xl:hidden mb-4">
              <ShopFilterBar
                filterState={filterState}
                sortState={sortState}
                searchInput={searchInput}
                onChangeSearchInput={setSearchInput}
                onChangeFilter={handleChangeFilter}
                onResetFilters={handleResetFilters}
                onChangeSort={handleChangeSort}
                resultCount={resultCount}
              />
            </div>
            <ProductGrid
              products={filteredProducts}
              onOpenProduct={handleOpenProduct}
              onNavigateToProduct={handleNavigateToProduct}
            />
          </div>
        </div>
      </main>
      <Footer className="border-t border-[#e7d6c6]" showSurfaceRibbons />
      <AnimatePresence>
        {isProductModalOpen && activeProductId && (
          <ProductDetailModal
            productId={activeProductId}
            open={isProductModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleProductModalClose();
              }
            }}
            onClose={handleProductModalClose}
            enableDesignCta
            className="z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ShopPage;