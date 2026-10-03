import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { products, categories, searchSuggestions } from '@/data/mockData';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

function useQuery() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

function applyFilters(
  list: Product[],
  opts: { q: string; category: string; sort: string }
) {
  const q = opts.q.toLowerCase();
  let next = list.filter((p) => {
    const matchesQuery =
      !q ||
      p?.name?.toLowerCase()?.includes(q) ||
      p?.description?.toLowerCase()?.includes(q);
    const matchesCategory = !opts.category || p?.category === opts.category;
    return matchesQuery && matchesCategory;
  });
  if (opts.sort === 'price-asc') {
    next = [...next].sort(
      (a, b) => (a?.basePriceCents ?? 0) - (b?.basePriceCents ?? 0)
    );
  } else if (opts.sort === 'price-desc') {
    next = [...next].sort(
      (a, b) => (b?.basePriceCents ?? 0) - (a?.basePriceCents ?? 0)
    );
  }
  return next;
}

export function ShopPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(query.get('q') ?? '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const currentCategory = query.get('category') ?? '';
  const currentSort = query.get('sort') ?? 'featured';
  const q = query.get('q') ?? '';

  const filteredProducts = useMemo(
    () =>
      applyFilters(products ?? [], {
        q,
        category: currentCategory,
        sort: currentSort,
      }),
    [q, currentCategory, currentSort]
  );

  const suggestions = useMemo(
    () =>
      searchSuggestions
        ?.filter((s) =>
          s?.label?.toLowerCase()?.includes(searchValue.toLowerCase())
        )
        ?.slice(0, 6),
    [searchValue]
  );

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  const updateQuery = (patch: Partial<{ q: string; category: string; sort: string }>) => {
    const params = new URLSearchParams(window.location.search);
    if (patch.q !== undefined) {
      patch.q ? params.set('q', patch.q) : params.delete('q');
    }
    if (patch.category !== undefined) {
      patch.category ? params.set('category', patch.category) : params.delete('category');
    }
    if (patch.sort !== undefined) {
      patch.sort ? params.set('sort', patch.sort) : params.delete('sort');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: searchValue });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (label: string, category?: Category) => {
    updateQuery({ q: label, category: category ?? '' });
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1411] text-[#ecfdf5] pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 pt-28 md:pt-32">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#a7d7c4]/70 uppercase">
              Catalog
            </p>
            <h1 className="mt-2 font-['Playfair_Display'] text-4xl md:text-5xl">
              Curated waters for considered rituals
            </h1>
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-md"
          >
            <div className="flex items-center gap-2 rounded-xl border border-[#244337] bg-[#14241e] px-3 py-2">
              <Search className="h-4 w-4 text-[#a7d7c4]" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search bottles, rituals, materials..."
                className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-[#a7d7c4]/70"
              />
              <button
                type="submit"
                className="rounded-md bg-[#10b981] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black"
              >
                Find
              </button>
            </div>
            {showSuggestions && suggestions?.length ? (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[#244337] bg-[#0b1411]">
                {suggestions.map((s) => (
                  <button
                    key={s?.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(s?.query ?? s?.label, s?.category)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[#14241e]"
                  >
                    <span className="text-[#ecfdf5]">{s?.label}</span>
                    {s?.category ? (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7d7c4]">
                        {s?.category}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </header>

        <section className="mt-8 flex flex-col gap-4 border-y border-[#244337]/60 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[#244337] bg-[#14241e] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a7d7c4]"
            >
              <Filter className="h-3 w-3" />
              Filters
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateQuery({ category: '' })}
                className={cn(
                  'rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
                  !currentCategory
                    ? 'border-[#10b981] bg-[#10b981] text-black'
                    : 'border-[#244337] text-[#a7d7c4]'
                )}
              >
                All
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => updateQuery({ category: cat })}
                  className={cn(
                    'rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
                    currentCategory === cat
                      ? 'border-[#10b981] bg-[#10b981] text-black'
                      : 'border-[#244337] text-[#a7d7c4]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a7d7c4]">
              {filteredProducts?.length ?? 0} selections
            </span>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="appearance-none rounded-md border border-[#244337] bg-[#14241e] px-3 py-2 pr-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#a7d7c4] outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#a7d7c4]" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts?.map((product) => (
            <ProductCard
              key={product?.id}
              product={product}
              showQuickAdd
              className="h-full"
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default ShopPage;