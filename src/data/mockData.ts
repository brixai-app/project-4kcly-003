import { Product, Tag, Category } from '@/types';

export interface SearchSuggestion {
  id: string;
  label: string;
  query: string;
  category?: Category;
  tags?: Tag[];
}

export interface AboutSectionBlock {
  id: string;
  heading: string;
  body: string;
}

export const products: Product[] = [
  {
    id: 'nw-still-glass-750',
    name: 'Nishant Still Glass 750',
    slug: 'nishant-still-glass-750',
    description:
      'A calm, mineral-balanced still water presented in a slender glass bottle designed for clean tablescapes and quiet rituals. Slow-filtered through basalt and sand for a rounded mouthfeel that pairs effortlessly with seasonal cooking.',
    category: 'Still',
    tags: ['Glass', 'BPA-Free', 'CarbonNeutral', 'Bestseller'],
    basePriceCents: 1499,
    imageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    secondaryImageUrl:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
    isFeatured: true,
    variants: [
      {
        id: 'nw-still-500',
        name: '500 ml table size',
        volumeMl: 500,
        priceCents: 1299,
        inStock: true,
      },
      {
        id: 'nw-still-750',
        name: '750 ml dining',
        volumeMl: 750,
        priceCents: 1499,
        inStock: true,
      },
      {
        id: 'nw-still-1000',
        name: '1 L carafe companion',
        volumeMl: 1000,
        priceCents: 1699,
        inStock: true,
      },
    ],
  },
  {
    id: 'nw-sparkling-aluminum-350',
    name: 'Crestline Sparkling Can',
    slug: 'crestline-sparkling-can',
    description:
      'Bright, lifted carbonation with a subtle salinity that frames citrus-forward dishes and late-night playlists. Packed in lightweight, endlessly recyclable aluminum ideal for events and studio sessions.',
    category: 'Sparkling',
    tags: ['Aluminum', 'Recycled', 'CarbonNeutral', 'New'],
    basePriceCents: 899,
    imageUrl:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
    secondaryImageUrl:
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    variants: [
      {
        id: 'nw-sparkling-330',
        name: '330 ml session can',
        volumeMl: 330,
        priceCents: 799,
        inStock: true,
      },
      {
        id: 'nw-sparkling-355',
        name: '355 ml utility can',
        volumeMl: 355,
        priceCents: 899,
        inStock: true,
      },
      {
        id: 'nw-sparkling-473',
        name: '473 ml tall can',
        volumeMl: 473,
        priceCents: 1099,
        inStock: false,
      },
    ],
  },
  {
    id: 'nw-mineral-stone-1l',
    name: 'Stonebed Mineral 1L',
    slug: 'stonebed-mineral-1l',
    description:
      'Drawn from deep aquifers, Stonebed brings a quiet density and natural minerality that loves grilled vegetables, umami broths, and unhurried conversations. Each bottle carries subtle, site-specific character.',
    category: 'Mineral',
    tags: ['Glass', 'Refillable', 'CarbonNeutral', 'Bestseller'],
    basePriceCents: 1799,
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    secondaryImageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    variants: [
      {
        id: 'nw-mineral-700',
        name: '700 ml larder',
        volumeMl: 700,
        priceCents: 1599,
        inStock: true,
      },
      {
        id: 'nw-mineral-1000',
        name: '1 L pantry',
        volumeMl: 1000,
        priceCents: 1799,
        inStock: true,
      },
      {
        id: 'nw-mineral-1500',
        name: '1.5 L service',
        volumeMl: 1500,
        priceCents: 2199,
        inStock: true,
      },
    ],
  },
  {
    id: 'nw-flavored-citrus-mint',
    name: 'Garden Citrus + Mint',
    slug: 'garden-citrus-mint',
    description:
      'Zero-sugar, softly flavored water built from real citrus peels and bruised garden mint. A restrained, perfume-like profile that keeps the palate clear while feeling quietly indulgent.',
    category: 'Flavored',
    tags: ['BPA-Free', 'Recycled', 'CarbonNeutral', 'New'],
    basePriceCents: 1299,
    imageUrl:
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    secondaryImageUrl:
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    variants: [
      {
        id: 'nw-flavor-355',
        name: '355 ml on-the-go',
        volumeMl: 355,
        priceCents: 1199,
        inStock: true,
      },
      {
        id: 'nw-flavor-500',
        name: '500 ml desk companion',
        volumeMl: 500,
        priceCents: 1299,
        inStock: true,
      },
    ],
  },
  {
    id: 'nw-limited-nightglass',
    name: 'Nightglass Studio Edition',
    slug: 'nightglass-studio-edition',
    description:
      'A limited studio run inspired by late-night edit sessions and dimly lit listening rooms. Satin-matte black glass with a soft-touch label canvas ready for bold wordmarks and venue identities.',
    category: 'Limited',
    tags: ['Glass', 'LimitedRun', 'CarbonNeutral', 'Bestseller'],
    basePriceCents: 2499,
    imageUrl:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    secondaryImageUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    variants: [
      {
        id: 'nw-night-500',
        name: '500 ml studio',
        volumeMl: 500,
        priceCents: 2299,
        inStock: true,
      },
      {
        id: 'nw-night-750',
        name: '750 ml showcase',
        volumeMl: 750,
        priceCents: 2499,
        inStock: true,
      },
    ],
  },
  {
    id: 'nw-bundle-service-six',
    name: 'Service Six Bundle',
    slug: 'service-six-bundle',
    description:
      'A curated six-pack bundle tuned for intimate services, chef’s counters, and design-forward apartments. Mix still and sparkling formats under one cohesive label system.',
    category: 'Bundle',
    tags: ['Glass', 'Aluminum', 'Recycled', 'Bestseller'],
    basePriceCents: 6999,
    imageUrl:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    secondaryImageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
    isFeatured: false,
    variants: [
      {
        id: 'nw-bundle-mixed',
        name: 'Mixed still + sparkling',
        volumeMl: 750,
        priceCents: 6999,
        inStock: true,
      },
      {
        id: 'nw-bundle-still',
        name: 'All still configuration',
        volumeMl: 750,
        priceCents: 6799,
        inStock: true,
      },
      {
        id: 'nw-bundle-sparkling',
        name: 'All sparkling configuration',
        volumeMl: 750,
        priceCents: 7199,
        inStock: false,
      },
    ],
  },
];

export const categories: Category[] = [
  'Still',
  'Sparkling',
  'Mineral',
  'Flavored',
  'Limited',
  'Bundle',
];

export const searchSuggestions: SearchSuggestion[] = [
  {
    id: 'sug-still-glass',
    label: 'Still glass bottles for dining tables',
    query: 'still glass',
    category: 'Still',
    tags: ['Glass', 'BPA-Free'],
  },
  {
    id: 'sug-sparkling-events',
    label: 'Sparkling cans for events',
    query: 'sparkling aluminum',
    category: 'Sparkling',
    tags: ['Aluminum', 'Recycled'],
  },
  {
    id: 'sug-limited-studio',
    label: 'Limited studio editions',
    query: 'nightglass studio',
    category: 'Limited',
    tags: ['LimitedRun', 'CarbonNeutral'],
  },
  {
    id: 'sug-bundles-service',
    label: 'Service bundles for restaurants',
    query: 'service bundle',
    category: 'Bundle',
    tags: ['Glass', 'Bestseller'],
  },
];

export const aboutBody: AboutSectionBlock[] = [
  {
    id: 'about-origins',
    heading: 'Water, edited for the moment',
    body:
      'Nishant Waters was born from a simple studio question: what if the bottle on the table felt as considered as the playlist, the ceramics, and the light? Each format in our collection is tuned to context — from quiet desks to crowded service — with a shared language of restrained forms and tactile materials.',
  },
  {
    id: 'about-materials',
    heading: 'Material calm, circular thinking',
    body:
      'We work primarily with glass and high-recycled aluminum, always BPA-free and designed to cycle back into use. Labels are printed on low-impact stocks that hold ink beautifully while remaining easy to remove in refill programs and closed-loop hospitality systems.',
  },
  {
    id: 'about-custom',
    heading: 'Custom labels as living typography',
    body:
      'Your label is a living surface — for a wordmark, a fragment of a poem, a room name, a date. Our editor keeps the tools minimal so your typography and color choices feel deliberate, not decorative. Every order is printed on-demand, minimizing surplus and maximizing relevance.',
  },
  {
    id: 'about-practice',
    heading: 'A practice, not a product line',
    body:
      'Nishant Waters operates more like a studio than a factory. We prototype with chefs, florists, gallerists, and friends, letting real tables and real evenings shape what stays in our catalog. Limited runs appear, evolve, and occasionally retire — making room for what the next season asks for.',
  },
];

export const mockData = {
  products,
  categories,
  searchSuggestions,
  aboutBody,
};

export default mockData;