import React from "react";
import { Select } from "../ui/Select";
import { Price } from "../ui/Price";

const SIZE_PRICE_MULTIPLIER: Record<string, number> = {
  "500ml": 1,
  "750ml": 1.15,
  "1L": 1.3,
};

interface SizeSelectorProps {
  basePrice: number;
  value: string | null;
  onChange: (size: string) => void;
  className?: string;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  basePrice,
  value,
  onChange,
  className,
}) => {
  const sizeOptions = Object.keys(SIZE_PRICE_MULTIPLIER).map((s) => ({
    value: s,
    label: s,
  }));

  const multiplier = value ? SIZE_PRICE_MULTIPLIER[value] ?? 1 : 1;
  const effectivePrice = basePrice * multiplier;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <Select
          id="product-size"
          label="Bottle size"
          placeholder="Choose size"
          value={value ?? ""}
          onChange={onChange}
          options={sizeOptions}
          description="Larger sizes scale price slightly."
        />
        <div className="mt-6 text-right text-xs text-[rgba(87,65,47,0.8)]">
          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
            <span className="uppercase tracking-[0.14em]">From</span>
            <Price amount={effectivePrice} className="text-sm font-semibold" />
          </div>
          {value && (
            <p className="mt-0.5 text-[11px] text-[rgba(87,65,47,0.7)]">
              Approx. <strong>{multiplier.toFixed(2)}x</strong> base for {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;