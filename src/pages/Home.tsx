import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

export interface HomeProps {
  onSelectProduct?: (product: Product) => void;
}

export function Home({ onSelectProduct }: HomeProps) {
  const featured = products?.filter(p => p?.featured) ?? [];

  return (
    <div className="min-h-screen bg-[#f4e9dc] text-[#0b1f2a]">
      <main className="flex flex-col gap-20 pb-20">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
              crossOrigin="anonymous"
              alt="Editorial water bottles on a sculpted surface"
              className="h-full w-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f4e9dc]/95 via-[#f4e9dc]/80 to-transparent" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-24 lg:px-8 lg:py-28">
            <div className="max-w-xl">
              <motion.p
                className="inline-flex border border-[#e6d8c8] bg-[#fff7ee]/90 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-[#4b5a63]/80"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                NISHANT WATERS / CUSTOM LABELLED
              </motion.p>
              <motion.h1
                className="mt-6 font-[Sora] text-5xl leading-tight tracking-tight text-[#0b1f2a] sm:text-6xl"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Water that{" "}
                <span className="underline decoration-[#004e89] decoration-2 underline-offset-8">
                  remembers
                </span>{" "}
                your name.
              </motion.h1>
              <motion.p
                className="mt-6 max-w-lg font-[Lora] text-base leading-relaxed text-[#4b5a63]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Tactile glass, soft sand tones, and labels typed just for you.
                Designed for rooftops at dusk, boardrooms at dawn, and every
                ritual that deserves better than disposable plastic.
              </motion.p>
              <motion.div
                className="mt-10 flex items-center gap-6"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-[18px] bg-[#004e89] px-7 py-3 text-sm font-semibold tracking-[0.16em] text-white transition-colors hover:bg-[#003b67]"
                >
                  EXPLORE COLLECTION
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="hidden flex-col text-xs text-[#4b5a63] sm:flex">
                  <span className="font-semibold tracking-[0.18em]">
                    GLASS / REFILLABLE / PERSONAL
                  </span>
                  <span className="mt-1">
                    Free shipping on curated sets within India.
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="ml-auto flex max-w-md flex-col gap-4 rounded-[24px] bg-[#fff7ee]/95 p-5 shadow-[0_18px_60px_rgba(11,31,42,0.25)] backdrop-blur"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-[#4b5a63]">
                WATER, EDITED FOR YOU
              </p>
              <p className="font-[Lora] text-sm text-[#0b1f2a]">
                Choose label color, typography, and a line of text. We print on
                warm matte stock that wraps like a second skin.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#fff7ee]">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#4b5a63]">
                  CURATED DROP
                </p>
                <h2 className="mt-3 font-[Sora] text-2xl tracking-tight text-[#0b1f2a]">
                  Featured bottles for quiet, precise rituals.
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold tracking-[0.18em] text-[#004e89] hover:text-[#003b67]"
              >
                VIEW ALL
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(featured.length > 0 ? featured : products.slice(0, 3)).map(
                product => (
                  <ProductCard
                    key={product?.id}
                    product={product}
                    onCustomize={onSelectProduct}
                  />
                )
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#f4e9dc]">
          <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr]">
              <div className="rounded-[24px] border border-[#e6d8c8] bg-[#fff7ee] p-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#4b5a63]">
                  MANIFESTO
                </p>
                <h3 className="mt-4 font-[Sora] text-2xl tracking-tight text-[#0b1f2a]">
                  A bottle that feels like stationery.
                </h3>
                <p className="mt-4 font-[Lora] text-sm leading-relaxed text-[#4b5a63]">
                  Nishant Waters began as a note passed across a long table:
                  “what if water looked as considered as the agenda?” Today,
                  every bottle leaves our studio with the calm of good paper and
                  the weight of an intentional object.
                </p>
                <p className="mt-4 font-[Lora] text-sm leading-relaxed text-[#4b5a63]">
                  We work with warm-toned glass, low-gloss finishes, and
                  typography that whispers instead of shouts. No loud logos, no
                  disposable noise—just your name, your event, your moment.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-[18px] border border-[#e6d8c8] bg-[#fff7ee] px-5 py-4 text-xs text-[#4b5a63]">
                  Plastic-free glass vessels with replaceable custom labels.
                </div>
                <div className="rounded-[18px] border border-dashed border-[#e6d8c8] bg-[#f4e9dc] px-5 py-4 text-xs text-[#4b5a63]">
                  Printed in small batches in India. Ships with recycled pulp
                  cradles and zero-fuss unboxing.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fff7ee]">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#4b5a63]">
              STAY WITH THE CURRENT
            </p>
            <h3 className="mt-4 font-[Sora] text-2xl tracking-tight text-[#0b1f2a]">
              Notes on new drops, collaborations, and quiet gatherings.
            </h3>
            <p className="mt-4 font-[Lora] text-sm text-[#4b5a63]">
              We write infrequently and only when there is something to pour.
              No clutter, just considered announcements.
            </p>
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="h-11 flex-1 rounded-[14px] border border-[#e6d8c8] bg-white px-3 text-sm text-[#0b1f2a] placeholder:text-[#4b5a63]/60 focus:outline-none focus:ring-2 focus:ring-[#004e89]"
              />
              <button
                type="submit"
                className="h-11 rounded-[14px] bg-[#004e89] px-5 text-xs font-semibold tracking-[0.18em] text-white hover:bg-[#003b67]"
              >
                JOIN
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;