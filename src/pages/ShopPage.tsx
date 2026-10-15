import React, { useMemo, useState } from "react";
import { PageTransition } from "../components/layout/PageTransition";
import { Container } from "../components/layout/Container";
import { products } from "../mock";
import { ProductGrid } from "../components/product/ProductGrid";
import { FilterBar } from "../components/product/FilterBar";
import { tokens } from "../theme/tokens";

export const ShopPage: React.FC = () => {
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (sizeFilter) {
      list = list.filter((p) => p.availableSizes.includes(sizeFilter));
    }
    if (colorFilter) {
      list = list.filter((p) => p.availableColors.includes(colorFilter));
    }

    if (sort === "price-asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [sizeFilter, colorFilter, sort]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-[color:var(--nw-bg)] pb-16 pt-8 md:pt-10">
        <Container>
          <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1
                className="font-heading text-2xl text-[color:var(--nw-ink)] sm:text-3xl"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                Shop the collection
              </h1>
              <p
                className="mt-2 max-w-2xl text-sm text-[color:var(--nw-ink-soft)]"
                style={{ fontFamily: tokens.fonts.body }}
              >
                Explore mock products styled as editorial objects. All bottles and
                prices are sourced from a centralized mock catalog to keep this MVP
                fully front-end and ready for future backend wiring.
              </p>
            </div>
          </header>

          <section className="mb-6 rounded-[12px] bg-[color:var(--nw-panel)] p-4 shadow-sm">
            <FilterBar
              sizeFilter={sizeFilter}
              colorFilter={colorFilter}
              sort={sort}
              onSizeChange={setSizeFilter}
              onColorChange={setColorFilter}
              onSortChange={setSort}
            />
          </section>

          {filteredProducts.length === 0 ? (
            <section className="mt-10 flex flex-col items-start rounded-[12px] bg-[color:var(--nw-panel)] px-6 py-10 text-[color:var(--nw-ink-soft)] shadow-sm">
              <h2
                className="font-heading text-lg text-[color:var(--nw-ink)]"
                style={{ fontFamily: tokens.fonts.heading }}
              >
                No bottles match these filters.
              </h2>
              <p className="mt-2 text-sm" style={{ fontFamily: tokens.fonts.body }}>
                Try adjusting size, color, or sorting options. Because we are working
                with a finite mocked assortment, certain combinations may not exist—yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSizeFilter(null);
                  setColorFilter(null);
                  setSort("featured");
                }}
                className="mt-4 inline-flex rounded-[999px] border border-[color:var(--nw-border-soft)] px-4 py-2 text-xs font-medium text-[color:var(--nw-ink)] hover:border-[color:var(--nw-accent)] hover:text-[color:var(--nw-accent)]"
              >
                Clear all filters
              </button>
            </section>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </Container>
      </main>
    </PageTransition>
  );
};

export default ShopPage;