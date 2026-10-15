import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Image as ImageIcon, Layers, Sliders, Sparkles, Tag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ID,
  LabelCanvasPreset,
  LabelColorToken,
  LabelDesign,
  LabelDesignerState,
  LabelElement,
  LabelShapeElement,
  Product,
} from '@/types';
import mockData, { products as mockProducts } from '@/data/mockData';
import LabelDesigner from '@/components/LabelDesigner';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export interface DesignPageHeroTipProps {
  index?: number;
  text?: string;
}

export function DesignPageHeroTip({
  index = 0,
  text = '',
}: DesignPageHeroTipProps) {
  if (!text) {
    return null;
  }
  return (
    <motion.li
      className="flex items-start gap-3 text-sm text-[#6b625a]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.05, duration: 0.32 }}
    >
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee] text-[11px] font-semibold text-[#007a8a]">
        {index + 1}
      </span>
      <span>{text}</span>
    </motion.li>
  );
}

export interface DesignPresetPillProps {
  label?: string;
  preset?: LabelCanvasPreset;
  active?: boolean;
  onClick?: (preset: LabelCanvasPreset) => void;
}

export function DesignPresetPill({
  label = '',
  preset = 'minimal',
  active = false,
  onClick,
}: DesignPresetPillProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(preset)}
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
        active
          ? 'border-[#007a8a] bg-[#007a8a] text-white'
          : 'border-[#e7d6c6] bg-[#fff7ee] text-[#6b625a] hover:border-[#007a8a]'
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#007a8a]" />
      {label}
    </button>
  );
}

export interface ColorTokenSwatchProps {
  token?: LabelColorToken;
  active?: boolean;
  onClick?: (token: LabelColorToken) => void;
}

export function ColorTokenSwatch({
  token = 'sand',
  active = false,
  onClick,
}: ColorTokenSwatchProps) {
  const colorMap: Record<LabelColorToken, string> = {
    sand: '#f5e9dc',
    shell: '#fff7ee',
    ink: '#222222',
    aqua: '#007a8a',
    coral: '#ff6b5a',
    foam: '#c5f3ff',
    slate: '#6b625a',
  };
  return (
    <button
      type="button"
      onClick={() => onClick?.(token)}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-md border transition-transform',
        active
          ? 'border-[#007a8a] scale-105'
          : 'border-[#e7d6c6] hover:border-[#007a8a]'
      )}
    >
      <span
        className="h-6 w-6 rounded-[10px]"
        style={{ backgroundColor: colorMap[token] ?? '#f5e9dc' }}
      />
      {active ? (
        <Check className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#007a8a] p-[2px] text-white" />
      ) : null}
    </button>
  );
}

export interface BottlePreviewProps {
  design?: LabelDesign | null;
  product?: Product | null;
}

export function BottlePreview({ design = null, product = null }: BottlePreviewProps) {
  const primaryImage =
    product?.heroImage?.url ??
    'https://images.unsplash.com/photo-1605760291099-f75d92e645fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjB0YWJsZXRvcCUyMGh5ZHJhdGlvbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDcxNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

  const labelBounds = useMemo(() => {
    if (!design?.canvas) {
      return {
        widthPercent: 48,
        heightPercent: 32,
        topPercent: 34,
        leftPercent: 26,
      };
    }
    const widthPercent = Math.min(70, Math.max(30, (design.canvas.width / 120) * 10));
    const heightPercent = Math.min(40, Math.max(24, (design.canvas.height / 150) * 10));
    return {
      widthPercent,
      heightPercent,
      topPercent: 40 - (heightPercent - 28) / 2,
      leftPercent: 50 - widthPercent / 2,
    };
  }, [design]);

  const backgroundTexture =
    'https://images.unsplash.com/photo-1706790608211-4c03fd4f4d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8d2FybSUyMGJlaWdlJTIwcGFwZXIlMjB0ZXh0dXJlJTIwYmFja2dyb3VuZCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfDB8fHwxNzkyMDcxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

  const hasBackgroundElement = (design?.elements ?? []).some(
    (el: LabelElement) => el.type === 'background'
  );

  const accentShape = (design?.elements ?? []).find(
    (el: LabelElement) => el.type === 'shape'
  ) as LabelShapeElement | undefined;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-[#e7d6c6] bg-[#fff7ee]">
      <div className="pointer-events-none absolute inset-0">
        <img
          src={backgroundTexture}
          crossOrigin="anonymous"
          alt="Studio backdrop"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5e9dc]/90 via-[#fff7ee]/96 to-[#f5e9dc]/92" />
      </div>
      <div className="relative flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-[#e7d6c6]/70 px-6 py-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
              Live Bottle Preview
            </span>
            <span className="mt-0.5 text-sm text-[#6b625a]">
              {product?.name ?? 'Select a bottle to see material + size context'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6b625a]">
            <span className="inline-flex items-center gap-1 rounded-md border border-[#e7d6c6] bg-[#fff7ee] px-2 py-1">
              <Sparkles className="h-3.5 w-3.5 text-[#007a8a]" />
              {design?.canvas?.preset ?? 'minimal'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-[#e7d6c6] bg-[#fff7ee] px-2 py-1">
              <Layers className="h-3.5 w-3.5 text-[#6b625a]" />
              {(design?.elements ?? []).length} elements
            </span>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 px-6 pb-6 pt-4 lg:flex-row">
          <div className="relative flex-1">
            <div className="relative mx-auto flex h-full max-h-[460px] min-h-[320px] w-full max-w-xs items-center justify-center">
              <div className="absolute -left-10 top-10 hidden rotate-[-12deg] rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee]/90 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b625a] lg:inline-flex">
                Proof
              </div>
              <div className="absolute -right-6 bottom-10 hidden rotate-[10deg] rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee]/90 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b625a] lg:inline-flex">
                1:1 Scale
              </div>
              <motion.div
                className="relative flex h-full w-full items-center justify-center"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative h-[82%] w-[62%] max-h-[420px]">
                  <div className="absolute inset-4 rounded-[28px] bg-gradient-to-b from-white/80 via-white/85 to-white/70 shadow-[0_40px_80px_rgba(0,0,0,0.18)]" />
                  <div className="absolute inset-0">
                    <img
                      src={primaryImage}
                      crossOrigin="anonymous"
                      alt={product?.heroImage?.alt ?? 'Bottle silhouette'}
                      className="h-full w-full select-none object-contain mix-blend-multiply"
                    />
                  </div>
                  <div
                    className="absolute rounded-[20px] border border-black/5 bg-[#fff7ee]/95 backdrop-blur-[1px]"
                    style={{
                      width: `${labelBounds.widthPercent}%`,
                      height: `${labelBounds.heightPercent}%`,
                      top: `${labelBounds.topPercent}%`,
                      left: `${labelBounds.leftPercent}%`,
                      boxShadow:
                        '0 18px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div className="absolute inset-[2px] rounded-[18px] border border-white/80" />
                    <div className="relative flex h-full w-full flex-col items-center justify-center px-3 py-3">
                      <span className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
                        {design?.name ?? 'Nishant Waters Atelier'}
                      </span>
                      <span className="line-clamp-2 text-center text-[11px] font-medium text-[#333333]">
                        {product?.subtitle ??
                          'Custom label proof for your next gathering, event, or ceremony.'}
                      </span>
                      {accentShape ? (
                        <div className="mt-1 h-3 w-[70%] overflow-hidden">
                          <div className="h-[2px] w-full rounded-full bg-[#007a8a]" />
                        </div>
                      ) : null}
                      {hasBackgroundElement ? (
                        <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#6b625a]">
                          text + logo alignment locked to safe zone
                        </span>
                      ) : (
                        <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#6b625a]">
                          drag label elements inside safe frame
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -right-6 bottom-0 hidden h-16 w-16 rounded-full bg-gradient-to-tr from-[#007a8a] to-[#ff6b5a] opacity-60 blur-2 lg:block" />
                </div>
              </motion.div>
            </div>
          </div>
          <aside className="relative mt-4 flex w-full flex-col gap-4 rounded-[20px] border border-[#e7d6c6] bg-[#fff7ee]/95 p-4 lg:mt-0 lg:w-64">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                Bottle Context
              </span>
              <ChevronDown className="h-4 w-4 text-[#6b625a]" />
            </div>
            <div className="mt-1 space-y-2 text-xs text-[#6b625a]">
              <div className="flex items-center justify-between">
                <span>Size</span>
                <span className="font-medium text-[#333333]">
                  {product?.sizeVariants?.[0]?.code ?? '500ml'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Material</span>
                <span className="font-medium text-[#333333]">
                  {product?.materialInfo?.material ?? 'glass'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Finish</span>
                <span className="font-medium text-[#333333]">
                  {product?.materialInfo?.finish ?? 'matte'}
                </span>
              </div>
            </div>
            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#e7d6c6] to-transparent" />
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                Pre-flight Checks
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#6b625a]">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#007a8a]" />
                  Text aligns within safe area
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#007a8a]" />
                  Logo minimum size respected
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#007a8a]" />
                  Contrast passes legibility
                </li>
              </ul>
            </div>
            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#e7d6c6] to-transparent" />
            <div className="space-y-2 text-xs text-[#6b625a]">
              <div className="flex items-center justify-between">
                <span>Label Size</span>
                <span className="font-medium text-[#333333]">
                  {design?.canvas?.width ?? 90} × {design?.canvas?.height ?? 120} mm
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Preset</span>
                <span className="font-medium text-[#333333]">
                  {design?.canvas?.preset ?? 'minimal'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Saved</span>
                <span className="font-medium text-[#333333]">
                  {design?.lastSavedAt
                    ? new Intl.DateTimeFormat('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(design.lastSavedAt))
                    : 'Not yet'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export interface TemplateCardProps {
  design?: LabelDesign;
  active?: boolean;
  onSelect?: (designId: ID) => void;
}

export function TemplateCard({
  design,
  active = false,
  onSelect,
}: TemplateCardProps) {
  if (!design) return null;

  const templateCategory = mockData?.labelTemplates?.find(
    (tpl) => tpl.id === design.id
  );

  const imageUrl =
    templateCategory?.canvas?.backgroundColor === 'aqua'
      ? 'https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8d2FybSUyMGJlaWdlJTIwcGFwZXIlMjB0ZXh0dXJlJTIwYmFja2dyb3VuZCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfDB8fHwxNzkyMDcxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(design.id)}
      className={cn(
        'group relative flex min-w-[230px] max-w-[260px] flex-col overflow-hidden rounded-[18px] border bg-[#fff7ee] text-left transition-all',
        active
          ? 'border-[#007a8a] shadow-[0_18px_40px_rgba(0,0,0,0.16)]'
          : 'border-[#e7d6c6] hover:border-[#007a8a] hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)]'
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          crossOrigin="anonymous"
          alt={design.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/55 via-transparent to-transparent" />
        <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5e9dc]">
              {design.canvas?.preset ?? 'minimal'}
            </span>
            <span className="mt-1 line-clamp-1 text-sm font-medium text-white">
              {design.name}
            </span>
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff7ee]/95 text-[#007a8a] shadow-sm">
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
            {templateCategory?.name ?? 'Atelier Template'}
          </span>
          <span className="mt-0.5 text-xs text-[#6b625a]">
            {(design.elements ?? []).length} elements · {design.canvas?.width ?? 90}×
            {design.canvas?.height ?? 120}mm
          </span>
        </div>
        <div
          className={cn(
            'inline-flex h-6 items-center rounded-md border px-2 text-[10px] font-semibold uppercase tracking-[0.18em]',
            active
              ? 'border-[#007a8a] bg-[#007a8a] text-white'
              : 'border-[#e7d6c6] bg-[#fff7ee] text-[#6b625a]'
          )}
        >
          {active ? 'Active' : 'Apply'}
        </div>
      </div>
    </button>
  );
}

export interface StudioRailSectionProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function StudioRailSection({
  title = '',
  description = '',
  children = null,
}: StudioRailSectionProps) {
  return (
    <section className="w-full border-b border-[#e7d6c6]/70 py-4 last:border-b-0">
      <header className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
            {title}
          </h3>
          {description ? (
            <p className="mt-0.5 text-[11px] text-[#6b625a]">{description}</p>
          ) : null}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}

export interface DesignSummaryMetaProps {
  design?: LabelDesign | null;
  product?: Product | null;
  formatMoney?: (money: { amount: number; currency: string; formatted?: string }) => string;
}

export function DesignSummaryMeta({
  design = null,
  product = null,
  formatMoney,
}: DesignSummaryMetaProps) {
  const minQty = product?.minimums?.defaultMinimumQuantity ?? 48;
  const basePrice = product?.startingAtPrice ?? product?.basePrice;

  return (
    <div className="grid grid-cols-2 gap-3 text-xs text-[#6b625a]">
      <div className="space-y-1.5">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
            Label
          </span>
          <span className="mt-0.5 line-clamp-2 text-[11px] text-[#333333]">
            {design?.name ?? 'Atelier proof'}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
            Elements
          </span>
          <span className="mt-0.5 text-[11px] text-[#333333]">
            {(design?.elements ?? []).length} layers
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
            Bottle
          </span>
          <span className="mt-0.5 line-clamp-2 text-[11px] text-[#333333]">
            {product?.name ?? 'Select a bottle in Shop'}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
            From
          </span>
          <span className="mt-0.5 text-[11px] text-[#333333]">
            {basePrice
              ? formatMoney?.(basePrice) ?? basePrice.formatted ?? `₹${basePrice.amount}`
              : 'On request'}{' '}
            · {minQty}+ units
          </span>
        </div>
      </div>
    </div>
  );
}

export interface DesignPageProps {
  initialState?: LabelDesignerState;
}

export function DesignPage({ initialState }: DesignPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { state: cartState, openCart, addItem, formatMoney, showToast } = useCart();

  const [activeDesignId, setActiveDesignId] = useState<ID | undefined>(
    initialState?.activeDesignId
  );
  const [localDesignerState, setLocalDesignerState] = useState<LabelDesignerState | null>(
    initialState ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<LabelCanvasPreset>('minimal');
  const [selectedColor, setSelectedColor] = useState<LabelColorToken>('sand');
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  const productSlug = searchParams.get('product');
  const productIdParam = searchParams.get('productId');

  const linkedProduct: Product | null = useMemo(() => {
    if (productIdParam) {
      const product = (mockProducts ?? []).find((p) => p.id === (productIdParam as ID));
      if (product) return product;
    }
    if (productSlug) {
      const product = (mockProducts ?? []).find((p) => p.meta?.slug === productSlug);
      if (product) return product;
    }
    const defaultProduct = (mockProducts ?? []).find(
      (p) => p.designCapability?.canCustomizeLabel
    );
    return defaultProduct ?? null;
  }, [productIdParam, productSlug]);

  const designTemplates: LabelDesign[] = useMemo(
    () => mockData?.labelTemplates ?? [],
    []
  );

  const activeDesign: LabelDesign | null = useMemo(() => {
    if (localDesignerState?.designs?.length) {
      const byActive = localDesignerState.designs.find(
        (d) => d.id === (activeDesignId ?? localDesignerState.activeDesignId)
      );
      if (byActive) return byActive;
      return localDesignerState.designs[0];
    }
    if (designTemplates?.length) {
      return designTemplates[0];
    }
    return null;
  }, [localDesignerState, activeDesignId, designTemplates]);

  useEffect(() => {
    if (!linkedProduct) return;
    const payload = mockData?.defaultToastPresets?.find(
      (t) => t.intent === 'info'
    );
    if (!payload) return;
    toast(payload.title, {
      description:
        payload.description ??
        `Designing for “${linkedProduct.name}”. You can always switch bottles from the Shop.`,
    });
  }, [linkedProduct]);

  useEffect(() => {
    if (!initialState && mockData?.labelDesignerInitialState) {
      setLocalDesignerState(mockData.labelDesignerInitialState);
      setActiveDesignId(mockData.labelDesignerInitialState.activeDesignId);
    }
  }, [initialState]);

  const handleBackToProduct = () => {
    if (linkedProduct?.meta?.slug) {
      navigate(`/product/${linkedProduct.meta.slug}`);
    } else {
      navigate('/shop');
    }
  };

  const handleApplyTemplate = (designId: ID) => {
    setIsLoadingTemplate(true);
    const timer = window.setTimeout(() => {
      setActiveDesignId(designId);
      setSelectedPreset(
        (designTemplates.find((d) => d.id === designId)?.canvas?.preset ??
          'minimal') as LabelCanvasPreset
      );
      setIsLoadingTemplate(false);
      showToast({
        title: 'Template applied',
        description: 'You can now fine-tune typography, logo, and layout details.',
        intent: 'success',
      });
    }, 380);
    return () => window.clearTimeout(timer);
  };

  const handlePresetChange = (preset: LabelCanvasPreset) => {
    setSelectedPreset(preset);
    showToast({
      title: 'Canvas preset updated',
      description: `Layout grid switched to ${preset} framing.`,
      intent: 'info',
    });
  };

  const handleColorChange = (token: LabelColorToken) => {
    setSelectedColor(token);
    showToast({
      title: 'Palette adjusted',
      description: 'Use your hero color as an accent, not the whole story.',
      intent: 'info',
    });
  };

  const handleSaveToCart = () => {
    if (!linkedProduct || !activeDesign) {
      showToast({
        title: 'Select a bottle first',
        description:
          'Your label studio is paired to a specific bottle. Choose one from the Shop view.',
        intent: 'warning',
      });
      return;
    }
    setIsSaving(true);
    window.setTimeout(() => {
      const quantity = linkedProduct.minimums?.defaultMinimumQuantity ?? 48;
      const unitPrice = linkedProduct.startingAtPrice ?? linkedProduct.basePrice;
      const lineTotalAmount = unitPrice.amount * quantity;
      const now = new Date().toISOString();

      const lineTotal = {
        ...unitPrice,
        amount: lineTotalAmount,
        formatted:
          formatMoney?.({
            ...unitPrice,
            amount: lineTotalAmount,
          }) ?? `₹${lineTotalAmount.toLocaleString('en-IN')}`,
      };

      const defaultVariant = {
        bottleSize: linkedProduct.sizeVariants?.[0]?.code ?? '500ml',
        material: linkedProduct.materialInfo?.material ?? 'glass',
        finish: linkedProduct.materialInfo?.finish ?? 'matte',
        capStyle: linkedProduct.materialInfo?.capStyle ?? 'twist',
        hydrationProfile: linkedProduct.hydrationProfile ?? 'still',
        flavorProfile: linkedProduct.flavors?.[0]?.profile ?? 'pure',
      };

      const cartItemBase = {
        productId: linkedProduct.id,
        productName: linkedProduct.name,
        productSlug: linkedProduct.meta?.slug ?? '',
        productThumbnail: linkedProduct.heroImage?.url ?? '',
        variant: defaultVariant,
        unitPrice,
        quantity,
        lineSubtotal: {
          ...unitPrice,
          amount: lineTotalAmount,
          formatted: lineTotal.formatted,
        },
        lineTotal,
        customizations: [
          {
            type: 'label' as const,
            designId: activeDesign.id,
            designSnapshot: {
              ...activeDesign,
              productId: linkedProduct.id,
              lastSavedAt: now,
              isSavedToProfile: true,
            },
          },
        ],
      };

      addItem(cartItemBase);

      setIsSaving(false);
      openCart();
      showToast({
        title: 'Label linked to cart',
        description: 'You can still tweak details before checkout.',
        intent: 'success',
      });
    }, 520);
  };

  const heroCopy = mockData?.designPageCopy;
  const heroTips = heroCopy?.tips ?? [];

  return (
    <div className="min-h-screen bg-[#f5e9dc] text-[#333333]">
      <Header className="border-b border-[#e7d6c6]/80 bg-[#f5e9dc]/80 backdrop-blur-md" />
      <main className="w-full">
        <section className="border-b border-[#e7d6c6]/80 bg-[#f5e9dc]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-10 pt-8 lg:px-12 lg:pb-12 lg:pt-10 xl:gap-14">
            <div className="grid grid-cols-12 items-start gap-10 lg:gap-12">
              <div className="col-span-12 space-y-6 lg:col-span-6 xl:col-span-5">
                <button
                  type="button"
                  onClick={handleBackToProduct}
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#6b625a] transition-colors hover:text-[#007a8a]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to {linkedProduct ? linkedProduct.name : 'Shop'}
                </button>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b625a]">
                    Label Studio
                  </p>
                  <h1 className="font-['DM_Sans'] text-4xl leading-[1.05] tracking-tight text-[#222222] sm:text-5xl lg:text-6xl">
                    {heroCopy?.heroTitle ??
                      'Compose your water story, one label at a time.'}
                  </h1>
                  <p className="max-w-xl text-sm leading-relaxed text-[#6b625a] sm:text-base">
                    {heroCopy?.heroSubtitle ??
                      'Design on a tactile canvas that mirrors our bottles—soft edges, editorial type, and a layout tuned for real-world legibility.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveToCart}
                    disabled={isSaving}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#007a8a] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors',
                      isSaving ? 'opacity-80' : 'hover:bg-[#006674]'
                    )}
                  >
                    <span>{isSaving ? 'Saving…' : 'Save Label To Cart'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast('Proof mode', {
                        description:
                          'Zoom in the canvas to inspect micro-typography & safe zones.',
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a] transition-colors hover:border-[#007a8a]"
                  >
                    <ImageIcon className="h-4 w-4" />
                    View Flat Proof
                  </button>
                  <span className="inline-flex items-center gap-1 rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                    <Truck className="h-3.5 w-3.5" />
                    {cartState?.shippingMethods?.[0]?.leadTimeDaysMin ?? 5}–{' '}
                    {cartState?.shippingMethods?.[0]?.leadTimeDaysMax ?? 7} days dispatch
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee] p-3.5 text-xs text-[#6b625a]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                      Studio Tips
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {heroTips.slice(0, 3).map((tip, index) => (
                        <DesignPageHeroTip key={index} index={index} text={tip} />
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee] p-3.5 text-xs text-[#6b625a]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                      Linked Bottle
                    </p>
                    {linkedProduct ? (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-[12px] border border-[#e7d6c6] bg-[#f5e9dc]">
                          <img
                            src={linkedProduct.heroImage.url}
                            crossOrigin="anonymous"
                            alt={linkedProduct.heroImage.alt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b625a]">
                            {linkedProduct.collection} Collection
                          </span>
                          <span className="text-xs font-medium text-[#333333]">
                            {linkedProduct.name}
                          </span>
                          <span className="text-[11px] text-[#6b625a]">
                            Min. {linkedProduct.minimums?.defaultMinimumQuantity ?? 48}{' '}
                            bottles ·{' '}
                            {formatMoney?.(linkedProduct.startingAtPrice) ??
                              linkedProduct.startingAtPrice?.formatted ??
                              `₹${linkedProduct.startingAtPrice?.amount ?? ''}`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px]">
                        Pair your label with a bottle from the{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/shop')}
                          className="underline underline-offset-4"
                        >
                          Shop
                        </button>{' '}
                        view to see final pricing.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 xl:col-span-7">
                <div className="grid grid-cols-12 gap-5 lg:gap-6">
                  <div className="col-span-12 lg:col-span-7">
                    <div className="flex h-full flex-col gap-3 rounded-[22px] border border-[#e7d6c6] bg-[#fff7ee] p-3.5 lg:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[12px] bg-[#f5e9dc] text-[#007a8a]">
                            <Sliders className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                              Canvas Presets
                            </p>
                            <p className="text-[11px] text-[#6b625a]">
                              Switch between editorial, wedding, or bold utility grids.
                            </p>
                          </div>
                        </div>
                        <span className="hidden rounded-[18px] border border-[#e7d6c6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b625a] sm:inline-flex">
                          Snap to Baseline
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <DesignPresetPill
                          label="Minimal Atelier"
                          preset="minimal"
                          active={selectedPreset === 'minimal'}
                          onClick={handlePresetChange}
                        />
                        <DesignPresetPill
                          label="Monogram Ring"
                          preset="monogram"
                          active={selectedPreset === 'monogram'}
                          onClick={handlePresetChange}
                        />
                        <DesignPresetPill
                          label="Wedding Suite"
                          preset="wedding"
                          active={selectedPreset === 'wedding'}
                          onClick={handlePresetChange}
                        />
                        <DesignPresetPill
                          label="Corporate Grid"
                          preset="corporate"
                          active={selectedPreset === 'corporate'}
                          onClick={handlePresetChange}
                        />
                        <DesignPresetPill
                          label="Limited Drop"
                          preset="limited"
                          active={selectedPreset === 'limited'}
                          onClick={handlePresetChange}
                        />
                      </div>
                      <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-[#e7d6c6] to-transparent" />
                      <div className="grid grid-cols-2 gap-3 text-xs text-[#6b625a]">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                            Primary Palette
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <ColorTokenSwatch
                              token="sand"
                              active={selectedColor === 'sand'}
                              onClick={handleColorChange}
                            />
                            <ColorTokenSwatch
                              token="shell"
                              active={selectedColor === 'shell'}
                              onClick={handleColorChange}
                            />
                            <ColorTokenSwatch
                              token="ink"
                              active={selectedColor === 'ink'}
                              onClick={handleColorChange}
                            />
                            <ColorTokenSwatch
                              token="aqua"
                              active={selectedColor === 'aqua'}
                              onClick={handleColorChange}
                            />
                            <ColorTokenSwatch
                              token="coral"
                              active={selectedColor === 'coral'}
                              onClick={handleColorChange}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                            Production Notes
                          </p>
                          <ul className="mt-2 space-y-1.5 text-[11px]">
                            <li>Foil accents require minimum 200 bottles.</li>
                            <li>Logos print at 300 DPI or higher.</li>
                            <li>We’ll share a final proof before bottling.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <DesignSummaryMeta
                      design={activeDesign}
                      product={linkedProduct}
                      formatMoney={formatMoney}
                    />
                    <div className="mt-3 rounded-[18px] border border-dashed border-[#e7d6c6] bg-[#fff7ee] px-3.5 py-3 text-[11px] text-[#6b625a]">
                      <p className="font-semibold uppercase tracking-[0.2em]">
                        Safe Zone Reminder
                      </p>
                      <p className="mt-1.5">
                        All critical details—names, dates, and logotypes—must sit within
                        the inner frame on the flat proof. Anything bleeding to the edge
                        risks trimming loss and may be adjusted by our studio team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b border-[#e7d6c6]/80 bg-[#fff7ee]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 pb-10 pt-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-12 lg:pt-10">
            <div className="px-6 lg:col-span-7 lg:px-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                    Label Canvas
                  </p>
                  <p className="mt-1 text-sm text-[#6b625a]">
                    Drag, align, and fine-tune your label just like a print studio.
                  </p>
                </div>
                <div className="hidden items-center gap-2 text-[11px] text-[#6b625a] sm:flex">
                  <span className="inline-flex h-7 items-center gap-2 rounded-[18px] border border-[#e7d6c6] bg-[#f5e9dc] px-3">
                    <Layers className="h-3.5 w-3.5" />
                    Layers
                  </span>
                  <span className="inline-flex h-7 items-center gap-2 rounded-[18px] border border-[#e7d6c6] bg-[#f5e9dc] px-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    Snapping
                  </span>
                </div>
              </div>
              <div className="rounded-[22px] border border-[#e7d6c6] bg-[#f5e9dc] p-3.5 lg:p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-[12px] bg-[#fff7ee] text-[#007a8a]">
                      <Tag className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                        Flat Proof
                      </p>
                      <p className="text-[11px] text-[#6b625a]">
                        Zoomable, grid-aligned label preview with live safe zones.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6b625a]">
                    <span className="inline-flex h-7 items-center gap-1 rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee] px-2">
                      <span className="h-2 w-2 rounded-full bg-[#007a8a]" />
                      AiM (Aqua in Motion)
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee]">
                  <LabelDesigner />
                </div>
              </div>
            </div>
            <div className="px-6 lg:col-span-5 lg:px-0">
              <div className="grid grid-rows-[minmax(0,1fr)_auto] gap-4 lg:h-full">
                <BottlePreview design={activeDesign} product={linkedProduct} />
                <div className="rounded-[22px] border border-[#e7d6c6] bg-[#fff7ee]">
                  <StudioRailSection
                    title="Templates"
                    description="Start from a studio-tested layout, then tune the details to your event."
                  >
                    <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1">
                      <AnimatePresence initial={false}>
                        {designTemplates.map((design) => (
                          <motion.div
                            key={design.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.25 }}
                          >
                            <TemplateCard
                              design={design}
                              active={design.id === activeDesign?.id}
                              onSelect={handleApplyTemplate}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    {isLoadingTemplate ? (
                      <p className="mt-2 px-2 text-[11px] text-[#6b625a]">
                        Applying template layout and typography…{' '}
                        <span className="font-semibold">This only takes a moment.</span>
                      </p>
                    ) : null}
                  </StudioRailSection>
                  <StudioRailSection
                    title="Layout Discipline"
                    description="Our studio auto-checks each label for safe zones, contrast, and scale."
                  >
                    <ul className="space-y-1.5 px-1 pb-2 text-[11px] text-[#6b625a]">
                      <li>
                        • Body copy runs between 7–10pt equivalents to remain legible on
                        chilled glass or aluminium.
                      </li>
                      <li>
                        • Brand marks and monograms keep at least 1.5mm from label edges
                        for a calm visual margin.
                      </li>
                      <li>
                        • For weddings, we nudge date & venue lines to match your suite
                        typography wherever possible.
                      </li>
                    </ul>
                  </StudioRailSection>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-t border-[#e7d6c6]/80 bg-[#f5e9dc]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#fff7ee]">
                <Sparkles className="h-4 w-4 text-[#007a8a]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
                  Ready When You Are
                </p>
                <p className="mt-0.5 text-sm text-[#6b625a]">
                  Save your label to cart now—our studio can refine micro-details before
                  printing.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveToCart}
                disabled={isSaving}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#007a8a] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors',
                  isSaving ? 'opacity-80' : 'hover:bg-[#006674]'
                )}
              >
                <span>{isSaving ? 'Saving…' : 'Save Label & View Cart'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625a] transition-colors hover:border-[#007a8a]"
              >
                Proceed To Checkout
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer className="border-t border-[#e7d6c6]" showNewsletter showSurfaceRibbons />
    </div>
  );
}

export default DesignPage;