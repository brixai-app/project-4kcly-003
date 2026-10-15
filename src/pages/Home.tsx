import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, ShoppingBag, Sliders, Circle as Droplets, Leaf, Truck, Image as ImageIcon, QrCode, ArrowUpRight, Play, Star, Users, Circle as BottleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import mockData, { products } from '@/data/mockData';
import { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';

export interface HomeHeroRibbonProps {
  label?: string;
  meta?: string;
}

export function HomeHeroRibbon({
  label = 'Nishant Waters',
  meta = 'Custom-labeled hydration for weddings, ateliers, and rare moments.',
}: HomeHeroRibbonProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl bg-[#fff7ee]/80 border border-[#e7d6c6] px-4 py-2 shadow-sm backdrop-blur-sm">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#007a8a] text-xs font-semibold uppercase tracking-[0.18em] text-white">
        NW
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b625a]">
          {label}
        </span>
        <span className="text-xs text-[#6b625a]">{meta}</span>
      </div>
    </div>
  );
}

export interface HeroStatPillProps {
  label?: string;
  value?: string;
  meta?: string;
}

export function HeroStatPill({
  label = '',
  value = '',
  meta = '',
}: HeroStatPillProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-[#e7d6c6] bg-[#fff7ee]/90 px-3.5 py-2.5 shadow-sm">
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b625a]">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#333333]">{value}</span>
      {meta ? (
        <span className="text-[11px] text-[#6b625a]">{meta}</span>
      ) : null}
    </div>
  );
}

export interface HeroCTAButtonProps {
  variant?: 'primary' | 'secondary';
  label?: string;
  to?: string;
  icon?: React.ReactNode;
}

export function HeroCTAButton({
  variant = 'primary',
  label = '',
  to = '/',
  icon,
}: HeroCTAButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.26em] transition-all duration-200';
  const variantClasses =
    variant === 'primary'
      ? 'bg-[#007a8a] text-white hover:bg-[#006674] shadow-md hover:shadow-lg'
      : 'bg-transparent border border-[#e7d6c6] text-[#333333] hover:border-[#007a8a] hover:text-[#007a8a]';
  return (
    <Link to={to} className={cn(base, variantClasses)}>
      <span>{label}</span>
      {icon ?? <ArrowRight className="h-4 w-4" />}
    </Link>
  );
}

export interface EditorialHeroProps {
  className?: string;
}

export function EditorialHero({ className }: EditorialHeroProps) {
  const navigate = useNavigate();
  const heroCopy = mockData?.homeHeroCopy;

  return (
    <section
      className={cn(
        'relative w-full bg-[#f5e9dc] pb-16 pt-28 md:pt-32 lg:pt-36',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f5e9dc] via-[#f5e9dc]/95 to-transparent pointer-events-none" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:px-12 xl:px-16">
        <div className="grid min-h-[80vh] grid-cols-1 items-stretch gap-10 lg:min-h-[85vh] lg:grid-cols-12 lg:gap-14">
          <motion.div
            className="relative flex flex-col justify-between space-y-10 lg:col-span-6 xl:col-span-5"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.18, 0.89, 0.32, 1.1] }}
          >
            <div className="space-y-8">
              <HomeHeroRibbon
                label={heroCopy?.eyebrow ?? 'Bespoke Label Studio'}
                meta="Designed in India · Poured for the world."
              />
              <div className="space-y-4">
                <h1 className="font-[var(--font-display,DM Sans)] text-4xl leading-[1.05] text-[#333333] sm:text-5xl lg:text-6xl">
                  {heroCopy?.title ?? 'Water that carries your name, not a logo.'}
                </h1>
                <p className="max-w-xl font-[var(--font-body,Lora)] text-[15px] leading-relaxed text-[#6b625a] md:text-base">
                  {heroCopy?.subtitle ??
                    'Nishant Waters creates custom-labeled bottles for weddings, ateliers, and brands that refuse to be background noise. Think gallery-grade typography, archival papers, and hydration with a point of view.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <HeroCTAButton
                  variant="primary"
                  label={heroCopy?.primaryCta ?? 'Explore collection'}
                  to="/shop"
                  icon={<ArrowRight className="h-4 w-4" />}
                />
                <HeroCTAButton
                  variant="secondary"
                  label={heroCopy?.secondaryCta ?? 'Open design studio'}
                  to="/design"
                  icon={<Sparkles className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#6b625a] underline-offset-4 hover:text-[#333333] hover:underline"
                >
                  Our origin story
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <HeroStatPill
                label="Lead time"
                value="3–7 days"
                meta="From approved artwork."
              />
              <HeroStatPill
                label="Minimums"
                value="24 bottles"
                meta="Perfect for intimate gatherings."
              />
              <HeroStatPill
                label="Material"
                value="Glass & rPET"
                meta="Designed for circularity."
              />
            </div>
          </motion.div>

          <motion.div
            className="relative lg:col-span-6 xl:col-span-7"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.18, 0.89, 0.32, 1.1] }}
          >
            <div className="relative h-full w-full">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-[#fff7ee] via-[#f5e9dc] to-[#ffe9da] opacity-90" />
              <div className="relative grid h-full grid-cols-12 gap-4 p-4 md:p-6">
                <div className="col-span-7 flex flex-col gap-4">
                  <div className="relative flex-1 overflow-hidden rounded-[26px] border border-[#e7d6c6] bg-[#0b1720] shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
                    <img
                      src="https://images.unsplash.com/photo-1637905351378-67232a5f0c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                      alt="Custom-labeled water bottles arranged on a linen-clad table with soft sunlight."
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      crossOrigin="anonymous"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />
                    <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f5e9dc]/80">
                          Atelier Drop · 2024
                        </p>
                        <p className="max-w-xs text-sm font-medium text-[#fff7ee]">
                          Linen-textured labels, foil initials, and still Himalayan spring
                          water.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-[#f5e9dc]/90 px-3 py-1.5 text-[11px] font-medium text-[#333333] shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />
                        <span>Live label preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative overflow-hidden rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b625a]">
                            Design first
                          </p>
                          <p className="text-xs text-[#333333]">
                            Drag-and-drop labels with typographic presets from our studio.
                          </p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007a8a]/10 text-[#007a8a]">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-[#6b625a]">
                        <span>Try the Label Studio</span>
                        <button
                          type="button"
                          onClick={() => navigate('/design')}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#e7d6c6] bg-white text-[#333333] transition-colors hover:border-[#007a8a] hover:text-[#007a8a]"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b625a]">
                          Event proof
                        </span>
                        <div className="inline-flex items-center gap-1 rounded-full bg-[#007a8a]/10 px-2 py-1 text-[10px] text-[#007a8a]">
                          <QrCode className="h-3 w-3" />
                          <span>QR-ready</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#333333]">
                        Add QR codes for menus, brand stories, or playlists without
                        compromising on aesthetics.
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-[#6b625a]">
                        <span>Wedding, corporate, hospitality</span>
                        <Users className="h-3.5 w-3.5 text-[#6b625a]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-5 flex flex-col gap-4">
                  <div className="relative h-48 overflow-hidden rounded-3xl border border-[#e7d6c6] bg-[#0b1720] shadow-[0_18px_40px_rgba(15,23,42,0.6)] sm:h-60 lg:h-72">
                    <img
                      src="https://images.unsplash.com/photo-1778058505479-447c46d800a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                      alt="A cinematic editorial still life of custom water bottles and linen textures."
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      crossOrigin="anonymous"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
                    <div className="absolute inset-x-4 bottom-4 space-y-2">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ee]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5e9dc]/80 ring-1 ring-white/20 backdrop-blur-sm">
                        <Droplets className="h-3 w-3" />
                        <span>Still · Sparkling · Mineral</span>
                      </div>
                      <p className="max-w-xs text-xs text-[#f5e9dc]/90">
                        Customize hydration profiles, bottle finishes, and cap styles for
                        each touchpoint in your experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 rounded-[26px] border border-[#e7d6c6] bg-[#fff7ee] p-3.5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b625a]">
                          Conscious by design
                        </p>
                        <p className="text-xs text-[#333333]">
                          rPET and glass bottles with fully recyclable label systems and
                          planet-first partners.
                        </p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007a8a]/10 text-[#007a8a]">
                        <Leaf className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-[#6b625a]">
                      <div className="flex flex-col gap-0.5 rounded-xl bg-white px-2.5 py-2">
                        <span className="font-semibold text-[#333333]">100%</span>
                        <span>Recyclable labels & caps.</span>
                      </div>
                      <div className="flex flex-col gap-0.5 rounded-xl bg-white px-2.5 py-2">
                        <span className="font-semibold text-[#333333]">Offset</span>
                        <span>Carbon-balanced production.</span>
                      </div>
                      <div className="flex flex-col gap-0.5 rounded-xl bg-white px-2.5 py-2">
                        <span className="font-semibold text-[#333333]">Local</span>
                        <span>Regional water sourcing.</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#6b625a]">
                      <div className="inline-flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" />
                        <span>Tracked shipping across India, UAE, EU.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/checkout')}
                        className="inline-flex items-center gap-1 rounded-full border border-[#e7d6c6] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#333333] hover:border-[#007a8a] hover:text-[#007a8a]"
                      >
                        View checkout flow
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-10 top-10 hidden rotate-3 rounded-3xl bg-[#007a8a] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-white shadow-xl lg:flex">
                Limited Atelier Run · SS24
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export interface FeaturedRailProps {
  className?: string;
}

export function FeaturedRail({ className }: FeaturedRailProps) {
  const navigate = useNavigate();
  const { formatMoney } = useCart();
  const activeProducts = useMemo(
    () => (products ?? []).filter((p: Product) => p?.status === 'active'),
    [],
  );
  const featured = useMemo(
    () => activeProducts.slice(0, 8),
    [activeProducts],
  );
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setIndex(prev => (prev + 1) % featured.length);
  };

  return (
    <section
      className={cn(
        'w-full bg-[#fff7ee] py-12 md:py-16 lg:py-20 border-t border-[#e7d6c6]',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 lg:px-12 xl:px-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b625a]">
              <span className="h-[1px] w-6 bg-[#6b625a]" />
              Featured drops
            </p>
            <h2 className="font-[var(--font-display,DM Sans)] text-2xl text-[#333333] sm:text-3xl">
              Curated waters for the season&apos;s rarest tables.
            </h2>
            <p className="max-w-xl font-[var(--font-body,Lora)] text-[13px] leading-relaxed text-[#6b625a]">
              Limited-run bottles handcrafted with our studio team. Every label ships
              press-checked and event-ready.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d6c6] bg-white text-[#333333] transition-colors hover:border-[#007a8a] hover:text-[#007a8a]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e7d6c6] bg-white text-[#333333] transition-colors hover:border-[#007a8a] hover:text-[#007a8a]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#333333] hover:border-[#e7d6c6]"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#fff7ee] via-[#fff7ee] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#fff7ee] via-[#fff7ee] to-transparent" />
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-2 pt-3 md:gap-5">
            <AnimatePresence initial={false}>
              {featured.map((product: Product, idx: number) => {
                const offset = ((idx - index + featured.length) % featured.length) - 1;
                const scale = offset === 0 ? 1 : 0.94;
                const opacity = Math.abs(offset) > 2 ? 0 : 1;
                return (
                  <motion.div
                    key={product?.id ?? idx}
                    layout
                    className="snap-start"
                    style={{ minWidth: '260px', maxWidth: '280px' }}
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity, y: 0, scale }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <ProductCard
                      product={product}
                      index={idx}
                      highlightVariant="heroRail"
                      showCollectionTag
                      showHydrationMeta
                      showMinimums
                      className="h-full"
                      onNavigateToProduct={slug => navigate(`/product/${slug}`)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-[#e7d6c6] pt-4 text-[12px] text-[#6b625a]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-[#007a8a]" />
              <span>Studio-selected hydration profiles for flavour clarity.</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
              <BottleIcon className="h-3.5 w-3.5 text-[#6b625a]" />
              <span>
                Starting at{' '}
                <strong className="font-semibold text-[#333333]">
                  {formatMoney?.(featured?.[0]?.startingAtPrice ?? featured?.[0]?.basePrice) ??
                    ''}
                </strong>{' '}
                for 24 bottles.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="uppercase tracking-[0.2em]">Slide to browse</span>
            <div className="flex h-5 items-center gap-0.5">
              <span className="h-[1px] w-6 bg-[#6b625a]" />
              <span className="h-[1px] w-6 bg-[#6b625a]/60" />
              <span className="h-[1px] w-6 bg-[#6b625a]/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export interface CategoryTileProps {
  label?: string;
  description?: string;
  imageUrl?: string;
  eyebrow?: string;
  href?: string;
  align?: 'left' | 'right';
}

export function CategoryTile({
  label = '',
  description = '',
  imageUrl = '',
  eyebrow = '',
  href = '/shop',
  align = 'left',
}: CategoryTileProps) {
  return (
    <Link
      to={href}
      className={cn(
        'group relative flex min-h-[220px] flex-col overflow-hidden rounded-[26px] border border-[#e7d6c6] bg-[#fff7ee] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl',
        align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="relative w-full flex-1 overflow-hidden lg:max-w-[55%]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f5e9dc]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b1720]/80 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#0b1720]/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f5e9dc]">
          {eyebrow}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col justify-between gap-4 p-5 md:p-6 lg:max-w-[45%]">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b625a]">
            {eyebrow}
          </p>
          <h3 className="text-lg font-semibold text-[#333333] md:text-xl">
            {label}
          </h3>
          <p className="text-[13px] leading-relaxed text-[#6b625a]">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#6b625a]">
          <span className="inline-flex items-center gap-1">
            <Sliders className="h-3.5 w-3.5" />
            Curated label templates included.
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#333333]">
            Shop this mood
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export interface CategoryMosaicProps {
  className?: string;
}

export function CategoryMosaic({ className }: CategoryMosaicProps) {
  const categoryDefs = mockData?.categories ?? [];
  const weddings = categoryDefs.find(c => c?.slug === 'weddings');
  const corporate = categoryDefs.find(c => c?.slug === 'corporate');
  const limited = categoryDefs.find(c => c?.slug === 'limited-editions');

  return (
    <section
      className={cn(
        'w-full bg-[#f5e9dc] py-14 md:py-18 lg:py-20 border-y border-[#e7d6c6]',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4 lg:pr-4">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b625a]">
              Occasions
              <span className="h-[1px] flex-1 bg-[#6b625a]" />
            </p>
            <h2 className="font-[var(--font-display,DM Sans)] text-2xl text-[#333333] sm:text-3xl">
              Hydration, edited for each kind of moment.
            </h2>
            <p className="font-[var(--font-body,Lora)] text-[13px] leading-relaxed text-[#6b625a]">
              From vows whispered on cliffside mandaps to midnight product drops in city
              warehouses, Nishant Waters shapes the way your guests meet water—quietly,
              precisely, beautifully.
            </p>
            <div className="grid grid-cols-2 gap-3 text-[12px] text-[#6b625a]">
              <div className="rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  For weddings
                </p>
                <p>Soft-focus palettes, monograms, and archival papers that age well.</p>
              </div>
              <div className="rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  For brands
                </p>
                <p>Subtle, logo-light branding for stores, launches, and studios.</p>
              </div>
            </div>
          </div>
          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CategoryTile
                label={weddings?.name ?? 'Ceremonial Waters'}
                description={
                  weddings?.description ??
                  'Soft linen textures, calligraphed initials, and discreet monograms for weddings that think past centrepieces.'
                }
                eyebrow={weddings?.tagline ?? 'Weddings & sangeets'}
                imageUrl="https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=1200&q=80"
                href="/shop?weddings"
                align="left"
              />
              <div className="flex flex-col gap-5">
                <CategoryTile
                  label={corporate?.name ?? 'Studio & brand waters'}
                  description={
                    corporate?.description ??
                    'Clean, grid-forward compositions and tonal palettes built for retail floors, ateliers, and galleries.'
                  }
                  eyebrow={corporate?.tagline ?? 'Studios & brands'}
                  imageUrl="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
                  href="/shop?corporate"
                  align="right"
                />
                <CategoryTile
                  label={limited?.name ?? 'Atelier limited runs'}
                  description={
                    limited?.description ??
                    'Seasonal collaborations, artist series, and treatments that won’t repeat. When the label is part of the story.'
                  }
                  eyebrow={limited?.tagline ?? 'Limited atelier runs'}
                  imageUrl="https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80"
                  href="/shop?limited"
                  align="left"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export interface ManifestoBandProps {
  className?: string;
}

export function ManifestoBand({ className }: ManifestoBandProps) {
  return (
    <section
      className={cn(
        'relative w-full bg-[#fff7ee] py-14 md:py-18 lg:py-20 overflow-hidden',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#f5e9dc] via-[#f5e9dc]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#f5e9dc] via-[#f5e9dc]/80 to-transparent" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="relative space-y-5 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7d6c6] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.23em] text-[#6b625a]">
              <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />
              Our manifesto
            </div>
            <p className="font-[var(--font-display,DM Sans)] text-2xl leading-snug text-[#333333] sm:text-3xl lg:text-[30px]">
              We believe water is the most democratic luxury on a table. When you{' '}
              <span className="underline decoration-[#007a8a]/60 decoration-[3px] underline-offset-[6px]">
                give it a face and a story
              </span>
              , it becomes a quiet host—holding memory, context, and care in every pour.
            </p>
            <div className="grid gap-4 text-[13px] text-[#6b625a] md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  No loud logos
                </p>
                <p>We design for the room, not the photo wall. Subtle, architectural, and timeless.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  Tactile first
                </p>
                <p>Paper stocks, varnishes, and foils chosen to be felt, not just seen.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  Circular thinking
                </p>
                <p>Materials, partners, and shipping optimised for impact without excess.</p>
              </div>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-[26px] border border-[#e7d6c6] bg-[#f5e9dc] p-4 shadow-md">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative h-40 overflow-hidden rounded-2xl bg-[#0b1720] shadow-lg md:h-48">
                  <img
                    src="https://images.unsplash.com/photo-1613638740901-4fa3f219b03b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjB0YWJsZXRvcCUyMGh5ZHJhdGlvbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDcxNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                    alt="Fine dining table with custom labeled water bottles and menus."
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    crossOrigin="anonymous"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-[#f5e9dc]/90">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1720]/80 px-2.5 py-1 font-semibold uppercase tracking-[0.24em]">
                      Studio tables
                    </span>
                    <span>Linen, bone china, and smoke glass pairings.</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div className="space-y-2 rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3">
                    <div className="flex items-center gap-2">
                      <Play className="h-3.5 w-3.5 text-[#007a8a]" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#333333]">
                        Explore the Label Studio
                      </p>
                    </div>
                    <p className="text-[12px] text-[#6b625a]">
                      See your name, venue, or brand rendered on our signature bottle in
                      under a minute.
                    </p>
                    <Link
                      to="/design"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#007a8a]"
                    >
                      Launch studio
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-dashed border-[#e7d6c6] bg-[#fff7ee] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#333333]">
                        Studio concierge
                      </p>
                      <ShoppingBag className="h-4 w-4 text-[#6b625a]" />
                    </div>
                    <p className="text-[12px] text-[#6b625a]">
                      Share your invite, menu, or lookbook and we&apos;ll respond with 3
                      label directions within 24 hours.
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#333333]"
                    >
                      Send my brief
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[#e7d6c6] pt-3 text-[11px] text-[#6b625a]">
                <div className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    Trusted by planners across Mumbai, Delhi, Dubai, and Singapore.
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1">
                  <Star className="h-3.5 w-3.5 text-[#007a8a]" />
                  <span>Average rating 4.9 from event hosts.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="no-scrollbar -mx-6 flex items-center gap-8 overflow-x-auto px-6 pt-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6b625a]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#6b625a]" />
            <span>Still · Sparkling · Mineral · Alkaline</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#6b625a]" />
            <span>Glass · Aluminium · rPET</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#6b625a]" />
            <span>Foil, emboss, deboss, spot UV</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#6b625a]" />
            <span>Minimums from 24 bottles</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export interface NewsletterSectionProps {
  className?: string;
}

export function NewsletterSection({ className }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [intent, setIntent] = useState<'hosts' | 'brands' | 'curious'>('hosts');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      className={cn(
        'w-full bg-[#f5e9dc] py-14 md:py-18 lg:py-20 border-t border-[#e7d6c6]',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6 lg:pr-6">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b625a]">
              Studio dispatch
              <span className="h-[1px] w-8 bg-[#6b625a]" />
            </p>
            <h2 className="font-[var(--font-display,DM Sans)] text-2xl text-[#333333] sm:text-3xl">
              Notes from the Nishant Waters studio.
            </h2>
            <p className="font-[var(--font-body,Lora)] text-[13px] leading-relaxed text-[#6b625a]">
              A quiet, infrequent letter about label experiments, paper stocks,
              collaborations, and how hosts across the world are rethinking water on the
              table. No discounts, no noise—just craft.
            </p>
            <div className="grid gap-3 text-[12px] text-[#6b625a] sm:grid-cols-3">
              <div className="space-y-1 rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  For hosts
                </p>
                <p>Seasonal checklists, menu pairings, and label moodboards.</p>
              </div>
              <div className="space-y-1 rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  For brands
                </p>
                <p>Retail rituals, gifting ideas, and packaging insights.</p>
              </div>
              <div className="space-y-1 rounded-2xl border border-[#e7d6c6] bg-[#fff7ee] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#333333]">
                  For the curious
                </p>
                <p>Behind-the-scenes of how we build an editorial water label.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[26px] border border-[#e7d6c6] bg-[#fff7ee] p-5 shadow-md sm:p-6">
              <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#007a8a]/10 blur-2xl" />
              <div className="relative space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.23em] text-[#6b625a]">
                  <span>Choose your lens</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIntent('hosts')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors',
                      intent === 'hosts'
                        ? 'border-[#007a8a] bg-[#007a8a] text-white'
                        : 'border-[#e7d6c6] bg-white text-[#333333] hover:border-[#007a8a] hover:text-[#007a8a]',
                    )}
                  >
                    Hosts & planners
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntent('brands')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors',
                      intent === 'brands'
                        ? 'border-[#007a8a] bg-[#007a8a] text-white'
                        : 'border-[#e7d6c6] bg-white text-[#333333] hover:border-[#007a8a] hover:text-[#007a8a]',
                    )}
                  >
                    Brands & stores
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntent('curious')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors',
                      intent === 'curious'
                        ? 'border-[#007a8a] bg-[#007a8a] text-white'
                        : 'border-[#e7d6c6] bg-white text-[#333333] hover:border-[#007a8a] hover:text-[#007a8a]',
                    )}
                  >
                    Quietly curious
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@studio, or a personal inbox you actually check"
                        className="h-11 w-full rounded-xl border border-[#e7d6c6] bg-white px-3 text-sm text-[#333333] placeholder:text-[#b0a89f] focus:border-[#007a8a] focus:outline-none focus:ring-2 focus:ring-[#007a8a]/20"
                        required
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-[#6b625a]">
                        Dispatch · Rarely
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#007a8a] px-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#006674]"
                    >
                      Join list
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-[#6b625a]">
                    By joining, you agree to receive occasional emails from Nishant Waters.
                    No tracking pixels, no third-party sharing.
                  </p>
                </form>
                <div className="grid gap-3 border-t border-dashed border-[#e7d6c6] pt-3 text-[11px] text-[#6b625a] sm:grid-cols-2">
                  <div className="inline-flex items-center gap-1.5">
                    <BottleIcon className="h-3.5 w-3.5" />
                    <span>
                      First letter: &ldquo;How to brief a water label in under 5
                      minutes.&rdquo;
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5" />
                    <span>Featuring a deep dive on rPET vs glass for event hosts.</span>
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

export function Home() {
  return (
    <div className="min-h-screen bg-[#f5e9dc] text-[#333333]">
      <Header />
      <main className="flex flex-col">
        <EditorialHero />
        <FeaturedRail />
        <CategoryMosaic />
        <ManifestoBand />
        <NewsletterSection />
      </main>
      <Footer className="mt-0" showNewsletter={false} />
      <div className="fixed right-5 bottom-5 z-40">
        <CartDrawer triggerVariant="icon" showTrigger />
      </div>
    </div>
  );
}

export default Home;