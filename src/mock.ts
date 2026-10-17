// src/mock.ts
// Central mock data + client-side state for Nishant Waters
// NOTE: This is a 100% frontend-only mock state layer. No backend calls are made.

// ----------------------
// Type Definitions
// ----------------------

export type ID = string;

export interface LabelPaletteColor {
  id: ID;
  name: string;
  hex: string;
  description?: string;
}

export interface ProductVariant {
  id: ID;
  sizeMl: number; // 330, 500, 750, etc.
  capColor: string; // e.g. "Matte Onyx", "Soft Champagne"
  labelFinish: "Matte" | "Satin" | "Gloss";
  priceCents: number;
  stock: number;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery: string[];
  baseColor: string; // hex for UI accents
  labelPaletteIds: ID[]; // ids into LabelPaletteColor
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
}

export interface LabelDesignTextConfig {
  value: string;
  fontFamily: "serif" | "sans";
  size: number; // 12-40 px logical
  align: "left" | "center" | "right";
}

export interface LabelDesign {
  id: ID;
  productId: ID;
  backgroundColorId: ID; // from palette
  textColorHex: string;
  text: LabelDesignTextConfig;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface CartItem {
  id: ID;
  productId: ID;
  variantId: ID;
  quantity: number;
  designId?: ID; // optional reference to LabelDesign snapshot
  designSnapshot?: LabelDesign; // frozen design at time of add
  linePriceCents: number; // unit price * qty at time of add
}

export interface CartState {
  items: CartItem[];
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMock {
  cardholderName: string;
  cardLast4: string;
  brand: string;
}

export interface OrderItem {
  id: ID;
  productId: ID;
  variantId: ID;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  designSnapshot?: LabelDesign;
}

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export interface Order {
  id: ID;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  shippingAddress: Address;
  payment: PaymentMock;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  defaultAddress?: Address;
}

export interface Review {
  id: ID;
  productId: ID;
  userInitials: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  createdAt: string;
}

export interface Filters {
  search?: string;
  sizeMl?: number[]; // selected sizes
  capColors?: string[];
  labelFinishes?: ("Matte" | "Satin" | "Gloss")[];
  paletteIds?: ID[];
}

export interface MockState {
  version: number;
  products: Product[];
  labelPalette: LabelPaletteColor[];
  reviews: Review[];
  cart: CartState;
  labelDesigns: Record<ID, LabelDesign>; // keyed by productId (latest design)
  orders: Order[];
  user: User | null;
}

// ----------------------
// Storage + Safe Access
// ----------------------

const STORAGE_VERSION = 1;
const STORAGE_KEY = `nishant-waters-state-v${STORAGE_VERSION}`;

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeStorage = {
  load(): Partial<MockState> | null {
    if (!isBrowser) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<MockState>;
    } catch {
      return null;
    }
  },
  save(state: MockState) {
    if (!isBrowser) return;
    try {
      const payload = JSON.stringify(state);
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch {
      // ignore quota / serialization errors for this mock
    }
  },
};

// ----------------------
// Utility Helpers
// ----------------------

export function createId(): ID {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
}

export function formatCurrency(
  cents: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(0)}`;
  }
}

// ----------------------
// Mock Data (purely client-side)
// ----------------------

// NOTE: All of this is mocked data. In a real app this would come from an API.

const LABEL_PALETTE: LabelPaletteColor[] = [
  {
    id: "amber-velvet",
    name: "Amber Velvet",
    hex: "#B56A3C",
    description: "A deep brandy amber with soft warmth.",
  },
  {
    id: "smoked-ivory",
    name: "Smoked Ivory",
    hex: "#E3D5C6",
    description: "Subtle ivory with a whisper of smoke.",
  },
  {
    id: "midnight-caramel",
    name: "Midnight Caramel",
    hex: "#3F2A23",
    description: "Dark caramel for high-contrast labels.",
  },
  {
    id: "linen-foam",
    name: "Linen Foam",
    hex: "#F4E9DD",
    description: "Airy linen tone for minimal layouts.",
  },
  {
    id: "burnt-citrus",
    name: "Burnt Citrus",
    hex: "#C16A32",
    description: "Rich orange-brandy accent.",
  },
  {
    id: "soft-cacao",
    name: "Soft Cacao",
    hex: "#8D5A3A",
    description: "Balanced cacao with a velvety finish.",
  },
];

const PRODUCTS: Product[] = [
  {
    id: "bottle-amber-500",
    name: "Amber Table 500",
    slug: "amber-table-500",
    shortDescription:
      "500ml glass bottle with warm amber label, ideal for dining rooms and boutique events.",
    description:
      "Amber Table 500 is designed for intimate gatherings, tasting rooms, and boutique hotels. Each bottle elevates water service with a warm amber label that feels at home beside stone, linen, and candlelight.",
    heroImage: "/images/amber-table-500-hero.jpg",
    gallery: [
      "/images/amber-table-500-1.jpg",
      "/images/amber-table-500-2.jpg",
      "/images/amber-table-500-3.jpg",
    ],
    baseColor: "#B56A3C",
    labelPaletteIds: ["amber-velvet", "smoked-ivory", "linen-foam", "soft-cacao"],
    variants: [
      {
        id: "bottle-amber-500-matte-bronze",
        sizeMl: 500,
        capColor: "Matte Bronze",
        labelFinish: "Matte",
        priceCents: 480,
        stock: 120,
      },
      {
        id: "bottle-amber-500-satin-champagne",
        sizeMl: 500,
        capColor: "Soft Champagne",
        labelFinish: "Satin",
        priceCents: 520,
        stock: 80,
      },
    ],
    tags: ["glass", "amber", "table-service"],
    featured: true,
  },
  {
    id: "bottle-clear-750",
    name: "Midnight Mineral 750",
    slug: "midnight-mineral-750",
    shortDescription:
      "Tall 750ml bottle with smoked label for tasting menus and curated wine pairings.",
    description:
      "Midnight Mineral 750 pairs clean glass with a smoked label field, keeping the focus on the table while quietly branding each pour. Perfect for progressive restaurants and gallery events.",
    heroImage: "/images/midnight-mineral-750-hero.jpg",
    gallery: [
      "/images/midnight-mineral-750-1.jpg",
      "/images/midnight-mineral-750-2.jpg",
    ],
    baseColor: "#3F2A23",
    labelPaletteIds: ["midnight-caramel", "smoked-ivory", "linen-foam"],
    variants: [
      {
        id: "bottle-clear-750-matte-onyx",
        sizeMl: 750,
        capColor: "Matte Onyx",
        labelFinish: "Matte",
        priceCents: 620,
        stock: 60,
      },
      {
        id: "bottle-clear-750-gloss-onyx",
        sizeMl: 750,
        capColor: "Matte Onyx",
        labelFinish: "Gloss",
        priceCents: 670,
        stock: 40,
      },
    ],
    tags: ["glass", "tasting", "smoked"],
    featured: true,
  },
  {
    id: "bottle-still-330",
    name: "Studio Still 330",
    slug: "studio-still-330",
    shortDescription:
      "Compact 330ml still water for studios, salons, and guest welcome trays.",
    description:
      "Studio Still 330 is proportioned for welcome trays, turn-down service, and curated studios. Soft cacao and linen tones can be tailored with your logotype or seasonal message.",
    heroImage: "/images/studio-still-330-hero.jpg",
    gallery: [
      "/images/studio-still-330-1.jpg",
      "/images/studio-still-330-2.jpg",
      "/images/studio-still-330-3.jpg",
    ],
    baseColor: "#8D5A3A",
    labelPaletteIds: ["soft-cacao", "linen-foam", "burnt-citrus"],
    variants: [
      {
        id: "bottle-still-330-matte-sand",
        sizeMl: 330,
        capColor: "Soft Sand",
        labelFinish: "Matte",
        priceCents: 380,
        stock: 200,
      },
      {
        id: "bottle-still-330-satin-sand",
        sizeMl: 330,
        capColor: "Soft Sand",
        labelFinish: "Satin",
        priceCents: 420,
        stock: 160,
      },
    ],
    tags: ["still", "compact", "welcome"],
    featured: true,
  },
  {
    id: "bottle-sparkling-750",
    name: "Brandy Spark 750",
    slug: "brandy-spark-750",
    shortDescription:
      "Sparkling 750ml with luminous amber label for celebrations and launches.",
    description:
      "Brandy Spark 750 brings a subtle glow to sparkling service. Pair with metallic caps and a luminous amber label for launches, openings, and celebrations that deserve a considered detail.",
    heroImage: "/images/brandy-spark-750-hero.jpg",
    gallery: [
      "/images/brandy-spark-750-1.jpg",
      "/images/brandy-spark-750-2.jpg",
    ],
    baseColor: "#C16A32",
    labelPaletteIds: ["burnt-citrus", "amber-velvet", "smoked-ivory"],
    variants: [
      {
        id: "bottle-sparkling-750-satin-gold",
        sizeMl: 750,
        capColor: "Brushed Gold",
        labelFinish: "Satin",
        priceCents: 720,
        stock: 90,
      },
      {
        id: "bottle-sparkling-750-gloss-gold",
        sizeMl: 750,
        capColor: "Brushed Gold",
        labelFinish: "Gloss",
        priceCents: 780,
        stock: 50,
      },
    ],
    tags: ["sparkling", "celebration"],
    featured: false,
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: createId(),
    productId: "bottle-amber-500",
    userInitials: "LA",
    userName: "Lena / Atelier North",
    rating: 5,
    title: "The bottles feel like part of our tablescape",
    body:
      "Clients keep asking where the bottles are from. The amber label sits quietly next to stoneware and linen, exactly as we hoped.",
    createdAt: new Date().toISOString(),
  },
  {
    id: createId(),
    productId: "bottle-clear-750",
    userInitials: "MB",
    userName: "Marco / Birch Dining",
    rating: 4,
    title: "Smoked labels, clean impression",
    body:
      "We use Midnight Mineral on our pairing menu. The smoked label photographs beautifully under low light without stealing focus.",
    createdAt: new Date().toISOString(),
  },
  {
    id: createId(),
    productId: "bottle-still-330",
    userInitials: "CR",
    userName: "Clare / Room 14",
    rating: 5,
    title: "Perfect welcome gesture",
    body:
      "Studio Still sits on our turn-down trays with a simple line of text. It quietly says we thought about every detail.",
    createdAt: new Date().toISOString(),
  },
];

const MOCK_USER: User = {
  id: "mock-user-1",
  name: "Nishant Waters Studio",
  email: "studio@nishantwaters.mock",
  defaultAddress: {
    fullName: "Nishant Waters Studio",
    email: "studio@nishantwaters.mock",
    phone: "+1 (000) 000-0000",
    line1: "14 Brandy Lane",
    city: "Warmth City",
    state: "CA",
    postalCode: "00000",
    country: "United States",
  },
};

// ----------------------
// Initial State
// ----------------------

function createInitialState(): MockState {
  const persisted = safeStorage.load();

  const baseState: MockState = {
    version: STORAGE_VERSION,
    products: PRODUCTS,
    labelPalette: LABEL_PALETTE,
    reviews: MOCK_REVIEWS,
    cart: { items: [] },
    labelDesigns: {},
    orders: [],
    user: MOCK_USER,
  };

  if (!persisted) return baseState;

  // Merge persisted with base data; prefer latest product catalog definition
  return {
    ...baseState,
    ...persisted,
    products: baseState.products,
    labelPalette: baseState.labelPalette,
    reviews: baseState.reviews,
    version: STORAGE_VERSION,
  };
}

let state: MockState = createInitialState();

// Subscribers for simple observer pattern
const subscribers = new Set<() => void>();

function notify() {
  for (const sub of subscribers) {
    try {
      sub();
    } catch {
      // ignore subscriber errors in mock
    }
  }
}

// ----------------------
// Core State Accessors
// ----------------------

export function getState(): MockState {
  return state;
}

export function subscribe(listener: () => void): () => void {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}

export function setState(partial: Partial<MockState>): void {
  state = { ...state, ...partial };
  safeStorage.save(state);
  notify();
}

// ----------------------
// Product + Review Helpers
// ----------------------

export function getProducts(): Product[] {
  return state.products;
}

export function getProductById(productId: ID): Product | undefined {
  return state.products.find((p) => p.id === productId);
}

export function getReviews(productId: ID): Review[] {
  return state.reviews.filter((r) => r.productId === productId);
}

export function getLabelPalette(): LabelPaletteColor[] {
  return state.labelPalette;
}

// Filter helpers for Catalog

export function getAvailableFilterOptions() {
  const sizes = new Set<number>();
  const capColors = new Set<string>();
  const finishes = new Set<ProductVariant["labelFinish"]>();
  const paletteIds = new Set<ID>();

  state.products.forEach((product) => {
    product.variants.forEach((v) => {
      sizes.add(v.sizeMl);
      capColors.add(v.capColor);
      finishes.add(v.labelFinish);
    });
    product.labelPaletteIds.forEach((id) => paletteIds.add(id));
  });

  return {
    sizes: Array.from(sizes).sort((a, b) => a - b),
    capColors: Array.from(capColors).sort(),
    labelFinishes: Array.from(finishes),
    palettes: state.labelPalette.filter((p) => paletteIds.has(p.id)),
  };
}

export function filterProducts(filters: Filters): Product[] {
  const { search, sizeMl, capColors, labelFinishes, paletteIds } = filters;

  return state.products.filter((product) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (paletteIds && paletteIds.length > 0) {
      const hasPalette = paletteIds.some((id) =>
        product.labelPaletteIds.includes(id),
      );
      if (!hasPalette) return false;
    }

    if (sizeMl && sizeMl.length > 0) {
      const variantMatches = product.variants.some((v) =>
        sizeMl.includes(v.sizeMl),
      );
      if (!variantMatches) return false;
    }

    if (capColors && capColors.length > 0) {
      const variantMatches = product.variants.some((v) =>
        capColors.includes(v.capColor),
      );
      if (!variantMatches) return false;
    }

    if (labelFinishes && labelFinishes.length > 0) {
      const variantMatches = product.variants.some((v) =>
        labelFinishes.includes(v.labelFinish),
      );
      if (!variantMatches) return false;
    }

    return true;
  });
}

// ----------------------
// Label Design Helpers
// ----------------------

export function getLabelDesign(productId: ID): LabelDesign | undefined {
  return state.labelDesigns[productId];
}

export function createDefaultLabelDesign(productId: ID): LabelDesign {
  const now = new Date().toISOString();
  const product = getProductById(productId);
  const paletteId =
    product?.labelPaletteIds[0] ?? LABEL_PALETTE[0]?.id ?? "amber-velvet";
  return {
    id: createId(),
    productId,
    backgroundColorId: paletteId,
    textColorHex: "#2B211A",
    text: {
      value: product ? product.name : "Nishant Waters",
      fontFamily: "serif",
      size: 20,
      align: "center",
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function saveLabelDesign(
  productId: ID,
  design: Omit<
    LabelDesign,
    "id" | "productId" | "createdAt" | "updatedAt"
  > &
    Partial<Pick<LabelDesign, "id" | "createdAt">>,
): LabelDesign {
  const existing = state.labelDesigns[productId];
  const now = new Date().toISOString();

  const merged: LabelDesign = {
    id: design.id ?? existing?.id ?? createId(),
    productId,
    backgroundColorId: design.backgroundColorId,
    textColorHex: design.textColorHex,
    text: design.text,
    createdAt: design.createdAt ?? existing?.createdAt ?? now,
    updatedAt: now,
  };

  const nextDesigns: Record<ID, LabelDesign> = {
    ...state.labelDesigns,
    [productId]: merged,
  };

  setState({ labelDesigns: nextDesigns });
  return merged;
}

export function resetLabelDesign(productId: ID): LabelDesign {
  const fresh = createDefaultLabelDesign(productId);
  const next = { ...state.labelDesigns };
  next[productId] = fresh;
  setState({ labelDesigns: next });
  return fresh;
}

// ----------------------
// Cart Helpers
// ----------------------

export function getCart(): CartState {
  return state.cart;
}

export function computeCartTotals() {
  const subtotalCents = state.cart.items.reduce(
    (sum, item) => sum + item.linePriceCents,
    0,
  );
  const shippingCents = subtotalCents > 0 ? 1200 : 0; // flat mock shipping
  const taxRate = 0.08;
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + shippingCents + taxCents;

  return { subtotalCents, shippingCents, taxCents, totalCents };
}

export function addToCart(
  productId: ID,
  variantId: ID,
  quantity: number = 1,
  design?: LabelDesign,
): CartItem | null {
  const product = getProductById(productId);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return null;

  const normalizedQty = Math.max(1, quantity);

  const existingIndex = state.cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.variantId === variantId &&
      (!design || item.designId === design.id),
  );

  const unitPriceCents = variant.priceCents;

  let nextItems: CartItem[];

  if (existingIndex >= 0) {
    const existing = state.cart.items[existingIndex];
    const newQty = existing.quantity + normalizedQty;
    const updated: CartItem = {
      ...existing,
      quantity: newQty,
      linePriceCents: unitPriceCents * newQty,
    };
    nextItems = [...state.cart.items];
    nextItems[existingIndex] = updated;
  } else {
    const id = createId();
    const snapshot = design ? { ...design } : undefined;

    const item: CartItem = {
      id,
      productId,
      variantId,
      quantity: normalizedQty,
      designId: design?.id,
      designSnapshot: snapshot,
      linePriceCents: unitPriceCents * normalizedQty,
    };
    nextItems = [...state.cart.items, item];
  }

  const nextCart: CartState = { items: nextItems };
  setState({ cart: nextCart });

  return nextItems[nextItems.length - 1];
}

export function updateCartItem(itemId: ID, quantity: number): CartItem | null {
  const idx = state.cart.items.findIndex((item) => item.id === itemId);
  if (idx === -1) return null;

  if (quantity <= 0) {
    return removeCartItem(itemId);
  }

  const current = state.cart.items[idx];
  const product = getProductById(current.productId);
  const variant = product?.variants.find((v) => v.id === current.variantId);
  const unitPriceCents =
    variant?.priceCents ?? current.linePriceCents / current.quantity;

  const updated: CartItem = {
    ...current,
    quantity,
    linePriceCents: unitPriceCents * quantity,
  };

  const nextItems = [...state.cart.items];
  nextItems[idx] = updated;

  const nextCart: CartState = { items: nextItems };
  setState({ cart: nextCart });

  return updated;
}

export function removeCartItem(itemId: ID): CartItem | null {
  const idx = state.cart.items.findIndex((item) => item.id === itemId);
  if (idx === -1) return null;

  const removed = state.cart.items[idx];
  const nextItems = state.cart.items.filter((item) => item.id !== itemId);
  const nextCart: CartState = { items: nextItems };
  setState({ cart: nextCart });

  return removed;
}

export function clearCart(): void {
  setState({ cart: { items: [] } });
}

// ----------------------
// Orders
// ----------------------

export interface CheckoutPayload {
  address: Address;
  payment: {
    cardholderName: string;
    cardNumber: string; // mock only
    expiry: string;
    cvc: string;
  };
}

export function getOrders(): Order[] {
  return state.orders;
}

export function placeOrder(payload: CheckoutPayload): Order | null {
  const { items } = state.cart;
  if (items.length === 0) return null;

  const { subtotalCents, shippingCents, taxCents, totalCents } =
    computeCartTotals();

  const orderItems: OrderItem[] = items.map((item) => {
    const product = getProductById(item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    const unitPriceCents =
      variant?.priceCents ?? item.linePriceCents / item.quantity;
    return {
      id: createId(),
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * item.quantity,
      designSnapshot: item.designSnapshot,
    };
  });

  const now = new Date().toISOString();
  const cardLast4 = payload.payment.cardNumber.slice(-4) || "0000";

  const order: Order = {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    items: orderItems,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    status: "confirmed",
    shippingAddress: { ...payload.address },
    payment: {
      cardholderName: payload.payment.cardholderName,
      cardLast4,
      brand: "Mock Card",
    },
  };

  const nextOrders = [...state.orders, order];

  setState({ orders: nextOrders, cart: { items: [] } });

  return order;
}

// ----------------------
// Convenience Selectors
// ----------------------

export function getCartItemCount(): number {
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getAverageRating(productId: ID): number {
  const reviews = getReviews(productId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
}

// ----------------------
// Summary (for debugging / dev tools)
// ----------------------

export function getDebugSummary() {
  const { subtotalCents, shippingCents, taxCents, totalCents } =
    computeCartTotals();
  return {
    version: state.version,
    productCount: state.products.length,
    cartItems: state.cart.items.length,
    orders: state.orders.length,
    subtotal: formatCurrency(subtotalCents),
    shipping: formatCurrency(shippingCents),
    tax: formatCurrency(taxCents),
    total: formatCurrency(totalCents),
  };
}

// This file is the single mock data + state source of truth for the entire app.
// All interactions are purely client-side and persisted only to localStorage.