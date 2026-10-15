import { BottleSize, CartItem, LabelDesign, Product } from '../types';

// Size multipliers relative to base price
export const SIZE_MULTIPLIERS: Record<BottleSize, number> = {
  '250ml': 0.9,
  '500ml': 1,
  '750ml': 1.3,
};

// Additional premium for specific bottle colors
export const COLOR_PREMIUM: Record<string, number> = {
  white: 0,
  'matte-black': 4,
  transparent: 2,
};

export function formatCurrency(value: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function computeUnitPrice(
  product: Product,
  size: BottleSize,
  color: string
): number {
  const base = product.basePrice;
  const multiplier = SIZE_MULTIPLIERS[size] ?? 1;
  const colorPremium = COLOR_PREMIUM[color] ?? 0;
  return Math.round((base * multiplier + colorPremium) * 100) / 100;
}

export function computeLineItemTotal(
  unitPrice: number,
  quantity: number
): number {
  return Math.round(unitPrice * quantity * 100) / 100;
}

export function computeCartTotals(items: CartItem[]): {
  subtotal: number;
  itemCount: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    itemCount,
  };
}

export function describeLabelDesign(design: LabelDesign): string {
  const parts: string[] = [];

  if (design.text) parts.push(`"${design.text}"`);
  if (design.font) parts.push(design.font);
  if (design.color) parts.push(`color ${design.color}`);
  if (design.icon) {
    const iconLabel =
      design.icon === 'water-droplet'
        ? 'droplet icon'
        : design.icon === 'leaf'
        ? 'leaf icon'
        : 'wave icon';
    parts.push(iconLabel);
  }

  return parts.join(' • ');
}

export function buildCartItem(
  product: Product,
  size: BottleSize,
  color: string,
  quantity: number,
  labelDesign: LabelDesign
): CartItem {
  const unitPrice = computeUnitPrice(product, size, color);
  const lineTotal = computeLineItemTotal(unitPrice, quantity);

  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? (crypto.randomUUID() as string)
        : Math.random().toString(36).substring(2, 11),
    productId: product.id,
    selectedSize: size,
    selectedBottleColor: color as any,
    labelDesign,
    quantity,
    price: lineTotal,
  };
}