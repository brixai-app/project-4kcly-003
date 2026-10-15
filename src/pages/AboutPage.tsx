import React from "react";
import { MotionFadeIn, MotionSlideUp } from "../components/ui/Motion";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Divider } from "../components/ui/Divider";

const editorialBlocks = [
  {
    eyebrow: "The Origin",
    title: "Born from a Quiet Obsession with Detail",
    body: `Nishant Waters began as a simple question: why should everyday hydration
    look ordinary? Our founders spent years immersed in the worlds of
    hospitality, fashion, and product design, sketching bottles in cafés and
    obsessing over the tactility of glass, the tone of a label, the weight of
    a cap in the hand. Every millimeter of each bottle is refined to feel
    quietly exceptional—never loud, always considered.`,
    align: "left" as const,
  },
  {
    eyebrow: "Design Philosophy",
    title: "Where Minimal Forms Meet Warm Luxury",
    body: `We reject stark sterility in favor of warm minimalism. Soft ivory
    labels, deep teal accents, and subtle typography create a visual language
    that feels at home on a marble counter, a boardroom table, or a private
    event. Each collection is curated like an editorial story—photographed in
    natural light, styled with real interiors, and designed to complement,
    not compete with, your space.`,
    align: "right" as const,
  },
  {
    eyebrow: "Sustainable Intention",
    title: "Considered Materials, Conscious Choices",
    body: `We believe that luxury is inseparable from responsibility. Our
    partners prioritize responsible sourcing, and our packaging is selected
    for recyclability and longevity. Instead of disposable impressions, we
    create pieces designed to be refilled, cherished, and displayed. Every
    order is produced in small, intentional batches to minimize waste while
    maximizing impact.`,
    align: "left" as const,
  },
  {
    eyebrow: "The Bespoke Experience",
    title: "A Signature Touch in Every Drop",
    body: `From intimate gatherings to grand openings, Nishant Waters transforms
    hydration into a signature brand moment. Our customization studio allows
    you to craft labels that whisper your story—never shouting. Choose
    typographic pairings, color accents, and icons that mirror your personal
    or brand identity, then preview your bottle in real time before it
    reaches your hands.`,
    align: "right" as const,
  },
];

const values = [
  {
    title: "Quiet Confidence",
    description:
      "We design for the person who notices the stitching on a sleeve, the curve of a chair, the weight of a glass.",
  },
  {
    title: "Thoughtful Rituals",
    description:
      "Hydration is not an afterthought. It is an elegant ritual woven into your day—designed, refined, and intentional.",
  },
  {
    title: "Enduring Quality",
    description:
      "From print techniques to materials, every detail is chosen to look as good on day 300 as it does on day one.",
  },
];

export const AboutPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] w-full max-h-[720px]">
          <div
            className="absolute inset-0 bg-[url('https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/70 to-transparent" />
          <div className="relative flex h-full items-center px-6 py-16 sm:px-10 lg:px-20">
            <MotionSlideUp className="max-w-3xl space-y-5 bg-[#FAF9F6]/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
              <p className="text-xs tracking-[0.3em] uppercase text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
                About Nishant Waters
              </p>
              <h1 className="font-[\"Playfair Display\",_serif] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                Water, Reimagined as a <span className="italic">Quiet Luxury</span>
                
              </h1>
              <p className="text-sm sm:text-base text-[#4A4A4A] max-w-xl">
                Nishant Waters crafts bespoke bottled water experiences that feel at
                once effortless and meticulously considered. Every bottle is an
                object of design, every label a story.
              </p>
            </MotionSlideUp>
          </div>
        </div>
      </section>

      {/* Narrative sections */}
      <section className="px-6 py-16 sm:px-10 lg:px-20 lg:py-24 space-y-20">
        {editorialBlocks.map((block, index) => (
          <MotionFadeIn
            key={block.title}
            className={`grid gap-10 lg:grid-cols-2 items-center ${
              block.align === "right" ? "lg:grid-flow-col-dense" : ""
            }`}
          >
            {block.align === "left" ? (
              <>
                <NarrativeCopy {...block} />
                <EditorialImage index={index} />
              </>
            ) : (
              <>
                <EditorialImage index={index} />
                <NarrativeCopy {...block} />
              </>
            )}
          </MotionFadeIn>
        ))}
      </section>

      <Divider className="mx-6 sm:mx-10 lg:mx-20" />

      {/* Values */}
      <section className="px-6 py-16 sm:px-10 lg:px-20 lg:py-20 bg-[#F3F1EB]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="Our Perspective"
            title="The Principles Behind the Pour"
            align="center"
          />
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {values.map((value) => (
              <MotionSlideUp key={value.title}>
                <div className="border border-[#DDD6C5] bg-[#FAF9F6] rounded-2xl px-5 py-6 shadow-sm h-full flex flex-col">
                  <h3 className="font-[\"Playfair Display\",_serif] text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </MotionSlideUp>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-16 sm:px-10 lg:px-20 lg:py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto">
          <MotionFadeIn className="border border-[#DDD6C5] rounded-3xl overflow-hidden bg-gradient-to-r from-[#FAF9F6] to-[#F3F1EB]">
            <div className="grid md:grid-cols-[1.1fr,0.9fr]">
              <div className="p-8 sm:p-10 flex flex-col justify-center space-y-4">
                <p className="text-xs tracking-[0.3em] uppercase text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
                  For considered hosts & creators
                </p>
                <h2 className="font-[\"Playfair Display\",_serif] text-2xl sm:text-3xl leading-tight">
                  Shape your next moment with a signature bottle.
                </h2>
                <p className="text-sm text-[#4A4A4A] max-w-xl">
                  Whether you are setting a table for twelve or launching a new
                  collection, Nishant Waters helps you weave your story into every
                  detail—right down to the bottle in your guest's hand.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-full bg-[#004D40] px-6 py-2.5 text-sm font-medium tracking-wide text-[#FAF9F6] shadow-[0_12px_30px_rgba(0,77,64,0.35)] transition-colors duration-200 hover:bg-[#006556] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]"
                  >
                    Explore the collection
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-[#004D40] px-6 py-2.5 text-sm font-medium tracking-wide text-[#004D40] bg-transparent transition-colors duration-200 hover:bg-[#004D40] hover:text-[#FAF9F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6]"
                  >
                    Speak with our studio
                  </a>
                </div>
              </div>
              <div className="relative h-56 md:h-full bg-[url('https://images.pexels.com/photos/1458680/pexels-photo-1458680.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/50 via-transparent" />
              </div>
            </div>
          </MotionFadeIn>
        </div>
      </section>
    </main>
  );
};

interface NarrativeCopyProps {
  eyebrow: string;
  title: string;
  body: string;
}

const NarrativeCopy: React.FC<NarrativeCopyProps> = ({ eyebrow, title, body }) => (
  <div className="space-y-4 max-w-xl">
    <p className="text-[11px] tracking-[0.32em] uppercase text-[#A89F91] font-[\"Bodoni Moda\",_serif]">
      {eyebrow}
    </p>
    <h2 className="font-[\"Playfair Display\",_serif] text-2xl sm:text-3xl leading-tight">
      {title}
    </h2>
    <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed whitespace-pre-line">
      {body}
    </p>
  </div>
);

const editorialImages = [
  "https://images.pexels.com/photos/1451348/pexels-photo-1451348.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3735162/pexels-photo-3735162.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/7691739/pexels-photo-7691739.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1451351/pexels-photo-1451351.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

const EditorialImage: React.FC<{ index: number }> = ({ index }) => (
  <div className="relative h-64 sm:h-80 lg:h-[320px] overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
    <div
      className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 hover:scale-110"
      style={{ backgroundImage: `url(${editorialImages[index % editorialImages.length]})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/45 via-transparent" />
  </div>
);

export default AboutPage;