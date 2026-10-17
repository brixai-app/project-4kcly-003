import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Badge,
  Separator,
} from "@/components/ui/shadcn";
import { Product, ID, Filters, getAvailableFilterOptions, filterProducts } from "@/mock";
import { ProductCard } from "@/components/ProductCard";

export interface CatalogPageProps {
  onAddToCart: (productId: ID) => void;
}

const filterPanelVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.03 * index, duration: 0.25, ease: "easeOut" },
  }),
};

export const CatalogPage: React.FC<CatalogPageProps> = ({ onAddToCart }) => {
  const [search, setSearch] = React.useState<string>("");
  const [selectedSizes, setSelectedSizes] = React.useState<number[]>([]);
  const [selectedCaps, setSelectedCaps] = React.useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = React.useState<
    ("Matte" | "Satin" | "Gloss")[]
  >([]);
  const [selectedPalettes, setSelectedPalettes] = React.useState<ID[]>([]);
  const [showFilters, setShowFilters] = React.useState(true);

  const options = React.useMemo(() => getAvailableFilterOptions(), []);

  const filters: Filters = React.useMemo(
    () => ({
      search: search.trim() || undefined,
      sizeMl: selectedSizes.length ? selectedSizes : undefined,
      capColors: selectedCaps.length ? selectedCaps : undefined,
      labelFinishes: selectedFinishes.length ? selectedFinishes : undefined,
      paletteIds: selectedPalettes.length ? selectedPalettes : undefined,
    }),
    [search, selectedSizes, selectedCaps, selectedFinishes, selectedPalettes],
  );

  const products: Product[] = React.useMemo(() => filterProducts(filters), [filters]);

  const hasActiveFilters =
    !!filters.search ||
    !!filters.sizeMl ||
    !!filters.capColors ||
    !!filters.labelFinishes ||
    !!filters.paletteIds;

  const clearFilters = () => {
    setSearch("");
    setSelectedSizes([]);
    setSelectedCaps([]);
    setSelectedFinishes([]);
    setSelectedPalettes([]);
  };

  const toggleNumberInArray = (value: number, arr: number[], setter: (next: number[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value));
    } else {
      setter([...arr, value]);
    }
  };

  const toggleStringInArray = (value: string, arr: string[], setter: (next: string[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value));
    } else {
      setter([...arr, value]);
    }
  };

  const toggleFinish = (
    value: "Matte" | "Satin" | "Gloss",
    arr: ("Matte" | "Satin" | "Gloss")[],
    setter: (next: ("Matte" | "Satin" | "Gloss")[]) => void,
  ) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value));
    } else {
      setter([...arr, value]);
    }
  };

  const togglePalette = (id: ID) => {
    if (selectedPalettes.includes(id)) {
      setSelectedPalettes(selectedPalettes.filter(p => p !== id));
    } else {
      setSelectedPalettes([...selectedPalettes, id]);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#f7eee4] text-[#1f130d]">
      {/* Top banner / intro */}
      <section className="w-full border-b border-[#d2b8a0]/60 bg-gradient-to-b from-[#f3e3d2] to-[#f7eee4]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4 max-w-3xl">
              <p className="uppercase tracking-[0.25em] text-xs text-[#9e6b3c]">Catalogue</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight text-[#2b1a12]">
                Every table, a quiet signature.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#5b4335] max-w-2xl">
                Explore still and sparkling silhouettes in warm, brandy-toned palettes. Filter by size,
                cap, finish, and label field to compose the bottles that sit naturally in your world.
              </p>
            </div>

            {/* Search & filter toggle */}
            <div className="w-full lg:w-[420px] flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b08a6a]" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, tone, or use..."
                    className="pl-9 pr-3 h-10 rounded-full border-[#d4bfa9] bg-[#fbf5ee]/80 text-sm placeholder:text-[#b99b80] focus-visible:ring-[#b97745]"
                    aria-label="Search bottles by name or description"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(prev => !prev)}
                  className="h-10 rounded-full border-[#d4bfa9] bg-[#f8ecdf] text-xs sm:text-sm text-[#5b4335] hover:bg-[#eddcc8] hover:text-[#2c1a10]"
                  aria-pressed={showFilters}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b4b32]">
                  <span className="uppercase tracking-[0.18em] text-[10px] text-[#b08a6a]">
                    Active
                  </span>
                  {filters.sizeMl?.map(size => (
                    <Badge
                      key={`size-${size}`}
                      variant="outline"
                      className="border-[#d2b8a0] bg-[#f7eee4] text-[11px] rounded-full px-2 py-0.5"
                    >
                      {size} ml
                    </Badge>
                  ))}
                  {filters.capColors?.map(cap => (
                    <Badge
                      key={`cap-${cap}`}
                      variant="outline"
                      className="border-[#d2b8a0] bg-[#f7eee4] text-[11px] rounded-full px-2 py-0.5"
                    >
                      {cap}
                    </Badge>
                  ))}
                  {filters.labelFinishes?.map(f => (
                    <Badge
                      key={`finish-${f}`}
                      variant="outline"
                      className="border-[#d2b8a0] bg-[#f7eee4] text-[11px] rounded-full px-2 py-0.5"
                    >
                      {f}
                    </Badge>
                  ))}
                  {filters.paletteIds?.map(pid => {
                    const palette = options.palettes.find(p => p.id === pid);
                    return (
                      <Badge
                        key={`palette-${pid}`}
                        variant="outline"
                        className="border-[#d2b8a0] bg-[#f7eee4] text-[11px] rounded-full px-2 py-0.5 flex items-center gap-1"
                      >
                        {palette && (
                          <span
                            className="h-2 w-2 rounded-full border border-[#b08a6a]/60"
                            style={{ backgroundColor: palette.hex }}
                          />
                        )}
                        {palette?.name ?? "Palette"}
                      </Badge>
                    );
                  })}
                  {(hasActiveFilters || search) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 text-[11px] text-[#a16639] hover:text-[#7b4b2b] underline-offset-4 hover:underline"
                    >
                      <X className="h-3 w-3" />
                      Clear all
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters + results */}
      <section className="w-full bg-[#f7eee4]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-6 lg:py-10 flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                key="filters"
                variants={filterPanelVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Card className="border-[#dec6ae] bg-[#fcf5ee]/95 shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-sm font-medium tracking-[0.18em] uppercase text-[#b08a6a]">
                        Refine the collection
                      </CardTitle>
                      <CardDescription className="text-xs text-[#7b5b45] max-w-xl mt-1">
                        Filter by bottle proportion, cap tone, and label finish. Palette fields are drawn from
                        our curated brandy spectrum.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={clearFilters}
                          className="h-8 px-3 text-xs rounded-full text-[#7b4b2b] hover:bg-[#f0e0d0]"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Size filter */}
                      <div className="space-y-3">
                        <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#a47342]">
                          Size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options.sizes.map(size => {
                            const active = selectedSizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleNumberInArray(size, selectedSizes, setSelectedSizes)}
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b97745] focus-visible:ring-offset-[#fcf5ee] ${
                                  active
                                    ? "border-[#b97745] bg-[#b97745] text-[#fdf7f1]"
                                    : "border-[#dec6ae] bg-[#fbf4ea] text-[#5b4335] hover:border-[#b97745]/70 hover:bg-[#f0ddc7]"
                                }`}
                                aria-pressed={active}
                              >
                                {size} ml
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cap color filter */}
                      <div className="space-y-3">
                        <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#a47342]">
                          Cap tone
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options.capColors.map(cap => {
                            const active = selectedCaps.includes(cap);
                            return (
                              <button
                                key={cap}
                                type="button"
                                onClick={() => toggleStringInArray(cap, selectedCaps, setSelectedCaps)}
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b97745] focus-visible:ring-offset-[#fcf5ee] ${
                                  active
                                    ? "border-[#8d5a3a] bg-[#8d5a3a] text-[#fdf7f1]"
                                    : "border-[#dec6ae] bg-[#fbf4ea] text-[#5b4335] hover:border-[#8d5a3a]/80 hover:bg-[#f1e0cf]"
                                }`}
                                aria-pressed={active}
                              >
                                {cap}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Label finish filter */}
                      <div className="space-y-3">
                        <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#a47342]">
                          Label finish
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options.labelFinishes.map(finish => {
                            const active = selectedFinishes.includes(finish);
                            return (
                              <button
                                key={finish}
                                type="button"
                                onClick={() => toggleFinish(finish, selectedFinishes, setSelectedFinishes)}
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b97745] focus-visible:ring-offset-[#fcf5ee] ${
                                  active
                                    ? "border-[#3f2a23] bg-[#3f2a23] text-[#f7eee4]"
                                    : "border-[#dec6ae] bg-[#fbf4ea] text-[#5b4335] hover:border-[#3f2a23]/70 hover:bg-[#e7d3c0]"
                                }`}
                                aria-pressed={active}
                              >
                                {finish}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Palette filter */}
                      <div className="space-y-3">
                        <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#a47342]">
                          Label field
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {options.palettes.map(palette => {
                            const active = selectedPalettes.includes(palette.id);
                            return (
                              <button
                                key={palette.id}
                                type="button"
                                onClick={() => togglePalette(palette.id)}
                                className={`group relative flex flex-col items-start rounded-xl border px-2.5 py-2 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#b97745] focus-visible:ring-offset-[#fcf5ee] ${
                                  active
                                    ? "border-[#b97745] bg-[#f2dfcf]"
                                    : "border-[#e0cbb4] bg-[#fcf5ee] hover:border-[#b97745]/70 hover:bg-[#f3e2d2]"
                                }`}
                                aria-pressed={active}
                              >
                                <span
                                  className="mb-1 h-6 w-full rounded-md border border-[#c9aa8b]/60 shadow-sm"
                                  style={{ backgroundColor: palette.hex }}
                                  aria-hidden="true"
                                />
                                <span className="truncate font-medium text-[11px] text-[#4a3222]">
                                  {palette.name}
                                </span>
                                {palette.description && (
                                  <span className="truncate text-[10px] text-[#896953]">
                                    {palette.description}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results summary */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#7b5b45]">
              Showing <span className="font-semibold text-[#3f2a23]">{products.length}</span> bottle
              {products.length === 1 ? "" : "s"} from the current selection.
            </p>
            <Separator className="hidden md:block bg-[#dec6ae]" />
          </div>

          {/* Masonry grid */}
          <div className="[column-count:1] sm:[column-count:2] lg:[column-count:3] [column-gap:1.75rem]">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={gridItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  exit={{ opacity: 0, y: 16 }}
                  className="mb-7 break-inside-avoid"
                >
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </motion.div>
              ))}
            </AnimatePresence>

            {products.length === 0 && (
              <div className="mb-7 break-inside-avoid">
                <Card className="border-dashed border-[#d5bda6] bg-[#fbf2e6]/70">
                  <CardContent className="py-10 flex flex-col items-start gap-3">
                    <p className="text-sm font-medium text-[#4a3222]">
                      No bottles match this combination yet.
                    </p>
                    <p className="text-xs text-[#7b5b45] max-w-md">
                      Try softening one of the filters or clearing the palette field. Every product in the
                      collection is designed to sit comfortably in warm, brandy-toned settings.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearFilters}
                      className="mt-1 h-9 px-4 rounded-full border border-[#d2b8a0] bg-[#f5e4d1] text-xs text-[#5b4335] hover:bg-[#ebd5be]"
                    >
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CatalogPage;