import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { toast } from 'sonner';
import type {
  CartItem,
  CartItemCustomization,
  CartItemLabelCustomization,
  CartMeta,
  CartPriceSummary,
  CartState,
  CartDiscount,
  CheckoutStepKey,
  LabelDesign,
  MoneyValue,
  ShippingMethod,
  ToastPayload,
  ID,
  CurrencyCode,
} from '@/types';
import { defaultAppConfig } from '@/types';
import mockData from '@/data/mockData';

export interface CartContextValue {
  state: CartState;
  isCartOpen: boolean;
  isDesignDrawerOpen: boolean;
  activeCheckoutStep: CheckoutStepKey;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openDesignDrawer: () => void;
  closeDesignDrawer: () => void;
  setCheckoutStep: (step: CheckoutStepKey) => void;
  addItem: (item: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<CartItem, 'id'>>) => void;
  removeItem: (itemId: ID) => void;
  updateItemQuantity: (itemId: ID, quantity: number) => void;
  clearCart: () => void;
  attachLabelToItem: (itemId: ID, design: LabelDesign) => void;
  updateItemCustomizations: (itemId: ID, customizations: CartItemCustomization[]) => void;
  applyDiscountCode: (code: string) => void;
  removeDiscountCode: (code: string) => void;
  selectShippingMethod: (shippingMethodId: ID) => void;
  refreshShippingProgress: () => number;
  getFulfilmentProgress: () => number;
  hydrateFromStorage: () => void;
  persistToStorage: () => void;
  formatMoney: (money: MoneyValue) => string;
  getItemCount: () => number;
  getTotalQuantity: () => number;
  getCartSummaryCopy: () => string;
  showToast: (payload: ToastPayload) => void;
}

const CartContext = createContext<CartContextValue>({
  state: mockData?.cartInitialState ?? ({} as CartState),
  isCartOpen: false,
  isDesignDrawerOpen: false,
  activeCheckoutStep: 'details',
  isHydrated: false,
  openCart: () => undefined,
  closeCart: () => undefined,
  toggleCart: () => undefined,
  openDesignDrawer: () => undefined,
  closeDesignDrawer: () => undefined,
  setCheckoutStep: () => undefined,
  addItem: () => undefined,
  removeItem: () => undefined,
  updateItemQuantity: () => undefined,
  clearCart: () => undefined,
  attachLabelToItem: () => undefined,
  updateItemCustomizations: () => undefined,
  applyDiscountCode: () => undefined,
  removeDiscountCode: () => undefined,
  selectShippingMethod: () => undefined,
  refreshShippingProgress: () => 0,
  getFulfilmentProgress: () => 0,
  hydrateFromStorage: () => undefined,
  persistToStorage: () => undefined,
  formatMoney: () => '',
  getItemCount: () => 0,
  getTotalQuantity: () => 0,
  getCartSummaryCopy: () => '',
  showToast: () => undefined,
});

type CartAction =
  | { type: 'HYDRATE'; payload: CartState }
  | { type: 'RESET'; payload?: CartState }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { itemId: ID } }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: ID; quantity: number } }
  | { type: 'UPDATE_ITEM_CUSTOMIZATIONS'; payload: { itemId: ID; customizations: CartItemCustomization[] } }
  | { type: 'ATTACH_LABEL'; payload: { itemId: ID; customization: CartItemLabelCustomization } }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: CartDiscount } }
  | { type: 'REMOVE_DISCOUNT'; payload: { code: string } }
  | { type: 'SELECT_SHIPPING_METHOD'; payload: { shippingMethodId: ID } }
  | { type: 'RECALCULATE_TOTALS' }
  | { type: 'LOCK_CART' }
  | { type: 'UNLOCK_CART' };

const STORAGE_KEY = 'nishant-waters-cart-v1';
const STORAGE_META_KEY = 'nishant-waters-cart-meta-v1';

const ensureMoneyFormatted = (value: MoneyValue): MoneyValue => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: value.currency ?? defaultAppConfig.currency,
    maximumFractionDigits: 0,
  });
  return {
    ...value,
    currency: value.currency ?? defaultAppConfig.currency,
    formatted: value.formatted ?? formatter.format(value.amount ?? 0),
  };
};

const createMoney = (amount: number, currency: CurrencyCode): MoneyValue => {
  return ensureMoneyFormatted({
    amount,
    currency,
  });
};

const sumMoney = (values: MoneyValue[], currency: CurrencyCode): MoneyValue => {
  const amount = values?.reduce((acc, v) => acc + (v?.amount ?? 0), 0) ?? 0;
  return createMoney(amount, currency);
};

const negativeMoney = (value: MoneyValue): MoneyValue => {
  return ensureMoneyFormatted({
    amount: -(value?.amount ?? 0),
    currency: value?.currency ?? defaultAppConfig.currency,
  });
};

const cloneCartItem = (item: CartItem): CartItem => {
  return {
    ...item,
    customizations: [...(item.customizations ?? [])],
  };
};

const calculateLineTotals = (item: CartItem, currency: CurrencyCode): CartItem => {
  const unitPrice = ensureMoneyFormatted({
    ...(item.unitPrice ?? { amount: 0, currency }),
    currency,
  });
  const quantity = item.quantity ?? 0;
  const lineSubtotal = createMoney(unitPrice.amount * quantity, currency);
  const lineDiscountAmount = item.lineDiscount?.amount ?? 0;
  const lineTotalAmount = Math.max(lineSubtotal.amount - lineDiscountAmount, 0);
  const lineTotal = createMoney(lineTotalAmount, currency);
  return {
    ...item,
    unitPrice,
    lineSubtotal,
    lineTotal,
  };
};

const deriveCartMeta = (state: CartState): CartMeta => {
  const now = new Date().toISOString();
  const itemCount = state.items?.length ?? 0;
  const totalQuantity =
    state.items?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) ?? 0;
  const hasCustomizations =
    state.items?.some((item) => (item?.customizations?.length ?? 0) > 0) ?? false;
  return {
    ...(state.meta ?? ({} as CartMeta)),
    id: (state.meta?.id ??
      (`cart_${(state.meta?.sessionId ?? 'session')}` as ID)) as ID,
    sessionId: state.meta?.sessionId ?? 'browser-session',
    itemCount,
    totalQuantity,
    hasCustomizations,
    createdAt: state.meta?.createdAt ?? now,
    updatedAt: now,
    lastTouchedAt: now,
  };
};

const derivePriceSummary = (state: CartState, currency: CurrencyCode): CartPriceSummary => {
  const itemsSubtotal = sumMoney(
    (state.items ?? []).map((item) =>
      ensureMoneyFormatted({
        ...(item.lineSubtotal ?? { amount: 0, currency }),
        currency,
      })
    ),
    currency
  );

  const decorationFees = sumMoney(
    (state.items ?? []).map((item) => {
      const hasLabel =
        item.customizations?.some((c) => c?.type === 'label') ?? false;
      if (!hasLabel) {
        return createMoney(0, currency);
      }
      const qty = item.quantity ?? 0;
      return createMoney(qty * 5, currency);
    }),
    currency
  );

  const packagingFees = sumMoney(
    (state.items ?? []).map((item) => {
      const hasPackaging =
        item.customizations?.some((c) => c?.type === 'packaging') ?? false;
      if (!hasPackaging) {
        return createMoney(0, currency);
      }
      const qty = item.quantity ?? 0;
      return createMoney(qty * 3, currency);
    }),
    currency
  );

  const selectedShipping =
    state.shippingMethods?.find(
      (m) => m?.id === state.selectedShippingMethodId
    ) ?? state.shippingMethods?.find((m) => m?.isDefault) ?? state.shippingMethods?.[0];

  const shipping = ensureMoneyFormatted(
    selectedShipping?.price ?? createMoney(0, currency)
  );

  const activeDiscounts = (state.discounts ?? []).filter(
    (d) => d?.applied
  );

  let discountTotal = createMoney(0, currency);
  activeDiscounts.forEach((discount) => {
    if (discount.type === 'percentage') {
      const base = itemsSubtotal.amount + decorationFees.amount + packagingFees.amount;
      const amount = (base * discount.value) / 100;
      const val = createMoney(amount, currency);
      discountTotal = sumMoney([discountTotal, val], currency);
    } else if (discount.type === 'fixed') {
      const val = createMoney(discount.value, currency);
      discountTotal = sumMoney([discountTotal, val], currency);
    } else if (discount.type === 'shipping') {
      const val = shipping;
      discountTotal = sumMoney([discountTotal, val], currency);
    }
  });

  const discount =
    discountTotal.amount > 0 ? negativeMoney(discountTotal) : undefined;

  const preTax =
    itemsSubtotal.amount +
    decorationFees.amount +
    packagingFees.amount +
    shipping.amount +
    (discount?.amount ?? 0);

  const taxAmount = preTax > 0 ? Math.round(preTax * 0.18) : 0;
  const tax = taxAmount > 0 ? createMoney(taxAmount, currency) : undefined;

  const grandTotalAmount = preTax + (tax?.amount ?? 0);
  const grandTotal = createMoney(Math.max(grandTotalAmount, 0), currency);

  return {
    itemsSubtotal: ensureMoneyFormatted(itemsSubtotal),
    decorationFees: ensureMoneyFormatted(decorationFees),
    packagingFees: ensureMoneyFormatted(packagingFees),
    shipping: ensureMoneyFormatted(shipping),
    discount: discount ? ensureMoneyFormatted(discount) : undefined,
    tax: tax ? ensureMoneyFormatted(tax) : undefined,
    grandTotal: ensureMoneyFormatted(grandTotal),
    currency,
  };
};

const recalculateState = (state: CartState, currency: CurrencyCode): CartState => {
  const itemsWithTotals = (state.items ?? []).map((item) =>
    calculateLineTotals(item, currency)
  );
  const meta = deriveCartMeta({ ...state, items: itemsWithTotals });
  const priceSummary = derivePriceSummary(
    { ...state, items: itemsWithTotals, meta },
    currency
  );
  return {
    ...state,
    items: itemsWithTotals,
    meta,
    priceSummary,
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  const currency = state.priceSummary?.currency ?? defaultAppConfig.currency;
  switch (action.type) {
    case 'HYDRATE': {
      const hydrated = action.payload ?? state;
      return recalculateState(hydrated, hydrated.priceSummary?.currency ?? currency);
    }
    case 'RESET': {
      const base = action.payload ?? mockData.cartInitialState;
      return recalculateState(base, base.priceSummary?.currency ?? currency);
    }
    case 'ADD_ITEM': {
      const existingIndex = state.items?.findIndex(
        (i) =>
          i.productId === action.payload.productId &&
          i.variant?.bottleSize === action.payload.variant?.bottleSize &&
          i.variant?.material === action.payload.variant?.material &&
          i.variant?.finish === action.payload.variant?.finish &&
          i.variant?.capStyle === action.payload.variant?.capStyle &&
          i.variant?.hydrationProfile === action.payload.variant?.hydrationProfile &&
          i.variant?.flavorProfile === action.payload.variant?.flavorProfile
      );
      const now = new Date().toISOString();
      const newItems = [...(state.items ?? [])];

      if (existingIndex != null && existingIndex >= 0) {
        const existing = cloneCartItem(newItems[existingIndex]);
        const newQty = (existing.quantity ?? 0) + (action.payload.quantity ?? 0);
        const merged: CartItem = {
          ...existing,
          quantity: newQty,
          updatedAt: now,
          lineDiscount: existing.lineDiscount ?? action.payload.lineDiscount,
          customizations: [
            ...(existing.customizations ?? []),
            ...(action.payload.customizations ?? []),
          ],
        };
        newItems[existingIndex] = merged;
      } else {
        const id =
          (action.payload.id ??
            (`cart_item_${Math.random().toString(36).slice(2)}` as ID)) as ID;
        const newItem: CartItem = {
          ...action.payload,
          id,
          createdAt: now,
          updatedAt: now,
          customizations: [...(action.payload.customizations ?? [])],
        };
        newItems.push(newItem);
      }

      const updatedState = {
        ...state,
        items: newItems,
      };
      return recalculateState(updatedState, currency);
    }
    case 'REMOVE_ITEM': {
      const filtered =
        state.items?.filter((item) => item.id !== action.payload.itemId) ?? [];
      const updatedState = {
        ...state,
        items: filtered,
      };
      return recalculateState(updatedState, currency);
    }
    case 'UPDATE_ITEM_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const newItems = (state.items ?? []).map((item) => {
        if (item.id !== itemId) return item;
        const now = new Date().toISOString();
        const nextQty = Math.max(quantity, 0);
        return {
          ...item,
          quantity: nextQty,
          updatedAt: now,
        };
      }).filter((item) => (item.quantity ?? 0) > 0);
      const updatedState = {
        ...state,
        items: newItems,
      };
      return recalculateState(updatedState, currency);
    }
    case 'UPDATE_ITEM_CUSTOMIZATIONS': {
      const { itemId, customizations } = action.payload;
      const newItems = (state.items ?? []).map((item) => {
        if (item.id !== itemId) return item;
        const now = new Date().toISOString();
        return {
          ...item,
          updatedAt: now,
          customizations: [...(customizations ?? [])],
        };
      });
      const updatedState = {
        ...state,
        items: newItems,
      };
      return recalculateState(updatedState, currency);
    }
    case 'ATTACH_LABEL': {
      const { itemId, customization } = action.payload;
      const newItems = (state.items ?? []).map((item) => {
        if (item.id !== itemId) return item;
        const now = new Date().toISOString();
        const others =
          item.customizations?.filter((c) => c.type !== 'label') ?? [];
        return {
          ...item,
          updatedAt: now,
          customizations: [...others, customization],
        };
      });
      const updatedState = {
        ...state,
        items: newItems,
      };
      return recalculateState(updatedState, currency);
    }
    case 'APPLY_DISCOUNT': {
      const exists =
        state.discounts?.some((d) => d.code === action.payload.discount.code) ??
        false;
      if (exists) {
        const mapped =
          state.discounts?.map((d) =>
            d.code === action.payload.discount.code
              ? { ...d, applied: true }
              : d
          ) ?? [];
        const updatedState = {
          ...state,
          discounts: mapped,
        };
        return recalculateState(updatedState, currency);
      }
      const updatedState = {
        ...state,
        discounts: [
          ...(state.discounts ?? []),
          { ...action.payload.discount, applied: true },
        ],
      };
      return recalculateState(updatedState, currency);
    }
    case 'REMOVE_DISCOUNT': {
      const filtered =
        state.discounts?.filter((d) => d.code !== action.payload.code) ?? [];
      const updatedState = {
        ...state,
        discounts: filtered,
      };
      return recalculateState(updatedState, currency);
    }
    case 'SELECT_SHIPPING_METHOD': {
      const updatedState = {
        ...state,
        selectedShippingMethodId: action.payload.shippingMethodId,
      };
      return recalculateState(updatedState, currency);
    }
    case 'RECALCULATE_TOTALS': {
      return recalculateState(state, currency);
    }
    case 'LOCK_CART': {
      return {
        ...state,
        isLocked: true,
      };
    }
    case 'UNLOCK_CART': {
      return {
        ...state,
        isLocked: false,
      };
    }
    default:
      return state;
  }
};

export interface CartProviderProps {
  children?: React.ReactNode;
}

export function CartProvider({ children = null }: CartProviderProps) {
  const [state, dispatch] = useReducer(
    cartReducer,
    mockData.cartInitialState ?? ({} as CartState)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDesignDrawerOpen, setIsDesignDrawerOpen] = useState(false);
  const [activeCheckoutStep, setActiveCheckoutStep] =
    useState<CheckoutStepKey>('details');
  const [isHydrated, setIsHydrated] = useState(false);

  const currency: CurrencyCode =
    state.priceSummary?.currency ?? defaultAppConfig.currency;

  const persistToStorage = useCallback(() => {
    if (!defaultAppConfig.enablePersistence) return;
    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(STORAGE_KEY, serialized);
      const meta = {
        lastPersistedAt: new Date().toISOString(),
        version: 1,
      };
      window.localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
    } catch (error) {
      // no-op
    }
  }, [state]);

  const hydrateFromStorage = useCallback(() => {
    if (!defaultAppConfig.enablePersistence) {
      setIsHydrated(true);
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        dispatch({
          type: 'RESET',
          payload: mockData.cartInitialState,
        });
        setIsHydrated(true);
        return;
      }
      const parsed = JSON.parse(stored) as CartState;
      dispatch({ type: 'HYDRATE', payload: parsed });
      setIsHydrated(true);
    } catch (error) {
      dispatch({
        type: 'RESET',
        payload: mockData.cartInitialState,
      });
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    if (!isHydrated) return;
    persistToStorage();
  }, [persistToStorage, isHydrated]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const openDesignDrawer = useCallback(() => {
    setIsDesignDrawerOpen(true);
  }, []);

  const closeDesignDrawer = useCallback(() => {
    setIsDesignDrawerOpen(false);
  }, []);

  const setCheckoutStep = useCallback((step: CheckoutStepKey) => {
    setActiveCheckoutStep(step);
  }, []);

  const addItem: CartContextValue['addItem'] = useCallback(
    (rawItem) => {
      if (state.isLocked) {
        toast.error('Cart is locked while an order is processing.');
        return;
      }
      const item: CartItem = {
        ...(rawItem as CartItem),
        id:
          (rawItem.id ??
            (`cart_item_${Math.random().toString(36).slice(2)}` as ID)) as ID,
        createdAt: (rawItem as CartItem).createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customizations: [...(rawItem.customizations ?? [])],
      };
      dispatch({ type: 'ADD_ITEM', payload: item });
      toast.success('Added to cart', {
        description: `${item.productName ?? 'Bottle'} added to your tray.`,
      });
      setIsCartOpen(true);
    },
    [state.isLocked]
  );

  const removeItem = useCallback(
    (itemId: ID) => {
      if (state.isLocked) {
        toast.error('Cart is locked while an order is processing.');
        return;
      }
      const item = state.items?.find((i) => i.id === itemId);
      dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
      toast('Removed from cart', {
        description: `${item?.productName ?? 'Item'} was removed.`,
      });
    },
    [state.isLocked, state.items]
  );

  const updateItemQuantity = useCallback(
    (itemId: ID, quantity: number) => {
      if (state.isLocked) {
        toast.error('Cart is locked while an order is processing.');
        return;
      }
      dispatch({
        type: 'UPDATE_ITEM_QUANTITY',
        payload: { itemId, quantity },
      });
    },
    [state.isLocked]
  );

  const clearCart = useCallback(() => {
    if (state.isLocked) {
      toast.error('Cart is locked while an order is processing.');
      return;
    }
    dispatch({
      type: 'RESET',
      payload: {
        ...mockData.cartInitialState,
        shippingMethods: state.shippingMethods ?? mockData.shippingMethods,
      },
    });
    toast('Cart cleared', {
      description: 'Your Nishant Waters tray is now empty.',
    });
  }, [state.isLocked, state.shippingMethods]);

  const attachLabelToItem = useCallback(
    (itemId: ID, design: LabelDesign) => {
      if (state.isLocked) {
        toast.error('Cart is locked while an order is processing.');
        return;
      }
      const customization: CartItemLabelCustomization = {
        type: 'label',
        designId: design.id,
        designSnapshot: {
          ...design,
          isDirty: false,
          isSynced: true,
        },
      };
      dispatch({
        type: 'ATTACH_LABEL',
        payload: {
          itemId,
          customization,
        },
      });
      toast.success('Label applied', {
        description: 'Your bespoke label is now linked to this bottle set.',
      });
    },
    [state.isLocked]
  );

  const updateItemCustomizations = useCallback(
    (itemId: ID, customizations: CartItemCustomization[]) => {
      if (state.isLocked) {
        toast.error('Cart is locked while an order is processing.');
        return;
      }
      dispatch({
        type: 'UPDATE_ITEM_CUSTOMIZATIONS',
        payload: { itemId, customizations },
      });
    },
    [state.isLocked]
  );

  const applyDiscountCode = useCallback(
    (code: string) => {
      if (!code) return;
      const trimmed = code.trim().toUpperCase();
      if (!trimmed) return;
      const existing =
        state.discounts?.find((d) => d.code === trimmed) ??
        mockData.discounts?.find((d) => d.code === trimmed);
      if (!existing) {
        toast.error('Code not recognized', {
          description: 'Double-check your Nishant Waters note or email.',
        });
        return;
      }
      dispatch({
        type: 'APPLY_DISCOUNT',
        payload: { discount: { ...existing, applied: true } },
      });
      toast.success('Code applied', {
        description: existing.label,
      });
    },
    [state.discounts]
  );

  const removeDiscountCode = useCallback((code: string) => {
    if (!code) return;
    dispatch({
      type: 'REMOVE_DISCOUNT',
      payload: { code },
    });
  }, []);

  const selectShippingMethod = useCallback((shippingMethodId: ID) => {
    dispatch({
      type: 'SELECT_SHIPPING_METHOD',
      payload: { shippingMethodId },
    });
  }, []);

  const refreshShippingProgress = useCallback(() => {
    if (!state.selectedShippingMethodId) return 0;
    const method = state.shippingMethods?.find(
      (m) => m.id === state.selectedShippingMethodId
    );
    if (!method) return 0;
    const min = method.leadTimeDaysMin ?? 0;
    const max = method.leadTimeDaysMax ?? min;
    const avg = (min + max) / 2;
    const buckets: Record<number, number> = {
      1: 0.9,
      2: 0.8,
      3: 0.7,
      4: 0.6,
      5: 0.5,
      6: 0.4,
      7: 0.35,
    };
    const normalized = buckets[Math.round(avg)] ?? 0.3;
    const clamped = Math.max(0.1, Math.min(0.95, normalized));
    return clamped;
  }, [state.selectedShippingMethodId, state.shippingMethods]);

  const getFulfilmentProgress = useCallback(() => {
    const subtotal = state.priceSummary?.grandTotal?.amount ?? 0;
    if (subtotal <= 0) return 0;
    const target = 25000;
    const ratio = subtotal / target;
    const progress = Math.max(0, Math.min(1, ratio));
    return progress;
  }, [state.priceSummary]);

  const formatMoney = useCallback(
    (money: MoneyValue) => {
      const m = ensureMoneyFormatted({
        ...(money ?? { amount: 0, currency }),
        currency: money?.currency ?? currency,
      });
      return m.formatted ?? `${m.amount}`;
    },
    [currency]
  );

  const getItemCount = useCallback(() => {
    return state.meta?.itemCount ?? state.items?.length ?? 0;
  }, [state.meta, state.items]);

  const getTotalQuantity = useCallback(() => {
    return (
      state.meta?.totalQuantity ??
      state.items?.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ??
      0
    );
  }, [state.meta, state.items]);

  const getCartSummaryCopy = useCallback(() => {
    const itemCount = getItemCount();
    const totalQty = getTotalQuantity();
    const { grandTotal } = state.priceSummary ?? {};
    const formattedTotal = grandTotal ? formatMoney(grandTotal) : '';
    if (itemCount === 0) {
      return 'Your Nishant Waters tray is currently empty.';
    }
    if (itemCount === 1) {
      return `${totalQty} bottle set • ${formattedTotal}`;
    }
    return `${itemCount} line items • ${totalQty} bottles • ${formattedTotal}`;
  }, [getItemCount, getTotalQuantity, state.priceSummary, formatMoney]);

  const showToast = useCallback((payload: ToastPayload) => {
    const intent = payload.intent ?? 'info';
    const base = {
      description: payload.description,
    };
    if (intent === 'success') {
      toast.success(payload.title, base);
    } else if (intent === 'error') {
      toast.error(payload.title, base);
    } else if (intent === 'warning') {
      toast.warning(payload.title, base);
    } else {
      toast(payload.title, base);
    }
  }, []);

  const value: CartContextValue = useMemo(
    () => ({
      state,
      isCartOpen,
      isDesignDrawerOpen,
      activeCheckoutStep,
      isHydrated,
      openCart,
      closeCart,
      toggleCart,
      openDesignDrawer,
      closeDesignDrawer,
      setCheckoutStep,
      addItem,
      removeItem,
      updateItemQuantity,
      clearCart,
      attachLabelToItem,
      updateItemCustomizations,
      applyDiscountCode,
      removeDiscountCode,
      selectShippingMethod,
      refreshShippingProgress,
      getFulfilmentProgress,
      hydrateFromStorage,
      persistToStorage,
      formatMoney,
      getItemCount,
      getTotalQuantity,
      getCartSummaryCopy,
      showToast,
    }),
    [
      state,
      isCartOpen,
      isDesignDrawerOpen,
      activeCheckoutStep,
      isHydrated,
      openCart,
      closeCart,
      toggleCart,
      openDesignDrawer,
      closeDesignDrawer,
      setCheckoutStep,
      addItem,
      removeItem,
      updateItemQuantity,
      clearCart,
      attachLabelToItem,
      updateItemCustomizations,
      applyDiscountCode,
      removeDiscountCode,
      selectShippingMethod,
      refreshShippingProgress,
      getFulfilmentProgress,
      hydrateFromStorage,
      persistToStorage,
      formatMoney,
      getItemCount,
      getTotalQuantity,
      getCartSummaryCopy,
      showToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  return ctx;
}

export { CartContext as NishantWatersCartContext };
export default CartContext;