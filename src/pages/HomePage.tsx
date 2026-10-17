import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Droplet, Sparkles } from "lucide-react";

import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/shadcn";
import { BRANDY_PALETTE, useProducts } from "@/mock";
import ReviewSection from "@/components/ReviewSection";

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerParent = {
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const HomePage: React.FC = () => {
  const products = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const remaining = products.filter((p) => !p.featured).slice(0, 3);

  return (
    <div className="w-full bg-[--nw-cream] text-[--nw-ink]">
      {/* HERO */}
      <section
        className="relative w-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-[--nw-amber-deep] via-[--nw-sienna] to-[--nw-cocoa] text-amber-50"
        style={{
          // ensure palette values are available as CSS vars from global styles; fallback here
          // @ts-expect-error runtime CSS var fallback
          "--nw-cream": BRANDY_PALETTE.cream,
          // @ts-expect-error
          "--nw-ink": BRANDY_PALETTE.inkSoft,
          // @ts-expect-error
          "--nw-amber": BRANDY_PALETTE.amber,
          // @ts-expect-error
          "--nw-amber-deep": BRANDY_PALETTE.amberDeep,
          // @ts-expect-error
          "--nw-sienna": BRANDY_PALETTE.sienna,
          // @ts-expect-error
          "--nw-cocoa": BRANDY_PALETTE.cocoa,
        }}
      >
        {/* subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.35),transparent_60%)] mix-blend-soft-light opacity-90" />

        {/* bottle silhouette stripe */}
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-[140%] w-[40%] bg-gradient-to-b from-white/10 via-white/2 to-transparent opacity-70 blur-3xl" />

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <motion.div
            className="flex-1 max-w-xl"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-amber-100/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100/80 backdrop-blur">
              <Sparkles className="h-3 w-3" />
              <span>Quiet luxury, bottled</span>
            </div>
            <h1
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl leading-tight font-semibold text-amber-50 font-['Playfair_Display']"
            >
              Nishant Waters
              <span className="block text-amber-100/80 text-2xl sm:text-3xl lg:text-4xl mt-2">
                Custom Labeled Water Bottles
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-amber-100/80 max-w-xl leading-relaxed font-['Inter']">
              Crafted for boutique hotels, galleries, studios, and hosts who consider every surface. Design a label that feels like part of the room, not an afterthought.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  asChild
                  className="group rounded-full bg-amber-200 text-[--nw-ink] hover:bg-amber-100 px-7 py-2.5 text-sm font-medium tracking-wide shadow-lg shadow-black/20 border border-amber-50/40"
                >
                  <Link to="/catalog" aria-label="Shop the Nishant Waters collection">
                    <span className="flex items-center gap-2">
                      Explore the collection
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <div className="flex flex-col text-xs sm:text-sm text-amber-100/75 font-['Inter']">
                <span>Minimums from just 24 bottles</span>
                <span className="text-amber-100/60">Lead times from 10–14 days · Complimentary proof</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          >
            <div className="relative h-[320px] sm:h-[360px] md:h-[420px] lg:h-[460px]">
              {/* base "table" */}
              <div className="absolute inset-x-0 bottom-6 sm:bottom-10 h-40 bg-gradient-to-t from-black/40 via-black/20 to-transparent blur-2xl" />

              {/* bottle cards in staggered masonry */}
              <div className="relative h-full flex items-end justify-center gap-4 sm:gap-6">
                <motion.div
                  className="relative h-[68%] w-[30%] min-w-[110px] rounded-3xl border border-amber-50/20 bg-gradient-to-b from-amber-50/10 via-amber-50/5 to-amber-950/40 backdrop-blur-sm shadow-xl shadow-black/40 overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
                >
                  <BottleMock labelColor={BRANDY_PALETTE.creamSoft} labelName="Soft Cream" />
                </motion.div>

                <motion.div
                  className="relative h-[88%] w-[34%] min-w-[120px] rounded-3xl border border-amber-50/30 bg-gradient-to-b from-amber-50/15 via-amber-50/8 to-amber-950/40 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.9, ease: "easeOut" }}
                >
                  <BottleMock labelColor={BRANDY_PALETTE.amberDeep} labelName="Smoked Caramel" highlight />
                </motion.div>

                <motion.div
                  className="relative h-[78%] w-[28%] min-w-[100px] rounded-3xl border border-amber-50/20 bg-gradient-to-b from-amber-50/10 via-amber-50/5 to-amber-950/40 backdrop-blur-sm shadow-xl shadow-black/40 overflow-hidden hidden sm:block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
                >
                  <BottleMock labelColor={BRANDY_PALETTE.sienna} labelName="Kiln Sienna" />
                </motion.div>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),transparent_55%)] mix-blend-screen" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* EDITORIAL SHOWCASE SECTION */}
      <section className="w-full bg-[--nw-cream] text-[--nw-ink] py-16 sm:py-20 lg:py-24">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.div
            className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Masonry teaser of products */}
            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6"
              variants={staggerParent}
            >
              {featured.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={
                    index === 1
                      ? "row-span-2 h-full"
                      : "row-span-1"
                  }
                  variants={sectionVariants}
                >
                  <Card className="group relative h-full min-h-[180px] sm:min-h-[220px] overflow-hidden border-amber-900/10 bg-gradient-to-b from-amber-50/70 via-amber-50 to-amber-100/70 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5 opacity-80" />
                    <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
                      <div>
                        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-amber-900/60 mb-1 font-['Inter']">
                          Featured
                        </p>
                        <h2 className="font-['Playfair_Display'] text-base sm:text-lg text-amber-950 leading-snug">
                          {product.name}
                        </h2>
                        <p className="mt-1.5 text-xs sm:text-sm text-amber-900/70 line-clamp-3 font-['Inter']">
                          {product.shortDescription}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs text-amber-900/70 font-['Inter']">
                            From <span className="font-medium">${product.price.toFixed(2)}</span>
                          </p>
                          <p className="text-[0.7rem] text-amber-900/60 font-['Inter']">
                            Min. {product.minOrderQty} bottles
                          </p>
                        </div>
                        <Link
                          to={`/product/${product.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-amber-900 text-amber-50 px-3 py-1.5 text-[0.7rem] sm:text-xs font-medium tracking-wide shadow-sm hover:bg-amber-800 transition-colors duration-200"
                        >
                          Customize
                          <Droplet className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {remaining.map((product) => (
                <motion.div key={product.id} variants={sectionVariants}>
                  <Card className="relative h-full min-h-[160px] overflow-hidden border-dashed border-amber-900/15 bg-gradient-to-br from-amber-50/60 via-amber-50 to-amber-100/80">
                    <CardContent className="relative p-3 sm:p-4 flex h-full flex-col justify-between">
                      <div>
                        <h3 className="font-['Playfair_Display'] text-sm sm:text-base text-amber-950">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-[0.7rem] sm:text-xs text-amber-900/70 line-clamp-2 font-['Inter']">
                          {product.shortDescription}
                        </p>
                      </div>
                      <p className="mt-2 text-[0.7rem] text-amber-900/70 font-['Inter']">
                        {product.capacityMl}ml • From ${product.price.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Craftsmanship copy */}
            <motion.div
              className="space-y-5 sm:space-y-6 max-w-xl"
              variants={sectionVariants}
            >
              <p className="text-xs tracking-[0.28em] uppercase text-amber-900/60 font-['Inter']">
                Crafted for the room, not the shelf
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl text-amber-950 leading-snug">
                Water as part of the mise-en-scène.
              </h2>
              <p className="text-sm sm:text-base text-amber-900/80 leading-relaxed font-['Inter']">
                Every Nishant Waters bottle begins as a quiet sketch — a band of color, a line of type, a hint of story. We calibrate label tones to sit softly against warm woods, linen, and concrete so they photograph beautifully in real light.
              </p>
              <p className="text-sm sm:text-base text-amber-900/80 leading-relaxed font-['Inter']">
                Choose from our warm brandy palette, then refine typography, crests, and copy. Use it for suites and welcome trays, or as a small ritual before guests take their seats.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex -space-x-1.5">
                  <span className="h-7 w-7 rounded-full border border-amber-900/10" style={{ backgroundColor: BRANDY_PALETTE.creamSoft }} />
                  <span className="h-7 w-7 rounded-full border border-amber-900/10" style={{ backgroundColor: BRANDY_PALETTE.amberLight }} />
                  <span className="h-7 w-7 rounded-full border border-amber-900/10" style={{ backgroundColor: BRANDY_PALETTE.amber }} />
                  <span className="h-7 w-7 rounded-full border border-amber-900/10" style={{ backgroundColor: BRANDY_PALETTE.amberDeep }} />
                  <span className="h-7 w-7 rounded-full border border-amber-900/10" style={{ backgroundColor: BRANDY_PALETTE.sienna }} />
                </div>
                <p className="text-xs sm:text-sm text-amber-900/70 font-['Inter']">
                  A considered palette of creams, ambers, and kiln-baked browns.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-900/90 underline underline-offset-4 decoration-amber-500/70 hover:text-amber-950 hover:decoration-amber-700 transition-colors duration-200 font-['Inter']"
                >
                  Browse all bottles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* REVIEWS SECTION (BRAND-LEVEL) */}
      <section className="w-full bg-gradient-to-b from-[--nw-cream] via-[#f2e4d4] to-[--nw-creamSoft] py-16 sm:py-20 lg:py-24 border-t border-amber-900/10">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <ReviewSection title="How hosts are pouring Nishant Waters" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

interface BottleMockProps {
  labelColor: string;
  labelName: string;
  highlight?: boolean;
}

const BottleMock: React.FC<BottleMockProps> = ({ labelColor, labelName, highlight }) => {
  return (
    <div className="relative flex h-full flex-col items-center justify-end pb-5">
      {/* glass body */}
      <div className="relative w-[54%] h-[78%] rounded-full bg-gradient-to-b from-white/75 via-white/20 to-white/5 shadow-[0_28px_60px_rgba(0,0,0,0.55)] overflow-hidden flex items-center justify-center">
        {/* inner gradient to mimic water */}
        <div className="absolute inset-[10%] rounded-full bg-gradient-to-b from-white/60 via-white/20 to-white/5" />
        {/* label band */}
        <div
          className="relative w-[86%] h-[32%] rounded-[20px] shadow-md shadow-black/35 border border-white/60 flex flex-col items-center justify-center px-2 text-center"
          style={{ backgroundColor: labelColor }}
        >
          <span className="text-[0.55rem] tracking-[0.3em] uppercase text-black/60 font-['Inter']">
            Nishant Waters
          </span>
          <span className="mt-1 text-[0.7rem] text-black/80 font-['Playfair_Display'] leading-tight">
            {labelName}
          </span>
        </div>
      </div>
      {/* neck */}
      <div className="mt-[-6%] h-[16%] w-[18%] rounded-t-full rounded-b-[40%] bg-gradient-to-b from-white/85 via-white/60 to-white/10 shadow-[0_10px_18px_rgba(0,0,0,0.35)]" />
      {/* cap */}
      <div className="mt-[-2%] h-[7%] w-[26%] rounded-[6px] bg-gradient-to-b from-amber-900/90 via-amber-900 to-black/80 shadow-[0_6px_12px_rgba(0,0,0,0.5)]" />
      {highlight && (
        <div className="absolute -top-4 right-3 rounded-full bg-amber-200/95 px-2 py-1 shadow-md shadow-black/40">
          <span className="text-[0.6rem] font-medium tracking-[0.14em] uppercase text-amber-900 font-['Inter']">
            Most selected
          </span>
        </div>
      )}
    </div>
  );
};

export default HomePage;