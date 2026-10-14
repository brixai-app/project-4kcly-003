import type { Product } from '@/types';

export const heroImages = {
  primary:
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  studio:
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
  tablescape:
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
};

export const editorialImages = {
  craftDetail:
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  workspace:
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  materials:
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  lifestyle:
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  stack:
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
};

export const productImages = {
  coastalMineral:
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
  nightEdition:
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
  atelierGlass:
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  desertSpring:
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  studioStack:
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
};

export const products: Product[] = [
  {
    id: 'coastal-mineral-750',
    name: 'Coastal Mineral 750',
    slug: 'coastal-mineral-750',
    description:
      'Hand-finished 750ml glass bottle with soft-matte sand label and ocean-mineral still water. Designed for tablescapes and studio bars.',
    price: 1499,
    volumeMl: 750,
    imageUrl: productImages.coastalMineral,
    accentColor: '#004e89',
    tags: ['still', 'glass', 'matte label', 'dinner table'],
    featured: true,
  },
  {
    id: 'midnight-studio-500',
    name: 'Midnight Studio 500',
    slug: 'midnight-studio-500',
    description:
      'Smoky midnight bottle with ink-black label and crisp sparkling profile, sized for playlists, city balconies, and late edits.',
    price: 1699,
    volumeMl: 500,
    imageUrl: productImages.nightEdition,
    accentColor: '#0b1f2a',
    tags: ['sparkling', 'limited', 'night', 'studio'],
    featured: true,
  },
  {
    id: 'atelier-glass-1000',
    name: 'Atelier Glass 1L',
    slug: 'atelier-glass-1000',
    description:
      'Tall 1L showpiece bottle with translucent ivory wrap, built for coffee bars, design studios, and generous pours.',
    price: 1899,
    volumeMl: 1000,
    imageUrl: productImages.atelierGlass,
    accentColor: '#b87b4b',
    tags: ['still', 'tall', 'atelier', 'reuse'],
  },
  {
    id: 'desert-spring-330',
    name: 'Desert Spring 330',
    slug: 'desert-spring-330',
    description:
      'Compact 330ml bottle with dune-toned label and mineral-bright still water, ideal for welcome trays and turn-down rituals.',
    price: 999,
    volumeMl: 330,
    imageUrl: productImages.desertSpring,
    accentColor: '#c08b5a',
    tags: ['still', 'mini', 'amenity'],
  },
  {
    id: 'stacked-studio-pack',
    name: 'Stacked Studio Pack (Set of 4)',
    slug: 'stacked-studio-pack',
    description:
      'Curated set of four custom-labeled bottles for shoots, launch dinners, and gifting. Mixed volumes with coordinated palettes.',
    price: 5699,
    volumeMl: 4 * 500,
    imageUrl: productImages.studioStack,
    accentColor: '#2d5a72',
    tags: ['set', 'gifting', 'editorial', 'mixed'],
    featured: true,
  },
];

export const collectionTags = [
  'still',
  'sparkling',
  'glass',
  'matte label',
  'night',
  'atelier',
  'amenity',
  'set',
];

const mockData = {
  heroImages,
  editorialImages,
  productImages,
  products,
  collectionTags,
};

export default mockData;
export { mockData };
