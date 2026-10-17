import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Droplets, Leaf, Sparkles, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "@/components/ui/shadcn";

// NOTE: This page is 100% frontend-only and powered by the mock client-side state in src/mock.ts.
// No backend calls are made; all interactions are purely in-browser.

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export interface AboutPageProps {}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <main className="w-full bg-[#f5ece2] text-[#281911] min-h-screen">
      {/* Hero */}
      <section className="relative w-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-[#f3e3d0] via-[#f5ece2] to-[#e1c9b0]">
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(181,106,60,0.22),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(63,42,35,0.3),_transparent_65%)] mix-blend-multiply" />
          {/* Vertical texture stripes */}
          <div className="absolute inset-0 opacity-[0.16]" style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(40,25,17,0.18) 0, rgba(40,25,17,0.18) 1px, transparent 1px, transparent 6px)",
          }} />
        </div>

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            className="flex-1 max-w-xl lg:max-w-none"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="uppercase tracking-[0.3em] text-xs lg:text-sm text-[#8D5A3A] mb-6">
              About Nishant Waters
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#2b1c11] mb-6">
              Water, framed as
              <span className="block lg:inline lg:ml-2">a quiet signature.</span>
            </h1>
            <p className="text-base lg:text-lg text-[#4c3422] max-w-2xl leading-relaxed mb-8">
              Nishant Waters was born from a simple question: what if the most
              understated detail on the table carried the clearest expression of
              a space? We create custom-labeled water bottles that feel more
              like editorial objects than packaging.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="rounded-full bg-[#B56A3C] hover:bg-[#9e5a31] text-[#fdf7f0] px-7 py-2.5 text-sm tracking-wide font-medium shadow-sm transition-colors duration-200"
              >
                <Link to="/shop" aria-label="Browse the Nishant Waters collection">
                  <span className="flex items-center gap-2">
                    Shop the collection
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
              <span className="text-xs sm:text-sm text-[#6b4a31]">
                100% client-side demo · mock orders only · no real payments
              </span>
            </div>
          </motion.div>

          {/* Hero imagery */}
          <motion.div
            className="flex-1 relative w-full max-w-xl lg:max-w-[520px] aspect-[3/5]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            {/* Bottle silhouette */}
            <div className="absolute inset-6 rounded-[40px] bg-gradient-to-b from-[#fdf7f0] via-[#f5ece2] to-[#e0c1a0] shadow-[0_24px_60px_rgba(40,25,17,0.35)]" />
            <div className="absolute inset-10 rounded-[30px] border border-white/70 border-l-[#f5e2d0] border-t-[#fbeee0] backdrop-blur-[2px]" />

            {/* Label overlay */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] h-[44%] rounded-[28px] bg-[#B56A3C] shadow-[0_18px_40px_rgba(40,25,17,0.55)] flex flex-col justify-between p-6">
              <div className="space-y-1">
                <p className="uppercase tracking-[0.35em] text-[9px] text-[#f4e6d7]">
                  Nishant Waters
                </p>
                <p className="text-xs text-[#fbeee0]/90">Custom Label Studio</p>
              </div>
              <p className="font-serif text-xl text-[#fdf7f0] leading-snug">
                Crafted for linen, stone, glass, and the spaces in between.
              </p>
              <p className="text-[10px] tracking-[0.24em] uppercase text-[#f4e6d7]/90">
                Still · Sparkling · Studio Editions
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Origin Story & Philosophy */}
      <section className="w-full bg-[#f5ece2] py-16 lg:py-24">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 xl:gap-20 items-start">
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <motion.div variants={sectionVariants}>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2b1c11] mb-4">
                  A studio between hospitality and print.
                </h2>
                <p className="text-sm sm:text-base text-[#4c3422] leading-relaxed max-w-2xl">
                  Nishant Waters sits at the intersection of visual identity,
                  hospitality, and the quiet power of objects. We work with
                  restaurants, hotels, galleries, and studios who see their
                  water service as an extension of their story rather than an
                  afterthought.
                </p>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                <Card className="border-[#e0cbb5]/80 bg-[#fbf3ea]/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 flex flex-row items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#B56A3C]/10 flex items-center justify-center text-[#B56A3C]">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-[#2b1c11]">
                        Water as a medium
                      </CardTitle>
                      <CardDescription className="text-xs text-[#7a5a3c]">
                        Quiet, generous, ever-present.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1">
                    <p className="text-sm text-[#4c3422] leading-relaxed">
                      We see each bottle as a framing device for your space.
                      Labels are tuned to your palette, typography, and light
                      conditions — so they photograph well but never shout.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#e0cbb5]/80 bg-[#fcf5ee]/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 flex flex-row items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#8D5A3A]/10 flex items-center justify-center text-[#8D5A3A]">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-[#2b1c11]">
                        Considered materials
                      </CardTitle>
                      <CardDescription className="text-xs text-[#7a5a3c]">
                        Glass, inks, and papers that last.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1">
                    <p className="text-sm text-[#4c3422] leading-relaxed">
                      Our mock catalog pairs glass silhouettes with label
                      stocks inspired by printmaking and small-batch wine.
                      Think soft fibres, subtle sheen, and restrained color.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Side quote */}
            <motion.aside
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#c98a54]/20 via-transparent to-[#40281d]/40" />
              <div className="relative rounded-3xl border border-white/60 bg-[rgba(250,241,231,0.18)] backdrop-blur-md p-7 lg:p-8 shadow-[0_22px_50px_rgba(40,25,17,0.35)]">
                <Sparkles className="w-5 h-5 text-[#B56A3C] mb-4" />
                <p className="font-serif text-xl text-[#2b1c11] leading-relaxed mb-4">
                  “When the label feels inevitable — as if it has always
                  belonged to your space — we know we&apos;ve done our work.”
                </p>
                <p className="text-xs tracking-[0.22em] uppercase text-[#7a5a3c]">
                  Nishant Waters Studio
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Full-bleed image storytelling strip */}
      <section className="relative w-full overflow-hidden bg-[#3F2A23] text-[#f8eee2]">
        <div className="w-full max-w-[1600px] mx-auto px-0 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Imagery block - mocked as gradient/texture */}
            <motion.div
              className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] overflow-hidden"
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(244,233,221,0.9),_transparent_55%),_radial-gradient(circle_at_80%_80%,_rgba(181,106,60,0.85),_transparent_60%)]" />
              <div className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{
                backgroundImage:
                  "linear-gradient(120deg, rgba(20,12,8,0.85), transparent 60%), repeating-linear-gradient(90deg, rgba(250,241,231,0.3) 0, rgba(250,241,231,0.3) 1px, transparent 2px, transparent 9px)",
              }} />

              <div className="relative h-full flex items-end justify-between px-6 sm:px-10 py-8 sm:py-10">
                <div className="space-y-3 max-w-xs">
                  <p className="uppercase tracking-[0.28em] text-[10px] text-[#f8eee2]/80">
                    Spaces we design for
                  </p>
                  <p className="font-serif text-2xl text-[#fdf7f0] leading-snug">
                    Dining rooms, lobby counters, tasting benches, studio
                    desks, and bedside tables.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col gap-4 items-end text-right text-[11px] text-[#f8eee2]/80">
                  <div>
                    <p className="tracking-[0.26em] uppercase">Textures</p>
                    <p className="mt-1">Stone · Linen · Waxed wood · Concrete</p>
                  </div>
                  <div>
                    <p className="tracking-[0.26em] uppercase">Palettes</p>
                    <p className="mt-1">Brandy, cacao, smoked ivory, linen foam</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Copy block */}
            <motion.div
              className="relative bg-[#3F2A23]/95 border-l border-[#6b4a31]/70 px-6 sm:px-10 py-12 lg:py-16 flex items-center"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            >
              <div className="space-y-6 max-w-xl">
                <p className="uppercase tracking-[0.3em] text-[10px] text-[#f5e2d0]">
                  The brandy palette
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#fdf7f0] leading-tight">
                  Warm neutrals tuned for candlelight and afternoon shadow.
                </h3>
                <p className="text-sm sm:text-base text-[#f5e2d0]/90 leading-relaxed">
                  We favor smoked ivories, linen foams, and amber velvets —
                  tones that carry warmth without overwhelming a tablescape.
                  Labels are designed to sit beside ceramics, stemware, and
                  textiles in harmony, not competition.
                </p>
                <p className="text-sm text-[#f5e2d0]/75 leading-relaxed">
                  This is a purely visual and experiential mock studio inside
                  your browser. Every design, label palette, and order you
                  explore is stored only in localStorage as part of this
                  frontend demo.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline / values */}
      <section className="w-full bg-[#f5ece2] py-16 lg:py-24">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <motion.div
              className="max-w-lg lg:max-w-sm flex-shrink-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="uppercase tracking-[0.3em] text-xs text-[#8D5A3A] mb-4">
                Timeline & values
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2b1c11] mb-4">
                From first bottle sketch to your custom label.
              </h3>
              <p className="text-sm sm:text-base text-[#4c3422] leading-relaxed mb-4">
                While this experience is fully mocked in the browser, it
                mirrors how a real collaboration with Nishant Waters would
                unfold — calmly, deliberately, and with a focus on the smallest
                details.
              </p>
              <p className="text-xs text-[#7a5a3c] leading-relaxed">
                Use this space to explore palettes, typography, and shapes.
                Every interaction — from label design to adding to cart — is
                handled by our mock state layer in <code className="px-1 py-0.5 rounded bg-[#f0e1d0] text-[10px]">src/mock.ts</code>,
                persisted only to your browser.
              </p>
            </motion.div>

            <motion.ol
              className="relative flex-1 border-l border-dashed border-[#d2bba2] pl-6 space-y-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              {[
                {
                  year: "Sketch",
                  title: "Defining the silhouette",
                  body:
                    "We begin with the bottle itself — proportions, shoulder lines, and how it sits among glassware and decanters. The aim is to feel present but never dominant.",
                },
                {
                  year: "Palette",
                  title: "Tuning warmth and contrast",
                  body:
                    "Brandy tones, smoked neutrals, and linen lights are mapped against your existing interiors and brand colors to hit the right temperature of warmth.",
                },
                {
                  year: "Typography",
                  title: "Settling on the voice",
                  body:
                    "We explore serif and sans-serif combinations, caps, and small details like tracking so that even a single line of text feels intentional.",
                },
                {
                  year: "Table",
                  title: "Seeing it in context",
                  body:
                    "Finally, we review how the bottle behaves under candlelight, daylight, and camera lenses — refining until the label feels inevitable in your space.",
                },
              ].map((step, index) => (
                <motion.li
                  key={step.title}
                  className="relative pl-6"
                  variants={sectionVariants}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
                >
                  <div className="absolute left-[-11px] top-1.5 w-5 h-5 rounded-full border-2 border-[#B56A3C] bg-[#f5ece2] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B56A3C]" />
                  </div>
                  <Card className="border-[#e0cbb5] bg-[#fcf5ee]/90 backdrop-blur-sm shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] tracking-[0.26em] uppercase text-[#8D5A3A]">
                          {step.year}
                        </p>
                        <CardTitle className="mt-1 text-base sm:text-lg text-[#2b1c11]">
                          {step.title}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-[#7a5a3c]">0{index + 1}</span>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                      <p className="text-sm text-[#4c3422] leading-relaxed">
                        {step.body}
                      </p>
                    </CardContent>
                  </Card>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="w-full bg-[#2b1c11] text-[#f8eee2] py-14 lg:py-18 border-t border-[#6b4a31]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            className="space-y-3 max-w-xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="uppercase tracking-[0.3em] text-[10px] text-[#f5e2d0]">
              Begin your mock collaboration
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#fdf7f0]">
              Design a label and see how it feels in your space.
            </h3>
            <p className="text-sm sm:text-base text-[#f5e2d0]/90 leading-relaxed">
              Head to the catalog, explore a bottle, and open the label
              designer. Every label you create and every cart you build lives
              only in your browser as part of this Nishant Waters frontend
              prototype.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <Button
              asChild
              className="rounded-full bg-[#C16A32] hover:bg-[#a65a29] text-[#fdf7f0] px-7 py-2.5 text-sm tracking-wide font-medium shadow-sm transition-colors duration-200"
            >
              <Link to="/shop" aria-label="Browse all Nishant Waters bottles">
                <span className="flex items-center gap-2">
                  Explore the catalog
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;