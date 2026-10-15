// Centralized mock data, theme tokens, and client-side persistence helpers
// Explicitly MOCKED: no backend, everything uses localStorage-only state.

import type {
  Product,
  CartItem,
  User,
  Order,
  PaymentStatus,
  LabelDesign,
  ValidationResult,
} from "./types";

// --------- THEME TOKENS ---------

export const theme = {
  colors: {
    terracotta: "#A0522D",
    sand: "#F4E1D2",
    olive: "#708238",
    cream: "#FFF8F0",
    coral: "#FF6F61",
    turquoise: "#40E0D0",
    ink: "#1F130B",
    muted: "#7A6A58",
  },
  radii: {
    lg: 12,
  },
};

export const labelFontOptions = [
  { id: "playfair", label: "Playfair Display", css: "\"Playfair Display\", serif" },
  { id: "inter", label: "Inter", css: "Inter, system-ui, sans-serif" },
  { id: "cormorant", label: "Cormorant Garamond", css: "\"Cormorant Garamond\", serif" },
];

export const shippingOptions = [
  { id: "standard", label: "Standard (5-7 days)", price: 4.5 },
  { id: "express", label: "Express (2-3 days)", price: 9.5 },
];

export const paymentConfig = {
  currency: "USD",
  taxRate: 0.08,
};

// --------- SAFE STORAGE HELPERS ---------

const STORAGE_KEYS = {
  user: "nw_user",
  cart: "nw_cart",
  orders: "nw_orders",
};

const isBrowser = typeof window !== "undefined";

function safeGetItem(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore quota / private errors in mock env
  }
}

// --------- UUID HELPER (DETERMINISTIC FALLBACK) ---------

export function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}

// --------- MOCK PRODUCT CATALOG ---------

// In a real app these would come from backend / CDN. Here we mock static URLs.

export const products: Product[] = [
  {
    id: createId("prod"),
    name: "Aurora Glass Carafe",
    description:
      "Hand-blown glass bottle with subtle tint inspired by desert sunsets. Perfect for dinner tables and curated events.",
    basePrice: 38,
    images: [
      "https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg",
      "https://images.pexels.com/photos/624017/pexels-photo-624017.jpeg",
    ],
    availableSizes: ["500ml", "750ml"],
    availableColors: ["#F4E1D2", "#A0522D", "#40E0D0"],
    customizableLabel: true,
  },
  {
    id: createId("prod"),
    name: "Olive Spring Steel",
    description:
      "Insulated stainless steel bottle with soft-touch olive coating. Keeps water crisp and cool for 24 hours.",
    basePrice: 42,
    images: [
      "https://images.pexels.com/photos/3735210/pexels-photo-3735210.jpeg",
      "https://images.pexels.com/photos/3735211/pexels-photo-3735211.jpeg",
    ],
    availableSizes: ["500ml", "750ml", "1L"],
    availableColors: ["#708238", "#FFF8F0", "#FF6F61"],
    customizableLabel: true,
  },
  {
    id: createId("prod"),
    name: "Sandline Minimalist",
    description:
      "Lightweight BPA-free bottle in warm sand tone. Ideal for studios, boutiques, and modern workspaces.",
    basePrice: 28,
    images: [
      "https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg",
      "https://images.pexels.com/photos/929778/pexels-photo-929778.jpeg",
    ],
    availableSizes: ["500ml", "1L"],
    availableColors: ["#F4E1D2", "#A0522D"],
    customizableLabel: true,
  },
  {
    id: createId("prod"),
    name: "Studio Spark Clear",
    description:
      "Crystal-clear bottle designed to showcase your label. A favorite for galleries and curated pop-ups.",
    basePrice: 32,
    images: [
      "https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg",
      "https://images.pexels.com/photos/3727256/pexels-photo-3727256.jpeg",
    ],
    availableSizes: ["750ml", "1L"],
    availableColors: ["#FFF8F0", "#40E0D0"],
    customizableLabel: true,
  },
];

// --------- VALIDATION HELPERS ---------

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cardRegex = /^\d{16}$/;

export function validateEmail(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: "Email is required" };
  if (!emailRegex.test(value.trim())) return { valid: false, error: "Enter a valid email" };
  return { valid: true };
}

export function validateRequired(label: string, value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: `${label} is required` };
  return { valid: true };
}

export function validateCardNumber(value: string): ValidationResult {
  const digits = value.replace(/\s+/g, "");
  if (!digits) return { valid: false, error: "Card number is required" };
  if (!cardRegex.test(digits)) return { valid: false, error: "Card must be 16 digits" };
  return { valid: true };
}

export function validateQuantity(qty: number): ValidationResult {
  if (Number.isNaN(qty)) return { valid: false, error: "Quantity is required" };
  if (qty < 1) return { valid: false, error: "Minimum quantity is 1" };
  if (qty > 10) return { valid: false, error: "Maximum quantity is 10" };
  return { valid: true };
}

export function validateLabelDesign(design: LabelDesign | null | undefined): ValidationResult {
  if (!design || !design.elements || design.elements.length === 0) {
    return { valid: false, error: "Add at least text or image to the label" };
  }
  return { valid: true };
}

// --------- PRICE HELPERS ---------

export function computeProductPrice(product: Product, size: string, qty: number, hasCustomLabel: boolean): number {
  let price = product.basePrice;
  if (size === "750ml") price += 4;
  if (size === "1L") price += 7;
  if (hasCustomLabel) price += 6;
  const validated = validateQuantity(qty);
  const quantity = validated.valid ? qty : 1;
  return price * quantity;
}

export function calculateCartItemSubtotal(item: CartItem, product: Product): number {
  const hasLabel = !!item.customLabelDesign && item.customLabelDesign.elements.length > 0;
  return computeProductPrice(product, item.selectedSize, item.quantity, hasLabel);
}

export function calculateCartTotals(items: CartItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return acc;
    return acc + calculateCartItemSubtotal(item, product);
  }, 0);
  const tax = subtotal * paymentConfig.taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

// --------- PERSISTENCE: USER ---------

export function loadUser(): User | null {
  const raw = safeGetItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    return parsed.isLoggedIn ? parsed : null;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  if (!user) {
    safeSetItem(STORAGE_KEYS.user, "");
    return;
  }
  safeSetItem(STORAGE_KEYS.user, JSON.stringify(user));
}

// --------- PERSISTENCE: CART ---------

export function loadCart(): CartItem[] {
  const raw = safeGetItem(STORAGE_KEYS.cart);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      ...item,
      quantity: Math.min(Math.max(item.quantity || 1, 1), 10),
    }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  safeSetItem(STORAGE_KEYS.cart, JSON.stringify(items));
}

// --------- PERSISTENCE: ORDERS ---------

export function loadOrders(): Order[] {
  const raw = safeGetItem(STORAGE_KEYS.orders);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as Order[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  safeSetItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

// --------- ORDER CREATION (MOCK PAYMENT) ---------

export function createOrderFromCart(params: {
  userId: string | null;
  items: CartItem[];
  shippingAddress: string;
}): Order {
  const { items, shippingAddress } = params;
  const { total } = calculateCartTotals(items);

  const order: Order = {
    id: createId("order"),
    userId: params.userId ?? "guest",
    items,
    totalPrice: total,
    shippingAddress,
    paymentStatus: "paid" as PaymentStatus,
    createdAt: new Date().toISOString(),
  };

  const existing = loadOrders();
  saveOrders([...existing, order]);
  return order;
}

// Convenience helper to get a product by id safely
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// Payment form validation bundle (email + card + address)
export function validateCheckoutPayload(payload: {
  name: string;
  email: string;
  address: string;
  cardNumber: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const nameRes = validateRequired("Name", payload.name);
  if (!nameRes.valid && nameRes.error) errors.name = nameRes.error;

  const emailRes = validateEmail(payload.email);
  if (!emailRes.valid && emailRes.error) errors.email = emailRes.error;

  const addressRes = validateRequired("Address", payload.address);
  if (!addressRes.valid && addressRes.error) errors.address = addressRes.error;

  const cardRes = validateCardNumber(payload.cardNumber);
  if (!cardRes.valid && cardRes.error) errors.cardNumber = cardRes.error;

  return { valid: Object.keys(errors).length === 0, errors };
}

export type { Product, CartItem, User, Order, LabelDesign };