import React from "react";
import { ColorSwatch } from "../ui/ColorSwatch";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  colors: string[];
  value: string | null;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  value,
  onChange,
  className,
}) => {
  if (!colors || colors.length === 0) return null;

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="text-sm font-medium text-[rgba(87,65,47,0.96)]">
        Accent color
      </legend>
      <p className="text-xs text-[rgba(87,65,47,0.7)]">
        Pick the label and cap accent you love. Colors preview instantly in your design.
      </p>
      <div
        className="mt-1 flex flex-wrap gap-1.5"
        role="radiogroup"
        aria-label="Choose accent color"
      >
        {colors.map((c) => (
          <ColorSwatch
            key={c}
            color={c}
            selected={value === c}
            ariaLabel={`Select color ${c}`}
            onSelect={() => onChange(c)}
          />
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {value ? `Color ${value} selected` : "No color selected"}
      </span>
    </fieldset>
  );
};

export default ColorSelector;