import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

export function Home() {
  const featured = products?.filter((p) => p?.isFeatured)?.slice(0, 4) ?? [];
  const shopAll = products?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen bg-[#0b1411] text-[#ecfdf5]">
      <div className="relative">
        <div className="relative h-[80vh] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
            crossOrigin="anonymous"
            alt="Editorial water lookbook"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b1411] via-[#0b1411]/70 to-transparent" />
          <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#10b981]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#10b981]/20 blur-3xl" />
          <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="max-w-xl space-y-6"
            >
              <p className="text-xs font-semibold tracking-[0.25em] text-[#a7d7c4] uppercase">
                NISHANT WATERS
              </p>
              <h1 className="font-['Playfair_Display'] text-6xl md:text-7xl leading-tight tracking-tight">
                Water, written
                <br />
                in your language.
              </h1>
              <p className="max-w-md text-sm md:text-base text-[#a7d7c4] font-['Plus_Jakarta_Sans']">
                Eco-forward, custom-labeled bottles crafted for studios, galleries, and gatherings
                that care about every detail.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-md bg-[#10b981] px-6 py-3 text-sm font-semibold tracking-[0.2em] text-black uppercase hover:bg-[#0ea371] transition-colors"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/shop?category=Limited"
                  className="text-xs font-semibold tracking-[0.2em] text-[#a7d7c4] uppercase hover:text-[#ecfdf5] transition-colors"
                >
                  Limited mineral edits
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <section className="mx-auto -mt-12 max-w-6xl space-y-12 px-6 pb-20">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Circular by design',
                body: 'Aluminum and glass-first silhouettes, refillable and infinitely recyclable.',
              },
              {
                title: 'Custom label atelier',
                body: 'Typeface-perfect labels tuned to your event, gallery, or studio identity.',
              },
              {
                title: 'Carbon-neutral delivery',
                body: 'Chilled, on-time drops with emissions balanced on every order.',
              },
            ].map((item) => (
              <div
                key={item?.title ?? ''}
                className="rounded-2xl bg-[#14241e] border border-[#244337] px-5 py-6"
              >
                <p className="text-[10px] font-semibold tracking-[0.25em] text-[#a7d7c4] uppercase mb-3">
                  {item?.title ?? ''}
                </p>
                <p className="text-sm text-[#ecfdf5]/90 font-['Plus_Jakarta_Sans']">
                  {item?.body ?? ''}
                </p>
              </div>
            ))}
          </div>

          <section className="grid gap-6 md:grid-cols-[1.3fr,1fr] items-stretch">
            <div className="rounded-2xl bg-[#14241e] border border-[#244337] p-5 flex flex-col">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-['Playfair_Display'] text-2xl tracking-tight">
                  Featured vessels
                </h2>
                <span className="text-[10px] tracking-[0.25em] text-[#a7d7c4] uppercase">
                  CURATED DROP
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {featured?.map((product) => (
                  <ProductCard
                    key={product?.id ?? ''}
                    product={product}
                    showQuickAdd
                    className="h-full"
                  />
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-[#14241e] border border-[#244337]">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85"
                crossOrigin="anonymous"
                alt="Mineral water still life"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1411] via-[#0b1411]/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-2">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-[#a7d7c4] uppercase">
                  STUDIO SERVICE
                </p>
                <p className="font-['Playfair_Display'] text-xl">
                  Palette-matched labels for openings and residencies.
                </p>
                <p className="text-xs text-[#a7d7c4]">
                  Submit your brand assets at checkout and our team will tune the label for print.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-['Playfair_Display'] text-2xl tracking-tight">
                  Shop the selection
                </h2>
                <p className="text-xs text-[#a7d7c4]">
                  Still, sparkling, and flavored edits ready for your next gathering.
                </p>
              </div>
              <Link
                to="/shop"
                className="text-[10px] font-semibold tracking-[0.25em] text-[#a7d7c4] uppercase hover:text-[#ecfdf5] transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shopAll?.map((product) => (
                <ProductCard
                  key={product?.id ?? ''}
                  product={product}
                  showQuickAdd
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#244337] bg-[#14241e] px-5 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 rounded-md bg-[#10b981] text-black flex items-center justify-center text-xs font-semibold">
                NW
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#a7d7c4]">
                  ANNOUNCEMENT
                </p>
                <p className="text-sm">
                  Complimentary label proofs on all orders above ₹12,000. Free chilled delivery at
                  ₹18,000.
                </p>
              </div>
            </div>
            <Link
              to="/shop?category=Bundle"
              className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#ecfdf5] hover:text-[#10b981] transition-colors"
            >
              Browse service bundles
            </Link>
          </section>
        </section>
      </div>
    </div>
  );
}

export default Home;