import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  CartItem,
  CartState,
  CartTotals,
  CustomLabelDesign,
  LocalStorageSchema,
  Order,
  PaymentSummary,
  Address,
} from '@/types';
import { products } from '@/data/mockData';

export interface CartContextValue {
  items: CartItem[];
  savedDesigns: CustomLabelDesign[];
  totals: CartTotals;
  isCartOpen: boolean;
  isDesignStudioOpen: boolean;
  addToCart: (item: Omit<CartItem, 'id' | 'unitPrice'> & { unitPriceAmount?: number }) => void;
  updateQty: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openDesignStudio: () => void;
  closeDesignStudio: () => void;
  saveDesign: (design: CustomLabelDesign) => void;
  deleteDesign: (id: string) => void;
  placeOrder: (params: {
    shippingAddress: Address;
    billingAddress: Address;
    payment: PaymentSummary;
    notes?: string;
  }) => Order | null;
  lastOrder: Order | null;
}

const defaultTotals: CartTotals = {
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  currency: 'INR',
};

const defaultState: CartState = {
  items: [],
  savedDesigns: [],
  totals: defaultTotals,
};

const rawContext = createContext<CartContextValue>({
  items: [],
  savedDesigns: [],
  totals: defaultTotals,
  isCartOpen: false,
  isDesignStudioOpen: false,
  addToCart: () => undefined,
  updateQty: () => undefined,
  removeItem: () => undefined,
  clearCart: () => undefined,
  openCart: () => undefined,
  closeCart: () => undefined,
  openDesignStudio: () => undefined,
  closeDesignStudio: () => undefined,
  saveDesign: () => undefined,
  deleteDesign: () => undefined,
  placeOrder: () => null,
  lastOrder: null,
});

const STORAGE_KEY = 'nishant-waters-state-v1';

function loadState(): { cart: CartState; lastOrder: Order | null; designs: CustomLabelDesign[] } {
  if (typeof window === 'undefined') return { cart: defaultState, lastOrder: null, designs: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cart: defaultState, lastOrder: null, designs: [] };
    const parsed = JSON.parse(raw) as LocalStorageSchema;
    const cart = parsed?.cart ?? defaultState;
    const designs = parsed?.designs ?? [];
    const lastOrder = parsed?.lastOrder ?? null;
    return { cart, lastOrder, designs };
  } catch {
    return { cart: defaultState, lastOrder: null, designs: [] };
  }
}

function persistState(payload: { cart: CartState; lastOrder?: Order | null; designs: CustomLabelDesign[] }) {
  if (typeof window === 'undefined') return;
  const data: LocalStorageSchema = {
    cart: payload.cart,
    lastOrder: payload.lastOrder ?? undefined,
    designs: payload.designs,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function computeTotals(items: CartItem[]): CartTotals {
  if (!items?.length) return defaultTotals;
  const currency = items[0]?.unitPrice?.currency ?? 'INR';
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice?.amount ?? 0) * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : items.length > 0 ? 250 : 0;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, currency };
}

export function CartProvider({ children }: { children?: React.ReactNode }) {
  const { cart: initialCart, lastOrder: initialLastOrder, designs: initialDesigns } = useMemo(
    () => loadState(),
    []
  );

  const [items, setItems] = useState<CartItem[]>(initialCart.items ?? []);
  const [savedDesigns, setSavedDesigns] = useState<CustomLabelDesign[]>(initialDesigns ?? []);
  const [totals, setTotals] = useState<CartTotals>(() => computeTotals(initialCart.items ?? []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDesignStudioOpen, setIsDesignStudioOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(initialLastOrder);

  useEffect(() => {
    const nextTotals = computeTotals(items);
    setTotals(nextTotals);
    persistState({ cart: { items, savedDesigns, totals: nextTotals }, lastOrder, designs: savedDesigns });
  }, [items, savedDesigns, lastOrder]);

  const addToCart: CartContextValue['addToCart'] = (payload) => {
    const { productId, variantId, quantity, labelDesignId, personalizationSummary, unitPriceAmount } = payload;
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants?.find((v) => v.id === variantId);
    const amount = unitPriceAmount ?? variant?.price?.amount ?? 0;
    const currency = variant?.price?.currency ?? 'INR';
    const unitPrice = { amount, currency, compareAtAmount: variant?.price?.compareAtAmount ?? null };
    setItems((prev) => {
      const existing = prev.find(
        (it) => it.productId === productId && it.variantId === variantId && it.labelDesignId === labelDesignId
      );
      if (existing) {
        return prev.map((it) =>
          it.id === existing.id ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      const id = crypto.randomUUID();
      return [
        ...prev,
        {
          id,
          productId,
          variantId,
          quantity,
          unitPrice,
          labelDesignId,
          personalizationSummary,
        },
      ];
    });
    setIsCartOpen(true);
    toast.success('Added to cart', { description: product?.name ?? 'Item added successfully.' });
  };

  const updateQty: CartContextValue['updateQty'] = (id, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((it) => it.id !== id);
      return prev.map((it) => (it.id === id ? { ...it, quantity } : it));
    });
  };

  const removeItem: CartContextValue['removeItem'] = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast('Item removed', { description: 'The item was removed from your cart.' });
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openDesignStudio = () => setIsDesignStudioOpen(true);
  const closeDesignStudio = () => setIsDesignStudioOpen(false);

  const saveDesign: CartContextValue['saveDesign'] = (design) => {
    setSavedDesigns((prev) => {
      const existingIndex = prev.findIndex((d) => d.id === design.id);
      const next = [...prev];
      if (existingIndex >= 0) {
        next[existingIndex] = { ...design, updatedAt: new Date().toISOString() };
      } else {
        next.push({ ...design, createdAt: design.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      return next;
    });
    toast.success('Design saved', { description: design.name ?? 'Your label design is stored in Studio.' });
  };

  const deleteDesign: CartContextValue['deleteDesign'] = (id) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
    toast('Design removed', { description: 'The design has been removed from your Studio.' });
  };

  const placeOrder: CartContextValue['placeOrder'] = ({ shippingAddress, billingAddress, payment, notes }) => {
    if (!items.length) {
      toast.error('Your cart is empty');
      return null;
    }
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const number = `NW-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderTotals = computeTotals(items);
    const orderItems = items.map((it) => {
      const design = savedDesigns.find((d) => d.id === it.labelDesignId);
      return {
        id: it.id,
        productId: it.productId,
        variantId: it.variantId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        labelDesignSnapshot: design,
      };
    });
    const order: Order = {
      id,
      number,
      createdAt: now,
      status: 'processing',
      items: orderItems,
      totals: orderTotals,
      shippingAddress,
      billingAddress,
      payment,
      notes,
    };
    setLastOrder(order);
    setItems([]);
    setIsCartOpen(false);
    toast.success('Order placed', { description: `Order ${number} is now processing.` });
    return order;
  };

  const value: CartContextValue = {
    items,
    savedDesigns,
    totals,
    isCartOpen,
    isDesignStudioOpen,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    openDesignStudio,
    closeDesignStudio,
    saveDesign,
    deleteDesign,
    placeOrder,
    lastOrder,
  };

  return <rawContext.Provider value={value}>{children}</rawContext.Provider>;
}

export function useCart(): CartContextValue {
  return useContext(rawContext);
}

export const CartContext = rawContext;
export default rawContext;
export { rawContext };
