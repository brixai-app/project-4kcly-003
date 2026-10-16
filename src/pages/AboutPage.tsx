import React from "react";
import { motion } from "framer-motion";
import { products } from "@/mock";

const AboutPage: React.FC = () => {
  const heroProduct = products[0];
  const secondaryProduct = products[1] ?? products[0];

  return (
    <div className="min-h-screen bg-[#FFF5E1] text-[#333333]">
      {/* Hero / Masthead */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5E1] via-[#F8E2C5] to-[#FFF5E1]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:w-1/2"
          >
            <p className="text-xs tracking-[0.3em] text-[#A0522D] uppercase mb-4">
              The Story of Nishant Waters
            </p>
            <h1 className="font-['Playfair_Display'] text-4xl font-semibold tracking-tight text-[#2B211A] sm:text-5xl">
              Still water, quietly extraordinary.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#4A3C33] md:text-base">
              Nishant Waters was born from a single, enduring question: what if the
              simplest ritual — a glass of water — could carry the same quiet
              ceremony as a rare spirit? We craft custom-labeled bottles that feel
              at home on a marble bar cart, a gallery plinth, or a boardroom table.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5E4C40] md:text-base">
              Each bottle is an object of intention: refined silhouettes,
              considered typography, and warm brandy tones that glow softly under
              candlelight. Your name, your evening, your moment — distilled into
              a single, elegant gesture.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="md:w-1/2"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#F5D8B8] shadow-[0_28px_60px_rgba(35,24,13,0.35)]">
              {heroProduct?.images?.[0] && (
                <img
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  className="h-full w-full object-cover object-center"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F130C]/60 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#FBE9CF]/80">
                  Signature Collection
                </p>
                <p className="mt-2 font-['Playfair_Display'] text-xl text-[#FFF5E1]">
                  Water dressed for the evening.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="border-y border-[#E3C19C] bg-[#FFF5E1]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr,1fr] md:py-20">
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#2B211A] sm:text-3xl">
              Born in the after-hours.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#4A3C33] md:text-base">
              Nishant — the Sanskrit word for the tender edge between night and
              dawn — captures the liminal moments we design for. The quiet exhale
              after a long service. The last glass poured at a rooftop bar. The
              soft clink of bottles as a private dinner draws to a close.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5E4C40] md:text-base">
              Our founders came from hospitality, print, and type design. Together,
              they set out to reimagine bottled water as a canvas for subtle
              storytelling. Every curve, color, and ligature is studied — so your
              brand, your initials, or your message can live effortlessly in that
              in-between light.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-[#F7E3C8] p-5 shadow-sm">
              <p className="text-xs font-medium tracking-[0.2em] text-[#A0522D] uppercase">
                Philosophy
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#3C2E25]">
                We believe luxury is not loud — it is precise. Fewer elements,
                softer edges, deeper attention. A Nishant bottle is designed to be
                noticed only when you choose to look closely.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-[#E3C19C] bg-[#FFF9EF] p-5">
              <p className="text-xs font-medium tracking-[0.2em] text-[#A0522D] uppercase">
                Materials
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#3C2E25]">
                Premium glass silhouettes, archival-grade inks, and label stocks
                selected for their tactility. Your bottles arrive ready for display
                — and designed to be kept.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Visual Story */}
      <section className="bg-[#FDF1DF]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-stretch md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="md:w-[58%]"
          >
            <div className="relative h-full overflow-hidden rounded-3xl bg-[#E9C9A2] shadow-[0_24px_50px_rgba(33,22,13,0.3)]">
              {secondaryProduct?.images?.[0] && (
                <img
                  src={secondaryProduct.images[0]}
                  alt={secondaryProduct.name}
                  className="h-full w-full object-cover object-center"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1E130C]/55 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-6 left-6 max-w-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-[#FFEED5]/80">
                  Designed to belong
                </p>
                <p className="mt-2 font-['Playfair_Display'] text-xl text-[#FFF5E1]">
                  On the credenza, beside the record player, under the low light
                  of a private dining room — Nishant bottles live where your
                  stories unfold.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col justify-between md:w-[42%]"
          >
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#2B211A] sm:text-3xl">
                Custom, without the chaos.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#4A3C33] md:text-base">
                The Nishant label editor was designed to feel like a quiet studio
                desk, not a cluttered dashboard. Choose a template, set your
                bottle color and size, then refine type, color, and copy — all in
                real time.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#5E4C40] md:text-base">
                Whether you are curating a boutique hotel amenity, an event
                welcome gift, or a private cellar detail, our tools are crafted to
                respect your time and your taste.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 text-sm text-[#3C2E25] md:mt-10">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-[#CBA135]/40 bg-[#FDF5E3] text-center text-xs font-semibold leading-[22px] text-[#A0522D]">
                  1
                </span>
                <p className="leading-relaxed">
                  Select a silhouette, volume, and bottle tone that echoes your
                  environment — from clear and crisp to amber and atmospheric.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-[#CBA135]/40 bg-[#FDF5E3] text-center text-xs font-semibold leading-[22px] text-[#A0522D]">
                  2
                </span>
                <p className="leading-relaxed">
                  Pair with a label template built on thoughtful typography and
                  negative space. Add your copy, monogram, or mark.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-6 w-6 rounded-full border border-[#CBA135]/40 bg-[#FDF5E3] text-center text-xs font-semibold leading-[22px] text-[#A0522D]">
                  3
                </span>
                <p className="leading-relaxed">
                  Preview every detail live before you add to cart. Your design is
                  saved locally so you can refine it at your pace.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing Note */}
      <section className="bg-[#FFF5E1]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <p className="text-xs tracking-[0.3em] text-[#A0522D] uppercase">
            A quiet signature
          </p>
          <p className="mt-4 font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#2B211A] sm:text-3xl">
            More than a bottle. A gentle introduction.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[#4A3C33] md:text-base">
            When a guest reaches for water, they touch your world. The weight of
            the glass, the warmth of the label, the way their name or your mark
            catches the light — these are the small, human-scale encounters that
            define how a space feels.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#5E4C40] md:text-base">
            Nishant Waters exists to compose those encounters with care. We hope
            every bottle you create here feels quietly inevitable — as if it
            could not have been designed any other way.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;