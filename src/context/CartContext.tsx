import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  ReactNode,
} from 'react';
import { toast } from 'sonner';
import type {
  CartAction,
  CartItem,
  CartState,
  Product,
  CustomLabel,
} from '@/types';

const STORAGE_KEY = 'nishant-waters-cart';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addCustomizedItem: (product: Product, customLabel?: CustomLabel, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
}

const CartContextRaw = createContext<CartContextValue>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  drawerOpen: false,
  setDrawerOpen: () => undefined,
  addCustomizedItem: () => undefined,
  removeItem: () => undefined,
  updateQty: () => undefined,
  clearCart: () => undefined,
  checkout: () => undefined,
});

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'SET_CART') {
    const next = (action.payload as CartState) ?? { items: [] };
    return { items: next.items ?? [] };
  }
  if (action.type === 'ADD_ITEM') {
    const item = action.payload as CartItem;
    const existingIndex = state.items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      const items = [...state.items];
      items[existingIndex] = item;
      return { items };
    }
    return { items: [...state.items, item] };
  }
  if (action.type === 'REMOVE_ITEM') {
    const id = action.payload as string;
    return { items: state.items.filter(i => i.id !== id) };
  }
  if (action.type === 'UPDATE_QUANTITY') {
    const { id, quantity } = (action.payload ?? {}) as { id: string; quantity: number };
    return {
      items: state.items.map(i => (i.id === id ? { ...i, quantity } : i)),
    };
  }
  if (action.type === 'CLEAR_CART') {
    return { items: [] };
  }
  return state;
}

function safeParseCart(value: string | null): CartState {
  if (!value) return { items: [] };
  try {
    const parsed = JSON.parse(value) as CartState;
    if (!parsed?.items) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

function createLineItemId(productId: string, customLabel?: CustomLabel): string {
  const base = `${productId}-${customLabel?.text ?? ''}-${customLabel?.color ?? ''}-${customLabel?.font ?? ''}`;
  return btoa(unescape(encodeURIComponent(base))).slice(0, 32);
}

export function CartProvider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    const initial = safeParseCart(stored);
    dispatch({ type: 'SET_CART', payload: initial });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + (item.unitPrice ?? 0) * (item.quantity ?? 0),
        0,
      ),
    [state.items],
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    [state.items],
  );

  const addCustomizedItem = useCallback(
    (product: Product, customLabel?: CustomLabel, quantity: number = 1) => {
      const clampedQty = Math.min(10, Math.max(1, quantity ?? 1));
      const id = createLineItemId(product.id, customLabel);
      const existing = state.items.find(i => i.id === id);
      const newQuantity = Math.min(10, (existing?.quantity ?? 0) + clampedQty);
      const now = new Date().toISOString();
      const item: CartItem = {
        id,
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.price,
        quantity: existing ? newQuantity : clampedQty,
        customLabel,
        createdAt: existing?.createdAt ?? now,
      };
      dispatch({ type: 'ADD_ITEM', payload: item });
      setDrawerOpen(true);
      toast.success('Added to cart', {
        description: `${product.name} • Qty ${item.quantity}`,
      });
    },
    [state.items],
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast('Item removed', { description: 'This bottle has been taken out of your cart.' });
  }, []);

  const updateQty = useCallback((id: string, quantity: number) => {
    const clamped = Math.min(10, Math.max(1, quantity ?? 1));
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: clamped } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const checkout = useCallback(() => {
    if (!state.items.length) {
      toast.error('Your cart is empty');
      return;
    }
    const total = subtotal;
    toast.success('Order confirmed', {
      description: `Your Nishant Waters order is on its way • ₹${total.toFixed(0)}`,
    });
    dispatch({ type: 'CLEAR_CART' });
    setDrawerOpen(false);
  }, [state.items.length, subtotal]);

  const value: CartContextValue = {
    items: state.items,
    itemCount,
    subtotal,
    drawerOpen,
    setDrawerOpen,
    addCustomizedItem,
    removeItem,
    updateQty,
    clearCart,
    checkout,
  };

  return <CartContextRaw.Provider value={value}>{children}</CartContextRaw.Provider>;
}

export function useCart(): CartContextValue {
  return useContext(CartContextRaw);
}

export const CartContext = CartContextRaw;
export default CartContextRaw;
export { CartContextRaw };
