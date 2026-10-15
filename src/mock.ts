// Centralized mock data and client-side persistence helpers for Nishant Waters.
// This is explicitly MOCK data only; there is no backend yet.

import {
  BottleColor,
  BottleSize,
  CartItem,
  CustomerInfo,
  LabelDesignOptions,
  Order,
  Product,
  UserFeedback,
} from './types';
import { buildCartItem } from './lib/pricing';

// Safe storage wrapper to avoid crashes in private mode or server render
const STORAGE_KEY_CART = 'nishant_waters_cart_v1';
const STORAGE_KEY_ORDERS = 'nishant_waters_orders_v1';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    const testKey = '__nw_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

export const safeStorage = {
  getItem(key: string): string | null {
    const storage = getStorage();
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(key, value);
    } catch {
      // ignore
    }
  },
};

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}

// Label design master options (mock)
export const labelDesignOptions: LabelDesignOptions = {
  fonts: ['Playfair Display', 'Bodoni', 'Lora'],
  colors: ['#004D40', '#A89F91', '#2B2B2B', '#FAF9F6'],
  icons: ['water-droplet', 'leaf', 'wave'],
};

// Seed products (mock catalog)
const heroImage =
  'https://images.pexels.com/photos/1458683/pexels-photo-1458683.jpeg?auto=compress&cs=tinysrgb&w=1200';

export const products: Product[] = [
  {
    id: 'signature-glass',
    name: 'Signature Glass Carafe',
    basePrice: 38,
    description:
      'Hand-polished glass carafe with minimalist silhouette, designed for bespoke label artistry and everyday rituals.',
    images: [
      {
        url: heroImage,
        alt: 'Signature glass water carafe on a marble table with soft light.',
      },
      {
        url:
          'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Close-up of water pouring into a glass beside the carafe.',
      },
    ],
    availableSizes: ['250ml', '500ml', '750ml'],
    availableBottleColors: ['transparent', 'white'],
    customizableLabelOptions: labelDesignOptions,
    stockQuantity: 36,
  },
  {
    id: 'atelier-matte',
    name: 'Atelier Matte Bottle',
    basePrice: 42,
    description:
      'Double-walled stainless steel bottle with deep matte finish and refined detailing for monogram-ready statements.',
    images: [
      {
        url:
          'https://images.pexels.com/photos/3735551/pexels-photo-3735551.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Matte black water bottle on linen fabric with dramatic light.',
      },
      {
        url:
          'https://images.pexels.com/photos/1346348/pexels-photo-1346348.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Lifestyle shot of a person holding a matte bottle outdoors.',
      },
    ],
    availableSizes: ['500ml', '750ml'],
    availableBottleColors: ['matte-black', 'white'],
    customizableLabelOptions: labelDesignOptions,
    stockQuantity: 24,
  },
  {
    id: 'lumiere-collection',
    name: 'Lumière Collection Set',
    basePrice: 68,
    description:
      'Curated trio of slim bottles with ivory, charcoal, and clear finishes, ideal for gifting and bespoke events.',
    images: [
      {
        url:
          'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Three bottles arranged with books and soft draped fabric.',
      },
    ],
    availableSizes: ['250ml', '500ml'],
    availableBottleColors: ['transparent', 'white', 'matte-black'],
    customizableLabelOptions: labelDesignOptions,
    stockQuantity: 18,
  },
];

// Mock user feedback
export const feedback: UserFeedback[] = [
  {
    id: generateId('fb'),
    productId: 'signature-glass',
    userName: 'Aria',
    rating: 5,
    comment:
      'The label printing is crisp and subtle—perfect for our dinner parties.',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId('fb'),
    productId: 'atelier-matte',
    userName: 'Jonas',
    rating: 4,
    comment:
      'Keeps water cold all day and the custom crest feels incredibly premium.',
    createdAt: new Date().toISOString(),
  },
];

// CART HELPERS (mock persistence)

export function loadCart(): CartItem[] {
  const raw = safeStorage.getItem(STORAGE_KEY_CART);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  safeStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
}

export function addToCart(item: CartItem): CartItem[] {
  const current = loadCart();
  const next = [...current, item];
  saveCart(next);
  return next;
}

export function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): CartItem[] {
  const current = loadCart();
  const next = current.map((item) =>
    item.id === cartItemId ? { ...item, quantity } : item
  );
  saveCart(next);
  return next;
}

export function removeCartItem(cartItemId: string): CartItem[] {
  const current = loadCart();
  const next = current.filter((item) => item.id !== cartItemId);
  saveCart(next);
  return next;
}

export function clearCart(): void {
  saveCart([]);
}

// ORDER HELPERS (mock persistence)

export function loadOrders(): Order[] {
  const raw = safeStorage.getItem(STORAGE_KEY_ORDERS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  safeStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
}

export function generateOrderId(): string {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NW-${timestamp}-${rand}`;
}

export function createOrder(
  cartItems: CartItem[],
  customerInfo: CustomerInfo
): Order {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const order: Order = {
    id: generateOrderId(),
    cartItems,
    totalPrice: Math.round(totalPrice * 100) / 100,
    customerInfo,
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  const existing = loadOrders();
  const next = [order, ...existing];
  saveOrders(next);

  return order;
}

export function findOrderById(orderId: string): Order | undefined {
  const orders = loadOrders();
  return orders.find((o) => o.id === orderId);
}

// Helper to easily create and persist a cart item from raw inputs
export function addConfiguredProductToCart(
  productId: string,
  size: BottleSize,
  color: BottleColor,
  quantity: number,
  labelDesign: { text: string; font: any; color: any; icon: any }
): CartItem[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return loadCart();

  const cartItem = buildCartItem(product, size, color, quantity, {
    text: labelDesign.text,
    font: labelDesign.font,
    color: labelDesign.color,
    icon: labelDesign.icon,
  });

  return addToCart(cartItem);
}

// Basic filter helper for the shop page (client-side only)
export function filterProducts(options: {
  size?: BottleSize;
  color?: BottleColor;
  minPrice?: number;
  maxPrice?: number;
}): Product[] {
  const { size, color, minPrice, maxPrice } = options;
  return products.filter((product) => {
    if (size && !product.availableSizes.includes(size)) return false;
    if (color && !product.availableBottleColors.includes(color)) return false;
    if (typeof minPrice === 'number' && product.basePrice < minPrice) return false;
    if (typeof maxPrice === 'number' && product.basePrice > maxPrice) return false;
    return true;
  });
}

// Because this is a mock-only implementation, all network calls are intentionally
// omitted. Integrations can later replace these helpers with real API calls.