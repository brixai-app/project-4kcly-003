export type Category =
  | 'Still'
  | 'Sparkling'
  | 'Mineral'
  | 'Flavored'
  | 'Limited'
  | 'Bundle';

export type Tag =
  | 'Glass'
  | 'Aluminum'
  | 'BPA-Free'
  | 'Recycled'
  | 'Refillable'
  | 'CarbonNeutral'
  | 'New'
  | 'Bestseller'
  | 'LimitedRun';

export type LabelColorToken =
  | 'sand'
  | 'slate'
  | 'forest'
  | 'mint'
  | 'ink'
  | 'amber';

export interface LabelCustomization {
  text: string;
  colorToken: LabelColorToken;
}

export interface ProductVariant {
  id: string;
  name: string;
  volumeMl: number;
  priceCents: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  tags: Tag[];
  basePriceCents: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  isFeatured: boolean;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  unitPriceCents: number;
  quantity: number;
  variantId?: string;
  label: LabelCustomization;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  qualifiesForFreeShipping: boolean;
}

export interface UserInput {
  labelText: string;
  labelColorToken: LabelColorToken;
  quantity: number;
  selectedVariantId?: string;
}

export interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  freeShippingThresholdCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, input?: Partial<UserInput>) => void;
  updateItem: (id: string, patch: Partial<Pick<CartItem, 'quantity' | 'label'>>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const types = {};
export default types;