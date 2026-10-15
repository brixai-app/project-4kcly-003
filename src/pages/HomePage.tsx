import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "../mock";
import { Container } from "../components/layout/Container";
import { ProductMasonryGallery } from "../components/product/ProductMasonryGallery";
import { PageTransition } from "../components/layout/PageTransition";
import { MotionButton } from "../components/ui/MotionButton";
import { tokens } from "../theme/tokens";

const heroImage =
  "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1600";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const featured = products.slice(0, 6);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[color:var(--nw-bg)]">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Curated bottles on a warm stone table"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(15,10,5,0.82)] via-[rgba(34,22,12,0.78)] to-[rgba(112,130,56,0.7)]" />
          </div>

          <Container className="relative z-10 flex min-h-[70vh] flex-col justify-center py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl rounded-[12px] bg-[color:var(--nw-panel)]/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-9"
            >
              <p className="mb-3 text-xs font-medium tracking-[0.26em] text-[color:var(--nw-accent-muted)] uppercase">
                NISHANT WATERS
              </p>
              <h1
                className="font-heading text-3xl leading-tight text-[color:var(--nw-ink)] sm:text-4xl md:text-5xl"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                Custom-labeled water bottles
                <span className="block text-[color:var(--nw-accent)]">
                  for considered living.
                </span>
              </h1>
              <p
                className="mt-4 max-w-xl text-sm text-[color:var(--nw-ink-soft)] sm:text-base"
                style={{ fontFamily: tokens.fonts.body }}
              >
                Design bottles that feel like objects of desire—elevated silhouettes,
                tactile labels, and colors drawn from earth, clay, and coastal light.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <MotionButton
                  variant="primary"
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-2 rounded-[999px] px-6 py-2.5 text-sm font-medium"
                >
                  Shop the collection
                  <ArrowRight className="h-4 w-4" />
                </MotionButton>
                <button
                  type="button"
                  onClick={() => {
                    const section = document.getElementById("featured");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-medium text-[color:var(--nw-ink-soft)] underline-offset-4 hover:text-[color:var(--nw-ink)] hover:underline"
                >
                  Explore featured designs
                </button>
              </div>
            </motion.div>
          </Container>
        </section>

        <section id="featured" className="bg-[color:var(--nw-bg)] py-14 md:py-18">
          <Container>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2
                  className="font-heading text-2xl text-[color:var(--nw-ink)] sm:text-3xl"
                  style={{ fontFamily: tokens.fonts.heading }}
                >
                  Featured water silhouettes
                </h2>
                <p
                  className="mt-2 max-w-xl text-sm text-[color:var(--nw-ink-soft)]"
                  style={{ fontFamily: tokens.fonts.body }}
                >
                  A rotating edit of bestselling bottles, from minimalist glass to
                  sun-warmed terracotta tones. Each can be customized with your label,
                  typography, and color story.
                </p>
              </div>
              <div className="flex gap-3 text-xs text-[color:var(--nw-ink-soft)]">
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--nw-accent)]" />
                  Customizable labels
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--nw-terracotta)]" />
                  Small-batch production
                </div>
              </div>
            </div>

            <ProductMasonryGallery products={featured} />
          </Container>
        </section>

        <section className="border-t border-[color:var(--nw-border-soft)] bg-[color:var(--nw-panel)] py-12">
          <Container className="grid gap-8 md:grid-cols-[1.4fr,1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-[12px] bg-[color:var(--nw-bg)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
            >
              <h3
                className="font-heading text-xl text-[color:var(--nw-ink)]"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                Intentional details, from cap to base.
              </h3>
              <p
                className="mt-3 text-sm text-[color:var(--nw-ink-soft)]"
                style={{ fontFamily: tokens.fonts.body }}
              >
                Our label editor lets you play with type systems, color planes, and
                imagery without feeling like software. Drag, drop, and refine as if you
                were working in a studio—right in your browser.
              </p>
              <ul className="mt-4 grid gap-3 text-xs text-[color:var(--nw-ink-soft)] sm:grid-cols-2">
                <li className="rounded-[10px] bg-[color:var(--nw-panel-soft)] px-3 py-2">
                  Fluid typography presets designed for bottles.
                </li>
                <li className="rounded-[10px] bg-[color:var(--nw-panel-soft)] px-3 py-2">
                  Palette suggestions inspired by clay, stone, and sea glass.
                </li>
                <li className="rounded-[10px] bg-[color:var(--nw-panel-soft)] px-3 py-2">
                  Mock uploads only—no files leave your browser in this MVP.
                </li>
                <li className="rounded-[10px] bg-[color:var(--nw-panel-soft)] px-3 py-2">
                  Save designs to your cart and revisit before checkout.
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-between rounded-[12px] bg-[color:var(--nw-terracotta-soft)] px-6 py-7 text-[color:var(--nw-ink-strong)]"
            >
              <div>
                <h3
                  className="font-heading text-lg"
                  style={{ fontFamily: tokens.fonts.heading }}
                >
                  Crafted as a teaser experience.
                </h3>
                <p
                  className="mt-3 text-sm"
                  style={{ fontFamily: tokens.fonts.body }}
                >
                  This launch version of Nishant Waters is fully front-end and uses
                  carefully designed mock data—no real checkout, no external uploads,
                  and no server. It is intentionally built to feel like a finished
                  store while remaining safe for exploration.
                </p>
              </div>
              <p className="mt-4 text-xs opacity-75">
                All products, prices, and orders are mocked locally in your browser to
                make future backend integration seamless.
              </p>
            </motion.div>
          </Container>
        </section>
      </div>
    </PageTransition>
  );
};

export default HomePage;