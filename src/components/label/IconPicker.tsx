import React from "react";
import { Droplets, Leaf, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabelIconOption } from "@/types";

const ICON_MAP: Record<LabelIconOption["id"], React.ReactNode> = {
  droplet: <Droplets className="h-4 w-4" aria-hidden="true" />, // water droplet approximation
  leaf: <Leaf className="h-4 w-4" aria-hidden="true" />, // leaf icon
  wave: <Waves className="h-4 w-4" aria-hidden="true" />, // wave approximation
};

interface IconPickerProps {
  options: LabelIconOption[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Accessible icon picker using radiogroup semantics.
 * Keyboard:
 *  - Tab moves into group, arrow keys move between options
 *  - Space/Enter selects focused option
 */
export const IconPicker: React.FC<IconPickerProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const groupRef = React.useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const current = event.currentTarget;
    const items = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>("[role='radio']") ?? []
    );
    const index = items.indexOf(current);

    if (index === -1) return;

    const moveFocus = (nextIndex: number) => {
      const item = items[nextIndex];
      if (item) {
        item.focus();
      }
    };

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = (index + 1) % items.length;
        moveFocus(nextIndex);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const nextIndex = (index - 1 + items.length) % items.length;
        moveFocus(nextIndex);
        break;
      }
      case " ":
      case "Enter": {
        event.preventDefault();
        const newValue = current.getAttribute("data-value");
        if (newValue) onChange(newValue);
        break;
      }
    }
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="Label icon"
      className={cn("flex gap-2", className)}
    >
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            data-value={option.id}
            onClick={() => onChange(option.id)}
            onKeyDown={handleKeyDown}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#004D40] focus-visible:ring-offset-[#FAF9F6]",
              isSelected
                ? "border-[#004D40] bg-[#004D40] text-[#FAF9F6] shadow-sm"
                : "border-[#A89F91]/60 bg-white text-[#2B2B2B] hover:border-[#004D40] hover:text-[#004D40]"
            )}
          >
            <span className="sr-only">{option.label}</span>
            {ICON_MAP[option.id]}
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;