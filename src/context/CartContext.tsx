import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  CartContextValue,
  CartItem,
  CartTotals,
  LabelCustomization,
  Product,
  UserInput,
} from '@/types';
import { toast } from 'sonner';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const FLAT_SHIPPING_CENTS = 499;

function clampQuantity(qty: number | undefined): number {
  const n = Number.isFinite(qty) ? (qty as number) : 1;
  return Math.min(10, Math.max(1, n));
}

function computeTotals(items: CartItem[]): CartTotals {
  const itemCount = items?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0;
  const subtotalCents =
    items?.reduce((sum, item) => sum + (item?.unitPriceCents ?? 0) * (item?.quantity ?? 0), 0) ?? 0;
  const qualifiesForFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = items?.length ? (qualifiesForFreeShipping ? 0 : FLAT_SHIPPING_CENTS) : 0;
  const discountCents = 0;
  const totalCents = subtotalCents + shippingCents - discountCents;
  return {
    itemCount,
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    qualifiesForFreeShipping,
  };
}

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addItem = useCallback((product: Product, input?: Partial<UserInput>) => {
    if (!product?.id) return;
    const quantity = clampQuantity(input?.quantity ?? 1);
    const label: LabelCustomization = {
      text: input?.labelText ?? 'Nishant Waters',
      colorToken: input?.labelColorToken ?? 'mint',
    };
    const variantId = input?.selectedVariantId ?? product?.variants?.[0]?.id;
    const unitPriceCents =
      product?.variants?.find(v => v?.id === variantId)?.priceCents ??
      product?.basePriceCents ??
      0;

    const key = `${product?.id}-${variantId ?? 'base'}-${label.colorToken}-${label.text}`;
    setItems(prev => {
      const existing = prev?.find(item => item?.id === key);
      if (existing) {
        const nextQty = clampQuantity(existing.quantity + quantity);
        const updated = prev?.map(item =>
          item?.id === key ? { ...item, quantity: nextQty } : item
        );
        toast.success('Updated your bottle set');
        return updated;
      }
      const next: CartItem = {
        id: key,
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        unitPriceCents,
        quantity,
        variantId,
        label,
      };
      toast.success('Added to cart');
      return [...(prev ?? []), next];
    });
    setIsOpen(true);
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Pick<CartItem, 'quantity' | 'label'>>) => {
      if (!id) return;
      setItems(prev => {
        const exists = prev?.some(item => item?.id === id);
        if (!exists) {
          toast.error('Item not found in cart');
          return prev ?? [];
        }
        const updated = prev?.map(item => {
          if (item?.id !== id) return item;
          const nextQuantity = patch.quantity ? clampQuantity(patch.quantity) : item.quantity;
          const nextLabel: LabelCustomization = {
            text: patch.label?.text ?? item.label.text,
            colorToken: patch.label?.colorToken ?? item.label.colorToken,
          };
          return { ...item, quantity: nextQuantity, label: nextLabel };
        });
        toast.success('Cart updated');
        return updated;
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    if (!id) return;
    setItems(prev => {
      const next = prev?.filter(item => item?.id !== id) ?? [];
      toast.success('Removed from cart');
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Cart cleared');
  }, []);

  const totals = useMemo(() => computeTotals(items ?? []), [items]);

  const value: CartContextValue = useMemo(
    () => ({
      items: items ?? [],
      totals,
      freeShippingThresholdCents: FREE_SHIPPING_THRESHOLD_CENTS,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [items, totals, isOpen, openCart, closeCart, addItem, updateItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children ?? null}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

export default CartContext;
export { CartContext };
