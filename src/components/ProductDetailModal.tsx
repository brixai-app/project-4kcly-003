import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Circle as ChevronLeft, ChevronRight, HelpCircle, Info, ShoppingBag, Sparkles, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  CartItemCustomization,
  CartItemLabelCustomization,
  HydrationProfile,
  ID,
  LabelDesign,
  MoneyValue,
  Product,
  ProductVariantSelection,
} from '@/types';
import { useCart } from '@/context/CartContext';
import mockData, { products } from '@/data/mockData';

export interface ProductDetailModalProps {
  productId?: ID;
  productSlug?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  initialVariant?: Partial<ProductVariantSelection>;
  enableDesignCta?: boolean;
  trigger?: React.ReactNode;
  className?: string;
}

interface VariantSelectorOptionProps {
  label?: string;
  value?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface QuantityStepperProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

interface HydrationChipProps {
  profile?: HydrationProfile;
  active?: boolean;
  onClick?: () => void;
}

interface GalleryThumbnailProps {
  src?: string;
  alt?: string;
  active?: boolean;
  index?: number;
  onClick?: () => void;
}

interface ProductMetaPillProps {
  label?: string;
  value?: string;
}

interface DesignBadgeProps {
  product?: Product | null;
}

const SIZE_LABELS: Record<string, string> = {
  '250ml': '250 ml',
  '330ml': '330 ml',
  '500ml': '500 ml',
  '750ml': '750 ml',
  '1L': '1 L',
};

const HYDRATION_LABELS: Record<HydrationProfile, string> = {
  still: 'Still',
  sparkling: 'Sparkling',
  mineral: 'Mineral',
  alkaline: 'Alkaline',
  vitamin: 'Vitamin',
};

export function VariantSelectorOption({
  label = '',
  value = '',
  active = false,
  disabled = false,
  onClick,
}: VariantSelectorOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors',
        'bg-[#fff7ee] border-[#e7d6c6] text-[#6b625a]',
        'hover:border-[#007a8a] hover:text-[#333333]',
        active &&
          'border-[#007a8a] bg-[#007a8a]/5 text-[#333333] shadow-sm shadow-[#007a8a]/20',
        disabled && 'cursor-not-allowed opacity-50 hover:border-[#e7d6c6]',
      )}
      aria-pressed={active}
      aria-label={label || value}
    >
      <span>{label || value}</span>
      {active ? (
        <Check className="ml-1.5 h-3.5 w-3.5 text-[#007a8a]" />
      ) : null}
    </button>
  );
}

export function QuantityStepper({
  value = 1,
  min = 1,
  max = 9999,
  step = 1,
  onChange,
}: QuantityStepperProps) {
  const handleChange = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    if (clamped !== value) {
      onChange?.(clamped);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (Number.isNaN(parsed)) {
      onChange?.(min);
      return;
    }
    handleChange(parsed);
  };

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-[#e7d6c6] bg-[#fff7ee]">
      <button
        type="button"
        onClick={() => handleChange(value - step)}
        className="flex h-9 w-9 items-center justify-center border-r border-[#e7d6c6] text-[#333333] transition-colors hover:bg-[#f5e9dc]"
        aria-label="Decrease quantity"
      >
        <span className="sr-only">Decrease</span>
        <span className="text-lg leading-none">-</span>
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={handleInputChange}
        className="h-9 w-16 border-0 bg-transparent text-center text-sm font-medium text-[#333333] focus:outline-none focus:ring-0"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => handleChange(value + step)}
        className="flex h-9 w-9 items-center justify-center border-l border-[#e7d6c6] text-[#333333] transition-colors hover:bg-[#f5e9dc]"
        aria-label="Increase quantity"
      >
        <span className="sr-only">Increase</span>
        <span className="text-lg leading-none">+</span>
      </button>
    </div>
  );
}

export function HydrationChip({
  profile = 'still',
  active = false,
  onClick,
}: HydrationChipProps) {
  const label = HYDRATION_LABELS[profile];
  const accentClass =
    profile === 'sparkling'
      ? 'border-[#007a8a] bg-[#007a8a]/5'
      : profile === 'vitamin'
      ? 'border-[#f97360] bg-[#f97360]/5'
      : 'border-[#e7d6c6] bg-[#fff7ee]';
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide text-[#6b625a] transition-colors',
        accentClass,
        active &&
          'border-[#007a8a] bg-[#007a8a] text-white shadow-sm shadow-[#007a8a]/30',
        'hover:border-[#007a8a] hover:bg-[#007a8a]/10 hover:text-[#333333]',
      )}
      aria-pressed={active}
    >
      <span className="relative flex h-1.5 w-4 items-center overflow-hidden rounded-full bg-[#e7d6c6]">
        <span
          className={cn(
            'h-full w-2 rounded-full bg-[#007a8a] transition-transform duration-500',
            active ? 'translate-x-2' : 'translate-x-0',
          )}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

export function GalleryThumbnail({
  src = '',
  alt = '',
  active = false,
  index = 0,
  onClick,
}: GalleryThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative aspect-[3/4] w-16 overflow-hidden rounded-xl border transition-all',
        'border-[#e7d6c6] bg-[#fff7ee]',
        'hover:border-[#007a8a] hover:shadow-sm hover:shadow-[#007a8a]/20',
        active && 'border-[#007a8a] shadow-sm shadow-[#007a8a]/30',
      )}
      aria-label={alt || `View image ${index + 1}`}
      aria-pressed={active}
    >
      <img
        src={src}
        alt={alt || `Gallery image ${index + 1}`}
        crossOrigin="anonymous"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {active ? (
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#007a8a] ring-offset-2 ring-offset-[#f5e9dc]" />
      ) : null}
    </button>
  );
}

export function ProductMetaPill({
  label = '',
  value = '',
}: ProductMetaPillProps) {
  if (!label && !value) return null;
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#fff7ee] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b625a]">
      <span className="text-[9px] text-[#c3b4a5]">{label}</span>
      <span className="text-[#333333]">{value}</span>
    </div>
  );
}

export function DesignBadge({ product = null }: DesignBadgeProps) {
  if (!product?.designCapability?.canCustomizeLabel) {
    return null;
  }
  const supportsMonogram = product.designCapability.supportsMonogram;
  const supportsLogo = product.designCapability.supportsLogoUpload;
  const supportsFoil = product.designCapability.supportsFoilStamp;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#007a8a]/30 bg-[#007a8a]/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#007a8a]">
      <Sparkles className="h-3 w-3" />
      <span>Label Studio</span>
      <span className="text-[#6b625a]">
        {(supportsMonogram ? 'Monogram' : '')}
        {supportsMonogram && supportsLogo ? ' • ' : ''}
        {(supportsLogo ? 'Logos' : '')}
        {supportsFoil ? ' • Foil' : ''}
      </span>
    </div>
  );
}

export function formatMoneyLocal(money: MoneyValue | null | undefined) {
  if (!money) return '';
  const amount = money.amount ?? 0;
  const currency = money.currency ?? 'INR';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export function buildDefaultVariant(product: Product | null): ProductVariantSelection {
  if (!product) {
    return {
      bottleSize: '500ml',
      material: 'rPET',
      finish: 'matte',
      capStyle: 'twist',
      hydrationProfile: product?.hydrationProfile ?? 'still',
      flavorProfile: product?.flavors?.[0]?.profile ?? 'pure',
    };
  }
  const defaultSize = product.sizeVariants?.[0]?.code ?? '500ml';
  const defaultFlavor = product.flavors?.[0]?.profile ?? 'pure';
  return {
    bottleSize: defaultSize,
    material: product.materialInfo?.material ?? 'rPET',
    finish: product.materialInfo?.finish ?? 'matte',
    capStyle: product.materialInfo?.capStyle ?? 'twist',
    hydrationProfile: product.hydrationProfile ?? 'still',
    flavorProfile: defaultFlavor,
  };
}

export function ProductDetailModal({
  productId,
  productSlug,
  open,
  defaultOpen = false,
  onOpenChange,
  onClose,
  initialVariant,
  enableDesignCta = true,
  trigger,
  className,
}: ProductDetailModalProps) {
  const navigate = useNavigate();
  const { addItem, formatMoney, showToast, openCart } = useCart();
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(24);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [focusedOnMount, setFocusedOnMount] = useState<boolean>(false);
  const [hydrationHover, setHydrationHover] = useState<HydrationProfile | null>(null);

  const closeTimeoutRef = useRef<number | null>(null);
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);

  const resolvedOpen = open ?? internalOpen;

  const product: Product | null = useMemo(() => {
    if (!products || !Array.isArray(products)) return null;
    if (productId) {
      return (products.find(p => p.id === productId) as Product | undefined) ?? null;
    }
    if (productSlug) {
      return (products.find(p => p.meta?.slug === productSlug) as Product | undefined) ?? null;
    }
    return null;
  }, [productId, productSlug]);

  const [variant, setVariant] = useState<ProductVariantSelection>(() => {
    const base = buildDefaultVariant(product);
    if (!initialVariant) return base;
    return {
      ...base,
      ...initialVariant,
    };
  });

  useEffect(() => {
    const base = buildDefaultVariant(product);
    setVariant(prev => ({
      ...base,
      ...prev,
      ...initialVariant,
    }));
  }, [product, initialVariant]);

  useEffect(() => {
    if (resolvedOpen && !focusedOnMount) {
      const id = window.setTimeout(() => {
        if (initialFocusRef.current) {
          initialFocusRef.current.focus();
        }
        setFocusedOnMount(true);
      }, 40);
      return () => {
        window.clearTimeout(id);
      };
    }
    return undefined;
  }, [resolvedOpen, focusedOnMount]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleChangeOpen = (next: boolean) => {
    if (open === undefined) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
    if (!next) {
      onClose?.();
      setActiveImageIndex(0);
      setFocusedOnMount(false);
    }
  };

  const minQty = product?.minimums?.defaultMinimumQuantity ?? 24;
  useEffect(() => {
    setQuantity(prev => (prev < minQty ? minQty : prev));
  }, [minQty]);

  const handleSelectSize = (sizeCode: string) => {
    setVariant(prev => ({
      ...prev,
      bottleSize: sizeCode as any,
    }));
  };

  const handleSelectHydration = (profile: HydrationProfile) => {
    setVariant(prev => ({
      ...prev,
      hydrationProfile: profile,
      flavorProfile:
        product?.flavors?.find(f => f.profile === profile)?.profile ??
        prev.flavorProfile,
    }));
  };

  const handleAddToCart = useCallback(() => {
    if (!product) {
      toast.error('Unable to add to cart. Product not found.');
      return;
    }
    if (quantity < minQty) {
      const message = `Minimum order for this bottle is ${minQty.toLocaleString()} units.`;
      toast.warning(message);
      showToast({
        title: 'Increase quantity to proceed',
        description: message,
        intent: 'warning',
      });
      return;
    }
    if (isAdding) return;
    setIsAdding(true);

    const pricingForQty =
      product.pricingTable?.slice().reverse().find(row => quantity >= (row.minQty ?? 0)) ??
      null;
    const unitPrice = pricingForQty?.unitPrice ?? product.basePrice ?? product.startingAtPrice;

    const lineSubtotal: MoneyValue = {
      ...(unitPrice ?? { amount: 0, currency: product.basePrice?.currency ?? 'INR' }),
      amount: (unitPrice?.amount ?? 0) * quantity,
    };

    const lineTotal: MoneyValue = {
      ...lineSubtotal,
    };

    const now = new Date().toISOString();

    const labelCustomizations: CartItemCustomization[] = [];

    const itemBase: Omit<
      import('@/types').CartItem,
      'id' | 'createdAt' | 'updatedAt'
    > = {
      productId: product.id,
      productName: product.name,
      productSlug: product.meta?.slug ?? '',
      productThumbnail: product.heroImage?.url ?? '',
      variant,
      unitPrice,
      quantity,
      lineSubtotal,
      lineTotal,
      customizations: labelCustomizations,
    };

    addItem({
      ...itemBase,
      createdAt: now,
      updatedAt: now,
      id: (crypto.randomUUID() as ID) ?? (String(Date.now()) as ID),
    });

    const formattedUnit = formatMoney(unitPrice);
    const formattedTotal = formatMoney(lineTotal);

    const title = 'Added to cart';
    const description = `${product.name} • ${quantity.toLocaleString()} units • ${formattedUnit}/unit • ${formattedTotal} total`;

    toast.success(title, {
      description,
    });

    showToast({
      title,
      description,
      intent: 'success',
    });

    closeTimeoutRef.current = window.setTimeout(() => {
      setIsAdding(false);
      handleChangeOpen(false);
      openCart();
    }, 480);
  }, [
    product,
    quantity,
    minQty,
    isAdding,
    variant,
    addItem,
    formatMoney,
    showToast,
    openCart,
  ]);

  const handleGoToDesign = () => {
    if (!product) return;
    const designState: Partial<LabelDesign> = {
      productId: product.id,
      name: `${product.name} – Quick Label`,
      isDirty: true,
    };
    const encoded = window.btoa(JSON.stringify(designState));
    navigate(`/design?from=modal&product=${product.meta?.slug ?? ''}&seed=${encoded}`);
    handleChangeOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveImageIndex(prev => {
        const gallery = product?.gallery ?? [];
        if (!gallery.length) return 0;
        return (prev + 1) % gallery.length;
      });
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveImageIndex(prev => {
        const gallery = product?.gallery ?? [];
        if (!gallery.length) return 0;
        return (prev - 1 + gallery.length) % gallery.length;
      });
    }
  };

  const gallery = useMemo(() => {
    if (!product) return [];
    if (!product.gallery || !product.gallery.length) {
      return product.heroImage ? [product.heroImage] : [];
    }
    return product.gallery;
  }, [product]);

  const ratingLabel = useMemo(() => {
    if (!product) return '';
    const avg = product.rating?.average ?? 0;
    const count = product.rating?.count ?? 0;
    if (!avg || !count) return '';
    return `${avg.toFixed(1)} • ${count.toLocaleString()} tastings`;
  }, [product]);

  const minimumLabel = useMemo(() => {
    if (!product) return '';
    const qty = product.minimums?.defaultMinimumQuantity ?? 0;
    if (!qty) return '';
    return `${qty.toLocaleString()} bottle minimum`;
  }, [product]);

  const hydrationDescription = useMemo(() => {
    const profile =
      hydrationHover ??
      variant?.hydrationProfile ??
      product?.hydrationProfile ??
      'still';
    if (!product) return '';
    const flavor = product.flavors?.find(f => f.profile === profile);
    if (!flavor) return '';
    const notes = flavor.tastingNotes?.slice(0, 3) ?? [];
    return `${HYDRATION_LABELS[profile]} • ${notes.join(' • ')}`;
  }, [product, variant, hydrationHover]);

  const renderPricingSummary = () => {
    if (!product) return null;
    const pricingForQty =
      product.pricingTable?.slice().reverse().find(row => quantity >= (row.minQty ?? 0)) ??
      null;
    const unitPrice = pricingForQty?.unitPrice ?? product.basePrice ?? product.startingAtPrice;
    const lineTotal: MoneyValue | null = unitPrice
      ? {
          ...unitPrice,
          amount: (unitPrice.amount ?? 0) * quantity,
        }
      : null;

    const formattedUnit = formatMoney(unitPrice ?? null) || formatMoneyLocal(unitPrice ?? null);
    const formattedTotal =
      formatMoney(lineTotal ?? null) || formatMoneyLocal(lineTotal ?? null);

    return (
      <div className="mt-4 flex flex-col gap-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.18em] text-[#6b625a]">
            Est. total ({quantity.toLocaleString()} units)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-[#333333]">
              {formattedTotal}
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#6b625a]">
              ~ {formattedUnit}/unit
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#6b625a]">
          <span>
            Includes water, label print, and basic packing. Shipping calculated at checkout.
          </span>
        </div>
      </div>
    );
  };

  const surfaceBg = 'bg-[#f5e9dc]';
  const panelBg = 'bg-[#fff7ee]';

  return (
    <Dialog.Root open={resolvedOpen} onOpenChange={handleChangeOpen}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <AnimatePresence>
          {resolvedOpen ? (
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className={cn(
                  'fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]',
                  'data-[state=open]:animate-in data-[state=closed]:animate-out',
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dialog.Content asChild>
                  <motion.div
                    className={cn(
                      'fixed inset-y-4 left-1/2 z-50 flex w-[min(1120px,100%-1.5rem)] -translate-x-1/2 items-stretch overflow-hidden rounded-[22px] border border-[#e7d6c6] shadow-2xl shadow-black/30',
                      surfaceBg,
                      className,
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-label={product?.name ?? 'Product quick view'}
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 16 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.9 }}
                    onKeyDown={handleKeyDown}
                  >
                    <div className="grid h-full w-full grid-cols-12 bg-gradient-to-br from-[#f5e9dc] via-[#f5e9dc] to-[#f3e4d4]">
                      <div className="relative col-span-12 flex flex-col border-r border-[#e7d6c6]/80 lg:col-span-6">
                        <div className="flex items-center justify-between px-5 pt-4 pb-2 lg:px-6">
                          <div className="flex items-center gap-3">
                            <Dialog.Close asChild>
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee] text-[#6b625a] transition-colors hover:border-[#007a8a] hover:text-[#333333]"
                                aria-label="Close quick view"
                              >
                                <ArrowLeft className="h-4 w-4" />
                              </button>
                            </Dialog.Close>
                            <div className="flex flex-col gap-0">
                              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                Nishant Waters
                              </span>
                              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#6b625a]">
                                Quick look
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {product?.collection ? (
                              <ProductMetaPill
                                label="Collection"
                                value={product.collection}
                              />
                            ) : null}
                            <div className="hidden items-center gap-1 rounded-full border border-[#e7d6c6] bg-[#fff7ee] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b625a] lg:inline-flex">
                              <Info className="h-3 w-3" />
                              <span>Arrow keys: Gallery</span>
                            </div>
                          </div>
                        </div>
                        <div className="relative flex-1 px-5 pb-4 pt-2 lg:px-6 lg:pb-6">
                          <div className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e7d6c6] bg-[#fff7ee]">
                            <div className="absolute inset-x-6 top-4 z-10 flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                {product?.badges?.length ? (
                                  <div className="inline-flex items-center gap-1 rounded-full bg-[#333333]/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                                    <span className="h-1 w-1 rounded-full bg-[#f97360]" />
                                    <span>{product.badges[0]}</span>
                                    {product.badges[1] ? (
                                      <span className="text-[#f5e9dc]">
                                        • {product.badges[1]}
                                      </span>
                                    ) : null}
                                  </div>
                                ) : null}
                                {ratingLabel ? (
                                  <div className="inline-flex items-center gap-1 rounded-full bg-[#fff7ee]/90 px-2.5 py-1 text-[11px] font-medium text-[#333333] shadow-sm shadow-black/10 backdrop-blur">
                                    <Star className="h-3 w-3 fill-[#fbbf24] text-[#f59e0b]" />
                                    <span>{ratingLabel}</span>
                                  </div>
                                ) : null}
                              </div>
                              {minimumLabel ? (
                                <div className="hidden items-center gap-1 rounded-full bg-[#333333]/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f5e9dc] backdrop-blur lg:inline-flex">
                                  <span>{minimumLabel}</span>
                                </div>
                              ) : null}
                            </div>
                            <div className="relative flex flex-1 flex-col gap-3 px-4 pb-4 pt-10 lg:flex-row lg:pb-5 lg:pt-12">
                              <div className="relative flex-1 overflow-hidden rounded-[18px] bg-[#f5e9dc]">
                                <div className="pointer-events-none absolute inset-x-10 bottom-4 z-10 hidden h-32 rounded-full bg-[#000000]/15 blur-3xl lg:block" />
                                <div className="relative flex h-full items-center justify-center p-3 lg:p-4">
                                  <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-[18px] border border-[#e7d6c6] bg-[#f5e9dc] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                                    {gallery[activeImageIndex] ? (
                                      <img
                                        src={
                                          gallery[activeImageIndex].url ??
                                          'https://images.unsplash.com/photo-1762423255554-afdb20ca0c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop'
                                        }
                                        alt={
                                          gallery[activeImageIndex].alt ??
                                          product?.name ??
                                          'Bottle preview'
                                        }
                                        crossOrigin="anonymous"
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <img
                                        src="https://images.unsplash.com/photo-1762423255554-afdb20ca0c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                                        alt="Bottle preview"
                                        crossOrigin="anonymous"
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
                                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-[#333333]/70 px-3 py-2 text-[11px] text-[#f5e9dc] backdrop-blur">
                                      <div className="flex items-center gap-1.5">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f5e9dc]/10 text-[11px]">
                                          {SIZE_LABELS[variant.bottleSize] ??
                                            variant.bottleSize}
                                        </span>
                                        <span className="uppercase tracking-[0.18em]">
                                          {HYDRATION_LABELS[variant.hydrationProfile]}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="h-1 w-10 rounded-full bg-gradient-to-r from-[#f97360] via-[#facc15] to-[#34d399]" />
                                        <span className="text-[10px] uppercase tracking-[0.18em] text-[#f5e9dc]/90">
                                          Chill & serve at 6–8°C
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#f97360]/20 blur-3xl" />
                                <div className="pointer-events-none absolute -right-14 bottom-[-5rem] h-56 w-56 rounded-full bg-[#007a8a]/25 blur-3xl" />
                              </div>
                              <div className="mt-2 flex flex-row items-start justify-between gap-2 lg:mt-0 lg:flex-col lg:items-stretch">
                                <div className="flex flex-col gap-2 lg:gap-3">
                                  <div className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b625a] lg:block">
                                    Gallery
                                  </div>
                                  <div className="flex flex-row gap-2 overflow-x-auto pb-1 pt-0.5 lg:flex-col lg:pb-0">
                                    {gallery.map((image, index) => (
                                      <GalleryThumbnail
                                        key={image.id ?? `${index}`}
                                        src={
                                          image.url ??
                                          'https://images.unsplash.com/photo-1762423255554-afdb20ca0c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop'
                                        }
                                        alt={image.alt ?? product?.name ?? 'Bottle image'}
                                        index={index}
                                        active={index === activeImageIndex}
                                        onClick={() => setActiveImageIndex(index)}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="hidden gap-2 lg:flex lg:flex-col">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveImageIndex(prev => {
                                        const total = gallery.length;
                                        if (!total) return 0;
                                        return (prev - 1 + total) % total;
                                      })
                                    }
                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#e7d6c6] bg-[#fff7ee] px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6b625a] transition-colors hover:border-[#007a8a] hover:text-[#333333]"
                                  >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    Prev
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveImageIndex(prev => {
                                        const total = gallery.length;
                                        if (!total) return 0;
                                        return (prev + 1) % total;
                                      })
                                    }
                                    className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#e7d6c6] bg-[#fff7ee] px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6b625a] transition-colors hover:border-[#007a8a] hover:text-[#333333]"
                                  >
                                    Next
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative col-span-12 flex flex-col lg:col-span-6">
                        <div className={cn('flex-1 overflow-y-auto', panelBg)}>
                          <div className="flex h-full flex-col px-5 pb-4 pt-4 lg:px-6 lg:pb-5 lg:pt-5">
                            <div className="flex flex-col gap-3 border-b border-[#e7d6c6] pb-4 lg:gap-4 lg:pb-5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                    {product?.category ? (
                                      <ProductMetaPill
                                        label="For"
                                        value={product.category}
                                      />
                                    ) : null}
                                    {product?.hydrationProfile ? (
                                      <HydrationChip
                                        profile={product.hydrationProfile}
                                        active
                                      />
                                    ) : null}
                                  </div>
                                  <h2 className="font-display text-2xl font-medium tracking-tight text-[#333333] sm:text-3xl">
                                    {product?.name ?? 'Nishant Waters Signature Bottle'}
                                  </h2>
                                  {product?.subtitle ? (
                                    <p className="mt-1 text-sm text-[#6b625a]">
                                      {product.subtitle}
                                    </p>
                                  ) : (
                                    <p className="mt-1 text-sm text-[#6b625a]">
                                      Custom-labeled, hospitality-grade hydration for events,
                                      weddings, and elevated everyday rituals.
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    ref={initialFocusRef}
                                    type="button"
                                    onClick={() => handleChangeOpen(false)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee] text-[#6b625a] transition-colors hover:border-[#007a8a] hover:text-[#333333]"
                                    aria-label="Close"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                  {product ? <DesignBadge product={product} /> : null}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-3 text-sm text-[#6b625a] sm:grid-cols-3">
                                <div className="col-span-1 flex flex-col gap-1">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                    Starting at
                                  </span>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-semibold text-[#333333]">
                                      {formatMoney(product?.startingAtPrice ?? null) ||
                                        formatMoneyLocal(product?.startingAtPrice ?? null)}
                                    </span>
                                    <span className="text-[11px] text-[#6b625a]">
                                      per bottle
                                    </span>
                                  </div>
                                  {minimumLabel ? (
                                    <span className="text-[11px] text-[#6b625a]">
                                      {minimumLabel}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="col-span-1 flex flex-col gap-1">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                    Production
                                  </span>
                                  <span className="text-sm text-[#333333]">
                                    {product?.fulfilment?.productionLeadDays
                                      ? `${product.fulfilment.productionLeadDays} business days`
                                      : '4–6 business days'}
                                  </span>
                                  <span className="text-[11px] text-[#6b625a]">
                                    From{' '}
                                    {product?.fulfilment?.shipsFromCity ?? 'Mumbai'} • Rush
                                    options at checkout
                                  </span>
                                </div>
                                <div className="col-span-1 flex flex-col gap-1">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                    Material
                                  </span>
                                  <span className="text-sm text-[#333333]">
                                    {product?.materialInfo?.material === 'glass'
                                      ? 'Italian glass'
                                      : product?.materialInfo?.material === 'aluminium'
                                      ? 'Lightweight aluminium'
                                      : product?.materialInfo?.material === 'stainless'
                                      ? 'Brushed stainless steel'
                                      : 'rPET, made from recycled plastic'}
                                  </span>
                                  <span className="text-[11px] text-[#6b625a]">
                                    {product?.materialInfo?.bpaFree ? 'BPA-free' : 'Food safe'} •{' '}
                                    {product?.materialInfo?.recyclable
                                      ? 'Fully recyclable'
                                      : 'Reusable vessel'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-col gap-4 sm:gap-5">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                    Choose your mood
                                  </span>
                                  {hydrationDescription ? (
                                    <span className="text-[11px] text-[#6b625a]">
                                      {hydrationDescription}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {(product?.flavors ?? []).map(flavor => (
                                    <HydrationChip
                                      key={flavor.profile}
                                      profile={flavor.profile}
                                      active={variant.flavorProfile === flavor.profile}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          flavorProfile: flavor.profile,
                                          hydrationProfile:
                                            product.hydrationProfile ?? prev.hydrationProfile,
                                        }))
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                    Bottle size
                                  </span>
                                  <span className="text-[11px] text-[#6b625a]">
                                    Tailored for your service style
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {(product?.sizeVariants ?? []).map(size => (
                                    <VariantSelectorOption
                                      key={size.code}
                                      label={SIZE_LABELS[size.code] ?? size.code}
                                      value={size.code}
                                      active={variant.bottleSize === size.code}
                                      onClick={() => handleSelectSize(size.code)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                      Hydration profile
                                    </span>
                                    <button
                                      type="button"
                                      onMouseEnter={() =>
                                        setHydrationHover(product?.hydrationProfile ?? null)
                                      }
                                      onMouseLeave={() => setHydrationHover(null)}
                                      className="inline-flex items-center gap-1 text-[11px] text-[#6b625a]"
                                    >
                                      <HelpCircle className="h-3.5 w-3.5" />
                                      <span>What’s this?</span>
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(['still', 'sparkling', 'mineral', 'alkaline', 'vitamin'] as HydrationProfile[]).map(
                                      profile => (
                                        <HydrationChip
                                          key={profile}
                                          profile={profile}
                                          active={variant.hydrationProfile === profile}
                                          onClick={() => handleSelectHydration(profile)}
                                        />
                                      ),
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                      Finish & cap
                                    </span>
                                    <span className="text-[11px] text-[#6b625a]">
                                      {product?.materialInfo?.finish === 'matte'
                                        ? 'Soft-touch matte'
                                        : product?.materialInfo?.finish === 'frosted'
                                        ? 'Frosted glass'
                                        : product?.materialInfo?.finish === 'satin'
                                        ? 'Satin sheen'
                                        : 'High gloss'}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    <VariantSelectorOption
                                      label="Matte"
                                      active={variant.finish === 'matte'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          finish: 'matte',
                                        }))
                                      }
                                    />
                                    <VariantSelectorOption
                                      label="Glossy"
                                      active={variant.finish === 'glossy'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          finish: 'glossy',
                                        }))
                                      }
                                    />
                                    <VariantSelectorOption
                                      label="Frosted"
                                      active={variant.finish === 'frosted'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          finish: 'frosted',
                                        }))
                                      }
                                    />
                                    <VariantSelectorOption
                                      label="Satin"
                                      active={variant.finish === 'satin'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          finish: 'satin',
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    <VariantSelectorOption
                                      label="Twist cap"
                                      active={variant.capStyle === 'twist'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          capStyle: 'twist',
                                        }))
                                      }
                                    />
                                    <VariantSelectorOption
                                      label="Bamboo"
                                      active={variant.capStyle === 'bamboo'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          capStyle: 'bamboo',
                                        }))
                                      }
                                    />
                                    <VariantSelectorOption
                                      label="Sports"
                                      active={variant.capStyle === 'sports'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          capStyle: 'sports',
                                        }))
                                      }
                                    />
                                    <VariantSelectorOption
                                      label="Flip"
                                      active={variant.capStyle === 'flip'}
                                      onClick={() =>
                                        setVariant(prev => ({
                                          ...prev,
                                          capStyle: 'flip',
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 border-t border-[#e7d6c6] pt-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c3b4a5]">
                                    Quantity
                                  </span>
                                  <span className="text-[11px] text-[#6b625a]">
                                    Carton-friendly • multiples of 12 recommended
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <QuantityStepper
                                    value={quantity}
                                    min={minQty}
                                    step={12}
                                    onChange={setQuantity}
                                  />
                                  <div className="flex items-center gap-2 text-[11px] text-[#6b625a]">
                                    <span className="inline-flex h-6 items-center rounded-full bg-[#fff7ee] px-2">
                                      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                                      In stock for your configuration
                                    </span>
                                  </div>
                                </div>
                                {renderPricingSummary()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-[#e7d6c6] bg-gradient-to-r from-[#fff7ee] via-[#f5e9dc] to-[#fff7ee] px-5 py-3.5 lg:px-6">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-1 flex-wrap items-center gap-2">
                              {enableDesignCta && product?.designCapability?.canCustomizeLabel ? (
                                <button
                                  type="button"
                                  onClick={handleGoToDesign}
                                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-[18px] border border-[#007a8a] bg-[#007a8a]/5 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#007a8a] transition-colors hover:bg-[#007a8a] hover:text-white sm:flex-none sm:justify-start"
                                >
                                  <Sparkles className="h-4 w-4" />
                                  <span>Open label studio</span>
                                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              ) : (
                                <div className="hidden text-[11px] text-[#6b625a] sm:block">
                                  Fully recyclable packaging • Carbon-neutral shipping options
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                              <button
                                type="button"
                                disabled={isAdding}
                                onClick={handleAddToCart}
                                className={cn(
                                  'inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#007a8a] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm shadow-[#007a8a]/40 transition-transform transition-colors sm:w-auto',
                                  'hover:bg-[#006674] hover:shadow-md hover:shadow-[#007a8a]/50 active:translate-y-[1px] active:shadow-none',
                                  isAdding && 'opacity-80',
                                )}
                              >
                                <ShoppingBag className="h-4 w-4" />
                                <span>{isAdding ? 'Adding…' : 'Add to cart'}</span>
                              </button>
                              <Link
                                to={product?.meta?.slug ? `/product/${product.meta.slug}` : '#'}
                                className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a] transition-colors hover:border-[#e7d6c6] hover:bg-[#fff7ee]"
                                onClick={() => handleChangeOpen(false)}
                              >
                                <span>View full story</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </motion.div>
            </Dialog.Overlay>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;