import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Sparkles, Leaf } from "lucide-react";

import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/shadcn";
import { Product, getProducts, formatCurrency } from "@/mock";
import { ProductCard } from "@/components/ProductCard";

export interface HomePageProps {
  onAddToCart?: (productId: string, variantId: string) => void;
}

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] } },
};

const heroImageVariants = {
  hidden: { opacity: 0, x: 40, scale: 1.02 },
  enter: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const ctaVariants = {
  hover: { y: -1, boxShadow: "0 18px 40px rgba(40, 20, 10, 0.28)" },
  tap: { y: 0, scale: 0.99 },
};

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();

  const products = React.useMemo(() => getProducts(), []);
  const featured = products.filter(p => p.featured);
  const fallback = products[0];
  const heroProduct: Product | undefined = featured[0] ?? fallback;

  const showcaseProducts: Product[] = React.useMemo(() => {
    const pool = products.slice(0, 8);
    if (!heroProduct) return pool;
    return pool.filter(p => p.id !== heroProduct.id).slice(0, 6);
  }, [products, heroProduct]);

  const handlePrimaryCta = () => {
    navigate("/shop");
  };

  const handleSecondaryCta = () => {
    if (heroProduct) {
      navigate(`/product/${heroProduct.slug}`);
    }
  };

  const handleQuickAdd = (productId: string) => {
    if (!onAddToCart) return;
    const product = products.find(p => p.id === productId);
    const firstVariant = product?.variants[0];
    if (!product || !firstVariant) return;
    onAddToCart(product.id, firstVariant.id);
  };

  return (
    <motion.main
      initial="hidden"
      animate="enter"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-screen bg-[#0f0b08] text-[#f6eee5]"
    >
      {/* HERO */}
      <section className="relative w-full min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a120d] via-[#20130f] to-[#4b2b1a]" />
        {/* Texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-50 mix-blend-soft-light" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.09),transparent_55%),radial-gradient(circle_at_100%_0,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(0,0,0,0.45),transparent_60%)]" />
        </div>

        <div className="relative z-10 w-full px-6 lg:px-12 py-16 lg:py-24">
          <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-center">
            {/* Text column */}
            <motion.div variants={heroTextVariants}>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f4e2c4]/20 bg-[#1a120d]/60 px-4 py-1 text-xs tracking-[0.25em] uppercase text-[#f4e2c4]/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c87a3b]" />
                Custom labeled water, quietly exquisite
              </p>

              <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight text-[#f8f0e4]">
                Water that
                <br className="hidden sm:block" />
                <span className="ml-1 bg-gradient-to-r from-[#f5dfc4] via-[#e1b47a] to-[#c37e3c] bg-clip-text text-transparent">
                  belongs on your table.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#f4e2c4]/85 font-light">
                Nishant Waters wraps still and sparkling bottles in warm brandy-toned labels, designed to carry your logotype,
                monogram, or a single considered line of text. Built for restaurants, studios, and spaces that care about every detail.
              </p>

              {heroProduct && (
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <motion.div
                    variants={ctaVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-flex"
                  >
                    <Button
                      onClick={handlePrimaryCta}
                      className="group relative inline-flex items-center gap-2 rounded-full bg-[#c87a3b] px-7 py-2.5 text-sm font-medium tracking-wide text-[#1a120d] shadow-[0_16px_45px_rgba(0,0,0,0.35)] hover:bg-[#d48842] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a120d] focus-visible:ring-[#f5dfc4] transition-colors"
                    >
                      Browse the collection
                      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </Button>
                  </motion.div>

                  <button
                    type="button"
                    onClick={handleSecondaryCta}
                    className="group inline-flex items-center gap-2 rounded-full border border-[#f4e2c4]/35 bg-transparent px-4 py-2 text-xs sm:text-sm font-medium tracking-wide text-[#f4e2c4]/90 hover:bg-[#f4e2c4]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5dfc4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a120d] transition-colors"
                  >
                    Explore {heroProduct.name}
                    <span className="h-1 w-10 rounded-full bg-gradient-to-r from-transparent via-[#f4e2c4]/80 to-transparent opacity-60 transition group-hover:opacity-100" />
                  </button>
                </div>
              )}

              {heroProduct && (
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#f4e2c4]/75">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-[#f0d4ad]" />
                    <span>
                      Starting at {formatCurrency(heroProduct.variants[0]?.priceCents ?? 0)} per bottle
                    </span>
                  </div>
                  <div className="h-3 w-px bg-[#f4e2c4]/30" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#f0d4ad]" />
                    <span>Minimums built for intimate venues and studios</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Image column */}
            <motion.div
              className="relative h-[360px] sm:h-[420px] md:h-[460px] lg:h-[520px] xl:h-[560px]"
              variants={heroImageVariants}
            >
              <div className="pointer-events-none absolute inset-0 rounded-[3.5rem] border border-[#f4e2c4]/15 bg-gradient-to-b from-[#f4e2c4]/6 via-[#1a120d]/20 to-[#1a120d]/70 shadow-[0_40px_140px_rgba(0,0,0,0.72)] backdrop-blur-[26px]" />

              <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[3.5rem]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0,rgba(244,219,186,0.25),transparent_60%),radial-gradient(circle_at_90%_10%,rgba(181,106,60,0.6),transparent_55%)] mix-blend-screen" />

                <div className="relative h-[130%] w-auto translate-y-6">
                  {/* Oversized bottle silhouette using gradients if actual image missing */}
                  <div className="relative mx-auto flex h-full w-[160px] sm:w-[190px] md:w-[220px] items-center justify-center">
                    <div className="absolute inset-x-10 bottom-0 top-6 rounded-[90px] bg-gradient-to-b from-[#fdf4e7]/80 via-[#f2dfc0]/60 to-[#c37e3c]/80 shadow-[0_38px_80px_rgba(0,0,0,0.65)]" />
                    <div className="absolute inset-x-16 top-8 bottom-16 rounded-[60px] bg-gradient-to-b from-[#fdf4e7]/95 via-[#f3e1c4]/80 to-[#f0dcb9]/65" />
                    <div className="absolute inset-x-18 top-[30%] bottom-[26%] rounded-[40px] border border-[#c87a3b]/40 bg-gradient-to-br from-[#c87a3b]/90 via-[#b56a3c]/85 to-[#3f2a23]/95 shadow-[0_12px_40px_rgba(0,0,0,0.6)]" />
                    <div className="absolute inset-x-[22%] top-[34%] bottom-[30%] rounded-[34px] border border-[#f4e2c4]/12 bg-[linear-gradient(to_bottom,rgba(244,226,196,0.5),rgba(244,226,196,0.06)),radial-gradient(circle_at_30%_0,rgba(255,255,255,0.52),transparent_55%)] mix-blend-soft-light" />
                    <div className="absolute inset-x-[24%] top-[31%] bottom-[67%] rounded-[32px] bg-gradient-to-b from-[#1a120d] via-[#3f2a23] to-[#f4e2c4]/40 shadow-[0_24px_45px_rgba(0,0,0,0.75)]" />
                    <div className="absolute inset-x-[32%] top-[66%] bottom-[10%] rounded-full bg-[#121212]/80 blur-[22px] opacity-80" />
                  </div>
                </div>

                {heroProduct && (
                  <div className="pointer-events-none absolute inset-x-8 bottom-8 flex justify-between text-[11px] text-[#f4e2c4]/80">
                    <div>
                      <p className="font-medium uppercase tracking-[0.2em] text-[#f5dfc4]">Featured label</p>
                      <p className="mt-1 font-['Playfair_Display'] text-base">{heroProduct.name}</p>
                    </div>
                    <div className="text-right">
                      <p>{heroProduct.variants[0]?.sizeMl ?? 500}ml glass</p>
                      <p>{heroProduct.variants[0]?.capColor}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="w-full border-y border-[#f4e2c4]/12 bg-[#160f0b] px-6 lg:px-12 py-10">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          <Card className="group relative border-[#f4e2c4]/15 bg-gradient-to-b from-[#21140f] via-[#160f0b] to-[#160f0b] text-[#f6eee5] shadow-[0_18px_55px_rgba(0,0,0,0.65)]">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c87a3b]/15 text-[#f5dfc4]">
                <Droplets className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-['Playfair_Display'] text-lg tracking-tight">Table-first silhouettes</CardTitle>
                <CardDescription className="text-[#f4e2c4]/75 text-xs">
                  Proportions tuned for linen, stoneware, and low light.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-[#f4e2c4]/85">
              From compact 330ml welcome bottles to tall 750ml sparkling, each vessel is designed to feel collected, not branded.
            </CardContent>
          </Card>

          <Card className="group relative border-[#f4e2c4]/15 bg-gradient-to-b from-[#23150f] via-[#160f0b] to-[#160f0b] text-[#f6eee5] shadow-[0_18px_55px_rgba(0,0,0,0.65)]">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8c595]/15 text-[#f5dfc4]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-['Playfair_Display'] text-lg tracking-tight">Label as canvas</CardTitle>
                <CardDescription className="text-[#f4e2c4]/75 text-xs">
                  Your logotype, monogram, or a single line of text.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-[#f4e2c4]/85">
              A curated palette of smoked ivories and amber tones keeps your brand present but quiet, in both daylight and candlelight.
            </CardContent>
          </Card>

          <Card className="group relative border-[#f4e2c4]/15 bg-gradient-to-b from-[#24170f] via-[#160f0b] to-[#160f0b] text-[#f6eee5] shadow-[0_18px_55px_rgba(0,0,0,0.65)]">
            <CardHeader className="flex flex-row items-center gap-4 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b56a3c]/18 text-[#f5dfc4]">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-['Playfair_Display'] text-lg tracking-tight">Considered sourcing</CardTitle>
                <CardDescription className="text-[#f4e2c4]/75 text-xs">
                  Still and sparkling, bottled for low-impact programs.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-[#f4e2c4]/85">
              This is a fully mocked frontend experience, but built to mirror a future supply chain that prioritizes thoughtful materials.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="w-full bg-[#0f0b08] px-6 lg:px-12 py-14 lg:py-18">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-4 mb-10 lg:mb-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#f4e2c4]/70">The collection</p>
                <h2 className="mt-2 font-['Playfair_Display'] text-3xl sm:text-4xl tracking-tight text-[#f8f0e4]">
                  Bottles for rooms that notice the water.
                </h2>
              </div>
              <button
                type="button"
                onClick={handlePrimaryCta}
                className="inline-flex items-center gap-2 rounded-full border border-[#f4e2c4]/30 bg-[#160f0b] px-4 py-2 text-xs sm:text-sm font-medium text-[#f4e2c4]/90 hover:bg-[#1d120c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5dfc4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0b08] transition-colors"
              >
                View all pieces
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="max-w-3xl text-sm sm:text-base text-[#f4e2c4]/80">
              Each mock product below is fully interactive within this frontend. Add to cart, adjust quantities, and explore label
              customization—all persisted locally in your browser only.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(240px,auto)] gap-5 lg:gap-6">
            {showcaseProducts.map((product, index) => {
              const isTall = index === 0 || index === 3;
              const isWide = index === 1 || index === 4;

              const colSpan =
                index === 0
                  ? "md:col-span-5"
                  : index === 1
                  ? "md:col-span-7"
                  : index === 2
                  ? "md:col-span-4"
                  : index === 3
                  ? "md:col-span-4"
                  : index === 4
                  ? "md:col-span-4"
                  : "md:col-span-4";

              const rowSpan = isTall ? "md:row-span-2" : "";

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={`${colSpan} ${rowSpan} flex`}
                >
                  <div
                    className={`flex w-full flex-col rounded-3xl border border-[#f4e2c4]/12 bg-gradient-to-b from-[#1a120d] via-[#120c09] to-[#0f0b08] p-4 sm:p-5 lg:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.75)] ${
                      isWide ? "md:flex-row" : "md:flex-col"
                    } gap-4 md:gap-5`}
                  >
                    <div className={`${isWide ? "md:w-1/2" : "w-full"}`}>
                      <ProductCard product={product} onAddToCart={handleQuickAdd} />
                    </div>

                    <div
                      className={`${
                        isWide
                          ? "md:w-1/2 flex flex-col justify-between"
                          : "w-full mt-2 flex flex-col justify-between"
                      } text-xs sm:text-sm text-[#f4e2c4]/80`}
                    >
                      <p className="font-light">
                        {product.shortDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
                        {product.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex rounded-full border border-[#f4e2c4]/20 bg-[#160f0b]/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f4e2c4]/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default HomePage;