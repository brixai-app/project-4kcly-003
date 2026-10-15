import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, CustomerInfo, Order } from "../types";

const STORAGE_KEY = "nishant-waters-orders";

function getSafeStorage() {
  if (typeof window === "undefined") return null;
  try {
    const testKey = "__nw_order_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadInitialOrders(): Order[] {
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

function persistOrders(orders: Order[]) {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export type OrderContextValue = {
  orders: Order[];
  placeOrder: (payload: {
    cartItems: CartItem[];
    totalPrice: number;
    customerInfo: CustomerInfo;
  }) => Order;
  getOrderById: (id: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => loadInitialOrders());

  useEffect(() => {
    persistOrders(orders);
  }, [orders]);

  const placeOrder: OrderContextValue["placeOrder"] = ({ cartItems, totalPrice, customerInfo }) => {
    const id = `NW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const newOrder: Order = {
      id,
      cartItems,
      totalPrice,
      customerInfo,
      orderStatus: "pending",
      createdAt,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById: OrderContextValue["getOrderById"] = (id) => {
    return orders.find((o) => o.id === id);
  };

  const value: OrderContextValue = {
    orders,
    placeOrder,
    getOrderById,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export function useOrders(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return ctx;
}