// Domain types and shared utilities for Nishant Waters

export type PaymentStatus = "pending" | "paid" | "failed";

export interface LabelTransform {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // 0.5-2
  rotation: number; // degrees
}

export type LabelElementType = "text" | "image";

export interface BaseLabelElement {
  id: string;
  type: LabelElementType;
  transform: LabelTransform;
}

export interface TextLabelElement extends BaseLabelElement {
  type: "text";
  text: string;
  fontId: string; // references labelFontOptions
  color: string; // hex
  size: number; // px
}

export interface ImageLabelElement extends BaseLabelElement {
  type: "image";
  src: string; // data URL in mock mode
  alt: string;
  width: number; // px
  height: number; // px
}

export type LabelElement = TextLabelElement | ImageLabelElement;

export interface LabelDesign {
  id: string;
  name: string;
  backgroundColor: string;
  elements: LabelElement[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  availableSizes: ("500ml" | "750ml" | "1L")[] | string[];
  availableColors: string[]; // hex
  customizableLabel: boolean;
}

export interface CartItem {
  productId: string;
  selectedSize: string;
  selectedColor: string; // hex
  customLabelDesign: LabelDesign | null;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO
}

// ---------- FORM / VALIDATION UTILITIES ----------

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type FieldErrors<T extends Record<string, any>> = Partial<Record<keyof T, string>>;

export interface AuthCredentials {
  email: string;
  name?: string;
  password: string;
}

export interface CheckoutFormValues {
  name: string;
  email: string;
  address: string;
  cardNumber: string;
  shippingOptionId: string;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
}

export type Nullable<T> = T | null;