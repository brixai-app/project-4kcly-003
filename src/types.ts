export type ProductCategory =
  | 'still'
  | 'sparkling'
  | 'infused'
  | 'limited'
  | 'magnum'
  | 'mini';

export type VolumeMl = 250 | 330 | 500 | 750 | 1000;

export type BottleFinish = 'matte' | 'gloss' | 'frosted' | 'metallic';

export type LabelShape = 'rect' | 'arch' | 'circle' | 'pill';

export type LabelFoil = 'none' | 'gold' | 'rose-gold' | 'silver' | 'black';

export type TypographyCase = 'title' | 'upper' | 'lower' | 'caps';

export type Alignment = 'left' | 'center' | 'right';

export type BadgeTone = 'ivory' | 'taupe' | 'charcoal' | 'emerald';

export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export interface Price {
  amount: number;
  currency: CurrencyCode;
  compareAtAmount?: number | null;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  priority?: boolean;
}

export interface ProductVariant {
  id: string;
  volumeMl: VolumeMl;
  finish: BottleFinish;
  stock: number;
  sku: string;
  price: Price;
  isDefault?: boolean;
}

export interface ProductMeta {
  collection?: string;
  tastingNotes?: string[];
  sourceRegion?: string;
  phLevel?: number;
  mineralProfile?: string;
  badges?: string[];
  isNew?: boolean;
  isLimited?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  heroImage: ProductImage;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  meta?: ProductMeta;
  sortIndex?: number;
}

export type LabelElementType = 'text' | 'monogram' | 'badge' | 'date' | 'icon';

export interface LabelBaseElement {
  id: string;
  type: LabelElementType;
  x: number;
  y: number;
  rotation?: number;
  locked?: boolean;
}

export interface LabelTextElement extends LabelBaseElement {
  type: 'text' | 'monogram';
  text: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  color: string;
  case: TypographyCase;
  align: Alignment;
}

export interface LabelBadgeElement extends LabelBaseElement {
  type: 'badge';
  text: string;
  tone: BadgeTone;
  outline: boolean;
  radius: number;
}

export interface LabelDateElement extends LabelBaseElement {
  type: 'date';
  format: string;
  color: string;
  fontFamily: string;
  fontSize: number;
}

export interface LabelIconElement extends LabelBaseElement {
  type: 'icon';
  iconKey: string;
  size: number;
  color: string;
}

export type LabelElement =
  | LabelTextElement
  | LabelBadgeElement
  | LabelDateElement
  | LabelIconElement;

export interface LabelPalette {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  foil: LabelFoil;
}

export interface LabelDimensions {
  width: number;
  height: number;
  cornerRadius: number;
  shape: LabelShape;
}

export interface CustomLabelDesign {
  id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  palette: LabelPalette;
  dimensions: LabelDimensions;
  elements: LabelElement[];
  thumbnailUrl?: string;
  notes?: string;
  isFavorite?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: Price;
  labelDesignId?: string;
  personalizationSummary?: string;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
}

export interface CartState {
  items: CartItem[];
  savedDesigns: CustomLabelDesign[];
  totals: CartTotals;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface PaymentSummary {
  method: PaymentMethod;
  last4?: string;
  provider?: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: Price;
  labelDesignSnapshot?: CustomLabelDesign;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderLineItem[];
  totals: CartTotals;
  shippingAddress: Address;
  billingAddress: Address;
  payment: PaymentSummary;
  notes?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterQuery {
  search?: string;
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  sortBy?:
    | 'featured'
    | 'price-asc'
    | 'price-desc'
    | 'newest'
    | 'volume-asc'
    | 'volume-desc';
}

export type LocalStorageSchema = {
  cart: CartState;
  lastOrder?: Order;
  designs: CustomLabelDesign[];
};

export default {};