import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";
import type { CartItem, Order, CheckoutFormValues } from "../types";
import { createOrderFromCart, loadOrders, saveOrders, validateCheckoutPayload } from "../mock";
import { useAuth } from "./authStore";
import { useCart } from "./cartStore";

interface OrderContextValue {
  orders: Order[];
  currentOrder: Order | null;
  createFromCart: (form: CheckoutFormValues) => Promise<Order | null>;
  getUserOrders: () => Order[];
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const { items, clearCart } = useCart();

  const getUserOrders = () => {
    const userId = user?.id ?? "guest";
    return orders.filter((o) => o.userId === userId);
  };

  const createFromCart = async (form: CheckoutFormValues): Promise<Order | null> => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return null;
    }

    const validation = validateCheckoutPayload({
      name: form.name,
      email: form.email,
      address: form.address,
      cardNumber: form.cardNumber,
    });

    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      if (firstError) toast.error(firstError);
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 600)); // pretend payment delay

    const order = createOrderFromCart({
      userId: user?.id ?? "guest",
      items: items as CartItem[],
      shippingAddress: form.address,
    });

    const updated = [...orders, order];
    setOrders(updated);
    saveOrders(updated);
    setCurrentOrder(order);
    clearCart();

    toast.success("Order placed successfully");
    return order;
  };

  const value: OrderContextValue = useMemo(
    () => ({ orders, currentOrder, createFromCart, getUserOrders }),
    [orders, currentOrder]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = (): OrderContextValue => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};