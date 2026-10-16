// Mock data and cart helpers used across the app
// This file ensures all symbols imported from "@/mock" are correctly exported.

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // Allow extra fields without breaking existing UI usage
  images?: string[];
  [key: string]: unknown;
};

export type CustomLabel = {
  templateId: string;
  customText?: string;
  textColor?: string;
  font?: string;
};

export type CartItem = {
  id: string; // unique cart line id
  productId: string;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedBottleColor?: string;
  customLabel?: CustomLabel;
};

// Simple mock products list. Real app can extend this.
export const products: Product[] = [
  {
    id: "1",
    name: "Signature Cold Brew",
    description: "Smooth, slow-steeped cold brew with notes of caramel and cocoa.",
    price: 5.5,
    imageUrl: "/images/coldbrew-1.jpg",
    images: ["/images/coldbrew-1.jpg"],
  },
  {
    id: "2",
    name: "Vanilla Almond Latte",
    description: "Rich espresso with house-made vanilla and almond milk.",
    price: 6.0,
    imageUrl: "/images/latte-vanilla-almond.jpg",
    images: ["/images/latte-vanilla-almond.jpg"],
  },
  {
    id: "3",
    name: "Mocha Delight",
    description: "Chocolate-forward mocha topped with micro-foam.",
    price: 5.75,
    imageUrl: "/images/mocha-delight.jpg",
    images: ["/images/mocha-delight.jpg"],
  },
];

const CART_STORAGE_KEY = "mock_cart_storage";

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // fail silently for quota / privacy modes
  }
}

export function updateCartItemQuantity(
  cart: CartItem[],
  id: string,
  quantity: number
): CartItem[] {
  return cart
    .map((item) =>
      item.id === id
        ? {
            ...item,
            quantity,
          }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((item) => item.id !== id);
}

// Compute subtotal of the cart based on price * quantity
export function computeCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Find a product by its id from the mock products list
export function findProductById(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}