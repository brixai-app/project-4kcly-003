import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Clock, CreditCard, Info, Package, Percent, ShoppingBag, ShoppingCart, Trash2, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type {
  CartItem,
  CartPriceSummary,
  CartState,
  ID,
  MoneyValue,
  ShippingMethod,
} from '@/types';

export interface CartDrawerProps {
  triggerVariant?: 'icon' | 'label' | 'both';
  showTrigger?: boolean;
  className?: string;
}

interface ShippingProgressStep {
  key: 'bag' | 'design' | 'bottling' | 'dispatch';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface CartLineItemProps {
  item: CartItem;
  index: number;
  formatMoney: (money: MoneyValue) => string;
  onIncrease: (itemId: ID) => void;
  onDecrease: (itemId: ID) => void;
  onRemove: (itemId: ID) => void;
}

interface CartSummaryProps {
  priceSummary: CartPriceSummary;
  shippingMethods: ShippingMethod[];
  selectedShippingMethodId?: ID;
  currencyLabel: string;
  formatMoney: (money: MoneyValue) => string;
  onSelectShipping: (id: ID) => void;
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
  isLocked: boolean;
  fulfilmentProgress: number;
}

interface EmptyStateProps {
  onExplore: () => void;
}

function calculateProgressFromCart(cart: CartState): number {
  const base = Math.min(60, Math.max(0, cart?.priceSummary?.itemsSubtotal?.amount ?? 0) / 50);
  const customizationBoost = cart?.meta?.hasCustomizations ? 20 : 0;
  const shippingBoost = cart?.selectedShippingMethodId ? 10 : 0;
  const discountBoost = (cart?.discounts ?? []).some(d => d.applied) ? 10 : 0;
  const progress = base + customizationBoost + shippingBoost + discountBoost;
  if (!cart?.items?.length) {
    return 10;
  }
  return Math.max(15, Math.min(96, progress));
}

function ShippingProgressBar({
  progress = 0,
  steps = [],
}: {
  progress?: number;
  steps?: ShippingProgressStep[];
}) {
  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const clamped = Math.max(0, Math.min(100, safeProgress));
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#6b625a]">
        <span>Hydration journey</span>
        <span>{Math.round(clamped)}% to dispatch</span>
      </div>
      <div className="relative h-2 rounded-full bg-[#e7d6c6]/70 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[#007a8a]"
          initial={{ width: '0%' }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex justify-between px-[2px]">
            {steps?.map(step => (
              <div key={step.key} className="relative flex-1 flex justify-center">
                <div className="h-full w-px bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {steps?.length ? (
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => {
            const threshold = (index / (steps.length - 1 || 1)) * 100;
            const isActive = clamped >= threshold;
            return (
              <div key={step.key} className="flex flex-col gap-1">
                <div
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-1 border text-[10px] font-medium',
                    'border-[#e7d6c6] bg-[#fff7ee]/80',
                    isActive && 'border-[#007a8a]/60 bg-[#007a8a]/10 text-[#007a8a]',
                  )}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white">
                    {isActive ? (
                      <CheckCircle2 className="h-3 w-3 text-[#007a8a]" />
                    ) : (
                      <Clock className="h-3 w-3 text-[#6b625a]" />
                    )}
                  </span>
                  <span>{step.label}</span>
                </div>
                <p className="text-[10px] leading-snug text-[#6b625a]">{step.description}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function QuantityControl({
  value = 1,
  min = 1,
  max = 9999,
  onChange,
  disabled = false,
}: {
  value?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange?: (next: number) => void;
}) {
  const handleStep = (delta: number) => {
    if (disabled) return;
    const next = Math.min(max, Math.max(min, (value ?? 1) + delta));
    if (next !== value) {
      onChange?.(next);
    }
  };
  return (
    <div className="inline-flex items-center rounded-[999px] border border-[#e7d6c6] bg-[#fff7ee] px-1 py-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => handleStep(-1)}
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-[#333333]',
          'transition-colors',
          value <= min || disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-[#e7d6c6]/60 active:bg-[#e7d6c6]',
        )}
        disabled={disabled || value <= min}
      >
        –
      </button>
      <div className="mx-1 min-w-[2.25rem] text-center text-[13px] font-semibold text-[#333333]">
        {value}
      </div>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => handleStep(1)}
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-[#333333]',
          'transition-colors',
          disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#e7d6c6]/60 active:bg-[#e7d6c6]',
        )}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}

function CartItemMetaRow({
  label,
  value,
}: {
  label?: string;
  value?: string;
}) {
  if (!label && !value) return null;
  return (
    <div className="flex items-center justify-between text-[11px] text-[#6b625a]">
      <span>{label}</span>
      <span className="font-medium text-[#333333]">{value}</span>
    </div>
  );
}

function CartLineItem({
  item,
  index,
  formatMoney,
  onIncrease,
  onDecrease,
  onRemove,
}: CartLineItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const hydrationLabel = item?.variant?.hydrationProfile ?? 'still';
  const sizeLabel = item?.variant?.bottleSize ?? '500ml';
  const flavorLabel = item?.variant?.flavorProfile ?? 'pure';
  const materialLabel = item?.variant?.material ?? 'glass';

  const handleRemove = () => {
    if (!item?.id) return;
    setIsRemoving(true);
    window.setTimeout(() => {
      onRemove(item.id);
    }, 220);
  };

  const subtleIndexDelay = Math.min(index * 0.04, 0.22);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: subtleIndexDelay }}
    >
      <div
        className={cn(
          'group relative flex gap-4 rounded-[18px] border border-[#e7d6c6] bg-[#fff7ee] p-3',
          'shadow-sm shadow-[#c3a993]/10',
          'transition-all duration-300',
          'hover:-translate-y-[2px] hover:shadow-md hover:shadow-[#c3a993]/25',
          isRemoving && 'opacity-60 scale-[0.99]',
        )}
      >
        <div className="relative h-[110px] w-[88px] overflow-hidden rounded-[16px] bg-[#f5e9dc]/80">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
          <img
            crossOrigin="anonymous"
            src={item?.productThumbnail ?? 'https://images.unsplash.com/photo-1637905351378-67232a5f0c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop'}
            alt={item?.productName ?? 'Bottle thumbnail'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-1 top-1 flex justify-between">
            <div className="rounded-full bg-black/40 px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.18em] text-white">
              {sizeLabel}
            </div>
            <div className="rounded-full bg-white/80 px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#007a8a]">
              {hydrationLabel}
            </div>
          </div>
          {item?.customizations?.length ? (
            <div className="pointer-events-none absolute inset-x-1 bottom-1 flex items-center justify-between gap-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.16em] text-white">
                <span className="h-1 w-1 rounded-full bg-[#ff6f61]" />
                Custom label
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/80 px-2 py-[1px] text-[9px] font-semibold text-[#333333]">
                <Check className="h-3 w-3 text-[#007a8a]" />
                Proofed
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2">
                <p className="text-[14px] font-semibold tracking-tight text-[#333333]">
                  {item?.productName ?? 'Custom bottled water'}
                </p>
                <span className="rounded-full bg-[#f5e9dc] px-2 py-[1px] text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6b625a]">
                  {item?.productSlug ?? 'nishant-waters'}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#6b625a]">
                {materialLabel} • {flavorLabel} • {item?.variant?.capStyle ?? 'twist'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove from cart"
              onClick={handleRemove}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee]/80 text-[#6b625a] transition-colors hover:bg-[#f5e9dc] hover:text-[#333333]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            <CartItemMetaRow label="Unit" value={formatMoney(item?.unitPrice)} />
            <CartItemMetaRow
              label="Line total"
              value={formatMoney(item?.lineTotal)}
            />
            {item?.lineDiscount?.amount ? (
              <CartItemMetaRow
                label="Included savings"
                value={`–${formatMoney(item.lineDiscount)}`}
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between pt-1">
            <QuantityControl
              value={item?.quantity ?? 1}
              min={Math.max(1, item?.quantity ? 1 : 1)}
              onChange={next => {
                if (!item?.id) return;
                if (next > (item?.quantity ?? 0)) {
                  onIncrease(item.id);
                } else if (next < (item?.quantity ?? 0)) {
                  onDecrease(item.id);
                }
              }}
            />
            <div className="inline-flex items-center gap-2 text-[11px] text-[#6b625a]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f5e9dc]">
                <Package className="h-3 w-3 text-[#007a8a]" />
              </span>
              <span className="leading-snug">
                Ships from{' '}
                <span className="font-semibold text-[#333333]">
                  {item?.productSlug?.includes('atelier') ? 'Jaipur' : 'Mumbai'}
                </span>{' '}
                in{' '}
                <span className="font-semibold text-[#333333]">
                  {Math.max(3, (item?.quantity ?? 1) > 200 ? 7 : 4)}–{Math.max(6, (item?.quantity ?? 1) > 200 ? 10 : 8)} days
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function SummaryRow({
  label,
  value,
  emphasis = false,
  accent = false,
  tooltip,
}: {
  label?: string;
  value?: string;
  emphasis?: boolean;
  accent?: boolean;
  tooltip?: string;
}) {
  if (!label && !value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            'text-[12px]',
            emphasis ? 'font-semibold text-[#333333]' : 'text-[#6b625a]',
          )}
        >
          {label}
        </span>
        {tooltip ? (
          <span className="relative inline-flex">
            <Info className="h-3.5 w-3.5 text-[#6b625a]/70" />
          </span>
        ) : null}
      </div>
      <span
        className={cn(
          'text-[12px] font-medium',
          emphasis ? 'text-[#333333]' : 'text-[#6b625a]',
          accent && 'text-[#007a8a]',
        )}
      >
        {value}
      </span>
    </div>
  );
}

function CartSummary({
  priceSummary,
  shippingMethods,
  selectedShippingMethodId,
  currencyLabel,
  formatMoney,
  onSelectShipping,
  onCheckout,
  isCheckoutDisabled,
  isLocked,
  fulfilmentProgress,
}: CartSummaryProps) {
  const expressMethod = useMemo(
    () => shippingMethods?.find(m => m?.isExpress),
    [shippingMethods],
  );
  const selected =
    shippingMethods?.find(m => m?.id === selectedShippingMethodId) ??
    shippingMethods?.find(m => m?.isDefault) ??
    shippingMethods?.[0];

  const hasDiscount = Boolean(priceSummary?.discount?.amount);
  const savingsBadge = hasDiscount
    ? `You’re saving ${formatMoney(priceSummary.discount!)} on this order`
    : null;

  const steps: ShippingProgressStep[] = [
    {
      key: 'bag',
      label: 'Curated',
      description: 'Your bottles & volumes are locked in.',
      icon: <ShoppingCart className="h-3 w-3" />,
    },
    {
      key: 'design',
      label: 'Artwork',
      description: 'Labels proofed & queued for print.',
      icon: <Percent className="h-3 w-3" />,
    },
    {
      key: 'bottling',
      label: 'Bottling',
      description: 'Hydration profile is being bottled.',
      icon: <Package className="h-3 w-3" />,
    },
    {
      key: 'dispatch',
      label: 'Dispatch',
      description: 'Hand-off to our shipping partners.',
      icon: <Truck className="h-3 w-3" />,
    },
  ];

  return (
    <div className="space-y-4 rounded-[20px] border border-[#e7d6c6] bg-[#fff7ee]/90 p-4 shadow-sm shadow-[#c3a993]/15">
      <ShippingProgressBar progress={fulfilmentProgress} steps={steps} />
      <div className="space-y-2 pt-3 border-t border-dashed border-[#e7d6c6]">
        <SummaryRow
          label="Items"
          value={formatMoney(priceSummary?.itemsSubtotal ?? priceSummary?.grandTotal)}
        />
        {priceSummary?.decorationFees?.amount ? (
          <SummaryRow
            label="Labeling & decoration"
            value={formatMoney(priceSummary.decorationFees)}
          />
        ) : null}
        {priceSummary?.packagingFees?.amount ? (
          <SummaryRow
            label="Packaging"
            value={formatMoney(priceSummary.packagingFees)}
          />
        ) : null}
        {priceSummary?.discount?.amount ? (
          <SummaryRow
            label="Order savings"
            value={`–${formatMoney(priceSummary.discount)}`}
            accent
          />
        ) : null}
        {priceSummary?.tax?.amount ? (
          <SummaryRow label="Taxes (est.)" value={formatMoney(priceSummary.tax)} />
        ) : (
          <SummaryRow label="Taxes" value="Calculated at checkout" />
        )}
        <div className="pt-1">
          <SummaryRow
            label="Order total"
            value={formatMoney(priceSummary?.grandTotal ?? priceSummary?.itemsSubtotal)}
            emphasis
          />
          <p className="mt-0.5 text-[11px] text-[#6b625a]">
            Displayed in {currencyLabel}. Duties & import fees handled at checkout.
          </p>
        </div>
      </div>
      <div className="space-y-3 pt-1">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
            Shipping method
          </p>
          <div className="flex gap-2">
            {shippingMethods?.slice(0, 2).map(method => {
              const isActive = method?.id === selected?.id;
              return (
                <button
                  key={method?.id}
                  type="button"
                  onClick={() => method?.id && onSelectShipping(method.id)}
                  className={cn(
                    'flex-1 rounded-[999px] border px-3 py-2 text-left transition-all',
                    'border-[#e7d6c6] bg-[#f5e9dc]/60 hover:bg-[#f5e9dc] hover:border-[#d2bca3]',
                    isActive && 'border-[#007a8a] bg-[#007a8a]/10 shadow-sm',
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#333333]">
                      {method?.name}
                    </span>
                    {method?.isExpress ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#007a8a] px-2 py-[1px] text-[9px] font-semibold uppercase tracking-[0.16em] text-white">
                        <Clock className="h-3 w-3" />
                        Express
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#6b625a]">
                    {method?.leadTimeDaysMin}–{method?.leadTimeDaysMax} days •{' '}
                    {method?.price?.amount ? formatMoney(method.price) : 'Complimentary'}
                  </p>
                </button>
              );
            })}
          </div>
          {expressMethod && selected && expressMethod.id !== selected.id ? (
            <p className="text-[11px] text-[#6b625a]">
              Need it sooner? Switch to{' '}
              <button
                type="button"
                onClick={() => expressMethod?.id && onSelectShipping(expressMethod.id)}
                className="inline-flex items-center gap-1 font-semibold text-[#007a8a] underline-offset-2 hover:underline"
              >
                express dispatch
                <ArrowRight className="h-3 w-3" />
              </button>
            </p>
          ) : null}
        </div>
        {savingsBadge ? (
          <div className="flex items-center gap-2 rounded-[14px] border border-dashed border-[#e7d6c6] bg-[#f5e9dc]/80 px-3 py-2">
            <Percent className="h-4 w-4 text-[#007a8a]" />
            <p className="text-[11px] text-[#333333]">{savingsBadge}</p>
          </div>
        ) : null}
      </div>
      <div className="pt-1">
        <button
          type="button"
          onClick={onCheckout}
          disabled={isCheckoutDisabled || isLocked}
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-[999px] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em]',
            'bg-[#007a8a] text-white shadow-sm shadow-[#007a8a]/30 transition-all',
            'hover:bg-[#006674] hover:shadow-md hover:-translate-y-[1px]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5e9dc]',
            (isCheckoutDisabled || isLocked) &&
              'cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none',
          )}
        >
          <span>{isLocked ? 'Finalising order…' : 'Proceed to checkout'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-[#6b625a]">
          <CreditCard className="h-3.5 w-3.5" />
          <span>UPI, major cards & netbanking secured via encrypted checkout.</span>
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onExplore }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-stretch justify-center">
      <div className="space-y-4 rounded-[20px] border border-dashed border-[#e7d6c6] bg-[#fff7ee]/90 px-6 py-8 text-left shadow-sm shadow-[#c3a993]/15">
        <div className="inline-flex items-center gap-2 rounded-[999px] bg-[#f5e9dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b625a]">
          <ShoppingBag className="h-3.5 w-3.5" />
          Your cart is currently dry
        </div>
        <h3 className="text-[22px] font-light tracking-tight text-[#333333]">
          Begin a new table story with custom-labeled water.
        </h3>
        <p className="text-[13px] leading-relaxed text-[#6b625a]">
          Curate bottles for your next dinner, launch, wedding or offsite. Start with our
          signature stills, add a label concept, and we’ll handle the bottling ritual
          end-to-end.
        </p>
        <div className="space-y-2 text-[12px] text-[#6b625a]">
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-[#007a8a]" />
            <span>Low minimums across everyday & event collections.</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-[#007a8a]" />
            <span>On-bottle preview with live label designer.</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-[#007a8a]" />
            <span>Dispatch-ready within days once artwork is approved.</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2 rounded-[999px] bg-[#007a8a] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm shadow-[#007a8a]/30 transition-all hover:bg-[#006674] hover:-translate-y-[1px] hover:shadow-md"
          >
            Explore collections
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-[999px] bg-[#f5e9dc] px-4 py-2 text-[11px] font-medium text-[#6b625a]">
            <Truck className="h-3.5 w-3.5 text-[#007a8a]" />
            <span>Pan-India shipping from our Mumbai atelier.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({
  triggerVariant = 'icon',
  showTrigger = true,
  className,
}: CartDrawerProps) {
  const {
    state,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    formatMoney,
    getItemCount,
    getTotalQuantity,
    selectShippingMethod,
    getFulfilmentProgress,
    isHydrated,
  } = useCart();
  const navigate = useNavigate();

  const [localOpen, setLocalOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const itemCount = getItemCount();
  const totalQuantity = getTotalQuantity();
  const isEmpty = !itemCount;

  useEffect(() => {
    if (isCartOpen !== localOpen) {
      setLocalOpen(isCartOpen);
    }
  }, [isCartOpen, localOpen]);

  const handleOpenChange = (next: boolean) => {
    setLocalOpen(next);
    if (next) {
      if (!hasInteracted) setHasInteracted(true);
      openCart();
    } else {
      closeCart();
    }
  };

  const handleNavigate = useCallback(
    (path: string) => {
      closeCart();
      navigate(path);
    },
    [closeCart, navigate],
  );

  const handleCheckout = useCallback(() => {
    if (isEmpty) {
      toast.warning('Your cart is empty', {
        description: 'Add a collection of bottles before heading to checkout.',
      });
      return;
    }
    if (!isHydrated) {
      toast.info('Almost there', {
        description: 'We’re syncing your cart. Try again in a second.',
      });
      return;
    }
    toast.success('Cart locked in', {
      description: 'We’ll carry your configuration into a guided checkout.',
    });
    handleNavigate('/checkout');
  }, [handleNavigate, isEmpty, isHydrated]);

  const handleIncrease = (id: ID) => {
    if (!id) return;
    if (state?.isLocked) {
      toast.info('Order finalisation in progress', {
        description: 'You can adjust quantities again in a moment.',
      });
      return;
    }
  };

  const handleDecrease = (id: ID) => {
    if (!id) return;
    if (state?.isLocked) {
      toast.info('Order finalisation in progress', {
        description: 'You can adjust quantities again in a moment.',
      });
      return;
    }
  };

  const handleRemove = (id: ID) => {
    if (!id) return;
    if (state?.isLocked) {
      toast.info('Order finalisation in progress', {
        description: 'Item removals are paused while we prepare your order.',
      });
      return;
    }
  };

  const subtotal = state?.priceSummary?.itemsSubtotal ?? state?.priceSummary?.grandTotal;
  const cartCopy = state?.meta?.itemCount
    ? `${state.meta.totalQuantity} bottles in your ritual`
    : 'Begin your hydration ritual';

  const fulfilmentProgress = useMemo(
    () => getFulfilmentProgress() || calculateProgressFromCart(state),
    [getFulfilmentProgress, state],
  );

  const currencyLabel = state?.priceSummary?.currency ?? 'INR';

  const triggerLabel = useMemo(() => {
    if (!itemCount) return 'Cart';
    if (itemCount === 1) return '1 item';
    return `${itemCount} items`;
  }, [itemCount]);

  const quantityLabel = useMemo(() => {
    if (!totalQuantity) return '';
    if (totalQuantity === 1) return '1 bottle';
    return `${totalQuantity} bottles`;
  }, [totalQuantity]);

  const drawerTitle = useMemo(() => {
    if (!itemCount) return 'Your cart is empty';
    if (itemCount === 1) return '1 piece in your cart';
    return `${itemCount} pieces curated`;
  }, [itemCount]);

  const handleExploreCollections = () => {
    handleNavigate('/shop');
  };

  const animatedCount = useMemo(() => {
    if (!itemCount) return '0';
    if (itemCount > 99) return '99+';
    return String(itemCount);
  }, [itemCount]);

  const shippingMethods = state?.shippingMethods ?? [];
  const priceSummary = state?.priceSummary as CartPriceSummary;

  return (
    <Dialog.Root open={localOpen} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <Dialog.Trigger asChild>
          <button
            type="button"
            onClick={toggleCart}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-[999px] border border-[#e7d6c6] bg-[#fff7ee] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#333333]',
              'shadow-sm shadow-[#c3a993]/20 transition-all',
              'hover:-translate-y-[1px] hover:border-[#d2bca3] hover:bg-[#f5e9dc] hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5e9dc]',
              className,
            )}
          >
            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#007a8a] text-white shadow-sm shadow-[#007a8a]/40">
              <ShoppingBag className="h-3.5 w-3.5" />
              <AnimatePresence>
                {itemCount ? (
                  <motion.span
                    key={animatedCount}
                    initial={{ scale: 0.3, opacity: 0, y: 4 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0, y: -4 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="absolute -right-1.5 -top-1 h-4 min-w-[1.1rem] rounded-full bg-[#ff6f61] px-1 text-[9px] font-semibold leading-4 text-white shadow-sm shadow-[#ff6f61]/40"
                  >
                    {animatedCount}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
            {(triggerVariant === 'label' || triggerVariant === 'both') && (
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b625a] sm:inline-flex">
                {triggerLabel}
                {quantityLabel ? (
                  <span className="ml-1 text-[10px] lowercase text-[#6b625a]/80">
                    ({quantityLabel})
                  </span>
                ) : null}
              </span>
            )}
          </button>
        </Dialog.Trigger>
      ) : null}
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col',
            'bg-[#f5e9dc] shadow-2xl shadow-black/40',
            'border-l border-[#e7d6c6]',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#e7d6c6] bg-[#f5e9dc]/95 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavigate('/shop')}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee]/90 text-[#6b625a] shadow-sm shadow-[#c3a993]/30 transition-all hover:-translate-y-[1px] hover:bg-[#f5e9dc]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-col">
                <Dialog.Title className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#333333]">
                  Cart & dispatch
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-[#6b625a]">
                  {cartCopy}
                </Dialog.Description>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {subtotal?.amount ? (
                <div className="hidden md:flex md:flex-col md:items-end md:justify-center">
                  <span className="text-[11px] text-[#6b625a]">Estimated total</span>
                  <span className="text-[13px] font-semibold text-[#333333]">
                    {formatMoney(subtotal)}
                  </span>
                </div>
              ) : null}
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7d6c6] bg-[#fff7ee]/90 text-[#6b625a] shadow-sm shadow-[#c3a993]/30 transition-all hover:-translate-y-[1px] hover:bg-[#f5e9dc]"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>
          <div className="grid min-h-0 flex-1 grid-rows-[auto,1fr,auto]">
            <div className="border-b border-[#e7d6c6] bg-[#fff7ee]/90 px-4 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#007a8a] text-white shadow-sm shadow-[#007a8a]/40">
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#333333]">
                      {drawerTitle}
                    </span>
                    <span className="text-[10px] text-[#6b625a]">
                      {totalQuantity ? `Total of ${quantityLabel} in this ritual.` : 'Start with a collection that suits your table.'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate('/design')}
                  className="inline-flex items-center gap-1 rounded-[999px] bg-[#f5e9dc] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#333333] shadow-sm shadow-[#c3a993]/20 transition-all hover:-translate-y-[1px] hover:bg-[#f0dcc4]"
                >
                  <span>Open label studio</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="min-h-0 overflow-y-auto px-4 py-4">
              {isEmpty ? (
                <EmptyState onExplore={handleExploreCollections} />
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {state?.items?.map((item, index) => (
                      <CartLineItem
                        key={item?.id ?? `${item?.productId}-${index}`}
                        item={item}
                        index={index}
                        formatMoney={formatMoney}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemove}
                      />
                    ))}
                  </AnimatePresence>
                  <li className="mt-4">
                    <div className="rounded-[18px] border border-dashed border-[#e7d6c6] bg-[#fff7ee] px-3.5 py-3 text-[11px] text-[#6b625a]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#007a8a]" />
                          <span className="font-semibold text-[#333333]">
                            Artwork is finalized in checkout.
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f5e9dc] px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6b625a]">
                          <Info className="h-3 w-3" />
                          Need help?
                        </span>
                      </div>
                      <p className="mt-1.5 leading-relaxed">
                        You can share notes for your design concierge, upload logos, and
                        request proof tweaks before anything goes to print or bottle.
                      </p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
            <div className="border-t border-[#e7d6c6] bg-[#f5e9dc]/95 px-4 py-3 backdrop-blur-md">
              {isEmpty ? (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleExploreCollections}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[999px] bg-[#007a8a] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm shadow-[#007a8a]/30 transition-all hover:-translate-y-[1px] hover:bg-[#006674] hover:shadow-md"
                  >
                    <span>Explore collections</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('/about')}
                    className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#6b625a] underline-offset-2 hover:underline"
                  >
                    <span>About Nishant Waters</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <CartSummary
                  priceSummary={priceSummary}
                  shippingMethods={shippingMethods}
                  selectedShippingMethodId={state?.selectedShippingMethodId}
                  currencyLabel={currencyLabel}
                  formatMoney={formatMoney}
                  onSelectShipping={selectShippingMethod}
                  onCheckout={handleCheckout}
                  isCheckoutDisabled={isEmpty || !isHydrated}
                  isLocked={state?.isLocked ?? false}
                  fulfilmentProgress={fulfilmentProgress}
                />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;