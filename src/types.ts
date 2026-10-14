export type ID = string;

export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export type ProductCategory =
  | 'Still'
  | 'Sparkling'
  | 'Mineral'
  | 'Infused'
  | 'Limited'
  | 'Gift';

export type BottleFinish = 'Matte' | 'Gloss' | 'Frosted';

export type BottleSizeMl = 250 | 500 | 750 | 1000;

export type HydrationProfile = 'Light' | 'Balanced' | 'Mineral-Rich';

export interface CustomLabelFont {
  id: ID;
  name: string;
  family: string;
  isSerif: boolean;
}

export interface CustomLabelPalette {
  id: ID;
  name: string;
  primaryHex: string;
  secondaryHex?: string;
  accentHex?: string;
}

export interface CustomLabel {
  id: ID;
  name: string;
  headline: string;
  subline?: string;
  font: CustomLabelFont;
  palette: CustomLabelPalette;
  notes?: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  priority?: boolean;
}

export interface ProductVariant {
  id: ID;
  sizeMl: BottleSizeMl;
  finish: BottleFinish;
  stock: number;
  price: number;
  compareAtPrice?: number;
}

export interface ProductMeta {
  hydrationProfile: HydrationProfile;
  tdsPpm?: number;
  ph?: number;
  originRegion?: string;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  tagline?: string;
  category: ProductCategory;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  defaultVariantId: ID;
  meta?: ProductMeta;
  isFeatured?: boolean;
  isLimited?: boolean;
}

export interface CartItem {
  id: ID;
  productId: ID;
  variantId: ID;
  quantity: number;
  unitPrice: number;
  customLabel?: CustomLabel;
  lineTotal: number;
}

export type CartStatus = 'idle' | 'checking_out' | 'submitted';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  currency: CurrencyCode;
  grandTotal: number;
}

export interface Order {
  id: ID;
  createdAt: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  totals: OrderTotals;
}

export interface CartState {
  items: CartItem[];
  status: CartStatus;
  currency: CurrencyCode;
  lastUpdated: string | null;
}

export type CartActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'CLEAR_CART'
  | 'SET_STATUS';

export interface CartActionBase {
  type: CartActionType;
}

export interface AddItemAction extends CartActionBase {
  type: 'ADD_ITEM';
  payload: {
    product: Product;
    variant: ProductVariant;
    quantity?: number;
    customLabel?: CustomLabel;
  };
}

export interface RemoveItemAction extends CartActionBase {
  type: 'REMOVE_ITEM';
  payload: { cartItemId: ID };
}

export interface UpdateQuantityAction extends CartActionBase {
  type: 'UPDATE_QUANTITY';
  payload: { cartItemId: ID; quantity: number };
}

export interface ClearCartAction extends CartActionBase {
  type: 'CLEAR_CART';
}

export interface SetStatusAction extends CartActionBase {
  type: 'SET_STATUS';
  payload: { status: CartStatus };
}

export type CartAction =
  | AddItemAction
  | RemoveItemAction
  | UpdateQuantityAction
  | ClearCartAction
  | SetStatusAction;

export interface PriceRangeFilter {
  min?: number;
  max?: number;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';

export interface ProductFilters {
  searchQuery?: string;
  categories?: ProductCategory[];
  sizes?: BottleSizeMl[];
  finishes?: BottleFinish[];
  priceRange?: PriceRangeFilter;
  sortBy?: SortOption;
}

const types = {};
export default types;