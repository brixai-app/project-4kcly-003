import React from "react";
import { useSearchParams } from "react-router-dom";
import { Select } from "../ui/Select";
import { ColorSwatch } from "../ui/ColorSwatch";
import { cn } from "@/lib/utils";
import { tokens } from "@/theme/tokens";

const SIZES = ["500ml", "750ml", "1L"] as const;

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export type ProductSort = (typeof SORT_OPTIONS)[number]["value"];

interface FilterBarProps {
  availableColors: string[];
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  availableColors,
  className,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const size = (searchParams.get("size") as typeof SIZES[number]) || "";
  const color = searchParams.get("color") || "";
  const sort =
    (searchParams.get("sort") as ProductSort | null) || ("name-asc" as ProductSort);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const handleClear = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("size");
    next.delete("color");
    setSearchParams(next, { replace: true });
  };

  return (
    <section
      aria-label="Product filters"
      className={cn(
        "mb-6 rounded-xl border border-[rgba(160,82,45,0.18)] bg-[rgba(255,248,240,0.9)] px-4 py-3 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Filters */}
        <fieldset className="flex flex-col gap-3" aria-label="Filter products">
          <legend className="text-xs font-medium tracking-[0.16em] text-[rgba(112,130,56,0.9)] uppercase">
            Refine
          </legend>
          <div className="flex flex-wrap gap-3">
            {/* Size filter */}
            <div className="min-w-[140px] max-w-[180px]">
              <Select
                id="size-filter"
                label="Size"
                placeholder="All sizes"
                value={size}
                onChange={(value) => updateParam("size", value)}
                options={SIZES.map((s) => ({ label: s, value: s }))}
                description="Choose a bottle volume"
              />
            </div>

            {/* Color filter */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-[rgba(87,65,47,0.9)]">
                Accent color
              </span>
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Filter by bottle color">
                <button
                  type="button"
                  onClick={() => updateParam("color", "")}
                  className={cn(
                    "flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    "border-[rgba(112,130,56,0.25)] bg-white/80 text-[rgba(87,65,47,0.85)] hover:bg-[rgba(244,225,210,0.7)]",
                    !color &&
                      "border-[rgba(160,82,45,0.65)] bg-[rgba(244,225,210,0.85)] text-[rgba(87,65,47,0.95)]"
                  )}
                  aria-pressed={!color}
                >
                  All
                </button>
                {availableColors.map((c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    selected={color === c}
                    ariaLabel={`Filter by color ${c}`}
                    onSelect={() => updateParam("color", c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Right: Sort & Clear */}
        <div className="flex items-center justify-between gap-3 md:justify-end">
          <div className="min-w-[180px]">
            <Select
              id="sort-products"
              label="Sort by"
              hideLabel
              value={sort}
              onChange={(value) => updateParam("sort", value)}
              options={SORT_OPTIONS}
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium",
              "border-[rgba(160,82,45,0.35)] bg-white/80 text-[rgba(160,82,45,0.9)]",
              "hover:bg-[rgba(244,225,210,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,224,208,0.7)] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FFF8F0]"
            )}
          >
            Clear filters
          </button>
        </div>
      </div>
    </section>
  );
};

export default FilterBar;