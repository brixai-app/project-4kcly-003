import {
  type ID,
  type Product,
  type ProductImage,
  type ProductVolumeRange,
  type ProductFlavorInfo,
  type ProductMaterialInfo,
  type ProductSustainabilityInfo,
  type ProductDesignCapability,
  type ProductMinimums,
  type ProductFulfilmentInfo,
  type MoneyValue,
  type ProductVariantDimension,
  type LabelDesign,
  type LabelCanvasSettings,
  type LabelTextElement,
  type LabelBackgroundElement,
  type LabelShapeElement,
  type LabelLogoElement,
  type LabelAccentElement,
  type LabelImageElement,
  type LabelElement,
  type LabelValidationIssue,
  type LabelDesignerState,
  type CartState,
  type CartItem,
  type CartPriceSummary,
  type ShippingMethod,
  type CartDiscount,
  type Order,
  type CheckoutContactDetails,
  type CheckoutShippingDetails,
  type CheckoutBillingDetails,
  type PaymentMethod,
  type ProductFilterState,
  type ProductSortState,
  type PaginationState,
  type ToastPayload,
  type NishantWatersAppConfig,
  defaultThemeTokens,
  defaultAppConfig,
  type NishantWatersProduct,
  type NishantWatersLabelDesign,
  type NishantWatersCartItem,
  type NishantWatersCartState,
  type NishantWatersOrder,
} from '@/types';

const createId = (seed: string): ID => `id_${seed}` as ID;

const makeMoney = (amount: number, currency: MoneyValue['currency'] = 'INR'): MoneyValue => ({
  amount,
  currency,
  formatted: undefined,
});

const nowIso = (): string => new Date().toISOString();

export interface ProductCategoryDefinition {
  id: ID;
  slug: string;
  name: string;
  description: string;
  tagline: string;
  image: ProductImage;
  featuredProductSkus: string[];
}

export interface FAQEntry {
  id: ID;
  category: 'design' | 'orders' | 'shipping' | 'sustainability' | 'care';
  question: string;
  answer: string;
  isPopular: boolean;
}

export interface PressSnippet {
  id: ID;
  outlet: string;
  logoUrl: string;
  quote: string;
  context: string;
  year: number;
  link?: string;
}

export interface Testimonial {
  id: ID;
  name: string;
  role: string;
  company: string;
  quote: string;
  context: 'wedding' | 'corporate' | 'private' | 'hospitality';
}

export interface LabelTemplateCategory {
  id: ID;
  slug: string;
  name: string;
  description: string;
  presetKey:
    | 'minimal'
    | 'monogram'
    | 'atelier'
    | 'wedding'
    | 'corporate'
    | 'limited';
  previewImage: string;
}

export interface MockDataShape {
  appConfig: NishantWatersAppConfig;
  categories: ProductCategoryDefinition[];
  products: Product[];
  productVariantDimensions: ProductVariantDimension[];
  labelTemplates: LabelDesign[];
  labelDesignerInitialState: LabelDesignerState;
  cartInitialState: CartState;
  shippingMethods: ShippingMethod[];
  discounts: CartDiscount[];
  faqs: FAQEntry[];
  pressSnippets: PressSnippet[];
  testimonials: Testimonial[];
  homeHeroCopy: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  designPageCopy: {
    heroTitle: string;
    heroSubtitle: string;
    tips: string[];
  };
  defaultToastPresets: ToastPayload[];
  paginationDefaults: PaginationState;
  defaultFilterState: ProductFilterState;
  defaultSortState: ProductSortState;
}

const heroImage1: ProductImage = {
  id: createId('hero1'),
  url: 'https://images.unsplash.com/photo-1637905351378-67232a5f0c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
  alt: 'Editorial still life of custom-labeled water bottles on a warm beige set',
  width: 1200,
  height: 800,
  isPrimary: true,
  label: 'Signature atelier still life',
};

const heroImage2: ProductImage = {
  id: createId('hero2'),
  url: 'https://images.unsplash.com/photo-1778058505479-447c46d800a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
  alt: 'Tray of glass water bottles with refined label designs',
  width: 1200,
  height: 800,
  isPrimary: false,
  label: 'Glass atelier tray',
};

const heroImage3: ProductImage = {
  id: createId('hero3'),
  url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1400&q=85',
  alt: 'Minimalist water bar with carafes and glassware',
  width: 1200,
  height: 800,
  isPrimary: false,
  label: 'Hydration bar vignette',
};

const warmPaperTexture1 =
  'https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8d2FybSUyMGJlaWdlJTIwcGFwZXIlMjB0ZXh0dXJlJTIwYmFja2dyb3VuZCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfDB8fHwxNzkyMDcxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
const warmPaperTexture2 =
  'https://images.unsplash.com/photo-1612538498613-35c5c8d675c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8d2FybSUyMGJlaWdlJTIwcGFwZXIlMjB0ZXh0dXJlJTIwYmFja2dyb3VuZCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfDB8fHwxNzkyMDcxNzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
const warmPaperTexture3 =
  'https://images.unsplash.com/photo-1762423255554-afdb20ca0c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bWluaW1hbGlzdCUyMGx1eHVyeSUyMHdhdGVyJTIwYnJhbmQlMjBwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHNldHxlbnwwfDB8fHwxNzkyMDcxNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

const fineDining1 =
  'https://images.unsplash.com/photo-1613638740901-4fa3f219b03b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjB0YWJsZXRvcCUyMGh5ZHJhdGlvbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDcxNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
const fineDining2 =
  'https://images.unsplash.com/photo-1588157549725-abce1cac3c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjB0YWJsZXRvcCUyMGh5ZHJhdGlvbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDcxNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
const fineDining3 =
  'https://images.unsplash.com/photo-1605760291099-f75d92e645fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjB0YWJsZXRvcCUyMGh5ZHJhdGlvbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDcxNzgwfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

const fashionEditorial1 =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
const fashionEditorial2 =
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80';
const fashionEditorial3 =
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80';

const categories: ProductCategoryDefinition[] = [
  {
    id: createId('cat_everyday'),
    slug: 'everyday-hydration',
    name: 'Everyday Hydration',
    description:
      'Elevated daily hydration rituals — slender silhouettes, soft-touch finishes, and labels that quietly carry your monogram or mantra.',
    tagline: 'Effortless, all-day companions for desks, studios, and bedside tables.',
    image: {
      id: createId('cat_everyday_img'),
      url: warmPaperTexture1,
      alt: 'Warm beige paper textured backdrop with a single water bottle',
      width: 1200,
      height: 800,
      isPrimary: true,
      label: 'Everyday ritual',
    },
    featuredProductSkus: ['NW-GLS-500-MIN', 'NW-RPET-750-ALK'],
  },
  {
    id: createId('cat_events'),
    slug: 'events',
    name: 'Events & Occasions',
    description:
      'Thoughtfully labeled bottles that greet guests at arrival, line dinner tables, and anchor the afterparty — designed to be taken home.',
    tagline: 'From gallery previews to rooftop soirées, every pour becomes a keepsake.',
    image: {
      id: createId('cat_events_img'),
      url: fineDining1,
      alt: 'Fine dining table with glassware and bottles at dusk',
      width: 1200,
      height: 800,
      isPrimary: true,
      label: 'Evening service',
    },
    featuredProductSkus: ['NW-GLS-750-SPRK', 'NW-ALU-330-CITRUS'],
  },
  {
    id: createId('cat_weddings'),
    slug: 'weddings',
    name: 'Weddings',
    description:
      'Soft, romantic palettes with scripts, monograms, and venue sketches — bottles that sit beautifully by menus and linen.',
    tagline: 'For the welcome hamper, the mandap, the dance floor, and every moment between.',
    image: {
      id: createId('cat_weddings_img'),
      url: fineDining2,
      alt: 'Wedding style dining table with delicate glassware and flowers',
      width: 1200,
      height: 800,
      isPrimary: true,
      label: 'Wedding table',
    },
    featuredProductSkus: ['NW-GLS-500-MIN-WED', 'NW-RPET-250-BERRY'],
  },
  {
    id: createId('cat_corporate'),
    slug: 'corporate',
    name: 'Corporate & Gifting',
    description:
      'Uncompromisingly clean layouts that carry your identity with restraint — perfect for offsites, boardrooms, and launch kits.',
    tagline: 'Considered corporate gifting with a hydration-first mindset.',
    image: {
      id: createId('cat_corp_img'),
      url: warmPaperTexture2,
      alt: 'Corporate gift flatlay with stationery and water bottle',
      width: 1200,
      height: 800,
      isPrimary: true,
      label: 'Corporate gifting',
    },
    featuredProductSkus: ['NW-ALU-500-ALK', 'NW-RPET-500-PURE'],
  },
  {
    id: createId('cat_limited'),
    slug: 'limited',
    name: 'Limited Collabs',
    description:
      'Short runs with artists, galleries, and chefs — collectible bottles with bold typography and unexpected color blocking.',
    tagline: 'Tactile collaborations that feel equally at home on bar carts and bookshelves.',
    image: {
      id: createId('cat_limited_img'),
      url: heroImage3.url,
      alt: heroImage3.alt,
      width: heroImage3.width,
      height: heroImage3.height,
      isPrimary: true,
      label: 'Studio collab vignette',
    },
    featuredProductSkus: ['NW-GLS-750-COLLAB', 'NW-ALU-500-COLLOR'],
  },
];

const commonSizeVariants: ProductVolumeRange[] = [
  {
    code: '250ml',
    milliliters: 250,
    recommendedUse: 'Welcome trays, amenity kits, quick tastings.',
  },
  {
    code: '330ml',
    milliliters: 330,
    recommendedUse: 'Cocktail hours, lounges, gallery previews.',
  },
  {
    code: '500ml',
    milliliters: 500,
    recommendedUse: 'Everyday desks, turn-down service, gifting sets.',
  },
  {
    code: '750ml',
    milliliters: 750,
    recommendedUse: 'Family-style tables, restaurants, and long-format events.',
  },
];

const pureFlavor: ProductFlavorInfo = {
  profile: 'pure',
  tastingNotes: [
    'Clean, mineral-balanced palate with a gentle sweetness.',
    'Soft mouthfeel, calibrated for long sipping and pairing with food.',
    'Low sodium, naturally filtered through basalt-rich strata.',
  ],
  intensity: 1,
};

const citrusFlavor: ProductFlavorInfo = {
  profile: 'citrus',
  tastingNotes: [
    'Ethereal notes of yuzu and lime zest.',
    'Bright, palate-awakening finish with a dry edge.',
  ],
  intensity: 3,
};

const botanicalFlavor: ProductFlavorInfo = {
  profile: 'botanical',
  tastingNotes: [
    'Crushed coriander seed, cucumber peel, and alpine herbs.',
    'Layered aroma designed for pairing with modern Indian menus.',
  ],
  intensity: 3,
};

const berryFlavor: ProductFlavorInfo = {
  profile: 'berry',
  tastingNotes: [
    'Subtle macerated strawberry and mulberry on the nose.',
    'Zero-sugar impression, with a long mineral finish.',
  ],
  intensity: 2,
};

const tropicalFlavor: ProductFlavorInfo = {
  profile: 'tropical',
  tastingNotes: [
    'Guava leaf, green mango, and a whisper of pineapple core.',
    'Designed to cut through rich, spiced dishes.',
  ],
  intensity: 4,
};

const alkalineMaterial: ProductMaterialInfo = {
  material: 'glass',
  finish: 'frosted',
  capStyle: 'bamboo',
  bpaFree: true,
  reusable: true,
  recyclable: true,
};

const rpetMaterial: ProductMaterialInfo = {
  material: 'rPET',
  finish: 'satin',
  capStyle: 'twist',
  bpaFree: true,
  reusable: false,
  recyclable: true,
};

const aluMatteMaterial: ProductMaterialInfo = {
  material: 'aluminium',
  finish: 'matte',
  capStyle: 'sports',
  bpaFree: true,
  reusable: true,
  recyclable: true,
};

const sustainabilityHigh: ProductSustainabilityInfo = {
  carbonOffsetGramsPerBottle: 180,
  recycledContentPercentage: 85,
  sourceRegion: 'Kumaon Himalayan foothills, India',
  certifications: ['ISO 14001', 'CarbonNeutral® certified', 'EPR Compliant'],
};

const sustainabilityPremium: ProductSustainabilityInfo = {
  carbonOffsetGramsPerBottle: 140,
  recycledContentPercentage: 60,
  sourceRegion: 'Nilgiri highlands, India',
  certifications: ['CarbonNeutral® certified'],
};

const designFullCustom: ProductDesignCapability = {
  canCustomizeLabel: true,
  supportsMonogram: true,
  supportsLogoUpload: true,
  supportsFullWrap: true,
  supportsFoilStamp: true,
  supportsSpotUv: true,
  supportsVariableData: true,
};

const designMonogramOnly: ProductDesignCapability = {
  canCustomizeLabel: true,
  supportsMonogram: true,
  supportsLogoUpload: false,
  supportsFullWrap: false,
  supportsFoilStamp: true,
  supportsSpotUv: false,
  supportsVariableData: false,
};

const minimumsEvents: ProductMinimums = {
  defaultMinimumQuantity: 24,
  tierBreaks: [
    {
      minQty: 24,
      priceModifier: 1,
      label: 'Launch set',
    },
    {
      minQty: 72,
      priceModifier: 0.92,
      label: 'Salon',
    },
    {
      minQty: 144,
      priceModifier: 0.86,
      label: 'Gallery opening',
    },
    {
      minQty: 288,
      priceModifier: 0.82,
      label: 'Festival series',
    },
  ],
};

const minimumsCorporate: ProductMinimums = {
  defaultMinimumQuantity: 48,
  tierBreaks: [
    {
      minQty: 48,
      priceModifier: 1,
      label: 'Kick-off',
    },
    {
      minQty: 120,
      priceModifier: 0.9,
      label: 'Offsite',
    },
    {
      minQty: 300,
      priceModifier: 0.82,
      label: 'Global summit',
    },
  ],
};

const fulfilmentStandard: ProductFulfilmentInfo = {
  productionLeadDays: 7,
  rushAvailable: true,
  rushSurchargePercentage: 18,
  shipsFromCity: 'Mumbai',
  shippingNotes:
    'Standard lead times assume artwork approval within 24 hours. Rush windows compress to 72 hours with curated templates.',
};

const fulfilmentWedding: ProductFulfilmentInfo = {
  productionLeadDays: 10,
  rushAvailable: true,
  rushSurchargePercentage: 22,
  shipsFromCity: 'Jaipur',
  shippingNotes:
    'Wedding suites include an optional printed proof ship-out. We recommend locking artwork at least four weeks before events.',
};

const fulfilmentCollab: ProductFulfilmentInfo = {
  productionLeadDays: 14,
  rushAvailable: false,
  shipsFromCity: 'Mumbai',
  shippingNotes:
    'Limited collaborations are produced in timed windows. Please speak with the studio for aligned ship dates.',
};

const glassEveryday: Product = {
  id: createId('prod_glass_everyday'),
  sku: 'NW-GLS-500-MIN',
  name: 'Signature Still 500',
  subtitle: 'Frosted glass with quiet serif wordmark',
  description:
    'Our everyday Signature Still is a 500ml frosted glass bottle that sits comfortably on desks, nightstands, and studio carts. The silhouette is intentionally slender, with a minimal shoulder and a soft bevel at the base. Labels are printed on a warm eggshell stock with subtle tooth — designed for monograms, phrases, and fine-line illustrations that read beautifully in candlelight.',
  category: 'everyday',
  collection: 'signature',
  badges: ['bestseller', 'online-exclusive'],
  status: 'active',
  heroImage: {
    ...heroImage1,
    id: createId('prod_glass_everyday_hero'),
  },
  gallery: [
    {
      ...heroImage1,
      id: createId('prod_glass_everyday_g1'),
      isPrimary: true,
      label: 'Desk vignette',
    },
    {
      ...heroImage2,
      id: createId('prod_glass_everyday_g2'),
      label: 'Turn-down service pairing',
    },
    {
      id: createId('prod_glass_everyday_g3'),
      url: fineDining2,
      alt: 'Bottle alongside linen and cutlery',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Dinner pairing',
    },
  ],
  hydrationProfile: 'still',
  flavors: [pureFlavor, citrusFlavor],
  sizeVariants: commonSizeVariants.filter(v => v.code !== '1L'),
  materialInfo: alkalineMaterial,
  dimensions: {
    heightMm: 250,
    diameterMm: 65,
    weightGrams: 410,
  },
  sustainability: sustainabilityHigh,
  designCapability: designFullCustom,
  minimums: minimumsEvents,
  fulfilment: fulfilmentStandard,
  basePrice: makeMoney(180),
  startingAtPrice: makeMoney(165),
  pricingTable: [
    {
      minQty: 24,
      unitPrice: makeMoney(190),
    },
    {
      minQty: 72,
      unitPrice: makeMoney(175),
    },
    {
      minQty: 144,
      unitPrice: makeMoney(168),
    },
    {
      minQty: 288,
      unitPrice: makeMoney(160),
    },
  ],
  rating: {
    average: 4.8,
    count: 214,
  },
  meta: {
    status: 'active',
    slug: 'signature-still-500',
    seoTitle: 'Signature Still 500 — Frosted Glass Bottle | Nishant Waters',
    seoDescription:
      'A 500ml frosted glass bottle with custom labels on warm eggshell stock. Designed for desks, bedside tables, and restaurant tablescapes.',
    tags: [
      'frosted',
      'glass',
      'desk',
      'still',
      'monogram',
      'signature collection',
      'nishant waters',
    ],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isDeleted: false,
    createdBy: 'system',
    updatedBy: 'system',
  },
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const glassWedding: Product = {
  id: createId('prod_glass_wedding'),
  sku: 'NW-GLS-500-MIN-WED',
  name: 'Wedding Suite 500',
  subtitle: 'Soft-etched glass with script monogram band',
  description:
    'A ceremony-ready 500ml bottle for wedding suites and sangeet nights. The glass is softly etched to diffuse candlelight, while the label band carries a custom script monogram, dates, and venue. The palette leans into shell whites, muted golds, and a whisper of coral for those who prefer contemporary Indian celebrations with restraint.',
  category: 'weddings',
  collection: 'atelier',
  badges: ['new', 'limited'],
  status: 'active',
  heroImage: {
    id: createId('prod_glass_wedding_hero'),
    url: fineDining2,
    alt: 'Wedding themed bottles on a linen-covered table',
    width: 1200,
    height: 800,
    isPrimary: true,
    label: 'Wedding suite layout',
  },
  gallery: [
    {
      id: createId('prod_glass_wedding_g1'),
      url: warmPaperTexture3,
      alt: 'Flatlay of invitation, menu card, and custom bottle',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Invitation pairing',
    },
    {
      id: createId('prod_glass_wedding_g2'),
      url: fashionEditorial1,
      alt: 'Close-up of scripted monogram on bottle label',
      width: 800,
      height: 800,
      isPrimary: false,
      label: 'Monogram detail',
    },
  ],
  hydrationProfile: 'still',
  flavors: [pureFlavor, berryFlavor],
  sizeVariants: [
    commonSizeVariants[0],
    commonSizeVariants[2],
    commonSizeVariants[3],
  ],
  materialInfo: {
    ...alkalineMaterial,
    finish: 'satin',
  },
  dimensions: {
    heightMm: 255,
    diameterMm: 67,
    weightGrams: 420,
  },
  sustainability: sustainabilityHigh,
  designCapability: designMonogramOnly,
  minimums: {
    ...minimumsEvents,
    defaultMinimumQuantity: 60,
  },
  fulfilment: fulfilmentWedding,
  basePrice: makeMoney(230),
  startingAtPrice: makeMoney(210),
  pricingTable: [
    {
      minQty: 60,
      unitPrice: makeMoney(230),
    },
    {
      minQty: 120,
      unitPrice: makeMoney(215),
    },
    {
      minQty: 240,
      unitPrice: makeMoney(205),
    },
  ],
  rating: {
    average: 4.9,
    count: 97,
  },
  meta: {
    status: 'active',
    slug: 'wedding-suite-500',
    seoTitle: 'Wedding Suite 500 — Script Monogram Bottles | Nishant Waters',
    seoDescription:
      'Soft-etched 500ml glass bottles with script monogram bands, made for wedding suites, mehndi afternoons, and reception bars.',
    tags: [
      'wedding',
      'script',
      'monogram',
      'atelier collection',
      'ceremony',
      'reception',
    ],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isDeleted: false,
    createdBy: 'system',
    updatedBy: 'system',
  },
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const rpetStill: Product = {
  id: createId('prod_rpet_everyday'),
  sku: 'NW-RPET-500-PURE',
  name: 'rPET Everyday 500',
  subtitle: 'Lightweight, travel-ready, and fully recyclable',
  description:
    'Our lightest bottle — a 500ml rPET silhouette made for festivals, brand launches, and on-the-go gifting. The satin finish softens light reflections while still keeping your label in focus. Best paired with clean, high-contrast layouts, this format shines for corporate offsites and cultural festivals alike.',
  category: 'corporate',
  collection: 'monogram',
  badges: ['bestseller'],
  status: 'active',
  heroImage: {
    id: createId('prod_rpet_everyday_hero'),
    url: warmPaperTexture2,
    alt: 'rPET water bottle with corporate stationery on warm paper',
    width: 1200,
    height: 800,
    isPrimary: true,
    label: 'Corporate desk pairing',
  },
  gallery: [
    {
      id: createId('prod_rpet_everyday_g1'),
      url: warmPaperTexture1,
      alt: 'Multiple rPET bottles arranged in grid layout',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Grid layout',
    },
    {
      id: createId('prod_rpet_everyday_g2'),
      url: heroImage2.url,
      alt: 'Close-up of label on rPET bottle',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Label detail',
    },
  ],
  hydrationProfile: 'still',
  flavors: [pureFlavor],
  sizeVariants: [
    commonSizeVariants[0],
    commonSizeVariants[1],
    commonSizeVariants[2],
  ],
  materialInfo: rpetMaterial,
  dimensions: {
    heightMm: 230,
    diameterMm: 64,
    weightGrams: 290,
  },
  sustainability: {
    ...sustainabilityPremium,
    recycledContentPercentage: 100,
    certifications: [
      ...sustainabilityPremium.certifications,
      '100% rPET Food Grade',
    ],
  },
  designCapability: designFullCustom,
  minimums: minimumsCorporate,
  fulfilment: fulfilmentStandard,
  basePrice: makeMoney(95),
  startingAtPrice: makeMoney(85),
  pricingTable: [
    {
      minQty: 48,
      unitPrice: makeMoney(95),
    },
    {
      minQty: 120,
      unitPrice: makeMoney(88),
    },
    {
      minQty: 300,
      unitPrice: makeMoney(82),
    },
  ],
  rating: {
    average: 4.7,
    count: 162,
  },
  meta: {
    status: 'active',
    slug: 'rpet-everyday-500',
    seoTitle: 'rPET Everyday 500 — Lightweight Event Bottles | Nishant Waters',
    seoDescription:
      'A lightweight, fully recyclable 500ml rPET bottle with satin finish labels — ideal for corporate offsites and outdoor festivals.',
    tags: ['rpet', 'corporate', 'festival', 'lightweight'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isDeleted: false,
    createdBy: 'system',
    updatedBy: 'system',
  },
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const aluSportCitrus: Product = {
  id: createId('prod_alu_sport'),
  sku: 'NW-ALU-500-ALK',
  name: 'Aluminium Alkaline 500',
  subtitle: 'Matte aluminium with aqua sport cap',
  description:
    'A 500ml alkaline profile bottled in a matte aluminium shell with a sport cap. Built for gyms, retreats, and brand activations that need a durable, reusable piece. The label wraps partially, inviting bold color blocking and typographic statements that feel closer to streetwear than stationery.',
  category: 'events',
  collection: 'collab',
  badges: ['limited'],
  status: 'active',
  heroImage: {
    id: createId('prod_alu_sport_hero'),
    url: heroImage2.url,
    alt: 'Aluminium bottles styled on a studio set',
    width: 1200,
    height: 800,
    isPrimary: true,
    label: 'Studio aluminium set',
  },
  gallery: [
    {
      id: createId('prod_alu_sport_g1'),
      url: fashionEditorial2,
      alt: 'Person holding aluminium bottle next to fashion pieces',
      width: 800,
      height: 800,
      isPrimary: false,
      label: 'Streetwear pairing',
    },
    {
      id: createId('prod_alu_sport_g2'),
      url: fineDining3,
      alt: 'Aluminium bottles on a chef’s pass with tasting plates',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Chef’s pass',
    },
  ],
  hydrationProfile: 'alkaline',
  flavors: [pureFlavor, citrusFlavor, tropicalFlavor],
  sizeVariants: [
    commonSizeVariants[1],
    commonSizeVariants[2],
    commonSizeVariants[3],
  ],
  materialInfo: aluMatteMaterial,
  dimensions: {
    heightMm: 238,
    diameterMm: 70,
    weightGrams: 330,
  },
  sustainability: sustainabilityPremium,
  designCapability: designFullCustom,
  minimums: minimumsEvents,
  fulfilment: fulfilmentCollab,
  basePrice: makeMoney(210),
  startingAtPrice: makeMoney(195),
  pricingTable: [
    {
      minQty: 24,
      unitPrice: makeMoney(210),
    },
    {
      minQty: 96,
      unitPrice: makeMoney(198),
    },
    {
      minQty: 240,
      unitPrice: makeMoney(189),
    },
  ],
  rating: {
    average: 4.6,
    count: 88,
  },
  meta: {
    status: 'active',
    slug: 'aluminium-alkaline-500',
    seoTitle: 'Aluminium Alkaline 500 — Matte Sport Cap Bottle | Nishant Waters',
    seoDescription:
      'A 500ml alkaline water profile in a matte aluminium bottle with sport cap, designed for retreats, gyms, and bold brand activations.',
    tags: ['aluminium', 'alkaline', 'sport cap', 'collab'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isDeleted: false,
    createdBy: 'system',
    updatedBy: 'system',
  },
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const collabGlassLarge: Product = {
  id: createId('prod_collab_glass'),
  sku: 'NW-GLS-750-COLLAB',
  name: '750 Atelier Carafe',
  subtitle: 'Tall still carafe with atelier grid label',
  description:
    'A 750ml glass carafe for slow dinners and chef collaborations. The silhouette is slightly taller with a relaxed shoulder, intentionally sized for two to three guests at a table. The atelier grid label is designed to host chef names, menu notes, and micro-illustrations — turning every bottle into a snapshot of the evening.',
  category: 'limited',
  collection: 'atelier',
  badges: ['limited', 'online-exclusive'],
  status: 'active',
  heroImage: {
    id: createId('prod_collab_glass_hero'),
    url: fineDining3,
    alt: '750ml carafes with fine dining plating',
    width: 1200,
    height: 800,
    isPrimary: true,
    label: 'Atelier service',
  },
  gallery: [
    {
      id: createId('prod_collab_glass_g1'),
      url: fineDining1,
      alt: 'Carafe with layered table textures and textiles',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Table textures',
    },
    {
      id: createId('prod_collab_glass_g2'),
      url: heroImage3.url,
      alt: 'Minimalist bar display with carafes on shelves',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Bar display',
    },
  ],
  hydrationProfile: 'sparkling',
  flavors: [pureFlavor, botanicalFlavor],
  sizeVariants: [
    commonSizeVariants[2],
    commonSizeVariants[3],
  ],
  materialInfo: {
    ...alkalineMaterial,
    material: 'glass',
    finish: 'glossy',
  },
  dimensions: {
    heightMm: 270,
    diameterMm: 78,
    weightGrams: 530,
  },
  sustainability: sustainabilityHigh,
  designCapability: designFullCustom,
  minimums: {
    ...minimumsEvents,
    defaultMinimumQuantity: 36,
  },
  fulfilment: fulfilmentCollab,
  basePrice: makeMoney(260),
  startingAtPrice: makeMoney(245),
  pricingTable: [
    {
      minQty: 36,
      unitPrice: makeMoney(260),
    },
    {
      minQty: 96,
      unitPrice: makeMoney(248),
    },
    {
      minQty: 192,
      unitPrice: makeMoney(238),
    },
  ],
  rating: {
    average: 4.9,
    count: 61,
  },
  meta: {
    status: 'active',
    slug: 'atelier-carafe-750',
    seoTitle: 'Atelier Carafe 750 — Chef Collaboration Bottle | Nishant Waters',
    seoDescription:
      'A 750ml still glass carafe with an atelier grid label system designed for chef collaborations, limited menus, and restaurant tasting journeys.',
    tags: ['carafe', 'atelier', 'sparkling', 'collaboration'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isDeleted: false,
    createdBy: 'system',
    updatedBy: 'system',
  },
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const berryAmenity: Product = {
  id: createId('prod_berry_amenity'),
  sku: 'NW-RPET-250-BERRY',
  name: 'Amenity Berry 250',
  subtitle: 'Compact, color-forward welcome bottle',
  description:
    'A 250ml berry-inflected profile designed for welcome trays, turn-down rituals, and in-flight amenity kits. The label canvas leans into coral and berry tones, with a condensed typographic system that still leaves breathing room for your mark.',
  category: 'gifting',
  collection: 'signature',
  badges: ['new'],
  status: 'active',
  heroImage: {
    id: createId('prod_berry_amenity_hero'),
    url: fashionEditorial3,
    alt: 'Amenity-sized bottle styled with travel accessories',
    width: 800,
    height: 800,
    isPrimary: true,
    label: 'Amenity vignette',
  },
  gallery: [
    {
      id: createId('prod_berry_amenity_g1'),
      url: warmPaperTexture1,
      alt: 'Flatlay of amenity kit contents including bottle',
      width: 1200,
      height: 800,
      isPrimary: false,
      label: 'Welcome kit flatlay',
    },
  ],
  hydrationProfile: 'still',
  flavors: [berryFlavor],
  sizeVariants: [
    commonSizeVariants[0],
    commonSizeVariants[1],
  ],
  materialInfo: {
    ...rpetMaterial,
    finish: 'glossy',
  },
  dimensions: {
    heightMm: 170,
    diameterMm: 55,
    weightGrams: 220,
  },
  sustainability: sustainabilityPremium,
  designCapability: designMonogramOnly,
  minimums: {
    ...minimumsCorporate,
    defaultMinimumQuantity: 80,
  },
  fulfilment: fulfilmentStandard,
  basePrice: makeMoney(110),
  startingAtPrice: makeMoney(99),
  pricingTable: [
    {
      minQty: 80,
      unitPrice: makeMoney(110),
    },
    {
      minQty: 160,
      unitPrice: makeMoney(102),
    },
    {
      minQty: 320,
      unitPrice: makeMoney(96),
    },
  ],
  rating: {
    average: 4.5,
    count: 43,
  },
  meta: {
    status: 'active',
    slug: 'amenity-berry-250',
    seoTitle: 'Amenity Berry 250 — Welcome Tray Bottles | Nishant Waters',
    seoDescription:
      'A compact 250ml berry-inflected bottle with coral-forward labels, ideal for welcome trays, amenity kits, and premium in-flight gifting.',
    tags: ['amenity', 'berry', 'gifting', 'hospitality'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    isDeleted: false,
    createdBy: 'system',
    updatedBy: 'system',
  },
  createdAt: nowIso(),
  updatedAt: nowIso(),
};

const products: Product[] = [
  glassEveryday,
  glassWedding,
  rpetStill,
  aluSportCitrus,
  collabGlassLarge,
  berryAmenity,
];

const productVariantDimensions: ProductVariantDimension[] = [
  {
    code: 'bottleSize',
    name: 'Bottle Size',
    options: commonSizeVariants.map(v => ({
      id: createId(`vs_${v.code}`),
      label: v.code,
      description: v.recommendedUse,
    })),
  },
  {
    code: 'material',
    name: 'Material',
    options: [
      {
        id: createId('mat_glass'),
        label: 'Glass',
        description: 'Premium-weight glass with tactile labels.',
        imageUrl: heroImage1.url,
      },
      {
        id: createId('mat_rpet'),
        label: 'rPET',
        description: 'Lightweight and fully recyclable.',
        imageUrl: warmPaperTexture2,
      },
      {
        id: createId('mat_aluminium'),
        label: 'Aluminium',
        description: 'Matte, reusable, and sport-ready.',
        imageUrl: heroImage2.url,
      },
    ],
  },
];

const baseCanvasMinimal: LabelCanvasSettings = {
  preset: 'minimal',
  width: 900,
  height: 600,
  bleed: 24,
  safeZone: 32,
  backgroundColor: 'sand',
  customBackgroundHex: undefined,
  border: {
    enabled: false,
    color: 'shell',
    thickness: 1,
    radius: 18,
    style: 'solid',
  },
  shadow: {
    enabled: false,
    blur: 18,
    spread: 0,
    offsetX: 0,
    offsetY: 12,
    color: 'rgba(0,0,0,0.35)',
    opacity: 0.16,
  },
};

const backgroundElementMinimal: LabelBackgroundElement = {
  id: createId('lbl_bg_minimal'),
  type: 'background',
  name: 'Warm canvas',
  zIndex: 0,
  position: { x: 0, y: 0 },
  dimensions: { width: 900, height: 600 },
  transform: { rotation: 0, scale: 1, opacity: 1 },
  locked: true,
  visible: true,
  isDirty: false,
  isSynced: true,
  fillColor: 'sand',
  customFillHex: undefined,
  texture: 'linen',
  grainIntensity: 28,
};

const primaryWordmarkMinimal: LabelTextElement = {
  id: createId('lbl_txt_minimal_wordmark'),
  type: 'text',
  name: 'Wordmark',
  zIndex: 10,
  position: { x: 120, y: 190 },
  dimensions: { width: 660, height: 120 },
  transform: { rotation: -2, scale: 1, opacity: 1 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  content: 'Nishant Waters',
  typography: {
    fontFamily: 'sansDisplay',
    fontSize: 72,
    letterSpacing: 6,
    lineHeight: 1.1,
    fontWeight: 400,
    textAlign: 'left',
    allCaps: true,
  },
  color: 'ink',
  customHex: undefined,
};

const secondaryLineMinimal: LabelTextElement = {
  id: createId('lbl_txt_minimal_secondary'),
  type: 'text',
  name: 'Secondary line',
  zIndex: 11,
  position: { x: 120, y: 296 },
  dimensions: { width: 520, height: 70 },
  transform: { rotation: 0, scale: 1, opacity: 0.94 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  content: 'Custom-labeled water for considered moments.',
  typography: {
    fontFamily: 'serifEditorial',
    fontSize: 24,
    letterSpacing: 0.5,
    lineHeight: 1.4,
    fontWeight: 400,
    textAlign: 'left',
    allCaps: false,
  },
  color: 'slate',
  customHex: undefined,
};

const accentUnderlineMinimal: LabelAccentElement = {
  id: createId('lbl_acc_minimal'),
  type: 'accent',
  name: 'Underwave',
  zIndex: 12,
  position: { x: 118, y: 334 },
  dimensions: { width: 260, height: 18 },
  transform: { rotation: 0, scale: 1, opacity: 1 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  pattern: 'wave',
  thickness: 8,
  color: 'aqua',
  customHex: undefined,
};

const monogramCanvas: LabelCanvasSettings = {
  ...baseCanvasMinimal,
  preset: 'monogram',
  backgroundColor: 'shell',
  border: {
    enabled: true,
    color: 'ink',
    thickness: 1.4,
    radius: 32,
    style: 'dashed',
    customHex: undefined,
  },
};

const monogramBackground: LabelBackgroundElement = {
  ...backgroundElementMinimal,
  id: createId('lbl_bg_monogram'),
  fillColor: 'shell',
  grainIntensity: 18,
};

const monogramShape: LabelShapeElement = {
  id: createId('lbl_shape_monogram'),
  type: 'shape',
  name: 'Monogram ring',
  zIndex: 6,
  position: { x: 324, y: 146 },
  dimensions: { width: 250, height: 250 },
  transform: { rotation: -8, scale: 1, opacity: 1 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  shape: 'ring',
  fillColor: 'foam',
  customFillHex: undefined,
  border: {
    enabled: true,
    color: 'aqua',
    thickness: 1.6,
    radius: 999,
    style: 'solid',
    customHex: undefined,
  },
};

const monogramInitials: LabelLogoElement = {
  id: createId('lbl_logo_monogram'),
  type: 'logo',
  name: 'Initials',
  zIndex: 8,
  position: { x: 364, y: 180 },
  dimensions: { width: 170, height: 170 },
  transform: { rotation: 0, scale: 1, opacity: 1 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  sourceType: 'initials',
  imageUrl: undefined,
  initials: 'N / W',
  monochrome: true,
  tintColor: 'ink',
  customHex: undefined,
};

const monogramCaption: LabelTextElement = {
  id: createId('lbl_txt_monogram_caption'),
  type: 'text',
  name: 'Caption',
  zIndex: 9,
  position: { x: 240, y: 388 },
  dimensions: { width: 420, height: 80 },
  transform: { rotation: 0, scale: 1, opacity: 0.9 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  content: 'Still water | Bottled at source | Crafted on your terms',
  typography: {
    fontFamily: 'sansUtility',
    fontSize: 16,
    letterSpacing: 3,
    lineHeight: 1.5,
    fontWeight: 500,
    textAlign: 'center',
    allCaps: true,
  },
  color: 'slate',
  customHex: undefined,
};

const weddingCanvas: LabelCanvasSettings = {
  preset: 'wedding',
  width: 960,
  height: 640,
  bleed: 28,
  safeZone: 40,
  backgroundColor: 'shell',
  customBackgroundHex: undefined,
  border: {
    enabled: true,
    color: 'coral',
    thickness: 1.2,
    radius: 40,
    style: 'solid',
    customHex: undefined,
  },
  shadow: {
    enabled: true,
    blur: 22,
    spread: 0,
    offsetX: 0,
    offsetY: 16,
    color: 'rgba(0,0,0,0.35)',
    opacity: 0.18,
  },
};

const weddingBackground: LabelBackgroundElement = {
  id: createId('lbl_bg_wedding'),
  type: 'background',
  name: 'Wedding canvas',
  zIndex: 0,
  position: { x: 0, y: 0 },
  dimensions: { width: 960, height: 640 },
  transform: { rotation: 0, scale: 1, opacity: 1 },
  locked: true,
  visible: true,
  isDirty: false,
  isSynced: true,
  fillColor: 'shell',
  customFillHex: undefined,
  texture: 'marble',
  grainIntensity: 16,
};

const weddingRibbon: LabelShapeElement = {
  id: createId('lbl_shape_wedding_ribbon'),
  type: 'shape',
  name: 'Ribbon',
  zIndex: 4,
  position: { x: 0, y: 246 },
  dimensions: { width: 960, height: 146 },
  transform: { rotation: 0, scale: 1, opacity: 0.94 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  shape: 'wave',
  fillColor: 'aqua',
  customFillHex: undefined,
  border: {
    enabled: false,
    color: 'aqua',
    thickness: 0,
    radius: 0,
    style: 'solid',
    customHex: undefined,
  },
};

const weddingNames: LabelTextElement = {
  id: createId('lbl_txt_wedding_names'),
  type: 'text',
  name: 'Names',
  zIndex: 6,
  position: { x: 120, y: 180 },
  dimensions: { width: 720, height: 160 },
  transform: { rotation: 0, scale: 1, opacity: 1 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  content: 'Aanya  &  Advait',
  typography: {
    fontFamily: 'scriptSignature',
    fontSize: 64,
    letterSpacing: 2,
    lineHeight: 1.2,
    fontWeight: 400,
    textAlign: 'center',
    allCaps: false,
  },
  color: 'ink',
  customHex: undefined,
};

const weddingDetails: LabelTextElement = {
  id: createId('lbl_txt_wedding_details'),
  type: 'text',
  name: 'Details',
  zIndex: 7,
  position: { x: 200, y: 288 },
  dimensions: { width: 560, height: 140 },
  transform: { rotation: 0, scale: 1, opacity: 0.96 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  content: 'Jaipur | 18 February 2025',
  typography: {
    fontFamily: 'sansUtility',
    fontSize: 20,
    letterSpacing: 4,
    lineHeight: 1.6,
    fontWeight: 500,
    textAlign: 'center',
    allCaps: true,
  },
  color: 'shell',
  customHex: undefined,
};

const weddingVenueSketch: LabelImageElement = {
  id: createId('lbl_img_wedding_venue'),
  type: 'image',
  name: 'Venue sketch',
  zIndex: 5,
  position: { x: 344, y: 368 },
  dimensions: { width: 272, height: 162 },
  transform: { rotation: 0, scale: 1, opacity: 0.92 },
  locked: false,
  visible: true,
  isDirty: false,
  isSynced: true,
  imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
  objectFit: 'cover',
  borderRadius: 24,
};

const corporateCanvas: LabelCanvasSettings = {
  preset: 'corporate',
  width: 880,
  height: 520,
  bleed: 24,
  safeZone: 40,
  backgroundColor: 'sand',
  customBackgroundHex: undefined,
  border: {
    enabled: true,
    color: 'slate',
    thickness: 1,
    radius: 24,
    style: 'solid',
    customHex: undefined,
  },
  shadow: {
    enabled: true,
    blur: 20,
    spread: 0,
    offsetX: 0,
    offsetY: 14,
    color: 'rgba(0,0,0,0.35)',
    opacity: 0.16,
  },
};

const corporateBackground: LabelBackgroundElement = {
  id: createId('lbl_bg_corporate'),
  type: 'background',
  name: 'Corporate canvas',
  zIndex: 0,
  position: { x: 0, y: 0 },
  dimensions: { width: 880, height: 520 },
  transform: { rotation: 0, scale: 1, opacity: 1 },
  locked: true,
  visible: true,
  isDirty: false,
  isSynced: true,
  fillColor: 'sand',
  customFillHex: undefined,
  texture: 'grain',
  grainIntensity: 20,
};

const corporateLogoBlock: LabelShapeElement = {
  id: createId('lbl_shape_corp_block'),
  type: 'shape',
}

export default mockData;
export { mockData };

export { products };

export { categories };
