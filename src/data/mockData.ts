import {
  type Product,
  type ProductCategory,
  type BottleSizeMl,
  type BottleFinish,
  type ProductVariant,
  type ProductImage,
  type ProductFilters,
  type SortOption,
  type ID,
} from '@/types';

export const productCategories: ProductCategory[] = [
  'Still',
  'Sparkling',
  'Mineral',
  'Infused',
  'Limited',
  'Gift',
];

export const bottleSizes: BottleSizeMl[] = [250, 500, 750, 1000];

export const bottleFinishes: BottleFinish[] = ['Matte', 'Gloss', 'Frosted'];

const createImages = (urls: string[], baseAlt: string): ProductImage[] =>
  urls.map((url, index) => ({
    url,
    alt: `${baseAlt} ${index + 1}`,
    priority: index === 0,
  }));

const createVariants = (
  baseId: string,
  basePrice: number,
  finishes: BottleFinish[],
): ProductVariant[] => {
  const sizes: BottleSizeMl[] = [250, 500, 750];
  return sizes.flatMap((size, sizeIndex) =>
    finishes.map((finish, finishIndex) => {
      const id = `${baseId}-${size}-${finish}`;
      const stock = 8 + sizeIndex * 4 + finishIndex * 2;
      const priceMultiplier = size / 500;
      const finishPremium = finish === 'Frosted' ? 1.2 : finish === 'Matte' ? 1.1 : 1;
      const price = Math.round(basePrice * priceMultiplier * finishPremium);
      const compareAtPrice =
        sizeIndex === 2 && finish !== 'Gloss'
          ? Math.round(price * 1.15)
          : undefined;
      return {
        id,
        sizeMl: size,
        finish,
        stock,
        price,
        compareAtPrice,
      };
    }),
  );
};

export const products: Product[] = [
  {
    id: 'p-nishant-still-signature',
    slug: 'still-signature',
    name: 'Nishant Still — Signature Table Water',
    tagline: 'Calm, architectural hydration for the linen-clad table.',
    category: 'Still',
    description:
      'A quietly confident still water curated for slow dinners and gallery openings. Micro-filtered with a soft mineral profile that flatters nuanced cuisine and natural wines, bottled in a tall ivory silhouette ready for custom debossed labeling.',
    images: createImages(
      [
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
      ],
      'Nishant Still Signature bottle',
    ),
    variants: createVariants('p-nishant-still-signature', 420, ['Matte', 'Gloss']),
    defaultVariantId: 'p-nishant-still-signature-500-Matte',
    meta: {
      hydrationProfile: 'Balanced',
      ph: 7.4,
      tdsPpm: 95,
      originRegion: 'Lower Himalayan Springs, India',
    },
    isFeatured: true,
  },
  {
    id: 'p-nishant-sparkling-salon',
    slug: 'sparkling-salon',
    name: 'Nishant Sparkling — Salon Edition',
    tagline: 'Needle-fine bubbles for salons, showrooms, and soft launches.',
    category: 'Sparkling',
    description:
      'A precision-carbonated sparkling water with a featherlight mousse and restrained minerality. Designed to sit comfortably beside flutes and coupe glasses, with label zones optimized for launch dates, monograms, or gallery marks.',
    images: createImages(
      [
        'https://images.unsplash.com/photo-1781859240244-61e274c2bf39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bW9kZXJuJTIwYXJ0aXNhbiUyMHBhY2thZ2luZyUyMHN0dWRpbyUyMG5ldXRyYWwlMjB0b25lc3xlbnwwfDB8fHwxNzkyMDEzMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1653164514614-172c46a30984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTIwYXJ0aXNhbiUyMHBhY2thZ2luZyUyMHN0dWRpbyUyMG5ldXRyYWwlMjB0b25lc3xlbnwwfDB8fHwxNzkyMDEzMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      ],
      'Nishant Sparkling Salon Edition bottle',
    ),
    variants: createVariants('p-nishant-sparkling-salon', 520, ['Matte', 'Frosted']),
    defaultVariantId: 'p-nishant-sparkling-salon-500-Frosted',
    meta: {
      hydrationProfile: 'Light',
      ph: 7.2,
      tdsPpm: 80,
      originRegion: 'Dolomite Limestone Belt, Europe',
    },
    isFeatured: true,
  },
  {
    id: 'p-nishant-mineral-reserve',
    slug: 'mineral-reserve',
    name: 'Nishant Mineral — Reserve Cut',
    tagline: 'Structured, mineral-rich water for aged spirits and cigars.',
    category: 'Mineral',
    description:
      'Layered minerality with a deliberate, lingering finish. The Reserve Cut is crafted for pairings with aged spirits, artisan chocolates, and cigar lounges, arriving in a dark glass vessel with elongated shoulders and precise typographic grids.',
    images: createImages(
      [
        'https://images.unsplash.com/photo-1680627732679-4e71391ee836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8ZWRpdG9yaWFsJTIwbGlmZXN0eWxlJTIwaHlkcmF0aW9uJTIwcGhvdG9ncmFwaHklMjBzb2Z0JTIwbGlnaHR8ZW58MHwwfHx8MTc5MjAxMzE3N3ww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
      ],
      'Nishant Mineral Reserve Cut bottle',
    ),
    variants: createVariants('p-nishant-mineral-reserve', 640, ['Matte', 'Gloss']),
    defaultVariantId: 'p-nishant-mineral-reserve-750-Matte',
    meta: {
      hydrationProfile: 'Mineral-Rich',
      ph: 7.8,
      tdsPpm: 220,
      originRegion: 'Ancient Basalt Aquifers, Europe',
    },
    isFeatured: true,
  },
  {
    id: 'p-nishant-infused-citrus-herb',
    slug: 'infused-citrus-herb',
    name: 'Infused Citrus & Wild Herb',
    tagline: 'Softly aromatic with sunlit citrus top notes.',
    category: 'Infused',
    description:
      'An infused still water with restrained notes of Amalfi citrus peel, wild thyme, and verbena. Built for bridal brunches, resort turndown service, and studio tastings where fragrance should linger but never shout.',
    images: createImages(
      [
        'https://images.unsplash.com/photo-1540322112357-ebf4f8bfa63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMzE3NXww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
      ],
      'Nishant Infused Citrus & Wild Herb bottle',
    ),
    variants: createVariants('p-nishant-infused-citrus-herb', 560, ['Gloss', 'Frosted']),
    defaultVariantId: 'p-nishant-infused-citrus-herb-500-Frosted',
    meta: {
      hydrationProfile: 'Light',
      ph: 7.1,
      tdsPpm: 70,
      originRegion: 'Mediterranean Coastal Springs',
    },
    isLimited: true,
  },
  {
    id: 'p-nishant-limited-midnight-edition',
    slug: 'limited-midnight-edition',
    name: 'Midnight Atelier Edition',
    tagline: 'A moody, gallery-night bottle with deep ink foil.',
    category: 'Limited',
    description:
      'Produced in a numbered, small-batch run for openings and one-night-only installations. The Midnight Atelier Edition leans into a darker, cinematic profile with frosted obsidian glass and a tall, uninterrupted label canvas.',
    images: createImages(
      [
        'https://images.unsplash.com/photo-1540322112357-ebf4f8bfa63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMzE3NXww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1781859240244-61e274c2bf39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8bW9kZXJuJTIwYXJ0aXNhbiUyMHBhY2thZ2luZyUyMHN0dWRpbyUyMG5ldXRyYWwlMjB0b25lc3xlbnwwfDB8fHwxNzkyMDEzMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      ],
      'Nishant Midnight Atelier Edition bottle',
    ),
    variants: createVariants('p-nishant-limited-midnight-edition', 880, ['Frosted']),
    defaultVariantId: 'p-nishant-limited-midnight-edition-750-Frosted',
    meta: {
      hydrationProfile: 'Balanced',
      ph: 7.3,
      tdsPpm: 110,
      originRegion: 'Nordic Glacial Melt, Europe',
    },
    isFeatured: true,
    isLimited: true,
  },
  {
    id: 'p-nishant-gift-suite',
    slug: 'gift-suite',
    name: 'Editorial Suite Gift Set',
    tagline: 'A composed trio for hotel suites and welcome rituals.',
    category: 'Gift',
    description:
      'A curated three-bottle suite pairing still, sparkling, and infused profiles in a rigid archival box. Perfect for hosts, collaborators, or VIP rooms, with coordinated label frameworks and a shared typographic spine.',
    images: createImages(
      [
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
        'https://images.unsplash.com/photo-1681250648992-c86e1853db20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8ZWRpdG9yaWFsJTIwbGlmZXN0eWxlJTIwaHlkcmF0aW9uJTIwcGhvdG9ncmFwaHklMjBzb2Z0JTIwbGlnaHR8ZW58MHwwfHx8MTc5MjAxMzE3N3ww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1653164514614-172c46a30984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTIwYXJ0aXNhbiUyMHBhY2thZ2luZyUyMHN0dWRpbyUyMG5ldXRyYWwlMjB0b25lc3xlbnwwfDB8fHwxNzkyMDEzMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop',
      ],
      'Nishant Editorial Suite Gift Set',
    ),
    variants: createVariants('p-nishant-gift-suite', 1600, ['Matte', 'Frosted']),
    defaultVariantId: 'p-nishant-gift-suite-500-Matte',
    meta: {
      hydrationProfile: 'Balanced',
      ph: 7.4,
      tdsPpm: 120,
      originRegion: 'Curated Multi-Source Blend',
    },
    isFeatured: false,
  },
];

export const featuredProducts: Product[] = products.filter(p => p.isFeatured ?? false);

export const getProductById = (id: ID): Product | undefined =>
  products.find(p => p.id === id);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug);

export const filterAndSortProducts = (filters: ProductFilters = {}): Product[] => {
  const { searchQuery, categories, sizes, finishes, priceRange, sortBy } = filters;
  let result = [...products];

  if (searchQuery && searchQuery.trim().length > 0) {
    const query = searchQuery.trim().toLowerCase();
    result = result.filter(p => {
      const inName = p.name.toLowerCase().includes(query);
      const inTagline = (p.tagline ?? '').toLowerCase().includes(query);
      const inDescription = p.description.toLowerCase().includes(query);
      return inName || inTagline || inDescription;
    });
  }

  if (categories && categories.length > 0) {
    const set = new Set(categories);
    result = result.filter(p => set.has(p.category));
  }

  if ((sizes && sizes.length > 0) || (finishes && finishes.length > 0) || priceRange) {
    result = result.filter(p => {
      const v = p.variants ?? [];
      if (v.length === 0) return false;
      const matchesVariant = v.some(variant => {
        const sizeOk =
          !sizes || sizes.length === 0 || sizes.includes(variant.sizeMl as BottleSizeMl);
        const finishOk =
          !finishes ||
          finishes.length === 0 ||
          finishes.includes(variant.finish as BottleFinish);
        const priceOk =
          !priceRange ||
          ((!priceRange.min || variant.price >= priceRange.min) &&
            (!priceRange.max || variant.price <= priceRange.max));
        return sizeOk && finishOk && priceOk;
      });
      return matchesVariant;
    });
  }

  const sort: SortOption = sortBy ?? 'featured';

  if (sort === 'featured') {
    result.sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  } else if (sort === 'name-asc' || sort === 'name-desc') {
    result.sort((a, b) => {
      const comp = a.name.localeCompare(b.name);
      return sort === 'name-asc' ? comp : -comp;
    });
  } else if (sort === 'price-asc' || sort === 'price-desc') {
    result.sort((a, b) => {
      const aPrice =
        a.variants?.find(v => v.id === a.defaultVariantId)?.price ??
        a.variants?.[0]?.price ??
        0;
      const bPrice =
        b.variants?.find(v => v.id === b.defaultVariantId)?.price ??
        b.variants?.[0]?.price ??
        0;
      return sort === 'price-asc' ? aPrice - bPrice : bPrice - aPrice;
    });
  }

  return result;
};

export const mockData = {
  products,
  featuredProducts,
  productCategories,
  bottleSizes,
  bottleFinishes,
  getProductById,
  getProductBySlug,
  filterAndSortProducts,
};

export default mockData;
export const categories = (mockData as any)?.categories ?? [];
