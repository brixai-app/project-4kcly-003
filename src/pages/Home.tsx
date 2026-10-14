import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { products, homeEditorialCopy } from '@/data/mockData';
import type { Product } from '@/types';
import ProductDetailModal from '@/components/ProductDetailModal';

export function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const featured = products.slice(0, 3);
  const manifesto = homeEditorialCopy?.manifesto ?? '';
  const tagline = homeEditorialCopy?.tagline ?? 'Bespoke hydration, authored in glass.';

  const handleOpenProduct = (product: Product) => {
    setSelected(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#141310]">
      <main className="w-full">
        <section className="w-full border-b border-[#DED5C8]">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] lg:min-h-[90vh]">
            <motion.div
              className="flex flex-col justify-between px-6 md:px-12 py-12 lg:py-20 bg-[#F7F1E8]"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="max-w-xl space-y-8">
                <p className="text-xs tracking-[0.35em] uppercase text-[#5D584F]">
                  Nishant Waters
                </p>
                <h1 className="font-[Playfair] text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
                  Custom-labeled waters
                  <span className="block italic text-3xl md:text-4xl mt-3 text-[#0E4A3A]">
                    staged like couture.
                  </span>
                </h1>
                <p className="text-sm md:text-base text-[#5D584F] max-w-md">
                  {tagline}
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center gap-2 rounded-md bg-[#0E4A3A] px-6 py-3 text-xs font-semibold tracking-[0.22em] uppercase text-white hover:bg-[#0B3E31] transition-colors"
                  >
                    Explore collection
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/product/signature-edition')}
                    className="inline-flex items-center gap-2 rounded-md border border-[#DED5C8] px-6 py-3 text-xs font-semibold tracking-[0.22em] uppercase text-[#141310] hover:bg-white transition-colors"
                  >
                    Signature magnums
                  </button>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg text-xs text-[#5D584F]">
                <div>
                  <p className="font-semibold text-[#141310] tracking-[0.2em] uppercase text-[0.65rem]">
                    PHILOSOPHY
                  </p>
                  <p className="mt-2">
                    Mineral-rich still and sparkling waters framed in tailored glass silhouettes.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#141310] tracking-[0.2em] uppercase text-[0.65rem]">
                    EDITIONS
                  </p>
                  <p className="mt-2">Still, sparkling, infused, magnum and mini narratives.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#141310] tracking-[0.2em] uppercase text-[0.65rem]">
                    LEAD TIME
                  </p>
                  <p className="mt-2">Custom labels pressed, foiled and dispatched in 10–14 days.</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative bg-[#141310] overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1729303130444-686fbdaea1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8M3x8YXJjaGl0ZWN0dXJhbCUyMGRpbmluZyUyMHRhYmxlJTIwZ2xhc3N3YXJlJTIwc3RpbGwlMjBsaWZlJTIwbWluaW1hbHxlbnwwfDB8fHwxNzkyMDEwMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                  alt="Editorial bottle still life"
                  className="w-full h-full object-cover object-center scale-105"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#141310] via-transparent to-transparent opacity-80" />
              <div className="relative h-full flex flex-col justify-between p-6 md:p-10 lg:p-12 text-[#F7F1E8]">
                <div className="flex items-center gap-3 text-[0.65rem] tracking-[0.28em] uppercase">
                  <span className="h-px w-10 bg-[#F7F1E8]" />
                  Limited atelier run
                </div>
                <div className="space-y-4 max-w-md">
                  <p className="text-xs text-[#DED5C8]">
                    {homeEditorialCopy?.heroSubcopy ??
                      'Hand-finished labels, archival foils, and tailored silhouettes for galleries, ateliers, and tableaus.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full px-6 lg:px-12 py-14 lg:py-20">
          <div className="max-w-6xl mx-auto flex items-end justify-between mb-8">
            <div>
              <p className="text-[0.7rem] tracking-[0.28em] uppercase text-[#5D584F]">
                Current drop
              </p>
              <h2 className="mt-3 font-[Playfair] text-3xl md:text-4xl tracking-tight">
                Bottles staged like sculpture.
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#141310] hover:text-[#0E4A3A]"
            >
              View all pieces
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
            {featured[0] && (
              <motion.button
                type="button"
                onClick={() => handleOpenProduct(featured[0])}
                className="col-span-12 md:col-span-7 lg:col-span-8 group text-left"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                <div className="overflow-hidden rounded-[16px] bg-white">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={featured[0].heroImage.url}
                      alt={featured[0].heroImage.alt ?? featured[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-[#5D584F]">
                        {featured[0].meta?.collection ?? 'Signature'}
                      </p>
                      <p className="mt-1 font-[Playfair] text-lg">
                        {featured[0].name}
                      </p>
                    </div>
                    <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#0E4A3A]">
                      View piece
                    </span>
                  </div>
                </div>
              </motion.button>
            )}
            <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-6">
              {featured.slice(1, 3).map((product) => (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => handleOpenProduct(product)}
                  className="w-full group text-left"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                >
                  <div className="overflow-hidden rounded-[16px] bg-white flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.heroImage.url}
                        alt={product.heroImage.alt ?? product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5D584F]">
                        {product.meta?.collection ?? 'Edition'}
                      </p>
                      <p className="mt-1 font-[Playfair] text-base">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-y border-[#DED5C8] bg-[#F7F1E8]/60">
          <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-[0.7rem] tracking-[0.26em] uppercase text-[#5D584F]">
                Manifesto
              </p>
              <p className="mt-3 font-[Playfair] text-2xl md:text-3xl leading-snug tracking-tight">
                {manifesto ||
                  'Water is the quietest guest at the table. We dress it with the same attention as the rest of the room.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#5D584F]">
              <span className="px-3 py-2 rounded-md border border-[#DED5C8] bg-white">
                Still & sparkling narratives
              </span>
              <span className="px-3 py-2 rounded-md border border-[#DED5C8] bg-white">
                Archival foils & emboss
              </span>
              <span className="px-3 py-2 rounded-md border border-[#DED5C8] bg-white">
                Atelier-level proofing
              </span>
            </div>
          </div>
        </section>

        <section className="w-full px-6 lg:px-12 py-14 lg:py-18">
          <div className="max-w-4xl mx-auto rounded-[16px] border border-[#DED5C8] bg-white px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <p className="text-[0.7rem] tracking-[0.26em] uppercase text-[#5D584F]">
                Studio list
              </p>
              <h3 className="mt-3 font-[Playfair] text-2xl md:text-3xl tracking-tight">
                Receive new drops and private-label appointments.
              </h3>
              <p className="mt-3 text-sm text-[#5D584F]">
                A considered dispatch, a few times a season. No noise. Only bottles worth staging.
              </p>
            </div>
            <form
              className="w-full md:w-auto flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Studio or buyer email"
                className="w-full sm:w-64 rounded-md border border-[#DED5C8] bg-[#F7F1E8]/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0E4A3A]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-[#0E4A3A] px-5 py-2.5 text-xs font-semibold tracking-[0.22em] uppercase text-white hover:bg-[#0B3E31] transition-colors"
              >
                Join list
              </button>
            </form>
          </div>
        </section>
      </main>
      <ProductDetailModal
        product={selected}
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
          setModalOpen(open);
        }}
      />
    </div>
  );
}

export default Home;