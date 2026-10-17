import React, { useSyncExternalStore } from "react";

// ---------------------------------------------
// NOTE: This entire file is a FRONTEND-ONLY MOCK
// There is NO backend or real database.
// All data is stored in-memory and synced to
// browser localStorage to simulate persistence.
// ---------------------------------------------

// ================ COLOR PALETTE ================

export const BRANDY_PALETTE = {
  cream: "#f7f1e8",
  creamSoft: "#f3e6d6",
  amberLight: "#f2c29b",
  amber: "#d28c45",
  amberDeep: "#b46a2b",
  sienna: "#914b1a",
  cocoa: "#5b3420",
  inkSoft: "#2b211a",
} as const;

export type BrandyColorKey = keyof typeof BRANDY_PALETTE;

// Helper to expose label color options in a specific set
export const LABEL_COLOR_KEYS: BrandyColorKey[] = [
  "creamSoft",
  "amberLight",
  "amber",
  "amberDeep",
  "sienna",
];

// ================ HELPERS ================

const STORAGE_KEY = "nishant-waters-state-v1";
const SHIPPING_DRAFT_KEY = "nishant-waters-shipping-draft-v1";

export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

// Safe access to localStorage
const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore quota errors etc.
    }
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // noop
    }
  },
};

// Deterministic image URLs: simple textured placeholders
// Using picsum.photos-like service style; keeps IDs stable.
const bottleImage = (seed: number) =>
  `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=900&q=80`;

// ================ TYPES ================

export interface LabelColorOption {
  id: string; // deterministic id
  key: BrandyColorKey;
  name: string;
  hex: string;
}

export interface ProductSKU {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  capacityMl: number;
  minOrderQty: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  labelColors: LabelColorOption[];
  featured?: boolean;
}

export interface CartItem {
  id: string; // cart line id
  productId: string;
  quantity: number;
  unitPrice: number;
  labelColorId: string; // reference LabelColorOption.id
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
}

export interface Review {
  id: string;
  productId?: string; // undefined => brand-level review
  name: string;
  initials: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface MockState {
  products: ProductSKU[];
  reviews: Review[];
  cart: Cart;
  user: UserProfile | null;
  orders: Order[];
  contactMessages: ContactMessage[];
}

// ================ MOCK SEED DATA ================

const createLabelOption = (
  id: string,
  key: BrandyColorKey,
  name: string
): LabelColorOption => ({
  id,
  key,
  name,
  hex: BRANDY_PALETTE[key],
});

const BASE_LABEL_OPTIONS: LabelColorOption[] = [
  createLabelOption("label-cream-soft", "creamSoft", "Soft Cream"),
  createLabelOption("label-amber-light", "amberLight", "Honey Amber"),
  createLabelOption("label-amber", "amber", "Brandy Gold"),
  createLabelOption("label-amber-deep", "amberDeep", "Smoked Caramel"),
  createLabelOption("label-sienna", "sienna", "Kiln Sienna"),
];

const seedProducts = (): ProductSKU[] => {
  return [
    {
      id: "bottle-classic-500",
      slug: "classic-glass-500ml",
      name: "Classic Glass 500ml",
      description:
        "A slender glass bottle with a satin-brandy label band. Perfect for welcome amenities, boutique events, and turn-down service. Custom print your monogram, venue crest, or brand story in rich detail.",
      shortDescription: "Slender glass with warm-brandy label band.",
      price: 3.5,
      capacityMl: 500,
      minOrderQty: 48,
      imageUrl: bottleImage(166041),
      secondaryImageUrl: bottleImage(1458283),
      labelColors: BASE_LABEL_OPTIONS,
      featured: true,
    },
    {
      id: "bottle-still-750",
      slug: "still-reserve-750ml",
      name: "Still Reserve 750ml",
      description:
        "Our tall signature silhouette designed for chef's tables and gallery openings. The label canvas stretches generously, welcoming layered typography and subtle metallic foils in warm tones.",
      shortDescription: "Tall signature silhouette for chef's tables.",
      price: 4.2,
      capacityMl: 750,
      minOrderQty: 24,
      imageUrl: bottleImage(1458283),
      secondaryImageUrl: bottleImage(166041),
      labelColors: [
        BASE_LABEL_OPTIONS[1],
        BASE_LABEL_OPTIONS[2],
        BASE_LABEL_OPTIONS[3],
      ],
      featured: true,
    },
    {
      id: "bottle-sparkling-330",
      slug: "sparkling-studio-330ml",
      name: "Sparkling Studio 330ml",
      description:
        "A petite, effervescent-ready bottle ideal for gift boxes and turn-key press drops. The shorter label band adds a playful proportion without losing its editorial voice.",
      shortDescription: "Petite sparkling-ready bottle for gift boxes.",
      price: 3.1,
      capacityMl: 330,
      minOrderQty: 72,
      imageUrl: bottleImage(939986),
      secondaryImageUrl: bottleImage(681847),
      labelColors: [
        BASE_LABEL_OPTIONS[0],
        BASE_LABEL_OPTIONS[1],
        BASE_LABEL_OPTIONS[4],
      ],
    },
    {
      id: "bottle-alpine-1000",
      slug: "alpine-carafe-1l",
      name: "Alpine Carafe 1L",
      description:
        "A grounded, weighty form with a generous 1L capacity. Designed for suites, boardrooms, and galleries where water becomes part of the mise-en-scène.",
      shortDescription: "Weighty 1L carafe for suites and galleries.",
      price: 5.0,
      capacityMl: 1000,
      minOrderQty: 12,
      imageUrl: bottleImage(681847),
      secondaryImageUrl: bottleImage(939986),
      labelColors: BASE_LABEL_OPTIONS,
    },
  ];
};

const seedReviews = (): Review[] => {
  return [
    {
      id: "review-1",
      productId: "bottle-classic-500",
      name: "Maya Desai",
      initials: "MD",
      rating: 5,
      title: "Quiet luxury at the table",
      comment:
        "Our hotel guests kept asking where the bottles were from. The labels photograph beautifully in low light, which has been a gift for our social team.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: "review-2",
      productId: "bottle-still-750",
      name: "Studio Aurelia",
      initials: "SA",
      rating: 5,
      title: "Flawless for gallery openings",
      comment:
        "We wanted water bottles that felt considered, not afterthoughts. The warm brandy palette sits perfectly against white walls and raw concrete.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    },
    {
      id: "review-3",
      productId: undefined,
      name: "Casa Naya",
      initials: "CN",
      rating: 4,
      title: "A small ritual for our guests",
      comment:
        "Nishant Waters has become part of our arrival ritual. The customization process was simple, and the samples matched exactly what we imagined.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    },
    {
      id: "review-4",
      productId: "bottle-sparkling-330",
      name: "Noir Atelier",
      initials: "NA",
      rating: 5,
      title: "Press kits elevated",
      comment:
        "The petite bottles tucked perfectly into our press mailers. Even editors commented on the label color.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ];
};

const seedUser = (): UserProfile => ({
  id: "guest-user",
  name: "Guest",
  isGuest: true,
});

const seedState = (): MockState => ({
  products: seedProducts(),
  reviews: seedReviews(),
  cart: { items: [] },
  user: seedUser(),
  orders: [],
  contactMessages: [],
});

// ================ PERSISTENCE & STORE CORE ================

let state: MockState = seedState();

// Hydrate from localStorage if available
const loadStateFromStorage = (): void => {
  const raw = safeStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Partial<MockState>;
    const seeded = seedState();
    state = {
      products: seeded.products,
      reviews: seeded.reviews,
      cart: parsed.cart ?? seeded.cart,
      user: parsed.user ?? seeded.user,
      orders: parsed.orders ?? seeded.orders,
      contactMessages: parsed.contactMessages ?? seeded.contactMessages,
    };
  } catch {
    state = seedState();
  }
};

loadStateFromStorage();

const saveStateToStorage = (): void => {
  const toPersist: Partial<MockState> = {
    cart: state.cart,
    user: state.user,
    orders: state.orders,
    contactMessages: state.contactMessages,
  };
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
};

// Simple subscription model
const listeners = new Set<() => void>();

const emitChange = () => {
  saveStateToStorage();
  listeners.forEach((l) => l());
};

export const getSnapshot = (): MockState => state;

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useMockStore<T>(selector: (state: MockState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

// ================ SELECTORS & QUERIES ================

export const listProducts = (): ProductSKU[] => state.products;

export const getProductById = (productId: string): ProductSKU | undefined =>
  state.products.find((p) => p.id === productId);

export const filterByLabelColor = (
  labelColorKey?: BrandyColorKey
): ProductSKU[] => {
  if (!labelColorKey) return state.products;
  return state.products.filter((p) =>
    p.labelColors.some((c) => c.key === labelColorKey)
  );
};

export const getLabelColorById = (
  id: string
): LabelColorOption | undefined => {
  for (const product of state.products) {
    const match = product.labelColors.find((c) => c.id === id);
    if (match) return match;
  }
  return undefined;
};

export const getProductReviews = (productId?: string): Review[] => {
  if (!productId) return state.reviews.filter((r) => !r.productId);
  return state.reviews.filter((r) => r.productId === productId);
};

// ================ CART OPERATIONS ================

const findCartItemIndex = (
  productId: string,
  labelColorId: string
): number => {
  return state.cart.items.findIndex(
    (item) => item.productId === productId && item.labelColorId === labelColorId
  );
};

export const addToCart = (params: {
  productId: string;
  quantity?: number;
  labelColorId: string;
}): CartItem | null => {
  const { productId, quantity = 1, labelColorId } = params;
  const product = getProductById(productId);
  if (!product || quantity <= 0) return null;

  const existingIndex = findCartItemIndex(productId, labelColorId);
  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    const existing = state.cart.items[existingIndex];
    const updated: CartItem = {
      ...existing,
      quantity: existing.quantity + quantity,
    };
    state = {
      ...state,
      cart: {
        ...state.cart,
        items: [
          ...state.cart.items.slice(0, existingIndex),
          updated,
          ...state.cart.items.slice(existingIndex + 1),
        ],
      },
    };
    emitChange();
    return updated;
  }

  const newItem: CartItem = {
    id: `cart-${Math.random().toString(36).slice(2, 9)}`,
    productId,
    quantity,
    unitPrice: product.price,
    labelColorId,
    createdAt: now,
  };

  state = {
    ...state,
    cart: {
      ...state.cart,
      items: [...state.cart.items, newItem],
    },
  };
  emitChange();
  return newItem;
};

export const updateCartItemQuantity = (
  cartItemId: string,
  quantity: number
): void => {
  if (quantity <= 0) {
    removeCartItem(cartItemId);
    return;
  }
  const idx = state.cart.items.findIndex((i) => i.id === cartItemId);
  if (idx === -1) return;
  const item = state.cart.items[idx];
  const updated: CartItem = { ...item, quantity };
  state = {
    ...state,
    cart: {
      ...state.cart,
      items: [
        ...state.cart.items.slice(0, idx),
        updated,
        ...state.cart.items.slice(idx + 1),
      ],
    },
  };
  emitChange();
};

export const removeCartItem = (cartItemId: string): void => {
  state = {
    ...state,
    cart: {
      ...state.cart,
      items: state.cart.items.filter((i) => i.id !== cartItemId),
    },
  };
  emitChange();
};

export const clearCart = (): void => {
  state = {
    ...state,
    cart: { items: [] },
  };
  emitChange();
};

export const getCartSubtotal = (): number => {
  return state.cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
};

// ================ CHECKOUT & SHIPPING ================

export interface ShippingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ShippingInfo, string>>;
}

export const validateShipping = (
  info: ShippingInfo
): ShippingValidationResult => {
  const errors: Partial<Record<keyof ShippingInfo, string>> = {};

  if (!info.fullName.trim()) errors.fullName = "Please enter a full name.";

  if (!info.email.trim()) {
    errors.email = "Please enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!info.phone.trim()) errors.phone = "Please add a contact number.";
  if (!info.addressLine1.trim()) errors.addressLine1 = "Address is required.";
  if (!info.city.trim()) errors.city = "City is required.";
  if (!info.state.trim()) errors.state = "State is required.";
  if (!info.postalCode.trim()) errors.postalCode = "Postal code is required.";
  if (!info.country.trim()) errors.country = "Country is required.";

  return { valid: Object.keys(errors).length === 0, errors };
};

export const saveShippingDraft = (info: ShippingInfo): void => {
  safeStorage.setItem(SHIPPING_DRAFT_KEY, JSON.stringify(info));
};

export const loadShippingDraft = (): ShippingInfo | null => {
  const raw = safeStorage.getItem(SHIPPING_DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ShippingInfo;
  } catch {
    return null;
  }
};

export const clearShippingDraft = (): void => {
  safeStorage.removeItem(SHIPPING_DRAFT_KEY);
};

const computeOrderTotals = (items: CartItem[]): {
  subtotal: number;
  shipping: number;
  total: number;
} => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  // Simple flat shipping logic for mock: free over $250
  const shipping = subtotal === 0 ? 0 : subtotal >= 250 ? 0 : 24; // flat 24 USD
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
};

export const placeOrder = (shippingInfo: ShippingInfo): Order | null => {
  if (state.cart.items.length === 0) return null;

  const validation = validateShipping(shippingInfo);
  if (!validation.valid) return null;

  const { subtotal, shipping, total } = computeOrderTotals(state.cart.items);
  const now = new Date();
  const orderId = `ord-${Math.random().toString(36).slice(2, 10)}`;
  const orderNumber = `NW-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

  const order: Order = {
    id: orderId,
    orderNumber,
    createdAt: now.toISOString(),
    items: [...state.cart.items],
    subtotal,
    shipping,
    total,
    shippingInfo,
  };

  state = {
    ...state,
    orders: [order, ...state.orders],
    cart: { items: [] },
  };
  emitChange();
  clearShippingDraft();

  return order;
};

export const listOrders = (): Order[] => state.orders;

// ================ CONTACT MOCK ================

export interface ContactSubmitResult {
  success: boolean;
  message?: string;
}

export const submitContact = async (input: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactSubmitResult> => {
  // purely client-side mock of network + persistence
  const { name, email, message } = input;

  if (!name.trim() || !email.trim() || !message.trim()) {
    return {
      success: false,
      message: "Please complete all fields.",
    };
  }

  // Basic email pattern validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  // Simulated latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const id = `contact-${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();
  const record: ContactMessage = { id, name, email, message, createdAt };

  state = {
    ...state,
    contactMessages: [record, ...state.contactMessages],
  };
  emitChange();

  return {
    success: true,
    message: "Your note has been folded into our inbox.",
  };
};

// ================ DERIVED HELPERS FOR UI ================

export interface EnrichedCartItem extends CartItem {
  product: ProductSKU;
  labelColor?: LabelColorOption;
}

export const getEnrichedCartItems = (): EnrichedCartItem[] => {
  return state.cart.items.map((item) => {
    const product = getProductById(item.productId)!;
    const labelColor = getLabelColorById(item.labelColorId);
    return { ...item, product, labelColor };
  });
};

export interface CartSummary {
  items: EnrichedCartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const getCartSummary = (): CartSummary => {
  const items = getEnrichedCartItems();
  // computeOrderTotals expects plain CartItem[]; we strip enrichment.
  const baseItems: CartItem[] = items.map(({ product, labelColor, ...rest }) => rest);
  const { subtotal, shipping, total } = computeOrderTotals(baseItems);
  return { items, subtotal, shipping, total };
};

// Hook-friendly helpers
export const useCartSummary = (): CartSummary =>
  useMockStore(() => getCartSummary());

export const useCartCount = (): number =>
  useMockStore((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));

export const useProducts = (): ProductSKU[] => useMockStore((s) => s.products);

export const useProduct = (productId?: string): ProductSKU | undefined =>
  useMockStore((s) => (productId ? s.products.find((p) => p.id === productId) : undefined));

export const useReviewsForProduct = (productId?: string): Review[] =>
  useMockStore(() => getProductReviews(productId));

export const useOrders = (): Order[] => useMockStore((s) => s.orders);

// ================ SUMMARY (DEV NOTE) ================
// All data and behavior in this file are mocks designed to
// simulate a backend for the Nishant Waters MVP. When you
// are ready to integrate a real API, the components can
// be wired to network calls instead of these helpers.