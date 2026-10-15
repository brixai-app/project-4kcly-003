import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";
import type { CartItem } from "../types";
import { calculateCartTotals, loadCart, saveCart, validateQuantity, getProductById } from "../mock";

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // MOCKED cart restore from localStorage
    const stored = loadCart();
    setItems(stored);
  }, []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const totals = useMemo(() => calculateCartTotals(items), [items]);

  const addItem = (item: CartItem) => {
    const product = getProductById(item.productId);
    if (!product) {
      toast.error("This product is no longer available");
      return;
    }

    const quantityRes = validateQuantity(item.quantity);
    if (!quantityRes.valid && quantityRes.error) {
      toast.error(quantityRes.error);
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (p) =>
          p.productId === item.productId &&
          p.selectedSize === item.selectedSize &&
          p.selectedColor === item.selectedColor &&
          (!!p.customLabelDesign?.id === !!item.customLabelDesign?.id)
      );

      if (existingIndex !== -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + item.quantity;
        const validation = validateQuantity(newQty);
        if (!validation.valid && validation.error) {
          toast.error(validation.error);
          return prev;
        }
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        toast.success("Updated quantity in cart");
        return next;
      }

      toast.success("Added to cart");
      return [...prev, item];
    });
    setIsOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const validation = validateQuantity(quantity);
    if (!validation.valid && validation.error) {
      toast.error(validation.error);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    toast("Removed item from cart");
  };

  const clearCart = () => {
    setItems([]);
    toast("Cart cleared");
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value: CartContextValue = {
    items,
    isOpen,
    totals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};