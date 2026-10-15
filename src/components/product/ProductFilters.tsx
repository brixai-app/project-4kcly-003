import React from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { DropdownMenu } from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { cn } from "@/lib/utils";

const SIZE_OPTIONS = ["250ml", "500ml", "750ml"] as const;
const COLOR_OPTIONS = ["white", "matte black", "transparent"] as const;

type SizeOption = (typeof SIZE_OPTIONS)[number];
type ColorOption = (typeof COLOR_OPTIONS)[number];

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface ProductFilterState {
  size?: SizeOption;
  color?: ColorOption;
  sort?: SortOption;
}

interface ProductFiltersProps {
  value: ProductFilterState;
  onChange: (value: ProductFilterState) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  value,
  onChange,
}) => {
  const setFilter = (partial: Partial<ProductFilterState>) => {
    onChange({ ...value, ...partial });
  };

  const clearAll = () => onChange({});

  const activeCount = [value.size, value.color, value.sort].filter(Boolean).length;

  return (
    <section
      aria-label="Product filters"
      className="mb-8 flex flex-col gap-4 rounded-xl border border-neutral-200/70 bg-[#FAF9F6]/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3 text-sm text-neutral-700">
        <Filter className="h-4 w-4 text-[#004D40]" aria-hidden="true" />
        <span className="font-medium tracking-wide">Refine your selection</span>
        {activeCount > 0 && (
          <Badge variant="subtle" className="ml-1 bg-[#004D40]/10 text-[#004D40]">
            {activeCount} active
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu
          label="Size"
          triggerClassName="min-w-[110px] justify-between"
          triggerContent={
            <span className="flex w-full items-center justify-between text-sm">
              <span>{value.size ?? "All sizes"}</span>
              <ChevronDown className="ml-2 h-3 w-3" aria-hidden="true" />
            </span>
          }
          items={[
            {
              label: "All sizes",
              onSelect: () => setFilter({ size: undefined }),
              isActive: !value.size,
            },
            ...SIZE_OPTIONS.map((size) => ({
              label: size,
              onSelect: () => setFilter({ size }),
              isActive: value.size === size,
            })),
          ]}
        />

        <DropdownMenu
          label="Bottle color"
          triggerClassName="min-w-[140px] justify-between"
          triggerContent={
            <span className="flex w-full items-center justify-between text-sm">
              <span>{value.color ?? "All colors"}</span>
              <ChevronDown className="ml-2 h-3 w-3" aria-hidden="true" />
            </span>
          }
          items={[
            {
              label: "All colors",
              onSelect: () => setFilter({ color: undefined }),
              isActive: !value.color,
            },
            ...COLOR_OPTIONS.map((color) => ({
              label: color,
              onSelect: () => setFilter({ color }),
              isActive: value.color === color,
            })),
          ]}
        />

        <DropdownMenu
          label="Sort by"
          triggerClassName="min-w-[150px] justify-between"
          triggerContent={
            <span className="flex w-full items-center justify-between text-sm">
              <span>{getSortLabel(value.sort)}</span>
              <ChevronDown className="ml-2 h-3 w-3" aria-hidden="true" />
            </span>
          }
          items={[
            {
              label: "Featured",
              onSelect: () => setFilter({ sort: undefined }),
              isActive: !value.sort,
            },
            {
              label: "Price: Low to High",
              onSelect: () => setFilter({ sort: "price-asc" }),
              isActive: value.sort === "price-asc",
            },
            {
              label: "Price: High to Low",
              onSelect: () => setFilter({ sort: "price-desc" }),
              isActive: value.sort === "price-desc",
            },
            {
              label: "Name: A to Z",
              onSelect: () => setFilter({ sort: "name-asc" }),
              isActive: value.sort === "name-asc",
            },
            {
              label: "Name: Z to A",
              onSelect: () => setFilter({ sort: "name-desc" }),
              isActive: value.sort === "name-desc",
            },
          ]}
        />

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="ml-auto flex items-center gap-1 text-xs text-neutral-700 hover:text-[#004D40]"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}

        {/* Active filter chips */}
        <div className="flex flex-wrap gap-2">
          {value.size && (
            <button
              type="button"
              onClick={() => setFilter({ size: undefined })}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-[#004D40]/20 bg-white px-3 py-1 text-xs text-[#004D40] shadow-sm transition-colors",
                "hover:border-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/40"
              )}
            >
              <span>{value.size}</span>
              <X className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove size filter</span>
            </button>
          )}
          {value.color && (
            <button
              type="button"
              onClick={() => setFilter({ color: undefined })}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-[#004D40]/20 bg-white px-3 py-1 text-xs text-[#004D40] shadow-sm transition-colors",
                "hover:border-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/40"
              )}
            >
              <span>{value.color}</span>
              <X className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove color filter</span>
            </button>
          )}
          {value.sort && (
            <button
              type="button"
              onClick={() => setFilter({ sort: undefined })}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-[#004D40]/20 bg-white px-3 py-1 text-xs text-[#004D40] shadow-sm transition-colors",
                "hover:border-[#004D40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004D40]/40"
              )}
            >
              <span>{getSortLabel(value.sort)}</span>
              <X className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only">Remove sort selection</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

function getSortLabel(sort?: SortOption): string {
  switch (sort) {
    case "price-asc":
      return "Price: Low to High";
    case "price-desc":
      return "Price: High to Low";
    case "name-asc":
      return "Name: A to Z";
    case "name-desc":
      return "Name: Z to A";
    default:
      return "Featured";
  }
}

export default ProductFilters;