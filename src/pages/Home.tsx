import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { featuredProducts } from '@/data/mockData';
import ProductCard, { ProductCardProps } from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Product } from '@/types';

export interface HomeProps {
  className?: string;
}

export function Home({ className = '' }: HomeProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | undefined>(undefined);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView: ProductCardProps['onQuickView'] = product => {
    if (!product) return;
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const heroImage =
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85';

  const editorialImage =
    'https://images.unsplash.com/photo-1704489736974-dac457af4d7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8ZmluZSUyMGRpbmluZyUyMGNyeXN0YWwlMjBjYXJhZmUlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MHwwfHx8MTc5MjAxMzE3NXww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

  const manifestoImage =
    'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80';

  const onCloseQuickView = (open: boolean) => {
    setIsQuickViewOpen(open);
    if (!open) setQuickViewProduct(undefined);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <main
        className={`min-h-screen bg-[#F9F6F2] text-[#1F1F1F] pb-20 ${className}`}
      >
        <section className="w-full">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-stretch min-h-[70vh] lg:min-h-[80vh]">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="flex flex-col justify-between py-4 lg:py-10"
              >
                <div className="space-y-8">
                  <span className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#5F5A55]">
                    <span className="h-px w-8 bg-[#C8B8A2]" />
                    Nishant Waters • Custom-Labeled Hydration
                  </span>
                  <h1
                    className="font-[Playfair Display] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight"
                  >
                    Water,
                    <br />
                    dressed in your
                    <span className="block lg:inline font-light"> signature.</span>
                  </h1>
                  <p className="max-w-xl text-sm sm:text-base text-[#5F5A55] font-[Lora]">
                    A couture bottling house for brands, weddings, and homes that
                    obsess over detail. Select the mineral story, glass finish, and
                    label typography—every bottle becomes a tactile memento.
                  </p>
                </div>
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-3 border border-[#0B3D91] bg-[#0B3D91] text-white px-8 py-3 rounded-md text-xs tracking-[0.22em] uppercase"
                  >
                    Explore collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-[#5F5A55] font-[Lora]">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-8 w-8 rounded-full border border-[#E7E1D8] flex items-center justify-center text-[10px]">
                        01
                      </span>
                      Tailored mineral profiles
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1 w-8 bg-[#C8B8A2]" />
                      Hand-finished Italian glass
                    </span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className="relative rounded-3xl overflow-hidden bg-[#EFE6DA]"
              >
                <img
                  src={heroImage}
                  alt="Editorial still life of custom labeled water bottles"
                  crossOrigin="anonymous"
                  className="absolute inset-0 h-full w-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F9F6F2] via-transparent to-transparent opacity-70" />
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                  <div className="flex justify-between items-end gap-6">
                    <div>
                      <p className="text-xs tracking-[0.25em] uppercase text-[#F3ECE2]">
                        Atelier Series
                      </p>
                      <p className="mt-2 text-sm sm:text-base text-[#FDFBF8] font-[Lora] max-w-xs">
                        Limited-batch labels hand-aligned on small runs, reserved
                        for launch moments and slow dinners.
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-[11px] tracking-[0.24em] uppercase text-[#F3ECE2]">
                        Tonight&apos;s Pour
                      </p>
                      <p className="text-xs text-[#FDFBF8]">
                        Himalayan still • Frosted 750ml
                        <br />
                        Table of 40 • Private residence
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mt-20 lg:mt-24 w-full">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#5F5A55]">
                  Trending drops
                </p>
                <h2 className="mt-2 font-[Playfair Display] text-2xl sm:text-3xl tracking-tight">
                  Bottles guests reach for twice
                </h2>
              </div>
              <Link
                to="/shop"
                className="hidden sm:inline-flex text-xs tracking-[0.22em] uppercase border-b border-[#0B3D91] pb-1 text-[#0B3D91]"
              >
                View all
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                  className="bg-[#FDFBF8]"
                />
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mt-24 lg:mt-28 w-full">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col justify-between border border-[#E7E1D8] rounded-3xl bg-[#FEFBF6] p-7 sm:p-8 lg:p-10"
            >
              <div className="space-y-6">
                <p className="text-xs tracking-[0.2em] uppercase text-[#5F5A55]">
                  Curated for the table
                </p>
                <h2 className="font-[Playfair Display] text-2xl sm:text-3xl tracking-tight">
                  Still, sparkling, infused—
                  <span className="block font-light">your way of pouring.</span>
                </h2>
                <p className="text-sm text-[#5F5A55] font-[Lora]">
                  From mineral-rich stills for clean pairings to citrus-infused
                  sparkle for night service, each profile is tuned to the mood of
                  the room. Choose the canvas, then author the label.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-[Lora]">
                  <div className="border border-[#E7E1D8] rounded-2xl p-4">
                    <p className="tracking-[0.2em] uppercase text-[11px] text-[#5F5A55]">
                      For celebrations
                    </p>
                    <p className="mt-2 text-sm">
                      Sparkling & Limited runs
                      <br />
                      Gold-foiled labels
                    </p>
                  </div>
                  <div className="border border-[#E7E1D8] rounded-2xl p-4">
                    <p className="tracking-[0.2em] uppercase text-[11px] text-[#5F5A55]">
                      For everyday rituals
                    </p>
                    <p className="mt-2 text-sm">
                      Still & Mineral profiles
                      <br />
                      Soft matte finishes
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 self-start text-xs tracking-[0.22em] uppercase border-b border-[#0B3D91] pb-1 text-[#0B3D91]"
              >
                Browse by mood
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 relative rounded-3xl overflow-hidden"
            >
              <img
                src={editorialImage}
                alt="Editorial table setting with custom labeled water bottles"
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        <section className="mt-24 lg:mt-28 w-full bg-[#F1E8DC]">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7"
            >
              <p className="text-xs tracking-[0.25em] uppercase text-[#5F5A55] mb-3">
                The Nishant Waters manifesto
              </p>
              <h2 className="font-[Playfair Display] text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-4">
                We design bottles to disappear
                <span className="block font-light">
                  and then be remembered.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#5F5A55] font-[Lora] max-w-2xl">
                Labels that whisper, glass that feels inevitable in the hand, and
                typography that nods to your story instead of ours. Every decision
                is in service of how it feels when a guest reaches for the bottle,
                pours, and pauses to read the label.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col gap-5"
            >
              <div className="rounded-3xl overflow-hidden h-40 sm:h-48 bg-[#E7DFD3]">
                <img
                  src={manifestoImage}
                  alt="Soft light on glass bottles and linen"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs font-[Lora]">
                <div>
                  <p className="tracking-[0.25em] uppercase text-[11px] text-[#5F5A55]">
                    72-hour
                  </p>
                  <p className="mt-1">Label proofing window for every custom run.</p>
                </div>
                <div>
                  <p className="tracking-[0.25em] uppercase text-[11px] text-[#5F5A55]">
                    4 finishes
                  </p>
                  <p className="mt-1">From soft matte to crystal frost glasswork.</p>
                </div>
                <div>
                  <p className="tracking-[0.25em] uppercase text-[11px] text-[#5F5A55]">
                    32 fonts
                  </p>
                  <p className="mt-1">Curated editorial typography pairings.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-20 lg:mt-24 w-full">
          <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-[#5F5A55]">
              Studio dispatches
            </p>
            <h2 className="mt-3 font-[Playfair Display] text-2xl sm:text-3xl tracking-tight">
              Receive the next limited Atelier label before it sells out.
            </h2>
            <p className="mt-3 text-sm text-[#5F5A55] font-[Lora]">
              One considered email when a new water story is bottled. No noise,
              just stillness.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                required
                placeholder="Your email for quiet news"
                className="w-full sm:w-72 px-4 py-3 rounded-md border border-[#E7E1D8] bg-[#FDFBF8] text-sm font-[Lora] outline-none focus:border-[#0B3D91]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#0B3D91] text-white text-xs tracking-[0.22em] uppercase"
              >
                Join list
              </button>
            </form>
          </div>
        </section>
      </main>
      <ProductDetailModal
        open={isQuickViewOpen}
        onOpenChange={onCloseQuickView}
        product={quickViewProduct}
      />
    </>
  );
}

export default Home;