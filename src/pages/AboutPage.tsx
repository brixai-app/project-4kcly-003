import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { DocumentTitle } from "@/components/seo/DocumentTitle";
import { Divider } from "@/components/ui/Divider";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const AboutPage: React.FC = () => {
  return (
    <>
      <DocumentTitle
        title="About"
        description="Discover the story of Nishant Waters – premium, custom-labeled water with a focus on sustainability, craft, and considered design."
      />
      <div className="min-h-screen bg-[#FFF8F0] text-[#3B2A23] pb-20">
        <Container className="pt-16 lg:pt-24 space-y-16">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-10 lg:grid-cols-[3fr,2fr] items-start"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#A0522D]/80 mb-4">
                Our story
              </p>
              <h1
                className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#3B2A23] mb-6"
              >
                Water, designed for the moments that matter.
              </h1>
              <p className="font-['Inter'] text-base sm:text-lg text-[#5b4638] leading-relaxed max-w-2xl">
                Nishant Waters was born from a simple idea: everyday rituals deserve
                exceptional design. We craft custom-labeled water bottles that feel
                as considered as your space, your table, and your story. From
                intimate gatherings to brand launches, our bottles are designed to
                disappear visually while leaving a lasting impression.
              </p>
            </div>
            <div className="relative h-72 sm:h-80 lg:h-[22rem] rounded-3xl overflow-hidden shadow-xl shadow-[#a0522d33] bg-gradient-to-br from-[#F4E1D2] to-[#FFF8F0]">
              <div className="absolute inset-6 rounded-3xl bg-[url('https://images.pexels.com/photos/1458660/pexels-photo-1458660.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3B2A23]/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-7 max-w-xs text-[#FFF8F0]">
                <p className="font-['Inter'] text-xs uppercase tracking-[0.3em] mb-2">
                  Crafted Calm
                </p>
                <p className="font-['Playfair_Display'] text-xl leading-snug">
                  A quiet luxury approach to hydration, built for modern hosts.
                </p>
              </div>
            </div>
          </motion.section>

          <Divider className="border-[#E0C8B6]" />

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-12 lg:grid-cols-3"
          >
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-['Playfair_Display'] text-2xl text-[#3B2A23]">
                Sustainability, without compromise.
              </h2>
              <p className="font-['Inter'] text-sm text-[#5b4638] leading-relaxed">
                Every bottle we design begins with materials and partners we trust.
                Our mock storefront reflects our intent: lightweight recycled
                plastics, low-impact inks, and streamlined shipping designed to
                move quietly through the world.
              </p>
            </div>
            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
              <article className="rounded-2xl bg-[#F4E1D2] p-6 shadow-md shadow-[#b88a6a33]">
                <h3 className="font-['Inter'] font-semibold text-sm tracking-wide text-[#A0522D] mb-2">
                  Circular mindset
                </h3>
                <p className="font-['Inter'] text-sm text-[#5b4638] leading-relaxed">
                  From material sourcing to packaging, we design every detail with
                  a circular approach in mind. Think refill-friendly silhouettes,
                  recyclable components, and mock lifecycle tracking built into
                  our product thinking.
                </p>
              </article>
              <article className="rounded-2xl bg-[#FFF8F0] p-6 border border-[#E0C8B6] shadow-sm">
                <h3 className="font-['Inter'] font-semibold text-sm tracking-wide text-[#708238] mb-2">
                  Conscious partners
                </h3>
                <p className="font-['Inter'] text-sm text-[#5b4638] leading-relaxed">
                  Nishant Waters exists as a design-forward mock experience today,
                  but it is shaped by real conversations with makers, roasters,
                  sommeliers, and interior designers who obsess over the mood of a
                  table.
                </p>
              </article>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid gap-10 lg:grid-cols-[2fr,3fr] items-center"
          >
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 rounded-3xl bg-[#FF6F61]/10 blur-xl" />
              <div className="relative rounded-3xl overflow-hidden bg-[#FFF8F0] border border-[#E0C8B6] p-6 space-y-4">
                <h2 className="font-['Playfair_Display'] text-2xl text-[#3B2A23]">
                  Designed to be noticed, not loud.
                </h2>
                <p className="font-['Inter'] text-sm text-[#5b4638] leading-relaxed">
                  We treat every bottle as a canvas for your story – a quiet
                  extension of your brand, event, or home. Our label editor lets
                  you explore type, color, and imagery with playful precision,
                  while our mock 3D previews keep everything feeling tactile and
                  grounded.
                </p>
                <p className="font-['Inter'] text-sm text-[#5b4638] leading-relaxed">
                  This experience is fully client-side and powered by mock data,
                  so you can play freely without any real orders being processed.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl h-44 sm:h-52 bg-[url('https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center shadow-md shadow-[#4b33251f]" />
              <div className="rounded-3xl h-44 sm:h-52 bg-[url('https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center shadow-lg shadow-[#b88a6a33] translate-y-4" />
            </div>
          </motion.section>
        </Container>
      </div>
    </>
  );
};

export default AboutPage;