import {
  BottleColor,
  BottleSize,
  CartItemValidationResult,
  CheckoutValidationResult,
  CustomerInfo,
  LabelDesign,
  LabelValidationResult,
} from '../types';

// Allowed label characters: letters, numbers, spaces, basic punctuation .,!'-
const LABEL_TEXT_REGEX = /^[A-Za-z0-9 .,!'\-]*$/;

export const MAX_LABEL_LENGTH = 30;

export function validateLabelText(text: string): LabelValidationResult {
  const errors: LabelValidationResult['errors'] = {};

  const trimmed = text.trim();
  if (!trimmed) {
    errors.text = 'Label text is required.';
  } else if (trimmed.length > MAX_LABEL_LENGTH) {
    errors.text = `Label text must be at most ${MAX_LABEL_LENGTH} characters.`;
  } else if (!LABEL_TEXT_REGEX.test(trimmed)) {
    errors.text =
      'Only letters, numbers, spaces, and basic punctuation (.,!\'-) are allowed.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLabelDesign(design: LabelDesign): LabelValidationResult {
  const base = validateLabelText(design.text);
  const errors: LabelValidationResult['errors'] = { ...base.errors };

  if (!design.font) {
    errors.font = 'Please select a font.';
  }

  if (!design.color) {
    errors.color = 'Please select a label color.';
  }

  // icon is optional in this MVP, but we could enforce later

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCartQuantity(
  quantity: number,
  stockQuantity: number
): CartItemValidationResult {
  const errors: CartItemValidationResult['errors'] = {};

  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = 'Quantity must be at least 1.';
  } else if (quantity > stockQuantity) {
    errors.quantity = `Only ${stockQuantity} units available.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCartSelections(
  size: BottleSize | null,
  color: BottleColor | null
): CartItemValidationResult {
  const errors: CartItemValidationResult['errors'] = {};

  if (!size) {
    errors.selectedSize = 'Please select a bottle size.';
  }

  if (!color) {
    errors.selectedBottleColor = 'Please select a bottle color.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCheckoutFields(
  info: CustomerInfo
): CheckoutValidationResult {
  const errors: CheckoutValidationResult['errors'] = {};

  if (!info.name.trim()) {
    errors.name = 'Name is required.';
  }

  const email = info.email.trim();
  if (!email) {
    errors.email = 'Email is required.';
  } else {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
  }

  if (!info.address.trim()) {
    errors.address = 'Address is required.';
  }

  const phone = info.phone.trim();
  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      errors.phone = 'Phone number must have at least 7 digits.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isCheckoutValid(info: CustomerInfo): boolean {
  return validateCheckoutFields(info).valid;
}

export function isLabelDesignValid(design: LabelDesign): boolean {
  return validateLabelDesign(design).valid;
}

export function canAddToCart(
  design: LabelDesign,
  size: BottleSize | null,
  color: BottleColor | null,
  quantity: number,
  stockQuantity: number
): { valid: boolean; errors: string[] } {
  const label = validateLabelDesign(design);
  const selections = validateCartSelections(size, color);
  const qty = validateCartQuantity(quantity, stockQuantity);

  const errors: string[] = [];

  if (!label.valid) {
    Object.values(label.errors).forEach((msg) => {
      if (msg) errors.push(msg);
    });
  }

  if (!selections.valid) {
    Object.values(selections.errors).forEach((msg) => {
      if (msg) errors.push(msg);
    });
  }

  if (!qty.valid) {
    Object.values(qty.errors).forEach((msg) => {
      if (msg) errors.push(msg);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}