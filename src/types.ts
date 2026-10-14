export type FontOption = 'serif' | 'sans' | 'script';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface CustomLabel {
  text: string;
  color: string;
  font: FontOption;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  volumeMl: number;
  imageUrl: string;
  accentColor: string;
  tags: string[];
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  customLabel?: CustomLabel;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  customerEmail?: string;
}

export interface CartState {
  items: CartItem[];
}

export type CartActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'CLEAR_CART'
  | 'SET_CART';

export interface CartAction {
  type: CartActionType;
  payload?: unknown;
}

export type ProfanityFilter = (value: string) => ValidationResult;

export type Nullable<T> = T | null;

export type WithId<T> = T & { id: string };

export default {};