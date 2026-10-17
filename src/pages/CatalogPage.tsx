import React from "react";
import { motion } from "framer-motion";
import { Search, Palette } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Separator,
} from "@/components/ui/shadcn";
import {
  BRANDY_PALETTE,
  BrandyColorKey,
  LABEL_COLOR_KEYS,
  ProductSKU,
  formatMoney,
  useProducts,
} from "@/mock";
import ProductCard from "@/components/ProductCard";

// NOTE: This page is 100% frontend-only and backed by the
// mock state layer in src/mock.ts (no real backend).

const colorKeyToLabel: Record<BrandyColorKey, string> = {
  cream: "Ivory Glass",
  creamSoft: "Soft Cream",
  amberLight: "Honey Amber",
  amber: "Brandy Gold",
  amberDeep: "Smoked Caramel",
  sienna: "Kiln Sienna",
  cocoa: "Roasted Cocoa",
  inkSoft: "Soft Ink",
};

const CatalogPage: React.FC = () => {
  const products = useProducts();

  const [activeColorKey, setActiveColorKey] = React.useState<BrandyColorKey | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    let list: ProductSKU[] = products;

    if (activeColorKey !== "all") {
      list = list.filter((p) =>
        p.labelColors.some((c) => c.key === activeColorKey)
      );
    }

    const term = searchTerm.trim().toLowerCase();
    if (!term) return list;

    return list.filter((p) => {
      const haystack = (
        p.name +
        " " +
        p.description +
        " " +
        p.shortDescription +
        " " +
        p.capacityMl.toString()
      ).toLowerCase();
      return haystack.includes(term);
    });
  }, [products, activeColorKey, searchTerm]);

  return (
    <div className="w-full min-h-screen bg-[color:var(--nw-cream,#f7f1e8)] text-[color:var(--nw-ink,#2b211a)]">
      {/* Top banner / intro */}
      <section
        className="w-full border-b border-[rgba(43,33,26,0.12)] bg-gradient-to-b from-[rgba(210,140,69,0.14)] via-[rgba(247,241,232,0.9)] to-[rgba(247,241,232,1)]"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14 flex flex-col gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
         >
            <div className="max-w-2xl">
              <p className="uppercase tracking-[0.2em] text-xs text-[rgba(91,52,32,0.8)] mb-2">
                Collection
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-['Playfair_Display'] leading-tight text-[color:var(--nw-ink,#2b211a)]">
                Bottles for rooms, galleries & quiet celebrations.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[rgba(91,52,32,0.85)] max-w-xl">
                Browse the Nishant Waters family of custom-labeled bottles. Each
                silhouette is tuned for a different ritual—from turn-down
                service to chef&apos;s tables.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:text-right text-sm text-[rgba(91,52,32,0.8)]">
              <p>
                {filteredProducts.length} of {products.length} pieces
                available.
              </p>
              <p>
                From {formatMoney(Math.min(...products.map((p) => p.price)))} per
                bottle, with warm-brandy labels included.
              </p>
            </div>
          </motion.div>

          {/* Filters Row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
            className="flex flex-col gap-4 mt-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[rgba(210,140,69,0.25)] rounded-full px-3 py-1.5 shadow-[0_10px_25px_rgba(43,33,26,0.06)]">
                <Search className="w-4 h-4 text-[rgba(91,52,32,0.8)]" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, size or mood"
                  className="border-0 shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-[rgba(91,52,32,0.55)] px-0"
                />
              </div>

              {/* Color filter */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[rgba(91,52,32,0.8)]">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Label tone</span>
                </div>
                <Tabs
                  value={activeColorKey}
                  onValueChange={(val) =>
                    setActiveColorKey(val as BrandyColorKey | "all")
                  }
                  className="w-full"
                >
                  <TabsList className="flex w-full justify-start gap-1 bg-[rgba(247,241,232,0.9)] border border-[rgba(210,140,69,0.22)] rounded-full px-1 py-0.5 overflow-x-auto scrollbar-hide">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-[color:var(--nw-ink,#2b211a)] data-[state=active]:text-[color:var(--nw-cream,#f7f1e8)] rounded-full px-3 py-1.5 text-xs font-medium text-[rgba(91,52,32,0.9)] whitespace-nowrap"
                    >
                      All tones
                    </TabsTrigger>
                    {LABEL_COLOR_KEYS.map((key) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-[rgba(91,52,32,0.9)] data-[state=active]:bg-[color:var(--nw-ink,#2b211a)] data-[state=active]:text-[color:var(--nw-cream,#f7f1e8)] whitespace-nowrap"
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-[rgba(43,33,26,0.35)]"
                          style={{ backgroundColor: BRANDY_PALETTE[key] }}
                        />
                        <span>{colorKeyToLabel[key]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Hidden content sections; we do not need per-tab body but Tabs requires at least one. */}
                  <TabsContent value={activeColorKey} className="hidden" />
                </Tabs>
              </div>
            </div>

            <Separator className="bg-[rgba(210,140,69,0.2)]" />
          </motion.div>
        </div>
      </section>

      {/* Masonry grid section */}
      <section className="w-full py-10 lg:py-14">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-start gap-4 max-w-md"
            >
              <p className="text-sm text-[rgba(91,52,32,0.8)]">
                Nothing surfaced in this part of the archive. Try softening
                your search or choosing a different label tone.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveColorKey("all");
                  setSearchTerm("");
                }}
                className="rounded-full border-[rgba(210,140,69,0.65)] bg-white/80 text-[color:var(--nw-ink,#2b211a)] hover:bg-[rgba(210,140,69,0.08)] hover:text-[color:var(--nw-ink,#2b211a)] transition-colors duration-150"
              >
                Reset filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
              className="[column-fill:_balance] columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-7"
            >
              {filteredProducts.map((product, index) => {
                const isTall = index % 4 === 1; // make every fourth starting at 1 taller for asymmetry

                return (
                  <motion.div
                    key={product.id}
                    layout
                    className="mb-6 break-inside-avoid"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <div
                      className={
                        "rounded-[28px] overflow-hidden border border-[rgba(210,140,69,0.28)] bg-white shadow-[0_18px_40px_rgba(43,33,26,0.08)]" +
                        (isTall ? " lg:min-h-[430px]" : "")
                      }
                    >
                      <ProductCard product={product} />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Subtle bottom note */}
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mt-10 lg:mt-14 text-xs sm:text-sm text-[rgba(91,52,32,0.75)] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p>
            All pricing shown is purely illustrative for this frontend-only
            mock. No orders are actually processed.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3 h-8 rounded-full text-[rgba(91,52,32,0.9)] hover:bg-[rgba(210,140,69,0.12)] border border-transparent hover:border-[rgba(210,140,69,0.35)] text-xs"
                >
                  How customization works
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-[color:var(--nw-ink,#2b211a)] text-[color:var(--nw-cream,#f7f1e8)] border-0">
                <p className="text-xs">
                  Choose a bottle, pick a label tone, and tailor text on the
                  product detail page. This demo only simulates the flow—no
                  files or payments are collected.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;