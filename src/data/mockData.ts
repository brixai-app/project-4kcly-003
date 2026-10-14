import {
  Product,
  VolumeMl,
  BottleFinish,
  CustomLabelDesign,
  LabelElement,
  LabelPalette,
  LabelDimensions,
} from '@/types';

export const volumeFacets: VolumeMl[] = [250, 330, 500, 750, 1000];

export const finishFacets: BottleFinish[] = ['matte', 'gloss', 'frosted', 'metallic'];

export const materialFacets: string[] = ['glass', 'recycled-glass', 'crystal', 'aluminium'];

export const homeEditorialCopy = {
  heroTitle: 'Water, Composed.',
  heroSubtitle:
    'Nishant Waters creates custom-labeled bottles for galleries, ateliers, and private tables where every detail is curated.',
  heroKicker: 'Edition No. 01 · Monogrammed Still & Sparkling Service',
  manifestoTitle: 'For rooms where the lighting is tuned and the glassware is chosen by hand.',
  manifestoBody:
    'Our bottles are finished in tactile matte and soft gloss, dressed with labels cut for your name, event, or house mark. Each pour is quiet luxury — sourced from mineral-rich springs and designed to live as part of your table story.',
  dropHeadline: 'Current Table Editions',
  dropBody:
    'From gallery openings to weekend residences, these small-run bottlings are crafted to sit effortlessly beside your stemware and linen.',
};

export const shopCopy = {
  pageTitle: 'The Bottled Edit',
  pageSubtitle:
    'Curated still, sparkling, and infused waters prepared for custom labeling and small-batch events.',
};

export const labelStudioCopy = {
  defaultName: 'Atelier Monogram Study',
  description:
    'A restrained emerald palette with soft ivory ground, designed for initials, event dates, and discreet hospitality marks.',
};

const products: Product[] = [
  {
    id: 'nw-still-ivory-matte-750',
    slug: 'still-ivory-matte-750',
    name: 'Still No. 1 · Ivory Matte 750',
    shortDescription: 'Soft-mineral still water in a tall ivory-matte glass bottle.',
    description:
      'A long, quiet pour of still water with a silken texture, bottled in an ivory-matte glass silhouette that disappears into linen and stone. Designed as a neutral canvas for gallery marks, wedding crests, and private table monograms.',
    category: 'still',
    heroImage: {
      id: 'nw1-hero',
      url: 'https://images.unsplash.com/photo-1677735476292-0fc57ab097b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bHV4dXJ5JTIwYm90dGxlZCUyMHdhdGVyJTIwYnJhbmRpbmclMjBtaW5pbWFsaXN0JTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMDA5Mnww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      alt: 'Ivory matte glass water bottle on a warm neutral surface',
      priority: true,
    },
    images: [
      {
        id: 'nw1-alt1',
        url: 'https://images.unsplash.com/photo-1637787166081-b4afc2d6ab3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bHV4dXJ5JTIwYm90dGxlZCUyMHdhdGVyJTIwYnJhbmRpbmclMjBtaW5pbWFsaXN0JTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMDA5Mnww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Still water bottle in studio light',
      },
      {
        id: 'nw1-alt2',
        url: 'https://images.unsplash.com/photo-1640621774431-3b28204a5510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bHV4dXJ5JTIwYm90dGxlZCUyMHdhdGVyJTIwYnJhbmRpbmclMjBtaW5pbWFsaXN0JTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMDA5Mnww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail of bottle shoulder and label area',
      },
    ],
    variants: [
      {
        id: 'nw1-750-matte',
        volumeMl: 750,
        finish: 'matte',
        stock: 42,
        sku: 'NW-STILL-750-M-01',
        price: {
          amount: 1499,
          currency: 'INR',
          compareAtAmount: 1699,
        },
        isDefault: true,
      },
      {
        id: 'nw1-1000-matte',
        volumeMl: 1000,
        finish: 'matte',
        stock: 18,
        sku: 'NW-STILL-1000-M-01',
        price: {
          amount: 1799,
          currency: 'INR',
        },
      },
    ],
    tags: ['still', 'ivory', 'matte', 'table-service', 'monogram'],
    meta: {
      collection: 'House Still',
      tastingNotes: ['silken texture', 'soft mineral', 'quiet finish'],
      sourceRegion: 'Himalayan Foothills',
      phLevel: 7.4,
      mineralProfile: 'Low mineral, featherweight mouthfeel',
      badges: ['signature', 'sommelier-favored'],
      isNew: true,
    },
    sortIndex: 1,
  },
  {
    id: 'nw-sparkling-emerald-gloss-750',
    slug: 'sparkling-emerald-gloss-750',
    name: 'Sparkling No. 3 · Emerald Gloss 750',
    shortDescription: 'Fine-bubble sparkling in emerald-gloss glass with label-ready shoulders.',
    description:
      'A fine, vertical bead of carbonation bottled in deep emerald glass. The gloss finish catches candlelight while the tall label panel frames crests, dates, and gallery marks without competing with the table.',
    category: 'sparkling',
    heroImage: {
      id: 'nw2-hero',
      url: 'https://images.unsplash.com/photo-1789650890177-3e59164f434f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8ZWRpdG9yaWFsJTIwc3RpbGwlMjBsaWZlJTIwZ2xhc3MlMjBib3R0bGUlMjBvbiUyMHN0b25lJTIwc3VyZmFjZSUyMHdhcm0lMjBuZXV0cmFsfGVufDB8MHx8fDE3OTIwMTAwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      alt: 'Emerald glass sparkling water bottle on stone surface',
      priority: true,
    },
    images: [
      {
        id: 'nw2-alt1',
        url: 'https://images.unsplash.com/photo-1783150364764-d1389bc113d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8aGlnaC1lbmQlMjBwcm9kdWN0JTIwbGFiZWwlMjB0eXBvZ3JhcGh5JTIwbWFjcm8lMjBzaG90JTIwZ29sZCUyMGZvaWx8ZW58MHwwfHx8MTc5MjAxMDA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'High-end product macro of label and foil details',
      },
      {
        id: 'nw2-alt2',
        url: 'https://images.unsplash.com/photo-1711011973400-c5f5f8690374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8aGlnaC1lbmQlMjBwcm9kdWN0JTIwbGFiZWwlMjB0eXBvZ3JhcGh5JTIwbWFjcm8lMjBzaG90JTIwZ29sZCUyMGZvaWx8ZW58MHwwfHx8MTc5MjAxMDA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Macro of emerald glass and gloss reflections',
      },
    ],
    variants: [
      {
        id: 'nw2-750-gloss',
        volumeMl: 750,
        finish: 'gloss',
        stock: 26,
        sku: 'NW-SPARK-750-G-03',
        price: {
          amount: 1899,
          currency: 'INR',
          compareAtAmount: 2099,
        },
        isDefault: true,
      },
      {
        id: 'nw2-330-gloss',
        volumeMl: 330,
        finish: 'gloss',
        stock: 64,
        sku: 'NW-SPARK-330-G-03',
        price: {
          amount: 1299,
          currency: 'INR',
        },
      },
    ],
    tags: ['sparkling', 'emerald', 'label-panel', 'foil-ready'],
    meta: {
      collection: 'Emerald Service',
      tastingNotes: ['fine bead', 'chalky minerality', 'brisk finish'],
      sourceRegion: 'Alpine Spring',
      phLevel: 7.1,
      mineralProfile: 'Medium mineral, linear and bright',
      badges: ['sommelier-favored'],
      isLimited: true,
    },
    sortIndex: 2,
  },
  {
    id: 'nw-infused-citrus-frosted-500',
    slug: 'infused-citrus-frosted-500',
    name: 'Citrus Study · Frosted 500',
    shortDescription: 'Still water infused with citrus peels in a frosted glass bottle.',
    description:
      'An understated citrus infusion — more peel than juice — bottled in frosted glass that softens the colour while highlighting label work. Ideal for daytime terraces, gallery previews, and spa programs.',
    category: 'infused',
    heroImage: {
      id: 'nw3-hero',
      url: 'https://images.unsplash.com/photo-1627626147442-98bd5d06745c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8aGlnaC1lbmQlMjBwcm9kdWN0JTIwbGFiZWwlMjB0eXBvZ3JhcGh5JTIwbWFjcm8lMjBzaG90JTIwZ29sZCUyMGZvaWx8ZW58MHwwfHx8MTc5MjAxMDA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      alt: 'Frosted glass bottle with citrus-inspired label design',
      priority: true,
    },
    images: [
      {
        id: 'nw3-alt1',
        url: 'https://images.unsplash.com/photo-1677735476292-0fc57ab097b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8YXJjaGl0ZWN0dXJhbCUyMGRpbmluZyUyMHRhYmxlJTIwZ2xhc3N3YXJlJTIwc3RpbGwlMjBsaWZlJTIwbWluaW1hbHxlbnwwfDB8fHwxNzkyMDEwMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Architectural dining table with still life glassware',
      },
      {
        id: 'nw3-alt2',
        url: 'https://images.unsplash.com/photo-1729303130451-9b02fb8c731c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGRpbmluZyUyMHRhYmxlJTIwZ2xhc3N3YXJlJTIwc3RpbGwlMjBsaWZlJTIwbWluaW1hbHxlbnwwfDB8fHwxNzkyMDEwMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Detail of table glassware and bottle on stone',
      },
    ],
    variants: [
      {
        id: 'nw3-500-frosted',
        volumeMl: 500,
        finish: 'frosted',
        stock: 58,
        sku: 'NW-INF-500-F-CIT',
        price: {
          amount: 1599,
          currency: 'INR',
        },
        isDefault: true,
      },
      {
        id: 'nw3-250-frosted',
        volumeMl: 250,
        finish: 'frosted',
        stock: 92,
        sku: 'NW-INF-250-F-CIT',
        price: {
          amount: 1199,
          currency: 'INR',
        },
      },
    ],
    tags: ['infused', 'citrus', 'daytime', 'terrace'],
    meta: {
      collection: 'Daylight Service',
      tastingNotes: ['citrus peel', 'white flower', 'saline edge'],
      sourceRegion: 'Mountain Spring',
      phLevel: 7.2,
      mineralProfile: 'Balanced mineral with bright aromatics',
      badges: ['chef-collaboration'],
      isNew: true,
    },
    sortIndex: 3,
  },
  {
    id: 'nw-limited-gold-metallic-magnum',
    slug: 'limited-gold-metallic-magnum',
    name: 'Edition Gold · Metallic Magnum',
    shortDescription: 'Showpiece magnum in warm metallic finish for head tables and openings.',
    description:
      'A limited metallic magnum designed as a central object for long tables and opening nights. The tall label surface takes large-format typography and emblematic marks with equal ease.',
    category: 'magnum',
    heroImage: {
      id: 'nw4-hero',
      url: 'https://images.unsplash.com/photo-1729303130444-686fbdaea1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8YXJjaGl0ZWN0dXJhbCUyMGRpbmluZyUyMHRhYmxlJTIwZ2xhc3N3YXJlJTIwc3RpbGwlMjBsaWZlJTIwbWluaW1hbHxlbnwwfDB8fHwxNzkyMDEwMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      alt: 'Architectural dining table with metallic bottle centerpiece',
      priority: true,
    },
    images: [
      {
        id: 'nw4-alt1',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
        alt: 'Editorial still life with draped fabric and metallic bottle',
      },
      {
        id: 'nw4-alt2',
        url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
        alt: 'Warm-toned table setting with glassware and bottle',
      },
    ],
    variants: [
      {
        id: 'nw4-1500-metallic',
        volumeMl: 1000,
        finish: 'metallic',
        stock: 9,
        sku: 'NW-LTD-1000-MG-GOLD',
        price: {
          amount: 3899,
          currency: 'INR',
          compareAtAmount: 4299,
        },
        isDefault: true,
      },
    ],
    tags: ['limited', 'metallic', 'magnum', 'gold', 'centerpiece'],
    meta: {
      collection: 'Edition Gold',
      tastingNotes: ['layered mineral', 'extended finish'],
      sourceRegion: 'Selective European Springs',
      phLevel: 7.0,
      mineralProfile: 'Structured mineral backbone, built for food pairings',
      badges: ['limited-run', 'numbered'],
      isLimited: true,
    },
    sortIndex: 4,
  },
  {
    id: 'nw-mini-flight-matte-250',
    slug: 'mini-flight-matte-250',
    name: 'Mini Flight · Matte 250',
    shortDescription: 'Matte mini bottles for turndown service and tasting flights.',
    description:
      'A composed set of matte mini bottles sized for turndown trays, tasting flights, and welcome rituals. The compact label area is tuned for initials and discreet property marks.',
    category: 'mini',
    heroImage: {
      id: 'nw5-hero',
      url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
      alt: 'Set of small glass bottles arranged on a tray',
      priority: true,
    },
    images: [
      {
        id: 'nw5-alt1',
        url: 'https://images.unsplash.com/photo-1677735476292-0fc57ab097b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8YXJjaGl0ZWN0dXJhbCUyMGRpbmluZyUyMHRhYmxlJTIwZ2xhc3N3YXJlJTIwc3RpbGwlMjBsaWZlJTIwbWluaW1hbHxlbnwwfDB8fHwxNzkyMDEwMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Mini bottles in a row on neutral background',
      },
      {
        id: 'nw5-alt2',
        url: 'https://images.unsplash.com/photo-1677735476292-0fc57ab097b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bHV4dXJ5JTIwYm90dGxlZCUyMHdhdGVyJTIwYnJhbmRpbmclMjBtaW5pbWFsaXN0JTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMDA5Mnww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        alt: 'Close-up of mini bottle label zone',
      },
    ],
    variants: [
      {
        id: 'nw5-250-matte',
        volumeMl: 250,
        finish: 'matte',
        stock: 120,
        sku: 'NW-MINI-250-M-FLT',
        price: {
          amount: 899,
          currency: 'INR',
        },
        isDefault: true,
      },
      {
        id: 'nw5-330-matte',
        volumeMl: 330,
        finish: 'matte',
        stock: 80,
        sku: 'NW-MINI-330-M-FLT',
        price: {
          amount: 999,
          currency: 'INR',
        },
      },
    ],
    tags: ['mini', 'turndown', 'flight', 'amenity'],
    meta: {
      collection: 'Residence',
      tastingNotes: ['clean', 'refreshing'],
      sourceRegion: 'Regional Springs',
      phLevel: 7.3,
      mineralProfile: 'Neutral mineral balance for broad appeal',
      badges: ['hotel-favorite'],
    },
    sortIndex: 5,
  },
];

const defaultLabelPalette: LabelPalette = {
  background: '#F7F1E8',
  primary: '#141310',
  secondary: '#5D584F',
  accent: '#0E4A3A',
  foil: 'gold',
};

const defaultLabelDimensions: LabelDimensions = {
  width: 640,
  height: 880,
  cornerRadius: 24,
  shape: 'rect',
};

const baseLabelElements: LabelElement[] = [
  {
    id: 'el-title',
    type: 'text',
    x: 320,
    y: 220,
    rotation: 0,
    text: 'Nishant Waters',
    fontFamily: 'Playfair Display',
    fontWeight: 500,
    fontSize: 42,
    letterSpacing: 0.12,
    lineHeight: 1.15,
    color: '#141310',
    case: 'title',
    align: 'center',
  },
  {
    id: 'el-subtitle',
    type: 'text',
    x: 320,
    y: 310,
    rotation: 0,
    text: 'Table Edition · Still',
    fontFamily: 'Lato',
    fontWeight: 300,
    fontSize: 18,
    letterSpacing: 0.22,
    lineHeight: 1.4,
    color: '#5D584F',
    case: 'upper',
    align: 'center',
  },
  {
    id: 'el-monogram',
    type: 'monogram',
    x: 320,
    y: 460,
    rotation: 0,
    text: 'NW',
    fontFamily: 'Playfair Display',
    fontWeight: 600,
    fontSize: 64,
    letterSpacing: 0.18,
    lineHeight: 1,
    color: '#0E4A3A',
    case: 'caps',
    align: 'center',
  },
  {
    id: 'el-badge',
    type: 'badge',
    x: 320,
    y: 620,
    rotation: 0,
    text: 'Atelier Bottled Water',
    tone: 'ivory',
    outline: true,
    radius: 999,
    locked: false,
  },
  {
    id: 'el-date',
    type: 'date',
    x: 320,
    y: 700,
    rotation: 0,
    format: 'dd MMM yyyy',
    color: '#5D584F',
    fontFamily: 'Lato',
    fontSize: 14,
  },
];

export const savedDesignPresets: CustomLabelDesign[] = [
  {
    id: 'design-atelier-emerald',
    name: 'Atelier Emerald Monogram',
    slug: 'atelier-emerald-monogram',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    palette: defaultLabelPalette,
    dimensions: defaultLabelDimensions,
    elements: baseLabelElements,
    thumbnailUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    notes: 'Default atelier preset tuned for emerald-gloss bottles.',
    isFavorite: true,
  },
];

export const mockData = {
  products,
  volumeFacets,
  finishFacets,
  materialFacets,
  homeEditorialCopy,
  shopCopy,
  labelStudioCopy,
  savedDesignPresets,
  defaultLabelPalette,
  defaultLabelDimensions,
};

export default mockData;
export const products = (mockData as any)?.products ?? [];
