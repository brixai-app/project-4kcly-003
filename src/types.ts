export type ID = string & { readonly __brand: 'ID' };

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface WithTimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface WithSoftDelete {
  isDeleted: boolean;
  deletedAt?: string;
}

export interface WithAuditTrail {
  createdBy?: string;
  updatedBy?: string;
}

export interface WithClientOnlyState {
  isDirty?: boolean;
  isSynced?: boolean;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export type PriceDisplayFormat = 'symbol' | 'code' | 'none';

export interface MoneyValue {
  amount: number;
  currency: CurrencyCode;
  formatted?: string;
}

export type ProductCategory =
  | 'everyday'
  | 'events'
  | 'weddings'
  | 'corporate'
  | 'gifting'
  | 'limited';

export type ProductCollection =
  | 'signature'
  | 'atelier'
  | 'monogram'
  | 'collab'
  | 'bespoke';

export type HydrationProfile =
  | 'still'
  | 'sparkling'
  | 'mineral'
  | 'alkaline'
  | 'vitamin';

export type BottleMaterial = 'glass' | 'aluminium' | 'stainless' | 'rPET';

export type BottleFinish = 'matte' | 'glossy' | 'frosted' | 'satin';

export type BottleCapStyle = 'twist' | 'flip' | 'bamboo' | 'sports';

export type BottleSizeCode = '250ml' | '330ml' | '500ml' | '750ml' | '1L';

export type FlavorProfile =
  | 'pure'
  | 'citrus'
  | 'botanical'
  | 'berry'
  | 'tropical'
  | 'herbal';

export type ProductStatus = 'draft' | 'active' | 'archived' | 'limited';

export type ProductBadge = 'new' | 'bestseller' | 'limited' | 'online-exclusive';

export type ProductSortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'created-desc'
  | 'popularity-desc';

export interface ProductImage {
  id: ID;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
  label?: string;
}

export interface ProductDimension {
  heightMm: number;
  diameterMm: number;
  weightGrams: number;
}

export interface ProductVolumeRange {
  code: BottleSizeCode;
  milliliters: number;
  recommendedUse: string;
}

export interface ProductFlavorInfo {
  profile: FlavorProfile;
  tastingNotes: string[];
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface ProductMaterialInfo {
  material: BottleMaterial;
  finish: BottleFinish;
  capStyle: BottleCapStyle;
  bpaFree: boolean;
  reusable: boolean;
  recyclable: boolean;
}

export interface ProductSustainabilityInfo {
  carbonOffsetGramsPerBottle: number;
  recycledContentPercentage: number;
  sourceRegion: string;
  certifications: string[];
}

export interface ProductDesignCapability {
  canCustomizeLabel: boolean;
  supportsMonogram: boolean;
  supportsLogoUpload: boolean;
  supportsFullWrap: boolean;
  supportsFoilStamp: boolean;
  supportsSpotUv: boolean;
  supportsVariableData: boolean;
}

export interface ProductMinimums {
  defaultMinimumQuantity: number;
  tierBreaks: {
    minQty: number;
    priceModifier: number;
    label: string;
  }[];
}

export interface ProductFulfilmentInfo {
  productionLeadDays: number;
  rushAvailable: boolean;
  rushSurchargePercentage?: number;
  shipsFromCity: string;
  shippingNotes?: string;
}

export interface ProductMeta extends WithTimestamps, WithSoftDelete, WithAuditTrail {
  status: ProductStatus;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
}

export interface ProductVariantOption {
  id: ID;
  label: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductVariantDimension<TCode extends string = string> {
  code: TCode;
  name: string;
  options: ProductVariantOption[];
}

export interface ProductVariantSelection {
  bottleSize: BottleSizeCode;
  material: BottleMaterial;
  finish: BottleFinish;
  capStyle: BottleCapStyle;
  hydrationProfile: HydrationProfile;
  flavorProfile: FlavorProfile;
}

export interface ProductPricingBreakdown {
  baseUnitPrice: MoneyValue;
  decorationCostPerUnit: MoneyValue;
  packagingCostPerUnit: MoneyValue;
  discountPerUnit?: MoneyValue;
  effectiveUnitPrice: MoneyValue;
}

export interface Product extends WithTimestamps {
  id: ID;
  sku: string;
  name: string;
  subtitle?: string;
  description: string;
  category: ProductCategory;
  collection: ProductCollection;
  badges: ProductBadge[];
  status: ProductStatus;
  heroImage: ProductImage;
  gallery: ProductImage[];
  hydrationProfile: HydrationProfile;
  flavors: ProductFlavorInfo[];
  sizeVariants: ProductVolumeRange[];
  materialInfo: ProductMaterialInfo;
  dimensions: ProductDimension;
  sustainability: ProductSustainabilityInfo;
  designCapability: ProductDesignCapability;
  minimums: ProductMinimums;
  fulfilment: ProductFulfilmentInfo;
  basePrice: MoneyValue;
  startingAtPrice: MoneyValue;
  pricingTable: {
    minQty: number;
    unitPrice: MoneyValue;
  }[];
  rating: {
    average: number;
    count: number;
  };
  meta: ProductMeta;
}

export type LabelElementType =
  | 'text'
  | 'logo'
  | 'shape'
  | 'background'
  | 'image'
  | 'accent';

export type TextAlignment = 'left' | 'center' | 'right';

export type FontFamilyToken =
  | 'serifEditorial'
  | 'sansDisplay'
  | 'sansUtility'
  | 'scriptSignature'
  | 'monoGrid';

export type LabelShapeType =
  | 'circle'
  | 'oval'
  | 'rectangle'
  | 'pill'
  | 'wave'
  | 'ring';

export type LabelColorToken =
  | 'sand'
  | 'shell'
  | 'ink'
  | 'aqua'
  | 'coral'
  | 'foam'
  | 'slate';

export type LabelCanvasPreset =
  | 'minimal'
  | 'monogram'
  | 'atelier'
  | 'wedding'
  | 'corporate'
  | 'limited';

export interface LabelCoordinates {
  x: number;
  y: number;
}

export interface LabelDimensions {
  width: number;
  height: number;
}

export interface LabelDraggableState {
  isDragging: boolean;
  dragStart?: LabelCoordinates;
}

export interface LabelTransform {
  rotation: number;
  scale: number;
  opacity: number;
}

export interface LabelTypography {
  fontFamily: FontFamilyToken;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  fontWeight: 300 | 400 | 500 | 600 | 700;
  textAlign: TextAlignment;
  allCaps: boolean;
}

export interface LabelColorConfig {
  primary: LabelColorToken;
  secondary?: LabelColorToken;
  accent?: LabelColorToken;
  customHex?: string;
}

export interface LabelBorderConfig {
  enabled: boolean;
  color: LabelColorToken | 'custom';
  customHex?: string;
  thickness: number;
  radius: number;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface LabelShadowConfig {
  enabled: boolean;
  blur: number;
  spread: number;
  offsetX: number;
  offsetY: number;
  color: string;
  opacity: number;
}

export interface LabelBaseElement extends WithClientOnlyState {
  id: ID;
  type: LabelElementType;
  name?: string;
  zIndex: number;
  position: LabelCoordinates;
  dimensions: LabelDimensions;
  transform: LabelTransform;
  locked: boolean;
  visible: boolean;
}

export interface LabelTextElement extends LabelBaseElement {
  type: 'text';
  content: string;
  typography: LabelTypography;
  color: LabelColorToken | 'custom';
  customHex?: string;
}

export interface LabelLogoElement extends LabelBaseElement {
  type: 'logo';
  sourceType: 'upload' | 'gallery' | 'initials';
  imageUrl?: string;
  initials?: string;
  monochrome: boolean;
  tintColor: LabelColorToken | 'custom';
  customHex?: string;
}

export interface LabelShapeElement extends LabelBaseElement {
  type: 'shape';
  shape: LabelShapeType;
  fillColor: LabelColorToken | 'custom';
  customFillHex?: string;
  border: LabelBorderConfig;
}

export interface LabelBackgroundElement extends LabelBaseElement {
  type: 'background';
  fillColor: LabelColorToken | 'custom';
  customFillHex?: string;
  texture: 'none' | 'grain' | 'linen' | 'marble';
  grainIntensity: number;
}

export interface LabelImageElement extends LabelBaseElement {
  type: 'image';
  imageUrl: string;
  objectFit: 'cover' | 'contain';
  borderRadius: number;
}

export interface LabelAccentElement extends LabelBaseElement {
  type: 'accent';
  pattern: 'wave' | 'grid' | 'halo' | 'underline';
  thickness: number;
  color: LabelColorToken | 'custom';
  customHex?: string;
}

export type LabelElement =
  | LabelTextElement
  | LabelLogoElement
  | LabelShapeElement
  | LabelBackgroundElement
  | LabelImageElement
  | LabelAccentElement;

export interface LabelCanvasSettings {
  preset: LabelCanvasPreset;
  width: number;
  height: number;
  bleed: number;
  safeZone: number;
  backgroundColor: LabelColorToken | 'custom';
  customBackgroundHex?: string;
  border: LabelBorderConfig;
  shadow: LabelShadowConfig;
}

export interface LabelPreviewState {
  showOnBottle: boolean;
  bottleColor: 'clear' | 'smoke' | 'amber';
  lighting: 'day' | 'studio' | 'evening';
  zoom: number;
  rotation: number;
}

export interface LabelValidationIssue {
  id: ID;
  severity: 'info' | 'warning' | 'error';
  field: string;
  message: string;
  suggestion?: string;
}

export interface LabelDesign extends WithTimestamps, WithClientOnlyState {
  id: ID;
  name: string;
  productId?: ID;
  canvas: LabelCanvasSettings;
  elements: LabelElement[];
  activeElementId?: ID;
  preview: LabelPreviewState;
  validationIssues: LabelValidationIssue[];
  isSavedToProfile?: boolean;
  lastSavedAt?: string;
}

export type CartItemCustomizationType = 'label' | 'note' | 'packaging';

export interface CartItemLabelCustomization {
  type: 'label';
  designId: ID;
  designSnapshot: LabelDesign;
}

export interface CartItemNoteCustomization {
  type: 'note';
  message: string;
  recipientName?: string;
}

export interface CartItemPackagingCustomization {
  type: 'packaging';
  style: 'kraft' | 'linen' | 'ribbon';
  color: LabelColorToken | 'custom';
  customHex?: string;
}

export type CartItemCustomization =
  | CartItemLabelCustomization
  | CartItemNoteCustomization
  | CartItemPackagingCustomization;

export interface CartItem extends WithTimestamps {
  id: ID;
  productId: ID;
  productName: string;
  productSlug: string;
  productThumbnail: string;
  variant: ProductVariantSelection;
  unitPrice: MoneyValue;
  quantity: number;
  lineSubtotal: MoneyValue;
  lineDiscount?: MoneyValue;
  lineTotal: MoneyValue;
  customizations: CartItemCustomization[];
}

export type CartDiscountType = 'percentage' | 'fixed' | 'shipping';

export interface CartDiscount {
  code: string;
  type: CartDiscountType;
  value: number;
  label: string;
  applied: boolean;
}

export interface ShippingMethod {
  id: ID;
  name: string;
  description: string;
  leadTimeDaysMin: number;
  leadTimeDaysMax: number;
  price: MoneyValue;
  isDefault?: boolean;
  isExpress?: boolean;
}

export interface CartPriceSummary {
  itemsSubtotal: MoneyValue;
  decorationFees: MoneyValue;
  packagingFees: MoneyValue;
  shipping: MoneyValue;
  discount?: MoneyValue;
  tax?: MoneyValue;
  grandTotal: MoneyValue;
  currency: CurrencyCode;
}

export interface CartMeta extends WithTimestamps {
  id: ID;
  sessionId: string;
  itemCount: number;
  totalQuantity: number;
  hasCustomizations: boolean;
  lastTouchedAt: string;
}

export interface CartState {
  meta: CartMeta;
  items: CartItem[];
  discounts: CartDiscount[];
  shippingMethods: ShippingMethod[];
  selectedShippingMethodId?: ID;
  priceSummary: CartPriceSummary;
  isLocked: boolean;
}

export type CheckoutStepKey =
  | 'details'
  | 'shipping'
  | 'review'
  | 'payment'
  | 'confirmation';

export interface CheckoutContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface CheckoutAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutShippingDetails {
  address: CheckoutAddress;
  notes?: string;
  sameAsBilling: boolean;
}

export interface CheckoutBillingDetails {
  address: CheckoutAddress;
  gstNumber?: string;
  saveForFuture?: boolean;
}

export type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface PaymentCardDetails {
  brand: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'unknown';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
}

export interface PaymentUPIDetails {
  vpa: string;
  provider:
    | 'gpay'
    | 'phonepe'
    | 'paytm'
    | 'bhim'
    | 'other';
}

export interface PaymentNetbankingDetails {
  bankName: string;
  referenceId?: string;
}

export interface PaymentWalletDetails {
  walletName: string;
  referenceId?: string;
}

export interface PaymentMethod {
  type: PaymentMethodType;
  card?: PaymentCardDetails;
  upi?: PaymentUPIDetails;
  netbanking?: PaymentNetbankingDetails;
  wallet?: PaymentWalletDetails;
}

export type OrderStatus =
  | 'pending'
  | 'awaiting-payment'
  | 'processing'
  | 'in-production'
  | 'ready-to-ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type FulfilmentStage =
  | 'concept'
  | 'proof'
  | 'bottling'
  | 'labeling'
  | 'packing'
  | 'dispatched'
  | 'delivered';

export interface OrderTimelineEvent {
  id: ID;
  timestamp: string;
  label: string;
  description?: string;
  stage?: FulfilmentStage;
  internalNote?: string;
}

export interface ShippingTrackingInfo {
  carrier: string;
  serviceLevel: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  lastUpdatedAt?: string;
  events?: OrderTimelineEvent[];
}

export interface OrderPriceSummary extends CartPriceSummary {
  orderNumber: string;
}

export interface Order extends WithTimestamps {
  id: ID;
  orderNumber: string;
  status: OrderStatus;
  cartSnapshot: CartState;
  contact: CheckoutContactDetails;
  shipping: CheckoutShippingDetails;
  billing: CheckoutBillingDetails;
  payment: PaymentMethod;
  price: OrderPriceSummary;
  tracking?: ShippingTrackingInfo;
  notes?: string;
}

export type DesignFilterPreset =
  | 'all'
  | 'saved'
  | 'for-weddings'
  | 'for-events'
  | 'for-corporate';

export interface ProductFilterState {
  searchQuery: string;
  category: ProductCategory | 'all';
  collection: ProductCollection | 'all';
  hydrationProfiles: HydrationProfile[];
  bottleMaterials: BottleMaterial[];
  bottleSizes: BottleSizeCode[];
  flavorProfiles: FlavorProfile[];
  priceRange: {
    min?: number;
    max?: number;
  };
  onlyCustomizable: boolean;
  onlyInStock: boolean;
  badges: ProductBadge[];
}

export interface ProductSortState {
  key: ProductSortKey;
  ascending: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AsyncStateMeta {
  isLoading: boolean;
  isSubmitting?: boolean;
  isHydrating?: boolean;
  error?: string;
  successMessage?: string;
}

export interface PersistedSliceMeta {
  version: number;
  lastPersistedAt?: string;
}

export interface LabelDesignerUIState {
  selectedPreset?: LabelCanvasPreset;
  selectedColorToken?: LabelColorToken;
  showGuides: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
  pan: LabelCoordinates;
}

export interface LabelDesignerState {
  activeDesignId?: ID;
  designs: LabelDesign[];
  ui: LabelDesignerUIState;
  dragState: LabelDraggableState;
  asyncMeta: AsyncStateMeta;
  persistence: PersistedSliceMeta;
}

export type ToastIntent = 'success' | 'error' | 'info' | 'warning';

export interface ToastPayload {
  id?: ID;
  title: string;
  description?: string;
  intent?: ToastIntent;
}

export interface NishantWatersThemeTokens {
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  radiusLg: number;
}

export interface NishantWatersAppConfig {
  theme: NishantWatersThemeTokens;
  currency: CurrencyCode;
  priceDisplayFormat: PriceDisplayFormat;
  enableAnimations: boolean;
  enablePersistence: boolean;
}

export const defaultThemeTokens: NishantWatersThemeTokens = {
  background: '#f5e9dc',
  surface: '#fff7ee',
  border: '#e7d6c6',
  textPrimary: '#333333',
  textMuted: '#6b625a',
  accent: '#007a8a',
  accentHover: '#006674',
  accentText: '#ffffff',
  radiusLg: 18,
};

export const defaultAppConfig: NishantWatersAppConfig = {
  theme: defaultThemeTokens,
  currency: 'INR',
  priceDisplayFormat: 'symbol',
  enableAnimations: true,
  enablePersistence: true,
};

export type {
  Product as NishantWatersProduct,
  LabelDesign as NishantWatersLabelDesign,
  CartItem as NishantWatersCartItem,
  CartState as NishantWatersCartState,
  Order as NishantWatersOrder,
};

const types = {};

export default types;