import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FeaturedProductsGrid } from '@/components/ProductBits';
import { MotionButton, Section } from '@/components/ui';
import { getFeaturedProducts } from '@/mock';

const HeroBanner: React.FC = () => {
  return (
    <Section className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-[#FAF9F6] via-[#D9CBB6]/70 to-[#FAF9F6] px-6 py-10 md:px-12 md:py-16">
      <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex rounded-full bg-[#0E4D5B]/5 px-4 py-1 text-xs font-['Merriweather'] uppercase tracking-[0.25em] text-[#0E4D5B]"
          >
            Nishant Waters • custom labeled bottles
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl text-4xl font-semibold font-['Poppins'] leading-tight text-[#0E4D5B] md:text-5xl"
          >
            Hydration that carries
            <span className="text-[#FF6F61]"> your story</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-lg text-sm font-['Merriweather'] text-slate-700 md:text-base"
          >
            Design premium bottles that feel like keepsakes — from color and typography to your own logo.
            Perfect for weddings, events, and everyday rituals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/shop">
              <MotionButton
                className="rounded-full bg-[#FF6F61] px-8 py-3 text-sm font-semibold font-['Poppins'] text-[#FAF9F6] shadow-lg hover:bg-[#e76356]"
              >
                Start designing
              </MotionButton>
            </Link>
            <span className="text-xs font-['Merriweather'] text-slate-600">
              No accounts. No hassle. Just beautifully custom bottles in minutes.
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
          className="relative flex justify-center md:justify-end"
        >
          <div className="relative h-64 w-56 rotate-[-4deg] rounded-[2rem] bg-[#0E4D5B]/90 p-4 shadow-2xl md:h-80 md:w-64">
            <div className="flex h-full items-end justify-center rounded-2xl bg-gradient-to-t from-black/40 via-[#0E4D5B]/40 to-transparent">
              <img
                src="https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Custom water bottle"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
            <div className="pointer-events-none absolute -left-10 -top-8 h-28 w-28 rounded-full bg-[#FF6F61]/80 blur-2xl" />
            <div className="pointer-events-none absolute -right-6 bottom-6 h-24 w-24 rounded-full bg-[#7A9E7E]/70 blur-2xl" />
            <div className="absolute -right-10 top-6 w-32 rounded-2xl bg-[#FAF9F6] p-3 shadow-xl">
              <p className="text-[0.65rem] font-['Merriweather'] text-slate-700">
                Upload your logo, pick a mood, and see it live on our 3D bottle preview.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export const HomePage: React.FC = () => {
  const featured = getFeaturedProducts();

  return (
    <main className="space-y-12 pb-16 pt-6 md:space-y-16 md:pt-10">
      <HeroBanner />
      <Section className="space-y-10 rounded-[2.5rem] bg-[#FAF9F6] px-4 py-8 md:px-8 md:py-10">
        <FeaturedProductsGrid products={featured} />
      </Section>
    </main>
  );
};

export default HomePage;