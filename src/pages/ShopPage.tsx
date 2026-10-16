import React from 'react';
import { Section, H1 } from '@/components/ui';
import { ProductMasonryGrid } from '@/components/ProductBits';
import { getAllProducts } from '@/mock';

export const ShopPage: React.FC = () => {
  const products = getAllProducts();

  return (
    <main className="pb-16 pt-6 md:pt-10">
      <Section className="space-y-8 rounded-[2.5rem] bg-[#FAF9F6] px-4 py-8 md:px-8 md:py-10">
        <header className="space-y-3">
          <H1 className="text-[#0E4D5B]">Shop custom bottles</H1>
          <p className="max-w-xl text-sm font-['Merriweather'] text-slate-700">
            Every bottle is a canvas. Choose your base silhouette, then add your label, typography, and
            logo. Perfect for events, gifting, or elevating your daily ritual.
          </p>
        </header>
        <ProductMasonryGrid products={products} />
      </Section>
    </main>
  );
};

export default ShopPage;