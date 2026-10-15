export type BottleSize = '250ml' | '500ml' | '750ml';

export type BottleColor = 'white' | 'matte-black' | 'transparent';

export type LabelFont = 'Playfair Display' | 'Bodoni' | 'Lora';

export type LabelColor = '#004D40' | '#A89F91' | '#2B2B2B' | '#FAF9F6';

export type LabelIcon = 'water-droplet' | 'leaf' | 'wave';

export interface LabelDesign {
  text: string;
  font: LabelFont;
  color: LabelColor;
  icon: LabelIcon | null;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  images: ProductImage[];
  availableSizes: BottleSize[];
  availableBottleColors: BottleColor[];
  customizableLabelOptions: {
    fonts: LabelFont[];
    colors: LabelColor[];
    icons: LabelIcon[];
  };
  stockQuantity: number;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  selectedSize: BottleSize;
  selectedBottleColor: BottleColor;
  labelDesign: LabelDesign;
  quantity: number;
  price: number; // line item price (per unit * quantity)
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  cartItems: CartItem[];
  totalPrice: number;
  customerInfo: CustomerInfo;
  orderStatus: OrderStatus;
  createdAt: string; // ISO date string
}

export interface LabelDesignOptions {
  fonts: LabelFont[];
  colors: LabelColor[];
  icons: LabelIcon[];
}

export interface UserFeedback {
  id: string;
  productId: string;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string; // ISO
}

export interface Filters {
  sizes: BottleSize[];
  colors: BottleColor[];
  minPrice?: number;
  maxPrice?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string | undefined>;
}

export interface CheckoutValidationResult extends ValidationResult {
  errors: {
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
  };
}

export interface LabelValidationResult extends ValidationResult {
  errors: {
    text?: string;
    font?: string;
    color?: string;
    icon?: string;
  };
}

export interface CartItemValidationResult extends ValidationResult {
  errors: {
    quantity?: string;
    selectedSize?: string;
    selectedBottleColor?: string;
  };
}

export type KeyHandler = (event: KeyboardEvent) => void;