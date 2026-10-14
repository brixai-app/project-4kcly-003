import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  ReactNode,
} from 'react';
import { toast } from 'sonner';
import {
  CartItem,
  CartState,
  CartAction,
  AddItemAction,
  RemoveItemAction,
  UpdateQuantityAction,
  ClearCartAction,
  SetStatusAction,
  CartStatus,
  Product,
  ProductVariant,
  ID,
  OrderTotals,
} from '@/types';
import { getProductById } from '@/data/mockData';

export interface CartContextValue {
  state: CartState;
  isDrawerOpen: boolean;
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  itemCount: number;
  progressPercent: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (cartItemId: ID) => void;
  updateQuantity: (cartItemId: ID, quantity: number) => void;
  clearCart: () => void;
  setStatus: (status: CartStatus) => void;
  getCartItemProduct: (cartItem: CartItem) => Product | undefined;
  getOrderTotalsSnapshot: () => OrderTotals;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  currency: 'INR',
  lastUpdated: null,
};

const CartContext = createContext<CartContextValue>({
  state: initialState,
  isDrawerOpen: false,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  grandTotal: 0,
  itemCount: 0,
  progressPercent: 0,
  openDrawer: () => undefined,
  closeDrawer: () => undefined,
  toggleDrawer: () => undefined,
  addItem: () => undefined,
  removeItem: () => undefined,
  updateQuantity: () => undefined,
  clearCart: () => undefined,
  setStatus: () => undefined,
  getCartItemProduct: () => undefined,
  getOrderTotalsSnapshot: () => ({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    currency: 'INR',
    grandTotal: 0,
  }),
});

function calculateLineTotal(unitPrice: number, quantity: number): number {
  const clampedQty = Math.min(10, Math.max(1, quantity || 1));
  return unitPrice * clampedQty;
}

function reducer(state: CartState, action: CartAction): CartState {
  const timestamp = new Date().toISOString();
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity = 1 } = (action as AddItemAction).payload;
      const unitPrice = variant.price;
      const clampedQty = Math.min(10, Math.max(1, quantity));
      const existingIndex = state.items.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );
      let items: CartItem[] = [];
      if (existingIndex >= 0) {
        items = state.items.map((item, index) => {
          if (index !== existingIndex) return item;
          const nextQty = Math.min(10, item.quantity + clampedQty);
          return {
            ...item,
            quantity: nextQty,
            lineTotal: calculateLineTotal(item.unitPrice, nextQty),
          };
        });
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          productId: product.id,
          variantId: variant.id,
          quantity: clampedQty,
          unitPrice,
          lineTotal: calculateLineTotal(unitPrice, clampedQty),
        };
        items = [...state.items, newItem];
      }
      return { ...state, items, lastUpdated: timestamp };
    }
    case 'REMOVE_ITEM': {
      const { cartItemId } = (action as RemoveItemAction).payload;
      const items = state.items.filter(item => item.id !== cartItemId);
      return { ...state, items, lastUpdated: timestamp };
    }
    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = (action as UpdateQuantityAction).payload;
      const clampedQty = Math.min(10, Math.max(1, quantity));
      const items = state.items.map(item =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: clampedQty,
              lineTotal: calculateLineTotal(item.unitPrice, clampedQty),
            }
          : item
      );
      return { ...state, items, lastUpdated: timestamp };
    }
    case 'CLEAR_CART': {
      return { ...state, items: [], lastUpdated: timestamp };
    }
    case 'SET_STATUS': {
      const { status } = (action as SetStatusAction).payload;
      return { ...state, status, lastUpdated: timestamp };
    }
    default:
      return state;
  }
}

export interface CartProviderProps {
  children?: ReactNode;
}

export function CartProvider({ children = null }: CartProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0),
    [state.items]
  );

  const shipping = useMemo(() => {
    if (!state.items.length) return 0;
    return subtotal >= 5000 ? 0 : 350;
  }, [state.items.length, subtotal]);

  const tax = useMemo(() => Math.round(subtotal * 0.12), [subtotal]);

  const grandTotal = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    [state.items]
  );

  const progressPercent = useMemo(() => {
    const threshold = 5000;
    if (!state.items.length) return 0;
    if (subtotal >= threshold) return 100;
    return Math.min(100, Math.round((subtotal / threshold) * 100));
  }, [state.items.length, subtotal]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(
    () => setIsDrawerOpen(prev => !prev),
    []
  );

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product, variant, quantity },
      });
      toast.success('Added to cart', {
        description: `${product.name} · ${variant.sizeMl}ml`,
      });
      setIsDrawerOpen(true);
    },
    []
  );

  const removeItem = useCallback((cartItemId: ID) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
    toast.message('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((cartItemId: ID, quantity: number) => {
    const clampedQty = Math.min(10, Math.max(1, quantity));
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity: clampedQty } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setStatus = useCallback((status: CartStatus) => {
    dispatch({ type: 'SET_STATUS', payload: { status } });
  }, []);

  const getCartItemProduct = useCallback((cartItem: CartItem) => {
    return getProductById(cartItem.productId);
  }, []);

  const getOrderTotalsSnapshot = useCallback((): OrderTotals => {
    return {
      subtotal,
      shipping,
      tax,
      discount: 0,
      currency: state.currency,
      grandTotal,
    };
  }, [subtotal, shipping, tax, grandTotal, state.currency]);

  const value: CartContextValue = {
    state,
    isDrawerOpen,
    subtotal,
    shipping,
    tax,
    grandTotal,
    itemCount,
    progressPercent,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setStatus,
    getCartItemProduct,
    getOrderTotalsSnapshot,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  return context;
}

export default CartContext;
export { CartContext };
