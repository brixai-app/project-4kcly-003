import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "../types";
import { products } from "../mock";
import { validateCartQuantity } from "../lib/validators";

// Safe storage helper to avoid crashes when localStorage is not available
function getSafeStorage() {
  if (typeof window === "undefined") return null;
  try {
    const testKey = "__nw_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

const STORAGE_KEY = "nishant-waters-cart";

function loadInitialCart(): CartItem[] {
  const storage = getSafeStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persistCart(items: CartItem[]) {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
}

function findProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

export type CartContextValue = {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "id">) => { ok: boolean; error?: string };
  updateQuantity: (id: string, quantity: number) => { ok: boolean; error?: string };
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadInitialCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    persistCart(items);
  }, [items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem: CartContextValue["addItem"] = (item) => {
    const product = findProduct(item.productId);
    if (!product) {
      return { ok: false, error: "Product not found." };
    }

    const validation = validateCartQuantity(1, product.stockQuantity);
    if (!validation.ok) {
      return { ok: false, error: validation.error };
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.productId === item.productId &&
          ci.selectedSize === item.selectedSize &&
          ci.selectedBottleColor === item.selectedBottleColor &&
          ci.labelDesign.text === item.labelDesign.text &&
          ci.labelDesign.color === item.labelDesign.color &&
          ci.labelDesign.font === item.labelDesign.font &&
          ci.labelDesign.icon === item.labelDesign.icon
      );

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const desired = existing.quantity + item.quantity;
        const v = validateCartQuantity(desired, product.stockQuantity);
        if (!v.ok) return prev;
        const updated = [...prev];
        updated[existingIndex] = { ...existing, quantity: desired };
        return updated;
      }

      const v = validateCartQuantity(item.quantity, product.stockQuantity);
      if (!v.ok) return prev;

      const newItem: CartItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
      };
      return [...prev, newItem];
    });

    return { ok: true };
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (id, quantity) => {
    const current = items.find((i) => i.id === id);
    if (!current) return { ok: false, error: "Cart item not found." };
    const product = findProduct(current.productId);
    if (!product) return { ok: false, error: "Product not found." };
    const validation = validateCartQuantity(quantity, product.stockQuantity);
    if (!validation.ok) return { ok: false, error: validation.error };

    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    return { ok: true };
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const { subtotal, totalQuantity } = useMemo(() => {
    const subtotalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal: subtotalValue, totalQuantity: totalQty };
  }, [items]);

  const value: CartContextValue = {
    items,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}