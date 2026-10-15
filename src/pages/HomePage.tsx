import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "../mock";
import { ProductGallery } from "../components/product/ProductGallery";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#E0DAD0]">
        <div className="grid lg:grid-cols-2 min-h-[70vh]">
          {/* Hero imagery */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full w-full"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                }}
                aria-hidden="true"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent opacity-80" />
          </div>

          {/* Hero copy */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="order-1 lg:order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24 space-y-8"
          >
            <p className="tracking-[0.28em] text-xs sm:text-sm uppercase text-[#A89F91]">
              N I S H A N T   W A T E R S
            </p>
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Hydrate in Style
              <span className="block font-['Bodoni_Moda'] text-3xl sm:text-4xl mt-2">
                with Custom Elegance
              </span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-[#4A4A4A]">
              Bespoke, custom-labeled water bottles crafted for minimalists, hosts,
              and brands who understand that the smallest details speak the loudest.
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.div
                variants={heroVariants}
                className="flex-shrink-0"
              >
                <Button
                  asChild
                  variant="primary"
                  className="bg-[#004D40] text-[#FAF9F6] hover:bg-[#026457] px-7 py-3 rounded-full text-sm tracking-wide flex items-center gap-2"
                >
                  <Link to="/shop" aria-label="Shop custom water bottles">
                    Shop the Collection
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={heroVariants} className="flex-shrink-0">
                <Button
                  asChild
                  variant="ghost"
                  className="border border-[#A89F91]/60 text-[#004D40] hover:bg-[#F1EBE0] rounded-full px-6 py-3 text-sm"
                >
                  <Link to="/about">Discover the Story</Link>
                </Button>
              </motion.div>
            </motion.div>
            <p className="text-xs tracking-[0.18em] uppercase text-[#8F8578] pt-4">
              Small-batch • Carbon-filtered • Label designs saved in your browser
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured products section */}
      <section className="px-6 sm:px-10 lg:px-16 xl:px-24 py-16 sm:py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <SectionHeading
            eyebrow="Featured silhouettes"
            title="Curated bottles for intentional moments"
            description="Explore our most-loved vessels, designed to carry your custom narrative in glass-like clarity and understated color." 
          />

          <div className="flex flex-col items-start gap-3 text-sm text-[#4A4A4A] max-w-sm">
            <p>
              Every bottle can be tailored with your chosen typography, iconography, and tone-on-tone color stories. Start from a
              signature silhouette and make it distinctly yours.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#004D40] hover:text-[#026457] underline underline-offset-4"
            >
              View all designs
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <ProductGallery
            products={featuredProducts}
            layout="asymmetric"
            showSectionHeading={false}
          />
        </motion.div>
      </section>

      {/* Design philosophy */}
      <section className="px-6 sm:px-10 lg:px-16 xl:px-24 pb-20">
        <div className="grid md:grid-cols-[1.2fr,1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <p className="tracking-[0.2em] text-xs uppercase text-[#A89F91]">Label Atelier</p>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl">
              Design a label that
              <span className="block font-['Bodoni_Moda'] text-2xl mt-1">reads like a quiet signature</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] max-w-xl">
              Choose from elevated serif and editorial-inspired type, nuanced earth-and-sea tones, and subtle iconography.
              Our browser-based designer lets you preview every nuance on your bottle before it ever leaves the studio.
            </p>
            <ul className="space-y-2 text-sm text-[#4A4A4A]">
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#004D40]" aria-hidden="true" />
                <span>Live label preview on the bottle silhouette as you type.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#004D40]" aria-hidden="true" />
                <span>Fonts and color pairings curated specifically for legibility on glass.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#004D40]" aria-hidden="true" />
                <span>All label drafts are preserved in your browser until you&apos;re ready to order.</span>
              </li>
            </ul>
            <Button
              asChild
              variant="secondary"
              className="mt-2 bg-transparent border border-[#004D40] text-[#004D40] hover:bg-[#E6F1EF] rounded-full px-6 py-3 text-sm"
            >
              <Link to="/shop">Begin with a bottle</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl bg-[#F1EBE0] shadow-[0_18px_45px_rgba(0,0,0,0.12)] overflow-hidden flex items-center justify-center">
              <div className="relative h-[80%] w-[38%] rounded-full bg-gradient-to-b from-white to-[#E7F3F1] border border-white/60 shadow-[0_18px_30px_rgba(0,0,0,0.18)] flex items-center justify-center">
                <div className="absolute inset-x-4 top-10 bottom-10 rounded-2xl border border-[#D9E7E4] bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-[0.65rem] tracking-[0.24em] uppercase text-[#A89F91] mb-2">
                      Live Label Preview
                    </p>
                    <p className="font-['Playfair_Display'] text-xs text-[#2B2B2B] leading-snug">
                      "Nishant Waters"
                      <span className="block font-['Bodoni_Moda'] text-[0.7rem] text-[#004D40] mt-1">
                        Table No. 04
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;