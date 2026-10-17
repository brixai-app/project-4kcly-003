import React from "react";
import { motion } from "framer-motion";
import { Quote, Droplets, Leaf, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRANDY_PALETTE } from "@/mock";
import {
  Card,
  CardContent,
  Separator,
} from "@/components/ui/shadcn";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const childFade = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[color:var(--nw-cream)] text-[color:var(--nw-ink)]">
      {/* CSS variables bridge directly to BRANDY_PALETTE; we rely on global CSS setup elsewhere */}
      <style>{`
        :root {
          --nw-cream: ${BRANDY_PALETTE.cream};
          --nw-cream-soft: ${BRANDY_PALETTE.creamSoft};
          --nw-amber-light: ${BRANDY_PALETTE.amberLight};
          --nw-amber: ${BRANDY_PALETTE.amber};
          --nw-amber-deep: ${BRANDY_PALETTE.amberDeep};
          --nw-sienna: ${BRANDY_PALETTE.sienna};
          --nw-cocoa: ${BRANDY_PALETTE.cocoa};
          --nw-ink-soft: ${BRANDY_PALETTE.inkSoft};
        }
      `}</style>

      {/* HERO / ORIGIN STORY */}
      <section className="relative w-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-[color:var(--nw-amber-deep)] via-[color:var(--nw-cocoa)] to-black text-[color:var(--nw-cream)]">
        {/* Subtle grain / vignette overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.6),_transparent_55%)]" />
        </div>

        {/* Stylised bottle silhouettes */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6 lg:pr-12"
          aria-hidden="true"
        >
          <div className="relative h-[420px] w-[260px] translate-y-6 opacity-70 blur-[0.5px] sm:h-[520px] sm:w-[320px]">
            {/* Bottle body */}
            <div className="absolute bottom-0 left-1/2 h-[86%] w-[54%] -translate-x-1/2 rounded-[34px] bg-gradient-to-b from-[rgba(250,246,239,0.18)] via-[rgba(240,220,196,0.12)] to-[rgba(10,7,4,0.85)] shadow-[0_40px_90px_rgba(0,0,0,0.75)]" />
            {/* Label band */}
            <div className="absolute bottom-[32%] left-1/2 h-[22%] w-[70%] -translate-x-1/2 rounded-[26px] border border-[rgba(250,245,235,0.7)] bg-[radial-gradient(circle_at_top,_rgba(248,232,211,0.92),_rgba(210,140,69,0.9))] shadow-[0_18px_40px_rgba(0,0,0,0.7)]" />
            {/* Neck */}
            <div className="absolute top-[4%] left-1/2 h-[22%] w-[18%] -translate-x-1/2 rounded-t-[22px] rounded-b-[26px] bg-gradient-to-b from-[rgba(250,246,239,0.9)] via-[rgba(244,227,206,0.5)] to-[rgba(64,46,30,0.96)] shadow-[0_20px_40px_rgba(0,0,0,0.65)]" />
            {/* Cap */}
            <div className="absolute top-0 left-1/2 h-[7%] w-[26%] -translate-x-1/2 rounded-t-[16px] rounded-b-[10px] bg-gradient-to-b from-[rgba(255,252,247,0.95)] to-[rgba(214,166,108,0.8)] shadow-[0_8px_18px_rgba(0,0,0,0.55)]" />
            {/* Reflection slice */}
            <div className="absolute inset-y-[12%] left-[44%] w-[2px] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.3)] via-[rgba(255,255,255,0.12)] to-transparent" />
          </div>
        </div>

        <motion.div
          className="relative z-10 flex h-full items-center"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 lg:py-28 xl:py-32">
            <motion.p
              variants={childFade}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(248,232,211,0.4)] bg-[rgba(18,10,4,0.65)] px-4 py-1 text-xs tracking-[0.22em] uppercase text-[color:var(--nw-amber-light)]/90 backdrop-blur"
            >
              <span className="h-1 w-1 rounded-full bg-[color:var(--nw-amber-light)]" />
              Since 2024 · Crafted at the waterline of ritual
            </motion.p>

            <motion.h1
              variants={childFade}
              className="font-['Playfair_Display'] text-4xl leading-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Water, edited for
              <span className="block text-[color:var(--nw-amber-light)]">quiet moments of arrival.</span>
            </motion.h1>

            <motion.p
              variants={childFade}
              className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-[rgba(247,241,232,0.92)]"
            >
              Nishant Waters began with a simple observation: in the most considered
              rooms in the world, water was often the only object that felt
              unedited. We set out to design a bottle that could disappear into
              the scene while quietly carrying a story.
            </motion.p>

            <motion.div
              variants={childFade}
              className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[rgba(248,232,211,0.9)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(12,7,4,0.9)] ring-1 ring-[rgba(248,232,211,0.4)]">
                  <Droplets className="h-4 w-4 text-[color:var(--nw-amber-light)]" />
                </div>
                <div>
                  <p className="font-medium tracking-wide">Designed for hospitality</p>
                  <p className="text-[0.7rem] opacity-80">
                    Boutique hotels, galleries, studios, and gatherings.
                  </p>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden h-10 bg-[rgba(248,232,211,0.3)] sm:block" />

              <div className="max-w-xs text-[0.74rem] leading-relaxed sm:text-xs opacity-90">
                Every detail—from the warmth of the label palette to the way glass
                catches candlelight—has been tuned to feel like part of the
                mise-en-scène rather than an object on the table.
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ORIGIN + PROCESS SECTION */}
      <section className="w-full bg-[color:var(--nw-cream)] py-16 sm:py-20 lg:py-24">
        <motion.div
          className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Textual narrative */}
          <div className="space-y-6">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[color:var(--nw-cocoa)]/70">
              A small ritual, held in glass
            </p>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl text-[color:var(--nw-ink-soft)]">
              We design labeled water as part of the room&apos;s vocabulary.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[color:var(--nw-cocoa)]/90">
              For hotels, homes, and hospitality spaces that labor over the
              smallest details, the presence of a plastic bottle or mismatched
              label can feel loud. Nishant Waters was founded to create a quieter
              alternative—one that respects both the materials and the moment.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[color:var(--nw-cocoa)]/90">
              Our bottles are intentionally simple: clear glass, generous
              surfaces for expression, and a warm brandy-toned palette that
              complements linen, stone, and candlelight. The label becomes a
              soft frame for your crest, mark, or message—not the main event.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[color:var(--nw-cocoa)]/80">
              Every project begins with listening: to the stories told at your
              table, the palette of your space, and the pace of your service.
              From there, we build a bottle that feels inevitable—as though it
              always belonged there.
            </p>
          </div>

          {/* Process / imagery column */}
          <div className="relative flex flex-col gap-6 sm:gap-8">
            {/* Warm gradient block as editorial image */}
            <motion.div
              variants={childFade}
              className="relative overflow-hidden rounded-3xl border border-[rgba(145,75,26,0.25)] bg-gradient-to-br from-[color:var(--nw-cream-soft)] via-[color:var(--nw-amber-light)]/60 to-[color:var(--nw-amber)]/70 px-6 py-7 sm:px-8 sm:py-9 shadow-[0_24px_60px_rgba(145,75,26,0.18)]"
            >
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="max-w-xs space-y-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--nw-cocoa)]/85">
                    The making
                  </p>
                  <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-[color:var(--nw-ink-soft)]">
                    A bottle drawn to live in candlelight.
                  </h3>
                  <p className="text-[0.76rem] sm:text-xs leading-relaxed text-[color:var(--nw-cocoa)]/95">
                    Soft shoulders, a balanced foot, and label proportions that
                    echo the rhythm of a book spine. The silhouette is meant to
                    feel familiar, almost literary, when it sits beside a
                    bedside lamp or in a stack of art books.
                  </p>
                </div>
                <div className="hidden sm:flex h-28 w-20 items-center justify-center rounded-2xl border border-[rgba(145,75,26,0.28)] bg-[rgba(247,241,232,0.75)]/80 backdrop-blur-sm shadow-[0_16px_40px_rgba(120,68,28,0.35)]">
                  <div className="relative h-[86%] w-[40%]">
                    <div className="absolute bottom-0 inset-x-0 h-[78%] rounded-[24px] bg-gradient-to-b from-[rgba(242,194,155,0.9)] to-[rgba(145,75,26,0.95)]" />
                    <div className="absolute bottom-[26%] inset-x-[-18%] h-[32%] rounded-[22px] border border-[rgba(90,52,32,0.22)] bg-[color:var(--nw-cream)]" />
                    <div className="absolute top-0 inset-x-[10%] h-[22%] rounded-t-[14px] rounded-b-[18px] bg-gradient-to-b from-[rgba(255,252,247,0.96)] to-[rgba(244,215,186,0.92)]" />
                  </div>
                </div>
              </div>

              {/* Soft vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(117,64,30,0.5),_transparent_50%)] opacity-60" />
            </motion.div>

            {/* Quote card */}
            <motion.div
              variants={childFade}
              className="relative max-w-md rounded-2xl border border-[rgba(145,75,26,0.22)] bg-[color:var(--nw-cream-soft)]/90 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_16px_40px_rgba(91,52,32,0.18)]"
            >
              <div className="mb-3 flex items-center gap-2 text-[color:var(--nw-cocoa)]/80">
                <Quote className="h-4 w-4" />
                <span className="text-[0.7rem] uppercase tracking-[0.26em]">from the founder</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[color:var(--nw-cocoa)]">
                "We think of water as punctuation. It appears at the threshold of
                a room, in the pause between conversations, at the close of an
                evening. Our work is to make that punctuation feel as considered
                as every other detail you&apos;ve labored over."
              </p>
              <p className="mt-3 text-[0.7rem] font-medium tracking-wide text-[color:var(--nw-cocoa)]/85">
                — Nishant, Founder & Editor of Waters
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* VALUES / PRINCIPLES SECTION */}
      <section className="w-full bg-[color:var(--nw-cream-soft)] py-16 sm:py-20 lg:py-24">
        <motion.div
          className="w-full max-w-[1600px] mx-auto px-6 lg:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerChildren}
        >
          <motion.div
            variants={childFade}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-xl space-y-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--nw-cocoa)]/80">
                What we stand beside
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[2.1rem] text-[color:var(--nw-ink-soft)]">
                Three quiet commitments, poured into every bottle.
              </h2>
            </div>
            <p className="max-w-sm text-[0.78rem] sm:text-xs leading-relaxed text-[color:var(--nw-cocoa)]/85">
              We design Nishant Waters to be a long-term part of your space, not
              a seasonal trend. These principles guide every decision we make,
              from sourcing and printing to how each case leaves our studio.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Value 1 */}
            <motion.div variants={childFade}>
              <Card className="group h-full border-[rgba(145,75,26,0.22)] bg-[color:var(--nw-cream)]/60 shadow-[0_14px_38px_rgba(91,52,32,0.14)] transition-colors duration-300 hover:bg-[color:var(--nw-cream)]">
                <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--nw-amber-light)]/40 text-[color:var(--nw-cocoa)] shadow-[0_8px_18px_rgba(145,75,26,0.2)] transition-colors duration-300 group-hover:bg-[color:var(--nw-amber)]/60">
                      <Leaf className="h-4 w-4" />
                    </div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.23em] text-[color:var(--nw-cocoa)]">
                      Considered materials
                    </p>
                  </div>
                  <p className="font-['Playfair_Display'] text-lg text-[color:var(--nw-ink-soft)]">
                    Glass that wants to be refilled.
                  </p>
                  <p className="text-[0.8rem] leading-relaxed text-[color:var(--nw-cocoa)]/90">
                    Our bottles are designed to live multiple lives: refilled
                    for daily service, pressed into use as single stems, or
                    tucked into guest rooms as keepsakes. The more seasons they
                    stay on your shelves, the better.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={childFade}>
              <Card className="group h-full border-[rgba(145,75,26,0.22)] bg-[color:var(--nw-cream)]/60 shadow-[0_14px_38px_rgba(91,52,32,0.14)] transition-colors duration-300 hover:bg-[color:var(--nw-cream)]">
                <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--nw-amber-light)]/40 text-[color:var(--nw-cocoa)] shadow-[0_8px_18px_rgba(145,75,26,0.2)] transition-colors duration-300 group-hover:bg-[color:var(--nw-amber)]/60">
                      <Droplets className="h-4 w-4" />
                    </div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.23em] text-[color:var(--nw-cocoa)]">
                      Edited customization
                    </p>
                  </div>
                  <p className="font-['Playfair_Display'] text-lg text-[color:var(--nw-ink-soft)]">
                    A palette that speaks softly.
                  </p>
                  <p className="text-[0.8rem] leading-relaxed text-[color:var(--nw-cocoa)]/90">
                    Instead of infinite options, we offer a consciously narrow
                    spectrum of brandy-toned labels. Each hue has been tested in
                    natural light, candlelight, and on camera so your bottles
                    feel consistent across every moment.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={childFade}>
              <Card className="group h-full border-[rgba(145,75,26,0.22)] bg-[color:var(--nw-cream)]/60 shadow-[0_14px_38px_rgba(91,52,32,0.14)] transition-colors duration-300 hover:bg-[color:var(--nw-cream)]">
                <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--nw-amber-light)]/40 text-[color:var(--nw-cocoa)] shadow-[0_8px_18px_rgba(145,75,26,0.2)] transition-colors duration-300 group-hover:bg-[color:var(--nw-amber)]/60">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.23em] text-[color:var(--nw-cocoa)]">
                      Hospitality first
                    </p>
                  </div>
                  <p className="font-['Playfair_Display'] text-lg text-[color:var(--nw-ink-soft)]">
                    Built around your service rituals.
                  </p>
                  <p className="text-[0.8rem] leading-relaxed text-[color:var(--nw-cocoa)]/90">
                    From minibar shelves to chef&apos;s counters, we think in terms
                    of reach, rhythm, and ritual. Cases are packed to slot into
                    existing storage, labels are designed for easy reading at a
                    glance, and reorders are meant to be a single calm email.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* CLOSING INVITATION / HORIZONTAL STORY STRIP */}
      <section className="w-full bg-[color:var(--nw-ink-soft)] text-[color:var(--nw-cream)] py-16 sm:py-20 lg:py-24">
        <motion.div
          className="w-full max-w-[1600px] mx-auto px-6 lg:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center">
            <div className="space-y-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[rgba(242,194,155,0.88)]">
                A note on time
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[2.1rem] text-[color:var(--nw-cream)]">
                We design for the first impression—and the fiftieth.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[rgba(247,241,232,0.9)]">
                Most guests will only notice our bottles for a few seconds: a
                first arrival to their room, a pause between courses, a quiet
                morning by the window. But your team will live with them every
                day. We design for both—with durability, refilling, and storage
                considered from the start.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[rgba(248,232,211,0.88)]">
                We&apos;d be honored to sketch the first draft of your bottled
                ritual. When you&apos;re ready, you can begin by exploring the
                collection or sending us a note about your space, palette, and
                service style.
              </p>
            </div>

            {/* Horizontal editorial strip */}
            <div className="relative h-[220px] sm:h-[260px] lg:h-[280px] overflow-hidden rounded-3xl border border-[rgba(248,232,211,0.18)] bg-[radial-gradient(circle_at_left,_rgba(242,194,155,0.32),_transparent_55%),radial-gradient(circle_at_right,_rgba(145,75,26,0.9),_rgba(0,0,0,0.95))] shadow-[0_28px_80px_rgba(0,0,0,0.78)]">
              {/* Foreground composition: stacked bottles & label swatches */}
              <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-8 py-6">
                {/* Twin bottles */}
                <div className="flex items-end gap-5 sm:gap-7">
                  <div className="relative h-40 w-14 sm:h-48 sm:w-16">
                    <div className="absolute bottom-0 inset-x-0 h-[80%] rounded-[26px] bg-gradient-to-b from-[rgba(250,246,239,0.9)] via-[rgba(242,194,155,0.86)] to-[rgba(91,52,32,0.98)]" />
                    <div className="absolute bottom-[28%] inset-x-[-18%] h-[30%] rounded-[22px] border border-[rgba(90,52,32,0.26)] bg-[rgba(248,232,211,0.98)]" />
                    <div className="absolute top-0 inset-x-[5%] h-[20%] rounded-t-[18px] rounded-b-[18px] bg-gradient-to-b from-[rgba(255,252,247,0.98)] to-[rgba(246,214,181,0.9)]" />
                  </div>
                  <div className="relative h-32 w-12 sm:h-40 sm:w-14 translate-y-3 opacity-85">
                    <div className="absolute bottom-0 inset-x-0 h-[80%] rounded-[24px] bg-gradient-to-b from-[rgba(248,232,211,0.96)] via-[rgba(225,176,124,0.85)] to-[rgba(68,40,26,0.98)]" />
                    <div className="absolute bottom-[26%] inset-x-[-18%] h-[32%] rounded-[21px] border border-[rgba(80,48,30,0.32)] bg-[rgba(210,140,69,0.96)]" />
                    <div className="absolute top-0 inset-x-[10%] h-[20%] rounded-t-[16px] rounded-b-[16px] bg-gradient-to-b from-[rgba(255,252,247,0.98)] to-[rgba(241,207,175,0.92)]" />
                  </div>
                </div>

                {/* Label palette column */}
                <div className="flex flex-col items-end gap-2 sm:gap-3">
                  <p className="text-[0.64rem] uppercase tracking-[0.26em] text-[rgba(248,232,211,0.88)]">
                    Label palette studies
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-5 w-10 rounded-full border border-[rgba(248,232,211,0.6)] bg-[color:var(--nw-cream-soft)] shadow-[0_6px_14px_rgba(0,0,0,0.4)]",
                        )}
                      />
                      <span className="text-[0.65rem] text-[rgba(248,232,211,0.92)]">
                        Soft Cream · Turndown
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-5 w-10 rounded-full border border-[rgba(248,232,211,0.6)] bg-[color:var(--nw-amber-light)] shadow-[0_6px_14px_rgba(0,0,0,0.4)]",
                        )}
                      />
                      <span className="text-[0.65rem] text-[rgba(248,232,211,0.92)]">
                        Honey Amber · Arrival
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-5 w-10 rounded-full border border-[rgba(248,232,211,0.6)] bg-[color:var(--nw-amber-deep)] shadow-[0_6px_14px_rgba(0,0,0,0.4)]",
                        )}
                      />
                      <span className="text-[0.65rem] text-[rgba(248,232,211,0.92)]">
                        Smoked Caramel · Night
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soft overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_55%)]" />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;