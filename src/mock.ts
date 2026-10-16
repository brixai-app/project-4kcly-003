// src/mock.ts
// Single source of truth for mock data, types, and client-side state.
// This file uses localStorage-based persistence (mock only, no backend).

export type FontOption = 'Poppins' | 'Merriweather' | 'Pacifico';

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  availableColors: string[]; // hex strings
}

export interface CustomLabel {
  id: string;
  backgroundColor: string;
  text: string;
  font: FontOption;
  logoImage?: string; // data URL or external URL
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  customLabel: CustomLabel;
}

export interface ShippingInfo {
  name: string;
  address: string;
  email: string;
}

export interface PaymentInfo {
  /** Full cardholder name; matches `cardHolder` UI field */
  cardHolder: string;
  /** Last 4 digits only, stored for mock display */
  cardLast4: string;
}

export type OrderStatus = 'pending' | 'confirmed';

export interface Order {
  id: string;
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  totalPrice: number;
  status: OrderStatus;
  createdAt: number;
}

// ---- Constants & configuration ----

const STORAGE_VERSION = 'v1';
const CART_KEY = `nishant_waters_cart_${STORAGE_VERSION}`;
const ORDERS_KEY = `nishant_waters_orders_${STORAGE_VERSION}`;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LABEL_TEXT_MAX = 30;
export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 10;
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

// Design tokens used by components
export const DESIGN_COLORS = {
  background: '#FAF9F6',
  surface: '#D9CBB6',
  teal: '#0E4D5B',
  coral: '#FF6F61',
  moss: '#7A9E7E',
};

export const LABEL_COLOR_PALETTE: string[] = [
  '#FFFFFF',
  '#FAF3E0',
  '#FFE5D9',
  '#D9E4DD',
  '#CDE7F0',
  '#FDE2E4',
  '#FFF1E6',
];

export const FONT_OPTIONS: { value: FontOption; label: string }[] = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Pacifico', label: 'Pacifico (handwritten)' },
];

// ---- Safe storage helpers ----

function getSafeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    const testKey = '__nishant_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

const storage = getSafeStorage();

function readFromStorage<T>(key: string, fallback: T): T {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// ---- UUID helper ----

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
}

// ---- Mock product catalog ----

export const mockProducts: Product[] = [
  {
    id: 'bottle-aurora',
    name: 'Aurora Glass Bottle',
    description:
      'Hand-blown glass bottle with a satin finish that catches light like a soft sunrise. Perfect for boutique events and gifting.',
    basePrice: 32,
    images: [
      'https://images.pexels.com/photos/3735210/pexels-photo-3735210.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5930975/pexels-photo-5930975.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    availableColors: ['#FDE2E4', '#CDE7F0', '#D9E4DD'],
  },
  {
    id: 'bottle-tide',
    name: 'Tide Steel Bottle',
    description:
      'Double-walled stainless bottle with a matte ocean finish. Built for daily carry with a polished, minimalist label canvas.',
    basePrice: 28,
    images: [
      'https://images.pexels.com/photos/3735213/pexels-photo-3735213.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/975533/pexels-photo-975533.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    availableColors: ['#0E4D5B', '#7A9E7E', '#FFE5D9'],
  },
  {
    id: 'bottle-dune',
    name: 'Dune Everyday Bottle',
    description:
      'Lightweight, impact-ready bottle inspired by warm dunes and soft beach glass. Designed for daily rituals and rituals alike.',
    basePrice: 24,
    images: [
      'https://images.pexels.com/photos/4165285/pexels-photo-4165285.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    availableColors: ['#FAF3E0', '#FFF1E6', '#FDE2E4'],
  },
];

// ---- Validation helpers ----

export function clampQuantity(qty: number): number {
  if (qty < QUANTITY_MIN) return QUANTITY_MIN;
  if (qty > QUANTITY_MAX) return QUANTITY_MAX;
  return Math.round(qty);
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateLabelText(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, error: 'Label text cannot be empty.' };
  }
  if (trimmed.length > LABEL_TEXT_MAX) {
    return {
      valid: false,
      error: `Label text must be ${LABEL_TEXT_MAX} characters or fewer.`,
    };
  }
  return { valid: true };
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Logo must be a PNG or JPEG image.' };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return { valid: false, error: 'Logo must be smaller than 2MB.' };
  }
  return { valid: true };
}

// ---- Price helpers ----

export function calculateItemPrice(basePrice: number, customLabel: CustomLabel): number {
  // Simple mock pricing: flat customization fee + tiny premium for logo
  let price = basePrice + 4; // customization fee
  if (customLabel.logoImage) {
    price += 2;
  }
  return price;
}

export function calculateCartTotals(cart: CartItem[]): { subtotal: number; totalItems: number } {
  let subtotal = 0;
  let totalItems = 0;
  for (const item of cart) {
    const product = mockProducts.find(p => p.id === item.productId);
    const basePrice = product?.basePrice ?? 0;
    subtotal += calculateItemPrice(basePrice, item.customLabel) * item.quantity;
    totalItems += item.quantity;
  }
  return { subtotal, totalItems };
}

// ---- Cart persistence and operations ----

function loadCartInternal(): CartItem[] {
  return readFromStorage<CartItem[]>(CART_KEY, []);
}

function saveCartInternal(cart: CartItem[]): void {
  writeToStorage(CART_KEY, cart);
}

export function getCart(): CartItem[] {
  return loadCartInternal();
}

export function addToCart(input: {
  productId: string;
  quantity?: number;
  customLabel: CustomLabel;
}): CartItem[] {
  const current = loadCartInternal();
  const qty = clampQuantity(input.quantity ?? 1);
  const newItem: CartItem = {
    id: createId(),
    productId: input.productId,
    quantity: qty,
    customLabel: input.customLabel,
  };
  const updated = [...current, newItem];
  saveCartInternal(updated);
  return updated;
}

export function updateCartItemQuantity(itemId: string, quantity: number): CartItem[] {
  const current = loadCartInternal();
  const clamped = clampQuantity(quantity);
  const updated = current.map(item =>
    item.id === itemId
      ? {
          ...item,
          quantity: clamped,
        }
      : item,
  );
  saveCartInternal(updated);
  notifyCartSubscribers();
  return updated;
}

export function removeCartItem(itemId: string): CartItem[] {
  const current = loadCartInternal();
  const updated = current.filter(item => item.id !== itemId);
  saveCartInternal(updated);
  notifyCartSubscribers();
  return updated;
}

export function clearCart(): void {
  saveCartInternal([]);
  notifyCartSubscribers();
}

// ---- Label helpers ----

export function createDefaultLabel(productId?: string): CustomLabel {
  return {
    id: createId(),
    backgroundColor: LABEL_COLOR_PALETTE[0],
    text: productId ? 'Nishant Waters' : 'Custom Label',
    font: 'Poppins',
  };
}

// ---- Orders persistence and operations ----

function loadOrdersInternal(): Order[] {
  return readFromStorage<Order[]>(ORDERS_KEY, []);
}

function saveOrdersInternal(orders: Order[]): void {
  writeToStorage(ORDERS_KEY, orders);
}

export function getOrders(): Order[] {
  return loadOrdersInternal();
}

export function getOrderById(id: string): Order | undefined {
  return loadOrdersInternal().find(o => o.id === id);
}

export async function createOrder(params: {
  cart: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
}): Promise<Order> {
  const { cart, shippingInfo, paymentInfo } = params;

  // Simple validations
  if (!shippingInfo.name.trim() || !shippingInfo.address.trim() || !validateEmail(shippingInfo.email)) {
    throw new Error('Invalid shipping information.');
  }
  if (!cart.length) {
    throw new Error('Cart is empty.');
  }

  const { subtotal } = calculateCartTotals(cart);
  const order: Order = {
    id: createId(),
    cartItems: cart,
    shippingInfo,
    paymentInfo,
    totalPrice: subtotal,
    status: 'confirmed',
    createdAt: Date.now(),
  };

  // Simulate 2s network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const existing = loadOrdersInternal();
  const updated = [order, ...existing];
  saveOrdersInternal(updated);

  // Clear cart after successful order
  clearCart();

  return order;
}

// ---- Selectors for components ----

export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id);
}

export function findProductById(id: string): Product | undefined {
  return getProductById(id);
}

export function getAllProducts(): Product[] {
  return mockProducts.slice();
}

export function getFeaturedProducts(): Product[] {
  // Simple mock: first two products are featured
  return mockProducts.slice(0, 2);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

// Utility to update cart in components with minimal duplication
export type CartSubscriber = (cart: CartItem[]) => void;

let subscribers: CartSubscriber[] = [];

export function subscribeToCart(sub: CartSubscriber): () => void {
  subscribers.push(sub);
  // emit current state immediately
  sub(getCart());
  return () => {
    subscribers = subscribers.filter(s => s !== sub);
  };
}

function notifyCartSubscribers() {
  const current = getCart();
  subscribers.forEach(sub => sub(current));
}

// Hook-style helpers used by components

export function useCart() {
  const React = require('react') as typeof import('react');
  const { useEffect, useState } = React;
  const [items, setItems] = useState<CartItem[]>(() => getCart());

  useEffect(() => {
    const unsubscribe = subscribeToCart(setItems);
    return unsubscribe;
  }, []);

  return {
    items,
    updateQuantity: (itemId: string, quantity: number) => updateCartItemQuantity(itemId, quantity),
    removeItem: (itemId: string) => removeCartItem(itemId),
    clear: () => clearCart(),
  };
}

export function getCartItems(): CartItem[] {
  return getCart();
}

export function getCartTotal(): number {
  const { subtotal } = calculateCartTotals(getCart());
  return subtotal;
}

export function getCartSummary(items: CartItem[]) {
  const { subtotal, totalItems } = calculateCartTotals(items);
  return {
    subtotal,
    totalQuantity: totalItems,
  };
}

export function useCartDrawerState() {
  const React = require('react') as typeof import('react');
  const { useState, useCallback } = React;
  const [open, setOpen] = useState(false);
  const setOpenSafe = useCallback((value: boolean) => setOpen(value), []);
  return { open, setOpen: setOpenSafe };
}

// Backwards-compat helper names used elsewhere

export function addItemToCart(productId: string, quantity: number, customLabel: CustomLabel): CartItem[] {
  return addToCart({ productId, quantity, customLabel });
}