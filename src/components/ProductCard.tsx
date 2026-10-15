import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag, Star, Sparkles, Truck, ChevronRight, ChevronDown, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type {
  ID,
  MoneyValue,
  Product,
  ProductFlavorInfo,
  ProductVolumeRange,
  BottleSizeCode,
  BottleMaterial,
  BottleFinish,
  BottleCapStyle,
  HydrationProfile,
  FlavorProfile,
  ProductVariantSelection,
} from '@/types';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from '@/components/ProductDetailModal';

export interface ProductCardProps {
  product?: Product;
  index?: number;
  highlightVariant?: 'default' | 'heroRail' | 'compact';
  showCollectionTag?: boolean;
  showHydrationMeta?: boolean;
  showMinimums?: boolean;
  className?: string;
  onNavigateToProduct?: (slug: string) => void;
  onOpenDesign?: (productId: ID) => void;
}

type SwatchTone = 'light' | 'medium' | 'dark';

interface SwatchMeta {
  tone: SwatchTone;
  ring: boolean;
  label: string;
}

interface HydrationMeta {
  icon: React.ReactNode;
  label: string;
  copy: string;
}

interface BadgeConfig {
  key: string;
  label: string;
  className: string;
}

interface VariantPillProps {
  label?: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function VariantPill({
  label = '',
  active = false,
  onClick,
  disabled = false,
}: VariantPillProps) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [onClick, disabled]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors',
        'border-[#e7d6c6] text-[#6b625a] bg-[#fff7ee]/80',
        'hover:border-[#007a8a] hover:text-[#333333] hover:bg-white',
        active &&
          'border-[#007a8a] bg-[#007a8a]/10 text-[#007a8a] shadow-[0_0_0_1px_rgba(0,122,138,0.3)]',
        disabled && 'opacity-60 cursor-not-allowed hover:bg-[#fff7ee]/80 hover:text-[#6b625a]'
      )}
    >
      <span className="truncate max-w-[7rem]">{label}</span>
    </button>
  );
}

interface ColorSwatchProps {
  colorToken?: FlavorProfile;
  isActive?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

function resolveFlavorColor(flavor: FlavorProfile | undefined): string {
  if (!flavor) return '#007a8a';
  if (flavor === 'pure') return '#cfd9df';
  if (flavor === 'citrus') return '#f7c66b';
  if (flavor === 'botanical') return '#90b39d';
  if (flavor === 'berry') return '#c77ca2';
  if (flavor === 'tropical') return '#f4a259';
  if (flavor === 'herbal') return '#769f8b';
  return '#007a8a';
}

function resolveSwatchTone(hex: string): SwatchTone {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 'medium';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (lum > 0.8) return 'light';
  if (lum < 0.35) return 'dark';
  return 'medium';
}

export function ColorSwatch({
  colorToken = 'pure',
  isActive = false,
  onClick,
  ariaLabel,
}: ColorSwatchProps) {
  const backgroundHex = useMemo(() => resolveFlavorColor(colorToken), [colorToken]);
  const tone: SwatchTone = useMemo(() => resolveSwatchTone(backgroundHex), [backgroundHex]);

  const meta: SwatchMeta = useMemo(
    () => ({
      tone,
      ring: isActive,
      label: ariaLabel ?? colorToken,
    }),
    [tone, isActive, ariaLabel, colorToken]
  );

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={meta.label}
      className={cn(
        'relative inline-flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-200',
        'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007a8a]',
        meta.ring && 'scale-105'
      )}
    >
      <span
        className={cn(
          'inline-flex h-4 w-4 rounded-full border border-white shadow-sm',
          tone === 'light' && 'shadow-[0_0_0_1px_rgba(0,0,0,0.09)]',
          tone === 'dark' && 'shadow-[0_0_0_1px_rgba(255,255,255,0.5)]'
        )}
        style={{ backgroundColor: backgroundHex }}
      />
      {meta.ring && (
        <span className="pointer-events-none absolute inset-0 rounded-full border border-[#007a8a]" />
      )}
    </button>
  );
}

interface PriceMetaProps {
  startingAt?: MoneyValue;
  highlight?: boolean;
  minimumQty?: number;
  ratingAverage?: number;
  ratingCount?: number;
  formatMoney?: (money: MoneyValue) => string;
}

export function PriceMeta({
  startingAt,
  highlight = false,
  minimumQty,
  ratingAverage,
  ratingCount,
  formatMoney,
}: PriceMetaProps) {
  const display = useMemo(() => {
    if (!startingAt) return '';
    if (startingAt.formatted) return startingAt.formatted;
    if (!formatMoney) return `${startingAt.amount.toFixed(0)} ${startingAt.currency}`;
    return formatMoney(startingAt);
  }, [startingAt, formatMoney]);

  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'text-base font-semibold tracking-tight text-[#333333]',
              highlight && 'text-lg'
            )}
          >
            {display}
          </span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#6b625a]">
            per bottle
          </span>
        </div>
        {minimumQty && minimumQty > 1 && (
          <span className="mt-0.5 text-[11px] text-[#6b625a]">
            Minimum {minimumQty.toLocaleString()} units
          </span>
        )}
      </div>
      {ratingAverage && ratingAverage > 0 && (
        <div className="inline-flex items-center gap-1 rounded-full bg-[#fff7ee]/90 px-2.5 py-1 text-[11px] text-[#6b625a]">
          <Star className="h-3 w-3 fill-[#f5c26b] text-[#f5c26b]" />
          <span className="font-medium text-[#333333]">{ratingAverage.toFixed(1)}</span>
          {typeof ratingCount === 'number' && ratingCount > 0 && (
            <span className="text-[10px] text-[#6b625a]">
              ({ratingCount.toLocaleString()})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

interface ProductCardQuickMetaProps {
  hydrationProfile?: HydrationProfile;
  flavor?: ProductFlavorInfo;
  leadDays?: number;
  showHydrationMeta?: boolean;
}

export function ProductCardQuickMeta({
  hydrationProfile,
  flavor,
  leadDays,
  showHydrationMeta = true,
}: ProductCardQuickMetaProps) {
  const meta: HydrationMeta | null = useMemo(() => {
    if (!showHydrationMeta || !hydrationProfile) return null;
    if (hydrationProfile === 'sparkling') {
      return {
        icon: <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />,
        label: 'Sparkling',
        copy: 'Effervescent, crisp bubbles',
      };
    }
    if (hydrationProfile === 'mineral') {
      return {
        icon: <Truck className="h-3.5 w-3.5 text-[#007a8a]" />,
        label: 'Mineral',
        copy: 'Naturally enriched, balanced',
      };
    }
    if (hydrationProfile === 'alkaline') {
      return {
        icon: <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />,
        label: 'Alkaline',
        copy: 'Elevated pH, light mouthfeel',
      };
    }
    if (hydrationProfile === 'vitamin') {
      return {
        icon: <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />,
        label: 'Vitamin',
        copy: 'Fortified hydration, subtle flavor',
      };
    }
    return {
      icon: <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />,
      label: 'Still',
      copy: 'Silent, glassy, considered',
    };
  }, [hydrationProfile, showHydrationMeta]);

  if (!meta && !leadDays && !flavor) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#6b625a]">
      {meta && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ee]/80 px-2.5 py-1">
          {meta.icon}
          <span className="font-semibold uppercase tracking-[0.14em] text-[#333333]">
            {meta.label}
          </span>
          <span className="hidden text-[11px] sm:inline">{meta.copy}</span>
        </div>
      )}
      {flavor && flavor.tastingNotes?.length > 0 && (
        <div className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#e7d6c6] px-2.5 py-1">
          <Info className="h-3 w-3 text-[#6b625a]" />
          <span className="truncate max-w-[10rem]">
            {flavor.tastingNotes.slice(0, 2).join(' • ')}
          </span>
        </div>
      )}
      {typeof leadDays === 'number' && leadDays > 0 && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1">
          <Truck className="h-3 w-3 text-[#6b625a]" />
          <span>Ships in {leadDays}–{leadDays + 2} days</span>
        </div>
      )}
    </div>
  );
}

const badgeConfigMap: Record<string, BadgeConfig> = {
  new: {
    key: 'new',
    label: 'New Drop',
    className: 'bg-[#007a8a] text-white',
  },
  bestseller: {
    key: 'bestseller',
    label: 'Most Loved',
    className: 'bg-[#333333] text-white',
  },
  limited: {
    key: 'limited',
    label: 'Limited Run',
    className: 'bg-[#f9735b] text-white',
  },
  'online-exclusive': {
    key: 'online-exclusive',
    label: 'Online Only',
    className: 'bg-[#fff7ee] text-[#333333]',
  },
};

function getDefaultVariantSelection(product: Product | undefined): ProductVariantSelection {
  const size: BottleSizeCode =
    (product?.sizeVariants?.[0]?.code as BottleSizeCode) ?? '500ml';
  const material: BottleMaterial = product?.materialInfo?.material ?? 'glass';
  const finish: BottleFinish = product?.materialInfo?.finish ?? 'matte';
  const capStyle: BottleCapStyle = product?.materialInfo?.capStyle ?? 'bamboo';
  const hydration: HydrationProfile = product?.hydrationProfile ?? 'still';
  const flavor: FlavorProfile = product?.flavors?.[0]?.profile ?? 'pure';

  return {
    bottleSize: size,
    material,
    finish,
    capStyle,
    hydrationProfile: hydration,
    flavorProfile: flavor,
  };
}

function buildQuickVariantCopy(variant: ProductVariantSelection | null): string {
  if (!variant) return '';
  const sizeLabel = variant.bottleSize ?? '500ml';
  const profile = variant.hydrationProfile ?? 'still';
  const material = variant.material ?? 'glass';
  return `${sizeLabel} · ${profile === 'sparkling' ? 'sparkling' : 'still'} · ${material}`;
}

export function ProductCard({
  product,
  index = 0,
  highlightVariant = 'default',
  showCollectionTag = true,
  showHydrationMeta = true,
  showMinimums = true,
  className,
  onNavigateToProduct,
  onOpenDesign,
}: ProductCardProps) {
  const { addItem, openCart, formatMoney, showToast } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeFlavor, setActiveFlavor] = useState<FlavorProfile | undefined>(
    product?.flavors?.[0]?.profile
  );
  const [activeSize, setActiveSize] = useState<BottleSizeCode | undefined>(
    product?.sizeVariants?.[0]?.code
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const safeProduct: Product | null = product ?? null;

  const primaryImageUrl = useMemo(() => {
    if (!safeProduct) {
      return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80';
    }
    const primary = safeProduct.gallery?.find((img) => img?.isPrimary) ?? safeProduct.heroImage;
    return primary?.url ?? safeProduct.heroImage?.url;
  }, [safeProduct]);

  const primaryImageAlt = useMemo(() => {
    if (!safeProduct) return 'Nishant Waters custom-labeled bottle';
    const primary = safeProduct.gallery?.find((img) => img?.isPrimary) ?? safeProduct.heroImage;
    return primary?.alt ?? safeProduct.heroImage?.alt ?? safeProduct.name;
  }, [safeProduct]);

  const defaultVariant = useMemo(
    () => getDefaultVariantSelection(safeProduct ?? undefined),
    [safeProduct]
  );

  const effectiveVariant: ProductVariantSelection | null = useMemo(() => {
    if (!safeProduct) return null;
    return {
      ...defaultVariant,
      bottleSize: (activeSize ?? defaultVariant.bottleSize) as BottleSizeCode,
      flavorProfile: (activeFlavor ?? defaultVariant.flavorProfile) as FlavorProfile,
    };
  }, [safeProduct, defaultVariant, activeFlavor, activeSize]);

  const quickVariantCopy = useMemo(
    () => buildQuickVariantCopy(effectiveVariant),
    [effectiveVariant]
  );

  const minimumQty = useMemo<number | undefined>(() => {
    if (!safeProduct || !showMinimums) return undefined;
    return safeProduct.minimums?.defaultMinimumQuantity ?? safeProduct.pricingTable?.[0]?.minQty;
  }, [safeProduct, showMinimums]);

  const badges = useMemo<BadgeConfig[]>(() => {
    if (!safeProduct?.badges?.length) return [];
    return safeProduct.badges
      .map((badgeKey) => badgeConfigMap[badgeKey])
      .filter((b) => Boolean(b));
  }, [safeProduct]);

  const flavorOptions: ProductFlavorInfo[] = useMemo(
    () => safeProduct?.flavors ?? [],
    [safeProduct]
  );

  const sizeOptions: ProductVolumeRange[] = useMemo(
    () => safeProduct?.sizeVariants ?? [],
    [safeProduct]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleToggleWishlist = useCallback(() => {
    setIsWishlisted((prev) => !prev);
  }, []);

  const handleSizeSelect = useCallback((code: BottleSizeCode) => {
    setActiveSize(code);
  }, []);

  const handleFlavorSelect = useCallback((profile: FlavorProfile) => {
    setActiveFlavor(profile);
  }, []);

  const handleNavigate = useCallback(() => {
    if (safeProduct?.meta?.slug) {
      onNavigateToProduct?.(safeProduct.meta.slug);
    }
  }, [safeProduct, onNavigateToProduct]);

  const handleQuickViewOpen = useCallback(() => {
    if (!safeProduct) return;
    setIsQuickViewOpen(true);
  }, [safeProduct]);

  const handleQuickViewClose = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const handleOpenDesign = useCallback(() => {
    if (!safeProduct?.id) return;
    onOpenDesign?.(safeProduct.id);
  }, [safeProduct, onOpenDesign]);

  const handleAddToCart = useCallback(() => {
    if (!safeProduct || !effectiveVariant) return;
    if (isAdding) return;

    setIsAdding(true);
    const quantity = Math.max(minimumQty ?? 24, 12);
    const unitPrice: MoneyValue = safeProduct.startingAtPrice ?? safeProduct.basePrice;
    const lineSubtotal: MoneyValue = {
      ...unitPrice,
      amount: unitPrice.amount * quantity,
    };
    const lineTotal: MoneyValue = { ...lineSubtotal };

    const baseItem = {
      productId: safeProduct.id,
      productName: safeProduct.name,
      productSlug: safeProduct.meta?.slug ?? safeProduct.sku,
      productThumbnail: safeProduct.heroImage?.url ?? primaryImageUrl,
      variant: effectiveVariant,
      unitPrice,
      quantity,
      lineSubtotal,
      lineTotal,
      customizations: [],
      lineDiscount: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addItem(baseItem);

    const formattedTotal = formatMoney?.(lineTotal) ?? `${lineTotal.amount} ${lineTotal.currency}`;

    toast.success('Added to cart', {
      description: `${safeProduct.name} · ${quickVariantCopy} · ${quantity.toLocaleString()} units (${formattedTotal})`,
    });

    showToast?.({
      title: 'Cart updated',
      description: `${safeProduct.name} has been added.`,
      intent: 'success',
    });

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 280);
  }, [
    safeProduct,
    effectiveVariant,
    minimumQty,
    isAdding,
    formatMoney,
    quickVariantCopy,
    addItem,
    openCart,
    primaryImageUrl,
    showToast,
  ]);

  const rootPadding = highlightVariant === 'heroRail' ? 'p-3 md:p-4' : 'p-3';
  const elevationClass =
    highlightVariant === 'heroRail'
      ? 'hover:shadow-[0_18px_45px_rgba(15,23,42,0.20)]'
      : 'hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]';

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{
          duration: 0.55,
          delay: Math.min(index * 0.04, 0.32),
          ease: [0.19, 1, 0.22, 1],
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'group relative flex h-full flex-col rounded-[18px] border border-[#e7d6c6]/80 bg-[#fff7ee] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]',
          elevationClass,
          'transition-all duration-500',
          rootPadding,
          className
        )}
      >
        {badges?.length > 0 && (
          <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-col items-start gap-1.5">
            {badges.slice(0, 2).map((badge) => (
              <span
                key={badge.key}
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
                  badge.className
                )}
              >
                {badge.key === 'limited' && (
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white" />
                )}
                {badge.label}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-pressed={isWishlisted}
          className={cn(
            'absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7d6c6]/80 bg-[#fff7ee]/90 backdrop-blur-sm',
            'transition-colors hover:border-[#007a8a] hover:bg-white'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isWishlisted ? 'fill-[#f9735b] text-[#f9735b]' : 'text-[#6b625a]'
            )}
          />
        </button>

        <div
          className={cn(
            'relative mb-3 overflow-hidden rounded-[16px] bg-[#f5e9dc]',
            'aspect-[3/4]',
            'border border-[#e7d6c6]/80'
          )}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.04 : 1 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          >
            <img
              src={primaryImageUrl}
              crossOrigin="anonymous"
              alt={primaryImageAlt}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120f0a]/40 via-transparent to-transparent" />

          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div className="flex max-w-[70%] flex-col gap-1 text-left">
              {showCollectionTag && safeProduct && (
                <span className="inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  {safeProduct.collection ?? 'Signature'} collection
                </span>
              )}
              <h3 className="line-clamp-2 text-sm font-medium text-[#fefaf5]">
                {safeProduct?.name ?? 'Nishant Waters Custom Bottle'}
              </h3>
            </div>

            <div className="flex flex-col items-end gap-1">
              {quickVariantCopy && (
                <span className="inline-flex items-center rounded-full bg-[#fff7ee]/90 px-2 py-0.5 text-[10px] font-medium text-[#333333]">
                  {quickVariantCopy}
                </span>
              )}

              <div className="flex gap-1.5">
                <motion.button
                  type="button"
                  onClick={handleQuickViewOpen}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-[#fff7ee]/95 px-2.5 text-[11px] font-medium text-[#333333] shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <span>Preview</span>
                  <ChevronRight className="h-3 w-3" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product || isAdding}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-full bg-[#007a8a] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm',
                    'transition-colors hover:bg-[#006674]',
                    (!product || isAdding) && 'cursor-not-allowed opacity-75'
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{isAdding ? 'Adding…' : 'Quick add'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3 pt-0.5">
          <div>
            {safeProduct?.subtitle && (
              <p className="mb-0.5 text-[11px] uppercase tracking-[0.16em] text-[#6b625a]">
                {safeProduct.subtitle}
              </p>
            )}
            <button
              type="button"
              onClick={handleNavigate}
              className="text-left text-sm font-semibold text-[#333333] transition-colors hover:text-[#007a8a]"
            >
              <span className="line-clamp-2">{safeProduct?.name ?? 'Custom water label'}</span>
            </button>
            {safeProduct?.description && (
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#6b625a]">
                {safeProduct.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {flavorOptions.length > 0 && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {flavorOptions.slice(0, 4).map((flavor) => (
                    <ColorSwatch
                      key={flavor.profile}
                      colorToken={flavor.profile}
                      isActive={activeFlavor === flavor.profile}
                      onClick={() => handleFlavorSelect(flavor.profile)}
                      ariaLabel={flavor.profile}
                    />
                  ))}
                </div>
                {flavorOptions.length > 1 && (
                  <span className="text-[11px] text-[#6b625a]">
                    {flavorOptions.length} infusions
                  </span>
                )}
              </div>
            )}

            {sizeOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {sizeOptions.slice(0, 3).map((size) => (
                  <VariantPill
                    key={size.code}
                    label={size.code}
                    active={activeSize === size.code}
                    onClick={() => handleSizeSelect(size.code)}
                  />
                ))}
                {sizeOptions.length > 3 && (
                  <span className="text-[11px] text-[#6b625a]">
                    +{sizeOptions.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-1 space-y-2">
            <PriceMeta
              startingAt={safeProduct?.startingAtPrice ?? safeProduct?.basePrice}
              highlight={highlightVariant === 'heroRail'}
              minimumQty={minimumQty}
              ratingAverage={safeProduct?.rating?.average}
              ratingCount={safeProduct?.rating?.count}
              formatMoney={formatMoney}
            />

            <ProductCardQuickMeta
              hydrationProfile={safeProduct?.hydrationProfile}
              flavor={flavorOptions[0]}
              leadDays={safeProduct?.fulfilment?.productionLeadDays}
              showHydrationMeta={showHydrationMeta}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-dashed border-[#e7d6c6] pt-2.5">
            <div className="flex items-center gap-2">
              {safeProduct?.designCapability?.canCustomizeLabel && (
                <button
                  type="button"
                  onClick={handleOpenDesign}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full bg-[#fff7ee] px-2.5 py-1 text-[11px] font-medium text-[#333333]',
                    'transition-colors hover:bg-white'
                  )}
                >
                  <Sparkles className="h-3 w-3 text-[#007a8a]" />
                  <span>Design label</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleNavigate}
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b625a] transition-colors hover:text-[#007a8a]"
            >
              <span>View details</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {isQuickViewOpen && safeProduct && (
          <ProductDetailModal
            product={safeProduct}
            open={isQuickViewOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleQuickViewClose();
              }
            }}
            defaultVariant={effectiveVariant ?? defaultVariant}
            onAddToCart={handleAddToCart}
            onDesign={handleOpenDesign}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductCard;